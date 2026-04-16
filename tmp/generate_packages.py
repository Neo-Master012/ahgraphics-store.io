import re

with open('pricing.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the title and heroes
content = content.replace('<h1>Our <span>Pricing</span></h1>', '<h1>Our <span>Packages</span></h1>')
content = content.replace('<li>Our Pricing</li>', '<li>Our Packages</li>')
content = content.replace('<title> Pricing | Finris -  HTML 5 Template </title>', '<title> Packages | AH Graphics Tools </title>')
content = content.replace('Select the plan that <br> best fits <span>your\n                            needs.</span>', 'Select the package that <br> best fits <span>your needs.</span>')
content = content.replace('Pricing &amp; Plan', 'Premium Packages')

# Strip the switch toggle
content = re.sub(r'<div class=\"pricing-one__switch-toggle\">.*?</ul>\s*</div>', '', content, flags=re.DOTALL)

packages = [
    {
        'title': 'BASIC PLAN',
        'price': 'Rs 750',
        'interval': '/ Monthly',
        'features': ['Semrush Unlimited', 'Canva Premium', 'SE Ranking SEO TOOL', 'WEB CEO for website audit', 'Answer The Public']
    },
    {
        'title': 'SEO EXPERTS PLAN',
        'price': 'Rs 1000',
        'interval': '/ Monthly',
        'features': ['Semrush Premium Unlimited', 'Moz Pro', 'Ubersuggest Unlimited', 'SE Ranking', 'WEB CEO', 'answerthepublic']
    },
    {
        'title': 'STUDENT PLAN',
        'price': 'Rs 1250',
        'interval': '/ Monthly',
        'features': ['Semrush Premium Unlimited', 'Moz Pro Unlimited', 'Ubersuggest Unlimited', 'Grammarly Premium Unlimited', 'SE Ranking', 'Canva Premium', 'Closerscopy Unlimited']
    },
    {
        'title': 'CONTENT WRITER PLAN',
        'price': 'Rs 1950',
        'interval': '/ Monthly',
        'features': ['Chatgpt Premium (Including all modules of plus Plan)', 'Writehuman Unlimited', 'Closerscopy Premium Unlimited', 'Grammarly Premium Unlimited', 'Canva Premium', 'Hemingway Premium']
    },
    {
        'title': 'BLOGGERS PLAN',
        'price': 'Rs 1950',
        'interval': '/ Monthly',
        'features': ['Semrush Premium Unlimited', 'Moz Pro', 'Ubersuggest Unlimited', 'SE Ranking', 'Grammarly Premium', 'Chatgpt Premium', 'Writehuman', 'Closerscopy Unlimited', 'Canva Premium']
    },
    {
        'title': 'AGENCY PLAN',
        'price': 'Rs 2850',
        'interval': '/ Monthly',
        'features': ['Semrush Premium Unlimited', 'Moz Pro Unlimited', 'Ubersuggest Unlimited', 'Answerthepublic Unlimited', 'SE Ranking', 'Web CEO', 'Chatgpt Premium', 'Grammarly Premium Unlimited', 'Closerscopy Unlimited', 'Writehuman Unlimited', 'Hemingway Editor', 'Canva', 'VistaCreate', 'Coursera', 'rankability']
    }
]

html_blocks = []
for i, pkg in enumerate(packages):
    anim = 'fadeInDown' if i % 2 == 0 else 'fadeInUp'
    features_html = ''
    for f_item in pkg['features']:
        features_html += f'''
                                            <li>
                                                <div class="icon">
                                                    <span class="fas fa-check"></span>
                                                </div>
                                                <div class="text">
                                                    <p>{f_item}</p>
                                                </div>
                                            </li>'''
    
    block = f'''
                            <!-- Pricing One Single Start -->
                            <div class="col-xl-4 col-lg-6 col-md-6 wow {anim}" data-wow-duration="500ms" style="margin-bottom: 30px;">
                                <div class="pricing-one__single" style="height: 100%; display: flex; flex-direction: column;">
                                    <div class="pricing-one__title-box">
                                        <p class="pricing-one__title">{pkg['title']}</p>
                                        <h3 class="pricing-one__price-box" style="font-size:36px;">{pkg['price']} <span style="font-size:16px;">{pkg['interval']}</span> </h3>
                                        <div class="pricing-one__border"></div>
                                    </div>
                                    <div class="pricing-one__feature-list-box" style="flex: 1;">
                                        <h4 class="pricing-one__feature-title">Tools Included</h4>
                                        <ul class="list-unstyled pricing-one__feature-list">{features_html}
                                        </ul>
                                    </div>
                                    <div class="pricing-one__btn-box" style="margin-top: auto;">
                                        <a href="cart.html" class="pricing-one__btn thm-btn"><span
                                                class="icon-right"></span> Buy Now</a>
                                    </div>
                                    <div class="pricing-one__shape-1"></div>
                                    <div class="pricing-one__shape-2"></div>
                                </div>
                            </div>
                            <!-- Pricing One Single End -->'''
    html_blocks.append(block)

# Extract from <div class="tabed-content"> down to </section>
start_token = '<div class="tabed-content">'
end_token = '</section>'
start_idx = content.find(start_token)
end_idx = content.find(end_token, start_idx)

if start_idx != -1 and end_idx != -1:
    new_html = '<div class="row" style="margin-top: 40px;">\n' + '\n'.join(html_blocks) + '\n</div>\n'
    content = content[:start_idx] + new_html + content[end_idx:]

with open('packages.html', 'w', encoding='utf-8') as f:
    f.write(content)
