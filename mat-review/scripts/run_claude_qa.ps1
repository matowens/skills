[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $RepositoryPath,

    [string] $TaskPath,

    [string] $ReviewRequest,

    [string[]] $PreExistingPath = @(),

    [string] $ImplementationReport = 'Not supplied.',

    [string] $DiffBase = 'HEAD',

    [string] $ReportPath,

    [ValidateSet('sonnet', 'opus')]
    [string] $Model = 'sonnet',

    [ValidateSet('medium', 'high', 'xhigh', 'max')]
    [string] $Effort = 'high'
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $RepositoryPath -PathType Container)) {
    throw "Repository path is not a directory: $RepositoryPath"
}
$repository = (Resolve-Path -LiteralPath $RepositoryPath).Path

if ([string]::IsNullOrWhiteSpace($TaskPath) -and [string]::IsNullOrWhiteSpace($ReviewRequest)) {
    throw 'Supply TaskPath for a formal Task review, ReviewRequest for a bounded one-off review, or both.'
}

$task = $null
if (-not [string]::IsNullOrWhiteSpace($TaskPath)) {
    $resolvedTaskPath = if ([System.IO.Path]::IsPathRooted($TaskPath)) {
        $TaskPath
    } else {
        Join-Path $repository $TaskPath
    }
    if (-not (Test-Path -LiteralPath $resolvedTaskPath -PathType Leaf)) {
        throw "Task Specification is not a file: $resolvedTaskPath"
    }
    $task = (Resolve-Path -LiteralPath $resolvedTaskPath).Path
}

$gitRootOutput = (& git -C $repository rev-parse --show-toplevel 2>&1)
if ($LASTEXITCODE -ne 0) {
    throw "Repository path is not inside a Git worktree: $repository`n$gitRootOutput"
}
$gitRoot = (Resolve-Path -LiteralPath ($gitRootOutput -join "`n").Trim()).Path

$null = & git -C $gitRoot rev-parse --verify "$DiffBase^{commit}" 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "Git diff baseline is not a valid commit: $DiffBase"
}

$reviewContext = @()
if ($task) {
    $reviewContext += "Task Specification path: $task"
}
if (-not [string]::IsNullOrWhiteSpace($ReviewRequest)) {
    $reviewContext += @"
Additional review boundary or one-off review request:
---
$ReviewRequest
---
"@
}
$preExistingPaths = @($PreExistingPath | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
if ($preExistingPaths.Count -gt 0) {
    $reviewContext += @"
Paths already changed before this review boundary:
---
$($preExistingPaths -join "`n")
---
Do not attribute those pre-existing changes to the reviewed work unless the reviewed work also changed or depends on them.
"@
}

$prompt = @"
Perform independent QA for the bounded work described below.

Repository root: $gitRoot
Git review baseline: $DiffBase
$($reviewContext -join "`n")

Review the current working tree relative to the baseline, including staged, unstaged, and relevant untracked files. Read the repository guidance, Task Specification when supplied, relevant implementation, and tests yourself. Treat the Software Engineer report as context, not proof.

Software Engineer report:
---
$ImplementationReport
---

Return the complete QA report required by your agent instructions. Finish with exactly one recommendation on its own final line: ACCEPT, CORRECTIONS REQUIRED, or BLOCKED.
"@

$claudeArguments = @(
    '-p',
    '--agent', 'qa-engineer',
    '--model', $Model,
    '--effort', $Effort,
    '--permission-mode', 'plan',
    '--no-session-persistence',
    '--output-format', 'json'
)

$null = Get-Command claude -ErrorAction Stop
$originalLocation = Get-Location
try {
    Set-Location -LiteralPath $gitRoot
    $rawLines = @(& claude @claudeArguments $prompt)
    $claudeExitCode = $LASTEXITCODE
} finally {
    Set-Location -LiteralPath $originalLocation
}
$rawResponse = $rawLines -join [Environment]::NewLine

if ($claudeExitCode -ne 0) {
    throw "Claude QA failed with exit code $claudeExitCode.`n$rawResponse"
}

try {
    $response = $rawResponse | ConvertFrom-Json
} catch {
    throw "Claude QA returned invalid JSON.`n$rawResponse"
}

if ($response.is_error -or $response.subtype -ne 'success' -or [string]::IsNullOrWhiteSpace($response.result)) {
    throw "Claude QA did not return a successful review.`n$rawResponse"
}

$modelUsage = @()
if ($response.modelUsage) {
    $modelUsage = @($response.modelUsage.PSObject.Properties | ForEach-Object {
        [pscustomobject]@{
            model = $_.Name
            inputTokens = $_.Value.inputTokens
            outputTokens = $_.Value.outputTokens
            cacheReadInputTokens = $_.Value.cacheReadInputTokens
            cacheCreationInputTokens = $_.Value.cacheCreationInputTokens
            costUsd = $_.Value.costUSD
        }
    })
}

$recommendationPattern = '^\s*(?:\*\*)?(ACCEPT|CORRECTIONS REQUIRED|BLOCKED)(?:\*\*)?\s*$'
$resultLines = @($response.result -split '\r?\n')
$recommendationLines = @($resultLines | Where-Object { $_ -match $recommendationPattern })
$lastContentLine = @($resultLines | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })[-1]
$recommendation = 'INVALID'
if ($recommendationLines.Count -eq 1 -and $lastContentLine -match $recommendationPattern) {
    $recommendation = $Matches[1].ToUpperInvariant()
}

