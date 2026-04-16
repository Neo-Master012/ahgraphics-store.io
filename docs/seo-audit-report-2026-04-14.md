# SEO Audit Report

Date: 2026-04-14  
Project: AH Graphics Tools static website  
Audit basis: source-code review of the local repository only. This is not a live Google Search Console, Lighthouse, or server-log audit.

## Executive Score

- Overall SEO score: `66/100`
- On-page SEO: `78/100`
- Technical SEO: `62/100`
- Backend / server SEO readiness: `45/100`

## What is already working well

- All `32/32` HTML pages have a title tag.
- All `32/32` HTML pages have a meta description.
- All `32/32` HTML pages have a canonical tag.
- All `32/32` HTML pages have Open Graph and Twitter card basics.
- All `32/32` HTML pages include JSON-LD.
- All `32/32` HTML pages have exactly one `H1`.
- Utility pages are correctly set to `noindex`:
  - `404.html`
  - `cart.html`
  - `checkout.html`
  - `index-dark.html`
  - `login.html`
  - `sign-up.html`
  - `wishlist.html`
- Titles and descriptions are unique across the site.

## Key audit numbers

- Total HTML pages audited: `32`
- Indexable pages: `25`
- Noindex pages: `7`
- Total images referenced in HTML: `776`
- Images with blank or missing `alt`: `292`
- Images without `loading=\"lazy\"`: `776`
- Broken internal/asset references found in HTML: `242`
- Placeholder `#` links found: `766`
- `sitemap.xml` present: `No`
- `robots.txt` includes sitemap reference: `No`

## Main issues by priority

### P1. Canonicals, `og:url`, and schema URLs are not absolute

Every page uses root-relative URLs such as `/products.html` instead of a full production URL. This is acceptable during development but weak for production indexing and sharing.

Examples:

- [index.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/index.html:18)
- [products.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/products.html:18)
- [blog-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/blog-details.html:18)

Impact:

- weaker canonical clarity
- weaker social/share URL consistency
- schema entities use non-final identifiers

### P1. Business location data is inconsistent across the site

Structured data identifies the business in Lahore, Pakistan, while many page headers show `4124 Cimmaron Road, CA 92806`, and some footer/contact blocks show `Lahore, Pakistan`.

Examples:

- Schema locality in [products.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/products.html:107)
- Header CA address in [products.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/products.html:212)
- Footer Lahore address in [products.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/products.html:631)

Impact:

- hurts local trust signals
- creates conflicting entity data for crawlers
- weakens structured-data reliability

### P1. No XML sitemap exists

There is no `sitemap.xml` file in the project root, and `robots.txt` does not reference one.

Current file:

- [robots.txt](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/robots.txt:1)

Impact:

- slower discovery of pages
- weaker crawl guidance
- no clean source of canonical indexable URLs

### P1. Many broken internal template/demo links remain

The HTML still contains old template links to pages that do not exist in this repo.

Most common broken targets:

- `index2.html` referenced `64` times
- `index3.html` referenced `64` times
- `index-one-page.html` referenced `32` times
- `index2-one-page.html` referenced `32` times
- `index3-one-page.html` referenced `32` times
- `assets/images/resources/logo-1.png` referenced `16` times, but the file does not exist

Example location:

- [index.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/index.html:244)
- [about.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/about.html:269)
- [products.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/products.html:740)

Impact:

- crawl waste
- weaker internal-link quality
- avoidable 404s

### P1. The site still contains too many placeholder `#` links

There are `766` placeholder hash links across the pages.

Examples:

- blog prev/next links in [blog-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/blog-details.html:659)
- various social/template controls across multiple pages

Impact:

- poor crawl signal quality
- weaker internal-link structure
- poorer UX and accessibility

### P2. Schema exists, but not the strongest schema for page intent

The site has JSON-LD everywhere, which is good, but most pages use broad types like `WebPage`, `CollectionPage`, or `OnlineStore` only.

Examples:

- [blog-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/blog-details.html:139) uses `WebPage`, not `Article` or `BlogPosting`
- [product-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/product-details.html:140) uses `WebPage`, not `Product`
- [services.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/services.html:140) uses `WebPage`, not `Service`

Impact:

- missed rich-result opportunities
- weaker topical clarity for product, article, and service pages

### P2. Open Graph images are generic site-wide

All pages currently use the same preview image: `/testimonial-preview.png`.

Examples:

- [index.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/index.html:20)
- [products.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/products.html:20)
- [blog-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/blog-details.html:20)

