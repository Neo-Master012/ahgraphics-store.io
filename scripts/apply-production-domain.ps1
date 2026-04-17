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

function Resolve-AbsoluteUrl {
    param(
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $Value
    }

    if ($Value -match '^(https?:|mailto:|tel:|data:|#)') {
        return $Value
    }

    if ($Value.StartsWith("/")) {
        return "$base$Value"
    }

    return $Value
}

function Convert-JsonUrls {
    param(
        $Node
    )

    if ($null -eq $Node) {
        return $null
    }

    if ($Node -is [string]) {
        return (Resolve-AbsoluteUrl -Value $Node)
    }

    if ($Node -is [System.Collections.IList]) {
        for ($i = 0; $i -lt $Node.Count; $i += 1) {
            $Node[$i] = Convert-JsonUrls -Node $Node[$i]
        }

        return $Node
    }

    if ($Node -is [System.Management.Automation.PSCustomObject]) {
        foreach ($property in $Node.PSObject.Properties) {
            $property.Value = Convert-JsonUrls -Node $property.Value
        }

        return $Node
    }

    return $Node
}

function Replace-AttributeValue {
    param(
        [string]$Content,
        [string]$Pattern
    )

    return [regex]::Replace(
        $Content,
        $Pattern,
        {
            param($match)

            $prefix = $match.Groups[1].Value
            $value = $match.Groups[2].Value
            $suffix = $match.Groups[3].Value
            $resolved = Resolve-AbsoluteUrl -Value $value

            return $prefix + $resolved + $suffix
        },
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
}

$htmlFiles = Get-ChildItem -Path $root -Filter *.html

foreach ($file in $htmlFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw

    $content = Replace-AttributeValue -Content $content -Pattern '(<link rel="canonical" href=")([^"]+)(")'
    $content = Replace-AttributeValue -Content $content -Pattern '(<meta property="og:url" content=")([^"]+)(")'
    $content = Replace-AttributeValue -Content $content -Pattern '(<meta property="og:image" content=")([^"]+)(")'
    $content = Replace-AttributeValue -Content $content -Pattern '(<meta name="twitter:image" content=")([^"]+)(")'

    $matches = [regex]::Matches(
        $content,
        '<script type="application/ld\+json">\s*(.*?)\s*</script>',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline
    )

    for ($index = $matches.Count - 1; $index -ge 0; $index -= 1) {
        $match = $matches[$index]
        $rawJson = $match.Groups[1].Value
        $jsonObject = $rawJson | ConvertFrom-Json
        $jsonObject = Convert-JsonUrls -Node $jsonObject
        $newJson = $jsonObject | ConvertTo-Json -Depth 100
        $replacement = "<script type=""application/ld+json"">`r`n$newJson`r`n    </script>"

        $content = $content.Remove($match.Index, $match.Length).Insert($match.Index, $replacement)
    }

    Set-Content -LiteralPath $file.FullName -Value $content -Encoding UTF8
}

$robotsPath = Join-Path $root "robots.txt"
$robotsContent = Get-Content -LiteralPath $robotsPath -Raw
$robotsContent = [regex]::Replace($robotsContent, '^\s*Sitemap:.*$', '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$robotsContent = $robotsContent.TrimEnd() + "`r`nSitemap: $base/sitemap.xml`r`n"
Set-Content -LiteralPath $robotsPath -Value $robotsContent -Encoding UTF8

& (Join-Path $PSScriptRoot "generate-sitemap.ps1") -BaseUrl $base | Out-Null

Write-Output "Applied production domain to HTML metadata and schema: $base"
Write-Output "Updated robots.txt and regenerated sitemap.xml"
