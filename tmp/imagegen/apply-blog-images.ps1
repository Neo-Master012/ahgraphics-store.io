param(
    [string]$GeneratedDir = "output/imagegen/blog-batch",
    [string]$TargetDir = "assets/images/blog",
    [string]$BackupDir = "output/imagegen/original-blog-backup",
    [switch]$SkipBackup
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
    [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq "image/jpeg" } |
        Select-Object -First 1
}

function Save-Jpeg {
    param(
        [Parameter(Mandatory = $true)]
        [System.Drawing.Image]$Image,
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [int]$Quality = 92
    )

    $encoder = Get-JpegEncoder
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $qualityParam = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]$Quality
    )
    $encoderParams.Param[0] = $qualityParam
    $Image.Save($Path, $encoder, $encoderParams)
    $qualityParam.Dispose()
    $encoderParams.Dispose()
}

function Resize-CenterCrop {
    param(
        [Parameter(Mandatory = $true)]
        [string]$SourcePath,
        [Parameter(Mandatory = $true)]
        [string]$DestinationPath,
        [Parameter(Mandatory = $true)]
        [int]$Width,
        [Parameter(Mandatory = $true)]
        [int]$Height
    )

    $sourceImage = [System.Drawing.Image]::FromFile((Resolve-Path $SourcePath))
    try {
        $sourceRatio = $sourceImage.Width / $sourceImage.Height
        $targetRatio = $Width / $Height

        if ($sourceRatio -gt $targetRatio) {
            $cropHeight = $sourceImage.Height
            $cropWidth = [int][Math]::Round($cropHeight * $targetRatio)
            $cropX = [int][Math]::Round(($sourceImage.Width - $cropWidth) / 2)
            $cropY = 0
        }
        else {
            $cropWidth = $sourceImage.Width
            $cropHeight = [int][Math]::Round($cropWidth / $targetRatio)
            $cropX = 0
            $cropY = [int][Math]::Round(($sourceImage.Height - $cropHeight) / 2)
        }

        $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.DrawImage(
                    $sourceImage,
                    [System.Drawing.Rectangle]::new(0, 0, $Width, $Height),
                    [System.Drawing.Rectangle]::new($cropX, $cropY, $cropWidth, $cropHeight),
                    [System.Drawing.GraphicsUnit]::Pixel
                )
            }
            finally {
                $graphics.Dispose()
            }

            Save-Jpeg -Image $bitmap -Path $DestinationPath
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $sourceImage.Dispose()
    }
}

$mappings = @(
    @{ Source = "blog-2-1.jpeg"; Dest = "blog-2-1.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-2.jpeg"; Dest = "blog-2-2.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-3.jpeg"; Dest = "blog-2-3.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-4.jpeg"; Dest = "blog-2-4.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-5.jpeg"; Dest = "blog-2-5.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-6.jpeg"; Dest = "blog-2-6.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-7.jpeg"; Dest = "blog-2-7.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-8.jpeg"; Dest = "blog-2-8.jpg"; Width = 362; Height = 240 },
    @{ Source = "blog-2-9.jpeg"; Dest = "blog-2-9.jpg"; Width = 362; Height = 241 },
    @{ Source = "blog-1-1.jpeg"; Dest = "blog-1-1.jpg"; Width = 370; Height = 250 },
    @{ Source = "blog-1-2.jpeg"; Dest = "blog-1-2.jpg"; Width = 370; Height = 250 },
    @{ Source = "blog-1-3.jpeg"; Dest = "blog-1-3.jpg"; Width = 370; Height = 250 },
    @{ Source = "blog-list-1-1.jpeg"; Dest = "blog-list-1-1.jpg"; Width = 691; Height = 360 },
    @{ Source = "blog-list-1-2.jpeg"; Dest = "blog-list-1-2.jpg"; Width = 691; Height = 360 },
    @{ Source = "blog-list-1-3.jpeg"; Dest = "blog-list-1-3.jpg"; Width = 691; Height = 360 },
    @{ Source = "blog-details-img-1.jpeg"; Dest = "blog-details-img-1.jpg"; Width = 745; Height = 380 },
    @{ Source = "blog-details-img-box-img-1.jpeg"; Dest = "blog-details-img-box-img-1.jpg"; Width = 410; Height = 304 },
    @{ Source = "blog-details-img-box-img-2.jpeg"; Dest = "blog-details-img-box-img-2.jpg"; Width = 309; Height = 304 },
    @{ Source = "blog-list-1-1.jpeg"; Dest = "blog-details-prev-img.jpg"; Width = 80; Height = 80 },
    @{ Source = "blog-2-6.jpeg"; Dest = "blog-details-next-img.jpg"; Width = 80; Height = 80 },
    @{ Source = "blog-2-9.jpeg"; Dest = "lp-1-1.jpg"; Width = 80; Height = 80 },
    @{ Source = "blog-2-8.jpeg"; Dest = "lp-1-2.jpg"; Width = 80; Height = 80 },
    @{ Source = "blog-list-1-2.jpeg"; Dest = "lp-1-3.jpg"; Width = 80; Height = 80 }
)

New-Item -ItemType Directory -Force -Path $TargetDir, $BackupDir | Out-Null

if (-not $SkipBackup) {
    $existingTargets = $mappings |
        ForEach-Object { $_["Dest"] } |
        Select-Object -Unique

    foreach ($destName in $existingTargets) {
        $existingPath = Join-Path $TargetDir $destName
        if (Test-Path $existingPath) {
            Copy-Item -LiteralPath $existingPath -Destination (Join-Path $BackupDir $destName) -Force
        }
    }
}

foreach ($mapping in $mappings) {
    $sourcePath = Join-Path $GeneratedDir $mapping.Source
    if (-not (Test-Path $sourcePath)) {
        throw "Missing generated source image: $sourcePath"
    }

    $destinationPath = Join-Path $TargetDir $mapping.Dest
    Resize-CenterCrop `
        -SourcePath $sourcePath `
        -DestinationPath $destinationPath `
        -Width $mapping.Width `
        -Height $mapping.Height

    Write-Host "Wrote $destinationPath"
}
