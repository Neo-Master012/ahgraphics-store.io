from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))

HEADER_SOCIAL = """<div class="main-menu-two__social">
                            <a href="https://wa.me/923268600994?text=Hi%20AH%20Graphics%20Tools" target="_blank" rel="noopener" aria-label="Chat with AH Graphics Tools on WhatsApp"><i class="fab fa-whatsapp"></i></a>
                            <a href="mailto:neomaster012345@gmail.com" aria-label="Email AH Graphics Tools"><i class="fas fa-envelope"></i></a>
                            <a href="tel:+923268600994" aria-label="Call AH Graphics Tools"><i class="fas fa-phone"></i></a>
                            <a href="contact.html#contact-form" aria-label="Open the contact form"><i class="fas fa-paper-plane"></i></a>
                        </div>"""

MOBILE_SOCIAL = """<div class="mobile-nav__social">
                    <a href="https://wa.me/923268600994?text=Hi%20AH%20Graphics%20Tools" class="fab fa-whatsapp" target="_blank" rel="noopener" aria-label="Chat with AH Graphics Tools on WhatsApp"></a>
                    <a href="mailto:neomaster012345@gmail.com" class="fas fa-envelope" aria-label="Email AH Graphics Tools"></a>
                    <a href="tel:+923268600994" class="fas fa-phone" aria-label="Call AH Graphics Tools"></a>
                    <a href="contact.html#contact-form" class="fas fa-paper-plane" aria-label="Open the contact form"></a>
                </div>"""

TEAM_PAGE_LINKS = """<a href="portfolio.html" aria-label="View the AH Graphics Tools portfolio"><i class="fas fa-briefcase"></i></a>
                                    <a href="blog.html" aria-label="Read AH Graphics Tools insights"><i class="fas fa-blog"></i></a>
                                    <a href="contact.html#contact-form" aria-label="Send a message to AH Graphics Tools"><i class="fas fa-envelope"></i></a>
                                    <a href="https://wa.me/923268600994?text=Hi%20AH%20Graphics%20Tools" target="_blank" rel="noopener" aria-label="Chat with AH Graphics Tools on WhatsApp"><i class="fab fa-whatsapp"></i></a>"""

TEAM_DETAILS_SOCIAL = """<div class="team-details__social">
                                <a href="portfolio.html" aria-label="View the AH Graphics Tools portfolio"><i class="fas fa-briefcase"></i></a>
                                <a href="blog.html" aria-label="Read AH Graphics Tools insights"><i class="fas fa-blog"></i></a>
                                <a href="contact.html#contact-form" aria-label="Send a message to AH Graphics Tools"><i class="fas fa-envelope"></i></a>
                                <a href="https://wa.me/923268600994?text=Hi%20AH%20Graphics%20Tools" target="_blank" rel="noopener" aria-label="Chat with AH Graphics Tools on WhatsApp"><i class="fab fa-whatsapp"></i></a>
                            </div>"""

TEAM_ONE_SOCIAL = """<div class="team-one__social">
                                    <a href="portfolio.html" aria-label="View the AH Graphics Tools portfolio"><i class="fas fa-briefcase"></i></a>
                                    <a href="contact.html#contact-form" aria-label="Send a message to AH Graphics Tools"><i class="fas fa-envelope"></i></a>
                                    <a href="https://wa.me/923268600994?text=Hi%20AH%20Graphics%20Tools" target="_blank" rel="noopener" aria-label="Chat with AH Graphics Tools on WhatsApp"><i class="fab fa-whatsapp"></i></a>
                                </div>"""

FOOTER_SOCIAL = """<div class="site-footer__social">
                                        <a href="https://wa.me/923268600994?text=Hi%20AH%20Graphics%20Tools" target="_blank" rel="noopener" aria-label="Chat with AH Graphics Tools on WhatsApp"><i class="fab fa-whatsapp"></i></a>
                                        <a href="mailto:neomaster012345@gmail.com" aria-label="Email AH Graphics Tools"><i class="fas fa-envelope"></i></a>
                                        <a href="tel:+923268600994" aria-label="Call AH Graphics Tools"><i class="fas fa-phone"></i></a>
                                        <a href="contact.html#contact-form" aria-label="Open the contact form"><i class="fas fa-paper-plane"></i></a>
                                    </div>"""

PRODUCT_SOCIAL = """<div class="product-details__social-link">
                                <a href="https://twitter.com/intent/tweet?url=https://ahgraphicstools.eu.cc/product-details.html&amp;text=Premium%20Digital%20Tool%20Subscription%20from%20AH%20Graphics%20Tools" target="_blank" rel="noopener nofollow" aria-label="Share this product on X"><span class="fab fa-twitter"></span></a>
                                <a href="https://www.facebook.com/sharer/sharer.php?u=https://ahgraphicstools.eu.cc/product-details.html" target="_blank" rel="noopener nofollow" aria-label="Share this product on Facebook"><span class="fab fa-facebook"></span></a>
                                <a href="https://www.pinterest.com/pin/create/button/?url=https://ahgraphicstools.eu.cc/product-details.html&amp;description=Premium%20Digital%20Tool%20Subscription%20from%20AH%20Graphics%20Tools" target="_blank" rel="noopener nofollow" aria-label="Share this product on Pinterest"><span class="fab fa-pinterest-p"></span></a>
                                <a href="contact.html#contact-form" aria-label="Ask AH Graphics Tools about this product"><span class="fas fa-envelope"></span></a>
                            </div>"""


