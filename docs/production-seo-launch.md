# Production SEO Launch

When the final live domain is ready, run this command from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-production-domain.ps1 -BaseUrl "https://yourdomain.com"
```

What it does:

- converts canonical URLs to absolute production URLs
- converts `og:url`, `og:image`, and `twitter:image` to absolute URLs
- updates JSON-LD URLs and IDs to the production domain
- updates `robots.txt` with the final sitemap URL
- regenerates `sitemap.xml`

After running it, redeploy the updated files to production.
