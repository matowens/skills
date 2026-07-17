[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $RepositoryPath,

    [string] $TaskPath,

    [string] $ReviewRequest,

    [string[]] $PreExistingPath = @(),

    [string] $ImplementationReport = 'Not supplied.',

    [string] $DiffBase = 'HEAD',

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

$recommendationPattern = '^\s*(?:\*\*)?(ACCEPT|CORRECTIONS REQUIRED|BLOCKED)(?:\*\*)?\s*$'
$resultLines = @($response.result -split '\r?\n')
$recommendationLines = @($resultLines | Where-Object { $_ -match $recommendationPattern })
$lastContentLine = @($resultLines | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })[-1]
if ($recommendationLines.Count -ne 1 -or $lastContentLine -notmatch $recommendationPattern) {
    throw "Claude QA must finish with exactly one supported recommendation line. Found: $($recommendationLines.Count)"
}
$recommendation = $Matches[1].ToUpperInvariant()

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
    }
} | ConvertTo-Json -Depth 10