$resolvedReportPath = $null
if (-not [string]::IsNullOrWhiteSpace($ReportPath)) {
    $resolvedReportPath = if ([System.IO.Path]::IsPathRooted($ReportPath)) {
        [System.IO.Path]::GetFullPath($ReportPath)
    } else {
        [System.IO.Path]::GetFullPath((Join-Path $gitRoot $ReportPath))
    }
} elseif ($task) {
    $taskDirectory = Split-Path -Parent $task
    if ((Split-Path -Leaf $taskDirectory) -eq 'tasks') {
        $featureDirectory = Split-Path -Parent $taskDirectory
        $taskBaseName = [System.IO.Path]::GetFileNameWithoutExtension($task)
        $reportName = "$taskBaseName-qa.md"
        $resolvedReportPath = Join-Path (Join-Path $featureDirectory 'reviews') $reportName
    }
}

if ($resolvedReportPath) {
    $gitRootPrefix = $gitRoot.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    if (-not $resolvedReportPath.StartsWith($gitRootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "QA report path must stay inside the repository: $resolvedReportPath"
    }

    $reportDirectory = Split-Path -Parent $resolvedReportPath
    $null = New-Item -ItemType Directory -Path $reportDirectory -Force
    $reportSubject = if ($task) { [System.IO.Path]::GetFileNameWithoutExtension($task) } else { [System.IO.Path]::GetFileNameWithoutExtension($resolvedReportPath) }
    $timestamp = [DateTimeOffset]::UtcNow.ToString('yyyy-MM-dd HH:mm:ss') + ' UTC'
    $denials = @($response.permission_denials)
    $denialSummary = if ($denials.Count -eq 0) { 'None' } else { $denials -join '; ' }
    $reportSection = @"
## Pass: $timestamp

- Baseline: $DiffBase
- Model: $Model
- Effort: $Effort
- Recommendation: $recommendation
- Cost USD: $($response.total_cost_usd)
- Permission denials: $denialSummary

### Raw QA Review

$($response.result.Trim())
"@
    if (Test-Path -LiteralPath $resolvedReportPath -PathType Leaf) {
        [System.IO.File]::AppendAllText($resolvedReportPath, "`r`n`r`n$reportSection", [System.Text.UTF8Encoding]::new($false))
    } else {
        $reportTitle = "# Consolidated QA Report: $reportSubject"
        [System.IO.File]::WriteAllText($resolvedReportPath, "$reportTitle`r`n`r`n$reportSection", [System.Text.UTF8Encoding]::new($false))
    }
}

if ($recommendation -eq 'INVALID') {
    throw "Claude QA must finish with exactly one supported recommendation line. Found: $($recommendationLines.Count)"
}

[pscustomobject]@{
    status = 'success'
    recommendation = $recommendation
    review = $response.result
    metadata = [pscustomobject]@{
        diffBase = $DiffBase
        preExistingPaths = $preExistingPaths
        durationMs = $response.duration_ms
        totalCostUsd = $response.total_cost_usd
        permissionDenials = @($response.permission_denials)
        modelUsage = $modelUsage
        reportPath = $resolvedReportPath
    }
} | ConvertTo-Json -Depth 10