def replace_once(text: str, pattern: str, replacement: str) -> str:
    return re.sub(pattern, replacement, text, count=1, flags=re.S)


def replace_all(text: str, pattern: str, replacement: str) -> str:
    return re.sub(pattern, replacement, text, flags=re.S)


for html_file in HTML_FILES:
    text = html_file.read_text(encoding="utf-8")

    text = replace_once(
        text,
        r'<div class="main-menu-two__social">\s*<a href="#">.*?</div>',
        HEADER_SOCIAL,
    )
    text = replace_once(
        text,
        r'<div class="mobile-nav__social">\s*<a href="#" class="fab fa-twitter"></a>\s*<a href="#" class="fab fa-facebook-square"></a>\s*<a href="#" class="fab fa-pinterest-p"></a>\s*<a href="#" class="fab fa-instagram"></a>\s*</div>',
        MOBILE_SOCIAL,
    )
    text = replace_once(
        text,
        r'<div class="site-footer__social">\s*<a href="#"><i class="icon-facebook"></i></a>\s*<a href="#"><i class="icon-twitter"></i></a>\s*<a href="#"><i class="icon-linkedin"></i></a>\s*<a href="#"><i class="icon-pinterest"></i></a>\s*</div>',
        FOOTER_SOCIAL,
    )
    text = replace_all(
        text,
        r'(<div class="team-page__social">\s*<div class="team-page__social-shape-1">.*?</div>\s*<div class="team-page__social-shape-2">.*?</div>\s*)(<a href="#">.*?</a>\s*<a href="#">.*?</a>\s*<a href="#">.*?</a>\s*<a href="#">.*?</a>)(\s*</div>)',
        r"\1" + TEAM_PAGE_LINKS + r"\3",
    )
    text = replace_once(
        text,
        r'<div class="team-details__social">\s*<a href="#"><span class="icon-pinterest"></span></a>\s*<a href="#"><span class="icon-linkedin"></span></a>\s*<a href="#"><span class="icon-twitter"></span></a>\s*<a href="#"><span class="icon-facebook"></span></a>\s*</div>',
        TEAM_DETAILS_SOCIAL,
    )
    text = replace_once(
        text,
        r'<div class="team-one__social">\s*<a href="#"><span class="icon-linkedin"></span></a>\s*<a href="#"><span class="icon-twitter"></span></a>\s*<a href="#"><span class="icon-facebook"></span></a>\s*</div>',
        TEAM_ONE_SOCIAL,
    )
    text = replace_once(
        text,
        r'<div class="product-details__social-link">\s*<a href="#"><span class="fab fa-twitter"></span></a>\s*<a href="#"><span class="fab fa-facebook"></span></a>\s*<a href="#"><span class="fab fa-pinterest-p"></span></a>\s*<a href="#"><span class="fab fa-instagram"></span></a>\s*</div>',
        PRODUCT_SOCIAL,
    )

    text = text.replace('href="pricing.html"', 'href="contact.html#contact-form"')
    text = text.replace('href="#" class="services-details__contact-btn thm-btn"', 'href="contact.html#contact-form" class="services-details__contact-btn thm-btn"')
    text = text.replace("Mon - Fri: 09:00 - 05:00", "Mon - Fri: 10:00 - 18:00")
    text = text.replace(
        "We provide premium tools and services to scale your\n                                    printing and typesetting industry. ",
        "We provide practical growth support, onboarding help, and premium tool access for brands, freelancers, and agencies. ",
    )
    text = text.replace("printing and typesetting industry.", "brands, freelancers, and agencies.")
    text = text.replace(
        "Web designing Ã‚Â· Google Business Profile Creation & Management Ã‚Â· SEO Master & More",
        "Web design, Google Business Profile management, SEO leadership, and digital growth support.",
    )

    if html_file.name == "index.html":
        text = re.sub(
            r'(<p class="team-one__sub-title">)Web designing.*?SEO Master & More(</p>)',
            r"\1Web design, Google Business Profile management, SEO leadership, and digital growth support.\2",
            text,
            count=1,
            flags=re.S,
        )

    if html_file.name == "hot-tools-demo.html":
        text = re.sub(r"<h2>.*?Most Selling Tools</h2>", "<h1>Most Popular Tools</h1>", text, count=1, flags=re.S)

    html_file.write_text(text, encoding="utf-8")