Impact:

- lower social click-through rate
- weaker page-specific preview relevance

### P2. Too many images still have blank `alt`

There are `292` images with blank or missing `alt`. Some are decorative and should stay empty, but the total is still high enough to indicate missed opportunities.

Pages with especially high counts:

- `index.html`: `28`
- `index-dark.html`: `31`
- `services.html`: `20`
- `team.html`: `27`
- `team-carousel.html`: `27`

Impact:

- weaker image SEO
- reduced accessibility quality
- missed descriptive context for non-decorative visuals

### P2. No images use native lazy loading

All `776` images in the audited HTML are missing `loading=\"lazy\"`.

Impact:

- slower page rendering
- worse performance on content-heavy pages
- indirect SEO risk through performance and UX

### P2. Some metadata is still too generic for intent-heavy pages

The basics are present, but some pages still use template-like titles/descriptions rather than query-intent-driven copy.

Examples:

- [blog-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/blog-details.html:6)
- [product-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/product-details.html:6)
- [portfolio-details.html](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/portfolio-details.html:6)

Impact:

- lower relevance for search intent
- weaker CTR from SERPs

### P3. Meta keywords are present, but they are obsolete

The `keywords` meta tag appears site-wide. It does not help modern SEO and can be removed or ignored.

### P3. Backend/server SEO is not configured in-repo

This is a static HTML project with no production server config files such as:

- `.htaccess`
- `web.config`
- `nginx.conf`
- `netlify.toml`
- `vercel.json`

The only backend file found is a placeholder mail script:

- [assets/inc/sendemail.php](/c:/Users/Admin/Downloads/Compressed/01-html-file-20260409T130550Z-3-001/01-html-file/assets/inc/sendemail.php:1)

That means these launch-critical items are not verifiable or not defined here:

- HTTP to HTTPS redirect
- non-www to www or www to non-www redirect
- trailing-slash policy
- real 404 status handling
- gzip or brotli compression
- cache headers
- security headers

## Recommended implementation order

### Phase 1. Highest ROI fixes inside the repo

1. Unify NAP data across header, footer, contact blocks, and schema.
2. Remove or replace broken demo links.
3. Replace missing `logo-1.png` references with the real logo asset.
4. Replace `#` links with real destinations or non-link elements where appropriate.
5. Add a real `sitemap.xml`.
6. Add a `Sitemap:` line to `robots.txt`.
7. Upgrade page-specific schema:
   - `BlogPosting` on `blog-details.html`
   - `Product` on `product-details.html`
   - `ItemList` or product list schema on `products.html`
   - `Service` schema on service pages
   - stronger `FAQPage` entities in `faq.html`
8. Improve the generic metadata on detail pages.
9. Add `loading=\"lazy\"` to non-critical images.
10. Review blank `alt` attributes and keep them empty only for purely decorative images.

### Phase 2. Domain-dependent SEO fixes

1. Convert canonicals, `og:url`, JSON-LD IDs, and schema URLs to absolute production URLs.
2. Add absolute `Sitemap:` reference in `robots.txt`.
3. Create page-specific OG images with absolute URLs.

### Phase 3. Hosting / server SEO fixes

1. Enforce one canonical host version.
2. Enforce HTTPS redirect.
3. Serve real 404 status for `404.html`.
4. Add compression and cache headers.
5. Add security headers where compatible.
6. Connect Google Search Console and Bing Webmaster Tools.

## What I can implement directly

I can implement these in the codebase next:

- NAP cleanup and consistency
- broken-link cleanup for template/demo links
- missing-logo path fixes
- `#` link cleanup where a real target exists
- sitemap generation
- robots sitemap reference
- stronger page-specific schema
- metadata refinement on weak pages
- image lazy-loading pass
- another alt-text review

## What still needs your input

- the final production domain
- the one true business address to use everywhere
- whether you want Lahore/Pakistan positioning or California/USA positioning
- whether product pages should stay single-page/generic or become dedicated product URLs later

## Recommended next implementation sprint

If we implement only one sprint first, I recommend this exact order:

1. Fix NAP consistency.
2. Clean broken demo links and bad logo paths.
3. Generate `sitemap.xml` and update `robots.txt`.
4. Upgrade schema on product, blog, service, and FAQ pages.
5. Convert image and performance basics: lazy loading plus better `alt` coverage.

That would likely move the site from roughly `66/100` to the low-to-mid `80s` before any hosting-level improvements.

