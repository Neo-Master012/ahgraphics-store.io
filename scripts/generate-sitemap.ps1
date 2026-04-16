param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$base = $BaseUrl.TrimEnd("/")

if ($base -notmatch '^https?://') {
    throw "BaseUrl must start with http:// or https://"
}

function Resolve-SiteUrl {
    param(
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $null
    }

    if ($Value -match '^https?://') {
        return $Value
    }

    if ($Value.StartsWith("/")) {
        return "$base$Value"
    }

    return "$base/$Value"
}

$seen = @{}
$entries = New-Object System.Collections.Generic.List[string]

$pages = Get-ChildItem -Path $root -Filter *.html | Sort-Object Name

foreach ($page in $pages) {
    $content = Get-Content -LiteralPath $page.FullName -Raw
    $robotsMatch = [regex]::Match($content, '<meta name="robots" content="([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    if ($robotsMatch.Success -and $robotsMatch.Groups[1].Value.ToLower().Contains("noindex")) {
        continue
    }

    $canonicalMatch = [regex]::Match($content, '<link rel="canonical" href="([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $pathValue = if ($canonicalMatch.Success) { $canonicalMatch.Groups[1].Value } else { "/" + $page.Name }
    $loc = Resolve-SiteUrl -Value $pathValue

    if (-not $loc -or $seen.ContainsKey($loc)) {
        continue
    }

    $seen[$loc] = $true
    $lastmod = $page.LastWriteTime.ToString("yyyy-MM-dd")

    $entries.Add(@"
  <url>
    <loc>$loc</loc>
    <lastmod>$lastmod</lastmod>
  </url>
"@)
}

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($entries -join "`n")
</urlset>
"@

$output = Join-Path $root "sitemap.xml"
Set-Content -LiteralPath $output -Value $xml -Encoding UTF8
Write-Output "Generated sitemap.xml at $output"
