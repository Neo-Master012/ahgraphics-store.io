(function ($) {
  "use strict";



  var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 4,
      slideShadows: true
    },
    loop: true,
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    keyboard: {
      enabled: true
    },
    mousewheel: {
      thresholdDelta: 70
    },
    breakpoints: {
      768: {
        slidesPerView: 1.5
      },
      992: {
        slidesPerView: 2.5
      },
      1290: {
        slidesPerView: 3
      }
    }
  });






  /*--------------------------------------------------------------
    RegisterPlugin, ScrollTrigger, SplitText
  --------------------------------------------------------------*/
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.config({
    nullTargetWarn: false,
    trialWarn: false
  });



  // Preloader
  $(window).on('load', function (event) {
    $('.js-preloader').delay(700).fadeOut(500);
  });


  // AOS Animation
  if ($("[data-aos]").length) {
    AOS.init({
      duration: '1200',
      disable: 'false',
      easing: 'ease',
      mirror: true
    });
  }



  /*--------------------------------------------------------------
    FullHeight
  --------------------------------------------------------------*/
  function fullHeight() {
    $('.full-height').css("height", $(window).height());
  }



  // Price Filter
  function priceFilter() {
    if ($(".price-ranger").length) {
      $(".price-ranger #slider-range").slider({
        range: true,
        min: 50,
        max: 500,
        values: [11, 300],
        slide: function (event, ui) {
          $(".price-ranger .ranger-min-max-block .min").val(
            "$" + ui.values[0]
          );
          $(".price-ranger .ranger-min-max-block .max").val(
            "$" + ui.values[1]
          );
        },
      });
      $(".price-ranger .ranger-min-max-block .min").val(
        "$" + $(".price-ranger #slider-range").slider("values", 0)
      );
      $(".price-ranger .ranger-min-max-block .max").val(
        "$" + $(".price-ranger #slider-range").slider("values", 1)
      );
    }
  }

  var checkoutStorageKey = "ahgraphics_checkout_cart";
  var wishlistStorageKey = "ahgraphics_wishlist";
  var authUsersStorageKey = "ahgraphics_auth_users";
  var authSessionStorageKey = "ahgraphics_auth_session";
  var checkoutWhatsappNumber = "923268600994";
  var syncHeaderUtilityState = function () {};

  function createProductKey(product) {
    return (product.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getStoredCheckoutCart() {
    try {
      var raw = window.localStorage.getItem(checkoutStorageKey);
      var parsed = raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCheckoutCart(cart) {
    try {
      window.localStorage.setItem(checkoutStorageKey, JSON.stringify(cart));
    } catch (error) {
      // Ignore storage errors and keep browsing flow working.
    }

    syncHeaderUtilityState();
  }

  function addProductToCheckoutCart(product) {
    var cart = getStoredCheckoutCart();
    var key = createProductKey(product);
    var existing = null;
    var index = 0;

    for (index = 0; index < cart.length; index += 1) {
      if (cart[index].key === key) {
        existing = cart[index];
        break;
      }
    }

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        key: key,
        title: product.title,
        category: product.category,
        badge: product.badge,
        plan: product.plan,
        price: product.price,
        quantity: 1
      });
    }

    saveCheckoutCart(cart);
  }

  function getStoredWishlist() {
    try {
      var raw = window.localStorage.getItem(wishlistStorageKey);
      var parsed = raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function getStoredAuthSession() {
    try {
      var raw = window.localStorage.getItem(authSessionStorageKey);
      var parsed = raw ? JSON.parse(raw) : null;

      return parsed && parsed.email ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function saveStoredAuthSession(session) {
    try {
      if (session) {
        window.localStorage.setItem(authSessionStorageKey, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(authSessionStorageKey);
      }
    } catch (error) {
      // Ignore storage errors and keep browsing flow working.
    }

    syncHeaderUtilityState();
  }

  function saveStoredWishlist(items) {
    try {
      window.localStorage.setItem(wishlistStorageKey, JSON.stringify(items));
    } catch (error) {
      // Ignore storage errors and keep browsing flow working.
    }

    syncHeaderUtilityState();
  }

  function getCartItemCount() {
    return getStoredCheckoutCart().reduce(function (total, item) {
      return total + (item.quantity || 1);
    }, 0);
  }

  function isProductWishlisted(productKey) {
    return getStoredWishlist().some(function (item) {
      return item.key === productKey;
    });
  }

  function toggleWishlistProduct(product) {
    var wishlist = getStoredWishlist();
    var productKey = createProductKey(product);
    var existingIndex = -1;
    var index = 0;

    for (index = 0; index < wishlist.length; index += 1) {
      if (wishlist[index].key === productKey) {
        existingIndex = index;
        break;
      }
    }

    if (existingIndex !== -1) {
      wishlist.splice(existingIndex, 1);
      saveStoredWishlist(wishlist);
      return false;
    }

    wishlist.push({
      key: productKey,
      title: product.title,
      category: product.category,
      badge: product.badge,
      plan: product.plan,
      price: product.price
    });
    saveStoredWishlist(wishlist);

    return true;
  }

  function parseNumericPrice(price) {
    if (!price) {
      return null;
    }

    var digits = String(price).replace(/[^0-9]/g, "");

    return digits ? parseInt(digits, 10) : null;
  }

  function formatPriceTotal(total, hasCustomPrice) {
    if (!total && hasCustomPrice) {
      return "Custom pricing included";
    }

    if (hasCustomPrice) {
      return "PKR " + total.toLocaleString() + "+";
    }

    return "PKR " + total.toLocaleString();
  }

  function refreshNiceSelect($select) {
    if (!$select.length || !$select.next(".nice-select").length) {
      return;
    }

    $select.niceSelect("update");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function headerUtilityWorkflow() {
    $(".main-menu__list > li").each(function () {
      var $item = $(this);
      var $link = $item.children("a");
      var href = ($link.attr("href") || "").toLowerCase();
      var submenuText = $item.children("ul").text().toLowerCase();

      if (href !== "products.html") {
        return;
      }

      if (submenuText.indexOf("cart") === -1 &&
        submenuText.indexOf("checkout") === -1 &&
        submenuText.indexOf("wishlist") === -1 &&
        submenuText.indexOf("login") === -1 &&
        submenuText.indexOf("sign up") === -1) {
        return;
      }

      $item.removeClass("dropdown");
      $item.children("ul").remove();
    });

    $(".main-menu-two__right").each(function () {
      var $right = $(this);
      var $searchBoxWrap = $right.find(".main-menu-two__search-cart-box").first();

      if (!$searchBoxWrap.length) {
        return;
      }

      $searchBoxWrap.find(".main-menu-two__cart-box").remove();

      if (!$searchBoxWrap.find(".main-menu-two__utility-nav").length) {
        $searchBoxWrap.append([
          '<div class="main-menu-two__utility-nav">',
          '<a href="wishlist.html" class="main-menu-two__utility-link is-empty" data-header-wishlist title="Wishlist">',
          '<i class="fa fa-heart"></i>',
          '<span class="main-menu-two__utility-count" data-header-wishlist-count>0</span>',
          "</a>",
          '<a href="cart.html" class="main-menu-two__utility-link is-empty" data-header-cart title="Cart">',
          '<i class="fa fa-shopping-cart"></i>',
          '<span class="main-menu-two__utility-count" data-header-cart-count>0</span>',
          "</a>",
          '<a href="login.html" class="main-menu-two__utility-auth" data-header-login>Login</a>',
          '<a href="sign-up.html" class="main-menu-two__utility-auth main-menu-two__utility-auth--primary" data-header-signup>Sign Up</a>',
          '<a href="login.html" class="main-menu-two__utility-auth is-empty" data-header-account><i class="fa fa-user-circle"></i><span data-header-account-name>My Account</span></a>',
          '<button type="button" class="main-menu-two__utility-auth main-menu-two__utility-auth--ghost is-empty" data-header-logout>Logout</button>',
          "</div>"
        ].join(""));
      }
    });

    syncHeaderUtilityState = function () {
      var cartCount = getCartItemCount();
      var wishlistCount = getStoredWishlist().length;
      var session = getStoredAuthSession();
      var accountName = session && session.name ? session.name.split(" ")[0] : "My Account";

      $("[data-header-cart-count]").text(cartCount);
      $("[data-header-wishlist-count]").text(wishlistCount);
      $("[data-header-cart]").toggleClass("is-empty", cartCount === 0);
      $("[data-header-wishlist]").toggleClass("is-empty", wishlistCount === 0);
      $("[data-header-account-name]").text(accountName);
      $("[data-header-login], [data-header-signup]").toggleClass("is-empty", !!session);
      $("[data-header-account], [data-header-logout]").toggleClass("is-empty", !session);
    };

    syncHeaderUtilityState();

    $(document).off("click.headerLogout").on("click.headerLogout", "[data-header-logout]", function () {
      saveStoredAuthSession(null);
      window.location.href = "index.html";
    });
  }



  function productCategoryFilter() {
    var $catalog = $(".product-catalog");

    if (!$catalog.length) {
      return;
    }

    var categoryMeta = {
      all: { label: "All Products", heading: 'All <span>Products</span>', heroTitle: "All Products in One Place", heroText: "Shop every tool category in one premium storefront with stylish cards, color-coded sections, clear pricing, and a direct buy now button on every plan.", resultSingle: "premium tool or subscription plan", resultPlural: "premium tools and subscription plans", description: "Browse premium AI tools, design software, CapCut Pro, SEO platforms, and shared subscriptions from AH Graphics Tools.", pageTitle: "All Products | AH Graphics Tools" },
      "ai-tools": { label: "AI Tools", heading: 'AI <span>Tools</span>', heroTitle: "Premium AI Tools for Smart Workflows", heroText: "Explore private, shared, and long-term AI plans for research, writing, prompts, and day-to-day productivity.", resultSingle: "AI tool", resultPlural: "AI tools", accent: "#7c3aed", rgb: "124, 58, 237", kicker: "AI Tools", description: "Private and shared AI plans for chat, search, and multi-model productivity.", pageTitle: "AI Tools | AH Graphics Tools" },
      "ai-video-tools": { label: "AI Video", heading: 'AI <span>Video</span>', heroTitle: "AI Video Tools for Fast Content Production", heroText: "Compare private and semi-private video creation plans built for reels, cinematic clips, and unlimited visual output.", resultSingle: "AI video tool", resultPlural: "AI video tools", accent: "#ff6b35", rgb: "255, 107, 53", kicker: "AI Video", description: "Video generation, creative visuals, and premium plans for content creators.", pageTitle: "AI Video Tools | AH Graphics Tools" },
      "ai-voice-tools": { label: "AI Voice", heading: 'AI <span>Voice</span>', heroTitle: "AI Voice Tools for Premium Audio Output", heroText: "Voice generation plans for creators who need realistic speech, content narration, and creator-grade delivery.", resultSingle: "AI voice tool", resultPlural: "AI voice tools", accent: "#00a896", rgb: "0, 168, 150", kicker: "AI Voice", description: "Natural voice generation tools for creators, agencies, and audio-first content.", pageTitle: "AI Voice Tools | AH Graphics Tools" },
      "writing-tools": { label: "Writing Tools", heading: 'Writing <span>Tools</span>', heroTitle: "Writing, Humanizer, and Plagiarism Tools", heroText: "Browse premium plans for grammar fixes, plagiarism checks, rewriting, and clean humanized content.", resultSingle: "writing tool", resultPlural: "writing tools", accent: "#ef476f", rgb: "239, 71, 111", kicker: "Writing Suite", description: "Grammar, plagiarism, rewriting, and humanizer tools for content quality.", pageTitle: "Writing Tools | AH Graphics Tools" },
      "entertainment-streaming": { label: "Entertainment", heading: 'Entertainment <span>Streaming</span>', heroTitle: "Entertainment Streaming Plans for Everyday Watching", heroText: "Shared and private subscriptions for movies, series, ad-free video, and personal entertainment access.", resultSingle: "streaming plan", resultPlural: "streaming plans", accent: "#f59e0b", rgb: "245, 158, 11", kicker: "Entertainment", description: "Popular streaming platforms for shows, movies, and premium watching experiences.", pageTitle: "Entertainment Streaming | AH Graphics Tools" },
      "iptv-streaming": { label: "IPTV", heading: 'IPTV <span>Streaming</span>', heroTitle: "IPTV Packages with Flexible Durations", heroText: "Choose Opplex TV plans from one month to one year with category-wise pricing and premium shop cards.", resultSingle: "IPTV plan", resultPlural: "IPTV plans", accent: "#0ea5e9", rgb: "14, 165, 233", kicker: "IPTV", description: "Flexible Opplex TV subscription durations for budget and long-term users.", pageTitle: "IPTV Streaming | AH Graphics Tools" },
      "admin-panels": { label: "Admin Panels", heading: 'Admin <span>Panels</span>', heroTitle: "Admin Panels and Dashboards", heroText: "Centralized admin access for Canva, IPTV, and dashboard-based systems with custom support options.", resultSingle: "admin panel", resultPlural: "admin panels", accent: "#334155", rgb: "51, 65, 85", kicker: "Dashboards", description: "Backend dashboards and panel access for operators, resellers, and teams.", pageTitle: "Admin Panels | AH Graphics Tools" },
      "editing-design-tools": { label: "Editing & Design", heading: 'Editing &amp; <span>Design</span>', heroTitle: "Editing and Design Tools for Creators", heroText: "Premium subscriptions for video editing, creative suites, Canva plans, and visual design workflows.", resultSingle: "editing or design tool", resultPlural: "editing and design tools", accent: "#8b5cf6", rgb: "139, 92, 246", kicker: "Creative Suite", description: "Video editing, Canva plans, and Adobe tools for premium creative work.", pageTitle: "Editing & Design Tools | AH Graphics Tools" },
      "productivity-office-tools": { label: "Productivity", heading: 'Productivity <span>Tools</span>', heroTitle: "Productivity and Office Tools", heroText: "Subscriptions for documents, meetings, templates, and business workflow support in one place.", resultSingle: "productivity tool", resultPlural: "productivity tools", accent: "#2563eb", rgb: "37, 99, 235", kicker: "Productivity", description: "Office, meeting, and resource tools for business, freelance, and team use.", pageTitle: "Productivity Tools | AH Graphics Tools" },
      "seo-marketing-tools": { label: "SEO & Marketing", heading: 'SEO &amp; <span>Marketing</span>', heroTitle: "SEO and Marketing Tools That Scale", heroText: "Keyword tools, audits, competitor research, and video growth platforms for creators and agencies.", resultSingle: "SEO or marketing tool", resultPlural: "SEO and marketing tools", accent: "#10b981", rgb: "16, 185, 129", kicker: "SEO & Marketing", description: "Growth, SEO, and analytics platforms for marketers, sellers, and agencies.", pageTitle: "SEO & Marketing Tools | AH Graphics Tools" }
    };

    var categoryOrder = ["ai-tools", "ai-video-tools", "ai-voice-tools", "writing-tools", "entertainment-streaming", "iptv-streaming", "admin-panels", "editing-design-tools", "productivity-office-tools", "seo-marketing-tools"];

    var products = [
      { category: "ai-tools", badge: "Private AI", plan: "Monthly private", title: "Grok AI Super Monthly Private", price: "PKR 999", logoText: "GR", note: "Fast-access Grok plan for daily prompts, chats, and personal AI workflows.", features: ["Super monthly private access", "Personal login style setup", "Budget-friendly AI plan"] },
      { category: "ai-tools", badge: "Heavy AI", plan: "Monthly private", title: "Grok AI Heavy Monthly Private", price: "PKR 2500", logoText: "GH", note: "Higher-tier Grok access designed for heavier prompt usage and private use.", features: ["Heavy monthly private plan", "Made for bigger AI usage", "Suitable for power users"] },
      { category: "ai-tools", badge: "Shared AI", plan: "Shared subscription", title: "ChatGPT Plus Shared", price: "PKR 500", logoText: "GPT", note: "Affordable shared ChatGPT Plus plan for writing, research, and everyday productivity.", features: ["Shared Plus access", "Ideal for prompt work", "Best low-cost entry plan"] },
      { category: "ai-tools", badge: "Semi Private", plan: "Semi private", title: "ChatGPT Plus Semi Private", price: "PKR 1000", logoText: "GPT", note: "Balanced plan for users who want more privacy than shared access.", features: ["Semi-private setup", "Smooth AI assistance", "Great for regular usage"] },
      { category: "ai-tools", badge: "Special", plan: "Special plan", title: "ChatGPT Plus Special", price: "PKR 1300", logoText: "GPT", note: "Premium ChatGPT option for users who want a stronger and cleaner access tier.", features: ["Special access category", "Stable AI workflow", "Premium support style plan"] },
      { category: "ai-tools", badge: "Research AI", plan: "Shared subscription", title: "Perplexity AI Shared", price: "PKR 600", logoText: "PX", note: "Shared research-focused AI plan for answers, citations, and smart discovery.", features: ["Shared Perplexity access", "Research-friendly workflow", "Great for fact-based queries"] },
      { category: "ai-tools", badge: "Long Term", plan: "12-month plan", title: "Gemini 12 Months Price", price: "PKR 1500", logoText: "GM", note: "Long-duration Gemini subscription for users who want value and continuity.", features: ["12 months validity", "Reliable Google AI access", "Strong yearly value"] },
      { category: "ai-tools", badge: "Long Term", plan: "18-month plan", title: "Gemini 18 Months Price", price: "PKR 3000", logoText: "GM", note: "Extended Gemini plan for long-term AI use with lower renewal hassle.", features: ["18 months validity", "Long-running AI subscription", "Best for extended use"] },
      { category: "ai-video-tools", badge: "Credits Plan", plan: "Private with warranty", title: "Veo 3 Private 50K Credits Monthly Warranty", price: "PKR 3500", logoText: "V3", note: "Private Veo 3 plan with 50K credits and warranty-backed monthly access.", features: ["50K credits included", "Private monthly access", "Warranty-backed plan"] },
      { category: "ai-video-tools", badge: "Credits Plan", plan: "Private no warranty", title: "Veo 3 Private 50K Credits Monthly No Warranty", price: "PKR 3500", logoText: "V3", note: "Private Veo 3 monthly plan with the same credit pool in a no-warranty option.", features: ["50K credits included", "Private creator access", "No warranty variation"] },
      { category: "ai-video-tools", badge: "Unlimited", plan: "Semi private", title: "Runway ML Unlimited Plan Semi Private", price: "PKR 3500", logoText: "RW", note: "Runway plan for creators producing AI videos, edits, and cinematic content at scale.", features: ["Unlimited plan tier", "Semi-private setup", "Best for heavy creators"] },
      { category: "ai-video-tools", badge: "Image Gen", plan: "Semi private", title: "Midjourney Standard Plan Semi Private", price: "PKR 2500", logoText: "MJ", note: "Semi-private Midjourney standard access for premium image creation and art concepts.", features: ["Standard plan access", "Semi-private usage", "Great for creatives and ads"] },
      { category: "ai-video-tools", badge: "Stock Media", plan: "Semi access", title: "Story Block Unlimited Semi", price: "PKR 1500", logoText: "SB", note: "Unlimited stock content subscription for creators who need fast media assets.", features: ["Unlimited stock library", "Semi access setup", "Useful for reels and edits"] },
      { category: "ai-voice-tools", badge: "Voice AI", plan: "1 month creator plan", title: "ElevenLabs 1 Month Creator Plan", price: "PKR 2500", logoText: "11", note: "Creator-grade voice generation plan for clean narration, dubbing, and voiceovers.", features: ["1 month creator plan", "Realistic voice generation", "Great for narration work"] },
      { category: "writing-tools", badge: "Grammar", plan: "Premium access", title: "Grammarly Premium", price: "PKR 450", logoText: "GR", note: "Premium grammar and writing suggestions for polished personal and business content.", features: ["Grammar and tone fixes", "Premium writing checks", "Affordable monthly option"] },
      { category: "writing-tools", badge: "Rewriter", plan: "Premium access", title: "Quillbot Premium", price: "PKR 550", logoText: "QB", note: "Writing improvement tool for paraphrasing, rewriting, and cleaner sentence flow.", features: ["Premium paraphrasing tools", "Useful for rewrites", "Fast writing improvement"] },
      { category: "writing-tools", badge: "Plagiarism", plan: "Student plan", title: "Turnitin Student", price: "PKR 650", logoText: "TI", note: "Student-focused Turnitin access for originality checks and academic safety.", features: ["Student-level access", "Plagiarism checking", "Academic workflow support"] },
      { category: "writing-tools", badge: "Plagiarism", plan: "Instructor plan", title: "Turnitin Instructor", price: "PKR 850", logoText: "TI", note: "Instructor plan with stronger Turnitin workflow support for reviews and checks.", features: ["Instructor access tier", "Better review workflow", "Useful for institutions"] },
      { category: "writing-tools", badge: "Editing", plan: "Premium access", title: "Hemingway", price: "PKR 450", logoText: "HM", note: "Clarity-first writing tool that helps simplify and sharpen content quality.", features: ["Readability improvement", "Clean editing support", "Simple premium plan"] },
      { category: "writing-tools", badge: "Humanizer", plan: "Semi access", title: "Stealth Writer Semi", price: "PKR 1500", logoText: "SW", note: "Semi access to a humanizer tool built for cleaner, more natural output.", features: ["Semi-private style access", "Useful for humanized text", "Ideal for content creators"] },
      { category: "entertainment-streaming", badge: "Streaming", plan: "Shared plan", title: "Netflix Shared", price: "PKR 300", logoText: "NF", note: "Budget Netflix shared plan for movies, shows, and everyday entertainment.", features: ["Shared entertainment access", "Low monthly price", "Popular streaming option"] },
      { category: "entertainment-streaming", badge: "Streaming", plan: "Private plan", title: "Netflix Private", price: "PKR 2000", logoText: "NF", note: "Private Netflix plan for users who want dedicated and uninterrupted streaming access.", features: ["Private account style setup", "Premium watching experience", "Best for personal use"] },
      { category: "entertainment-streaming", badge: "Prime Video", plan: "Standard plan", title: "Amazon Prime Video", price: "PKR 100", logoText: "AP", note: "Entry-level Prime Video access for affordable movies and series streaming.", features: ["Budget Prime Video plan", "Movies and series access", "Good low-cost option"] },
      { category: "entertainment-streaming", badge: "Prime Video", plan: "Private monthly", title: "Amazon Prime Private Monthly", price: "PKR 500", logoText: "AP", note: "Private Amazon Prime monthly plan for a more personal entertainment experience.", features: ["Private monthly access", "Premium video content", "Better personal usage"] },
      { category: "entertainment-streaming", badge: "Ad-Free", plan: "Premium plan", title: "YouTube Premium", price: "PKR 150", logoText: "YT", note: "Ad-free YouTube access with premium playback convenience and smoother content viewing.", features: ["Ad-free YouTube use", "Premium playback benefits", "Excellent value plan"] },
      { category: "iptv-streaming", badge: "IPTV", plan: "1 month", title: "Opplex TV 1 Month", price: "PKR 250", logoText: "OT", note: "Short-term Opplex TV package for users who want a monthly IPTV option.", features: ["1 month IPTV validity", "Budget starter package", "Quick activation option"] },
      { category: "iptv-streaming", badge: "IPTV", plan: "3 months", title: "Opplex TV 3 Month", price: "PKR 650", logoText: "OT", note: "Three-month Opplex TV package with stronger value for regular viewers.", features: ["3 month package", "Better long-use value", "Stable streaming duration"] },
      { category: "iptv-streaming", badge: "IPTV", plan: "6 months", title: "Opplex TV 6 Month", price: "PKR 1300", logoText: "OT", note: "Mid-term IPTV plan built for users who want longer uninterrupted access.", features: ["6 month validity", "Balanced package price", "Strong mid-term choice"] },
      { category: "iptv-streaming", badge: "IPTV", plan: "9 months", title: "Opplex TV 9 Month", price: "PKR 1900", logoText: "OT", note: "Longer IPTV plan with improved value compared to shorter renewals.", features: ["9 month package", "Fewer renewals needed", "Good long-use option"] },
      { category: "iptv-streaming", badge: "IPTV", plan: "1 year", title: "Opplex TV 1 Year", price: "PKR 2500", logoText: "OT", note: "Full-year Opplex TV plan for customers who want the best duration coverage.", features: ["1 year access", "Best long-term package", "Great yearly value"] },
      { category: "admin-panels", badge: "Admin", plan: "Panel access", title: "Canva Edu Admin Panel", price: "Contact for Price", logoText: "CE", note: "Admin-level Canva Edu dashboard access for setup, management, and team operations.", features: ["Admin dashboard access", "Education workflow ready", "Available on request"] },
      { category: "admin-panels", badge: "Admin", plan: "Panel access", title: "Opplex IPTV Panel", price: "Contact for Price", logoText: "OP", note: "Management panel for Opplex IPTV operations and backend control.", features: ["IPTV panel access", "Backend management use", "Custom support available"] },
      { category: "admin-panels", badge: "Admin", plan: "Panel access", title: "IPTV Admin Panel", price: "Contact for Price", logoText: "IP", note: "General IPTV admin dashboard access for control, monitoring, and plan handling.", features: ["Admin dashboard access", "Useful for operators", "Price shared on contact"] },
      { category: "editing-design-tools", badge: "Editing", plan: "Monthly plan", title: "CapCut Pro Monthly", price: "PKR 600", logoText: "CC", note: "CapCut Pro subscription for premium templates, effects, and faster content editing.", features: ["Monthly Pro access", "Best for short video edits", "Affordable creator plan"] },
      { category: "editing-design-tools", badge: "Design", plan: "1-year plan", title: "Canva Pro 1 Year", price: "PKR 250", logoText: "CV", note: "One-year Canva Pro access for social posts, branding, and content design.", features: ["1 year validity", "Premium design elements", "Excellent budget value"] },
      { category: "editing-design-tools", badge: "Design", plan: "2-year plan", title: "Canva Pro 2 Year", price: "PKR 350", logoText: "CV", note: "Extended Canva Pro plan for creators who want longer premium design access.", features: ["2 year validity", "Long-term Canva access", "Lower renewal hassle"] },
      { category: "editing-design-tools", badge: "Design", plan: "3-year plan", title: "Canva Pro 3 Year", price: "PKR 450", logoText: "CV", note: "Three-year Canva Pro subscription built for strong value and long-term use.", features: ["3 year validity", "Ideal for consistent designers", "Premium toolkit included"] },
      { category: "editing-design-tools", badge: "Design", plan: "Lifetime plan", title: "Canva Pro Lifetime", price: "PKR 650", logoText: "CV", note: "Lifetime Canva Pro option for users who want one-time value and long-term access.", features: ["Lifetime style access", "Premium design workflow", "Best one-time value"] },
      { category: "editing-design-tools", badge: "Creative Cloud", plan: "4 months private", title: "Adobe Creative Cloud 4 Months Private", price: "PKR 2500", logoText: "AD", note: "Private Adobe Creative Cloud access for high-end creative work and design suites.", features: ["4 months private access", "Professional creative apps", "Best for advanced creators"] },
      { category: "productivity-office-tools", badge: "Office", plan: "Yearly plan", title: "MS Office 365 Yearly", price: "PKR 2500", logoText: "MS", note: "Yearly Office 365 plan for documents, spreadsheets, presentations, and daily office work.", features: ["Yearly Office access", "Useful for study and business", "Strong productivity bundle"] },
      { category: "productivity-office-tools", badge: "Meetings", plan: "Monthly plan", title: "Zoom Pro Monthly", price: "PKR 2000", logoText: "ZM", note: "Professional Zoom access for team calls, meetings, and remote collaboration.", features: ["Monthly Pro plan", "Great for meetings", "Business-ready subscription"] },
      { category: "productivity-office-tools", badge: "Assets", plan: "Shared plan", title: "Envato Elements Shared", price: "PKR 700", logoText: "EV", note: "Shared Envato Elements access for templates, graphics, video assets, and resources.", features: ["Shared asset library access", "Useful for designers", "Budget creator option"] },
      { category: "productivity-office-tools", badge: "Assets", plan: "Direct login", title: "Envato Elements Direct Logins", price: "PKR 1800", logoText: "EV", note: "Direct login Envato plan for easier asset downloads and cleaner workflow access.", features: ["Direct login access", "Premium design resources", "Better than shared workflow"] },
      { category: "seo-marketing-tools", badge: "SEO", plan: "Monthly plan", title: "Ahref Monthly", price: "PKR 5000", logoText: "AH", note: "High-value SEO platform for backlinks, keywords, competitors, and site research.", features: ["Monthly SEO toolkit", "Backlink and keyword research", "Agency-grade platform"] },
      { category: "seo-marketing-tools", badge: "Marketing", plan: "Premium access", title: "SEMrush", price: "PKR 450", logoText: "SE", note: "Affordable access to a broad SEO and marketing platform for campaigns and insights.", features: ["SEO and marketing features", "Great budget pricing", "Useful for audits and keywords"] },
      { category: "seo-marketing-tools", badge: "Marketing", plan: "Premium access", title: "Ubersuggest", price: "Contact for Price", logoText: "UB", note: "Keyword and content research tool for users who want lightweight SEO support.", features: ["Keyword research workflow", "Useful for content ideas", "Price shared on request"] },
      { category: "seo-marketing-tools", badge: "SEO", plan: "Premium access", title: "Moz Pro", price: "PKR 450", logoText: "MZ", note: "SEO research plan for ranking insights, audits, and campaign optimization.", features: ["SEO performance checks", "Site and keyword support", "Affordable professional plan"] },
      { category: "seo-marketing-tools", badge: "Video Growth", plan: "Private monthly boost", title: "VidIQ Pro Private Monthly Boost", price: "PKR 999", logoText: "VQ", note: "Private video growth tool for channel optimization, keywords, and YouTube planning.", features: ["Private monthly access", "YouTube growth support", "Useful for creators and sellers"] }
    ];

    var brandDomains = {
      grok: "x.ai",
      chatgpt: "chatgpt.com",
      perplexity: "perplexity.ai",
      gemini: "gemini.google.com",
      veo: "deepmind.google",
      runway: "runwayml.com",
      midjourney: "midjourney.com",
      storyblocks: "storyblocks.com",
      elevenlabs: "elevenlabs.io",
      grammarly: "grammarly.com",
      quillbot: "quillbot.com",
      turnitin: "turnitin.com",
      hemingway: "hemingwayapp.com",
      stealthwriter: "stealthwriter.ai",
      netflix: "netflix.com",
      amazonprime: "primevideo.com",
      youtube: "youtube.com",
      canva: "canva.com",
      opplex: "",
      iptv: "",
      capcut: "capcut.com",
      adobe: "adobe.com",
      microsoft: "microsoft.com",
      zoom: "zoom.us",
      envato: "envato.com",
      ahrefs: "ahrefs.com",
      semrush: "semrush.com",
      ubersuggest: "neilpatel.com",
      moz: "moz.com",
      vidiq: "vidiq.com"
    };

    var $catalogBody = $catalog.find(".product__all");
    var $links = $catalog.find(".product__filter-link");
    var $countText = $catalog.find(".product__showing-text");
    var $heroTitle = $catalog.find(".product__catalog-title");
    var $heroText = $catalog.find(".product__catalog-text");
    var $pageHeading = $(".page-header__inner h1");
    var $breadcrumbCurrent = $(".thm-breadcrumb li").last();
    var $emptyState = $catalog.find(".product__empty-state");
    var $searchInput = $catalog.find(".product__search-input");
    var $pagination = $catalog.find("[data-product-pagination]");
    var $sidebarToggle = $catalog.find("[data-sidebar-toggle]");
    var $sidebarBody = $catalog.find("[data-sidebar-body]");
    var $catalogLayout = $catalog.find(".product__catalog-layout");
    var catalogState = {
      category: "all",
      searchTerm: "",
      page: 1,
      perPage: 9,
      filteredProducts: []
    };

    function getCategoryAccent(category) {
      var meta = categoryMeta[category] || {};
      return meta.accent || "#22385e";
    }

    function getCategorySoft(category) {
      var accent = getCategoryAccent(category);

      if (accent === "#ff6b35") return "#fff2eb";
      if (accent === "#00a896") return "#eafbf8";
      if (accent === "#ef476f") return "#fff0f5";
      if (accent === "#f59e0b") return "#fff7e7";
      if (accent === "#0ea5e9") return "#ebf8ff";
      if (accent === "#334155") return "#f1f5f9";
      if (accent === "#8b5cf6") return "#f3efff";
      if (accent === "#2563eb") return "#edf4ff";
      if (accent === "#10b981") return "#ecfdf5";

      return "#eef4ff";
    }

    function getBrandKey(product) {
      var title = product.title.toLowerCase();

      if (title.indexOf("grok") !== -1) return "grok";
      if (title.indexOf("chatgpt") !== -1) return "chatgpt";
      if (title.indexOf("perplexity") !== -1) return "perplexity";
      if (title.indexOf("gemini") !== -1) return "gemini";
      if (title.indexOf("veo") !== -1) return "veo";
      if (title.indexOf("runway") !== -1) return "runway";
      if (title.indexOf("midjourney") !== -1) return "midjourney";
      if (title.indexOf("story block") !== -1 || title.indexOf("storyblocks") !== -1) return "storyblocks";
      if (title.indexOf("elevenlabs") !== -1) return "elevenlabs";
      if (title.indexOf("grammarly") !== -1) return "grammarly";
      if (title.indexOf("quillbot") !== -1) return "quillbot";
      if (title.indexOf("turnitin") !== -1) return "turnitin";
      if (title.indexOf("hemingway") !== -1) return "hemingway";
      if (title.indexOf("stealth writer") !== -1) return "stealthwriter";
      if (title.indexOf("netflix") !== -1) return "netflix";
      if (title.indexOf("amazon prime") !== -1 || title.indexOf("prime video") !== -1) return "amazonprime";
      if (title.indexOf("youtube") !== -1) return "youtube";
      if (title.indexOf("canva") !== -1) return "canva";
      if (title.indexOf("opplex") !== -1) return "opplex";
      if (title.indexOf("iptv") !== -1) return "iptv";
      if (title.indexOf("capcut") !== -1) return "capcut";
      if (title.indexOf("adobe") !== -1) return "adobe";
      if (title.indexOf("office") !== -1 || title.indexOf("microsoft") !== -1) return "microsoft";
      if (title.indexOf("zoom") !== -1) return "zoom";
      if (title.indexOf("envato") !== -1) return "envato";
      if (title.indexOf("ahref") !== -1) return "ahrefs";
      if (title.indexOf("semrush") !== -1) return "semrush";
      if (title.indexOf("ubersuggest") !== -1) return "ubersuggest";
      if (title.indexOf("moz") !== -1) return "moz";
      if (title.indexOf("vidiq") !== -1) return "vidiq";

      return "";
    }

    function getProductDetail(product) {
      if (product.plan) {
        return product.plan;
      }

      return product.features && product.features.length ? product.features[0] : "Premium access";
    }

    function getDisplayTitle(product) {
      return product.title
        .replace(/\b\d+\s*(month|months|year|years)\b/gi, "")
        .replace(/\b(monthly|private|yearly|lifetime|shared|direct logins|boost|plan)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    }

    function setMetaContent(selector, value) {
      var element = document.querySelector(selector);

      if (element && value) {
        element.setAttribute("content", value);
      }
    }

    function setLinkHref(selector, value) {
      var element = document.querySelector(selector);

      if (element && value) {
        element.setAttribute("href", value);
      }
    }

    function getSiteOrigin() {
      if (window.location && window.location.origin && window.location.origin !== "null") {
        return window.location.origin.replace(/\/$/, "");
      }

      return "";
    }

    function toAbsoluteUrl(value) {
      if (!value || /^(?:https?:|mailto:|tel:|data:|#)/i.test(value)) {
        return value;
      }

      if (value.charAt(0) === "/") {
        var origin = getSiteOrigin();

        return origin ? origin + value : value;
      }

      return value;
    }

    function getCategoryUrl(category) {
      var path = category === "all" ? "/products.html" : "/products.html?category=" + encodeURIComponent(category);

      return toAbsoluteUrl(path);
    }

    function updateProductSeoMeta(activeCategory, meta) {
      var canonicalUrl = getCategoryUrl(activeCategory);
      var description = meta.description || categoryMeta.all.description;
      var pageTitle = meta.pageTitle || document.title;

      document.title = pageTitle;
      setMetaContent('meta[name="description"]', description);
      setMetaContent('meta[property="og:title"]', pageTitle);
      setMetaContent('meta[property="og:description"]', description);
      setMetaContent('meta[name="twitter:title"]', pageTitle);
      setMetaContent('meta[name="twitter:description"]', description);
      setMetaContent('meta[property="og:url"]', canonicalUrl);
      setLinkHref('link[rel="canonical"]', canonicalUrl);
    }

    function updateProductSchema(activeCategory, meta, filteredProducts) {
      var schemaId = "dynamic-product-schema";
      var canonicalUrl = getCategoryUrl(activeCategory);
      var description = meta.description || categoryMeta.all.description;
      var schemaNode = document.getElementById(schemaId);
      var visibleProducts = filteredProducts.slice(0, 24);
      var itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": canonicalUrl + "#product-list",
        "url": canonicalUrl,
        "name": meta.label + " product catalog",
        "description": description,
        "numberOfItems": filteredProducts.length,
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "itemListElement": visibleProducts.map(function (product, index) {
          var numericPrice = parseNumericPrice(product.price);
          var productSchema = {
            "@type": "Product",
            "name": getDisplayTitle(product),
            "description": product.note || getProductDetail(product),
            "category": product.category,
            "sku": createProductKey(product),
            "brand": {
              "@type": "Brand",
              "name": "AH Graphics Tools"
            }
          };

          if (numericPrice !== null) {
            productSchema.offers = {
              "@type": "Offer",
              "priceCurrency": "PKR",
              "price": numericPrice,
              "availability": "https://schema.org/InStock",
              "url": canonicalUrl
            };
          }

          return {
            "@type": "ListItem",
            "position": index + 1,
            "item": productSchema
          };
        })
      };

      if (!schemaNode) {
        schemaNode = document.createElement("script");
        schemaNode.type = "application/ld+json";
        schemaNode.id = schemaId;
        document.head.appendChild(schemaNode);
      }

      schemaNode.text = JSON.stringify(itemList, null, 2);
    }

    function getLogoMarkup(product) {
      var domain = brandDomains[getBrandKey(product)] || "";

      if (!domain) {
        return '<span class="product__tool-logo-fallback">' + product.logoText + "</span>";
      }

      return [
        '<img class="product__tool-logo-image" src="https://www.google.com/s2/favicons?domain=',
        domain,
        '&sz=128" alt="',
        product.title,
        ' logo" loading="lazy" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'inline-flex\';">',
        '<span class="product__tool-logo-fallback" style="display:none;">',
        product.logoText,
        "</span>"
      ].join("");
    }

    function renderCard(product) {
      var productKey = createProductKey(product);
      var isWishlisted = isProductWishlisted(productKey);
      var detailText = getProductDetail(product);
      var accent = getCategoryAccent(product.category);
      var soft = getCategorySoft(product.category);
      var displayTitle = getDisplayTitle(product);
      var primaryPoint = (product.features && product.features.length ? product.features[0] : detailText);

      var cardPoints = [primaryPoint].map(function (feature) {
        return '<li class="product__feature-item">' + feature + "</li>";
      }).join("");

      return [
        '<article class="product__filter-card" data-category="' + product.category + '" style="--product-accent:' + accent + '; --product-soft:' + soft + ';">',
        '<div class="product__all-single">',
        '<div class="product__all-single--digital">',
        '<div class="product__card-top">',
        '<div class="product__card-halo"></div>',
        '<div class="product__brand-head">',
        '<div class="product__tool-logo product__tool-logo--hero">' + getLogoMarkup(product) + "</div>",
        "</div>",
        "</div>",
        '<div class="product__all-content">',
        '<div class="product__title-wrap">',
        '<span class="product__all-badge">' + product.badge + ' Access</span>',
        '<h4 class="product__all-title"><a href="checkout.html">' + displayTitle + '</a></h4>',
        "</div>",
        '<ul class="product__feature-list">' + cardPoints + "</ul>",
        '<div class="product__all-footer">',
        '<div class="product__price-box-wrap"><div class="product__price-box"><span class="product__price-label">' + product.plan + '</span><p class="product__all-price">' + product.price + "</p></div></div>",
        '<div class="product__all-actions product__card-actions">',
        '<div class="product__all-btn-box product__all-btn-box--icon product__card-action-slot product__card-action-slot--icon"><button class="product__all-btn product__all-btn--icon product__all-btn--secondary product__card-action-btn product__card-action-btn--icon" type="button" data-product-key="' + productKey + '" data-product-action="add-to-cart" aria-label="Add to cart"><i class="fa fa-shopping-bag"></i></button></div>',
        '<div class="product__all-btn-box product__card-action-slot product__card-action-slot--buy"><a class="thm-btn product__all-btn product__all-btn--buy product__card-action-btn product__card-action-btn--buy" href="checkout.html" data-product-key="' + productKey + '" data-product-action="buy-now">Buy Now</a></div>',
        '<div class="product__all-btn-box product__all-btn-box--icon product__card-action-slot product__card-action-slot--icon"><button class="product__all-btn product__all-btn--icon product__card-action-btn product__card-action-btn--icon product__card-action-btn--wishlist' + (isWishlisted ? ' is-active' : '') + '" type="button" data-product-key="' + productKey + '" data-product-action="toggle-wishlist" aria-label="Add to wishlist"><i class="fa fa-heart"></i></button></div>',
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
        "</article>"
      ].join("");
    }

    function getSortedProducts(list) {
      return list.slice().sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    }

    function renderPagination(totalItems) {
      if (!$pagination.length) {
        return;
      }

      var totalPages = Math.max(1, Math.ceil(totalItems / catalogState.perPage));

      if (totalItems === 0 || totalPages <= 1) {
        $pagination.empty().hide();
        return;
      }

      var buttons = [];
      var pageIndex = 1;

      buttons.push('<button type="button" class="product__pagination-btn product__pagination-btn--nav" data-page-nav="prev" ' + (catalogState.page === 1 ? "disabled" : "") + '>Prev</button>');

      for (pageIndex = 1; pageIndex <= totalPages; pageIndex += 1) {
        buttons.push('<button type="button" class="product__pagination-btn' + (pageIndex === catalogState.page ? ' is-active' : '') + '" data-page="' + pageIndex + '">' + pageIndex + "</button>");
      }

      buttons.push('<button type="button" class="product__pagination-btn product__pagination-btn--nav" data-page-nav="next" ' + (catalogState.page === totalPages ? "disabled" : "") + '>Next</button>');

      $pagination.html(buttons.join("")).show();
    }

    function renderCatalogPage() {
      var startIndex = (catalogState.page - 1) * catalogState.perPage;
      var pageProducts = catalogState.filteredProducts.slice(startIndex, startIndex + catalogState.perPage);

      if (!pageProducts.length) {
        $catalogBody.empty();
        renderPagination(0);
        return;
      }

      $catalogBody.html(['<div class="product__all-grid">', pageProducts.map(renderCard).join(""), "</div>"].join(""));
      renderPagination(catalogState.filteredProducts.length);
    }

    $catalog.on("click", "[data-product-action]", function (event) {
      var action = $(this).attr("data-product-action");
      var productKey = $(this).attr("data-product-key");
      var selectedProduct = null;
      var index = 0;

      for (index = 0; index < products.length; index += 1) {
        if (createProductKey(products[index]) === productKey) {
          selectedProduct = products[index];
          break;
        }
      }

      if (!selectedProduct) {
        return;
      }

      if (action === "toggle-wishlist") {
        var isActive = toggleWishlistProduct(selectedProduct);

        event.preventDefault();
        $(this).toggleClass("is-active", isActive);
        return;
      }

      addProductToCheckoutCart(selectedProduct);

      if (action === "add-to-cart") {
        var $button = $(this);

        event.preventDefault();
        if ($button.hasClass("product__card-action-btn--icon")) {
          var originalIcon = $button.html();
          $button.html('<i class="fa fa-check"></i>').addClass("is-added");

          window.setTimeout(function () {
            $button.html(originalIcon).removeClass("is-added");
          }, 1200);
        } else {
          $button.text("Added");

          window.setTimeout(function () {
            $button.text("Add to Cart");
          }, 1200);
        }
      }
    });

    function getCategoryFromUrl() {
      var params = new URLSearchParams(window.location.search);
      var category = params.get("category");

      if (!category) {
        return "all";
      }

      category = category.toLowerCase();

      return categoryMeta[category] ? category : "all";
    }

    function updateUrl(category) {
      if (!window.history || !window.history.replaceState) {
        return;
      }

      var nextUrl = category === "all" ? "products.html" : "products.html?category=" + category;
      window.history.replaceState({}, "", nextUrl);
    }

    function applyCategory(category, syncUrl) {
      var activeCategory = categoryMeta[category] ? category : "all";
      var meta = categoryMeta[activeCategory];
      var searchTerm = $searchInput.length ? ($searchInput.val() || "").toLowerCase().trim() : "";
      var filteredProducts = getSortedProducts(products).filter(function (product) {
        var titleText = product.title.toLowerCase();
        var planText = (product.plan || "").toLowerCase();
        var badgeText = (product.badge || "").toLowerCase();
        var shouldShowCategory = activeCategory === "all" || product.category === activeCategory;
        var shouldShowSearch = !searchTerm || titleText.indexOf(searchTerm) !== -1 || planText.indexOf(searchTerm) !== -1 || badgeText.indexOf(searchTerm) !== -1;

        return shouldShowCategory && shouldShowSearch;
      });
      var visibleCount = filteredProducts.length;
      var totalPages = Math.max(1, Math.ceil(visibleCount / catalogState.perPage));

      catalogState.category = activeCategory;
      catalogState.searchTerm = searchTerm;
      catalogState.filteredProducts = filteredProducts;
      catalogState.page = Math.min(catalogState.page, totalPages);
      catalogState.page = Math.max(1, catalogState.page);

      $links.removeClass("is-active").removeAttr("aria-current");
      $links
        .filter("[data-category-link='" + activeCategory + "']")
        .addClass("is-active")
        .attr("aria-current", "page");

      if ($pageHeading.length) {
        $pageHeading.html(meta.heading);
      }

      if ($breadcrumbCurrent.length) {
        $breadcrumbCurrent.text(meta.label);
      }

      if ($heroTitle.length) {
        $heroTitle.text(meta.heroTitle);
      }

      if ($heroText.length) {
        $heroText.text(meta.heroText);
      }

      if ($countText.length) {
        $countText.text(
          "Showing " +
          visibleCount +
          " " +
          (visibleCount === 1 ? meta.resultSingle : meta.resultPlural)
        );
      }

      if ($emptyState.length) {
        $emptyState.prop("hidden", visibleCount !== 0);
      }

      updateProductSeoMeta(activeCategory, meta);
      updateProductSchema(activeCategory, meta, filteredProducts);

      if (syncUrl) {
        updateUrl(activeCategory);
      }

      renderCatalogPage();
    }

    $links.on("click", function (e) {
      var nextCategory = $(this).data("category-link") || "all";

      e.preventDefault();
      catalogState.page = 1;
      applyCategory(nextCategory, true);
    });

    if ($searchInput.length) {
      $searchInput.on("input", function () {
        catalogState.page = 1;
        applyCategory(getCategoryFromUrl(), false);
      });
    }

    if ($pagination.length) {
      $pagination.on("click", "[data-page]", function () {
        catalogState.page = parseInt($(this).attr("data-page"), 10) || 1;
        renderCatalogPage();
        $("html, body").animate({ scrollTop: $catalogBody.offset().top - 120 }, 250);
      });

      $pagination.on("click", "[data-page-nav]", function () {
        var direction = $(this).attr("data-page-nav");
        var totalPages = Math.max(1, Math.ceil(catalogState.filteredProducts.length / catalogState.perPage));

        if (direction === "prev" && catalogState.page > 1) {
          catalogState.page -= 1;
        }

        if (direction === "next" && catalogState.page < totalPages) {
          catalogState.page += 1;
        }

        renderCatalogPage();
        $("html, body").animate({ scrollTop: $catalogBody.offset().top - 120 }, 250);
      });
    }

    if ($sidebarToggle.length && $sidebarBody.length) {
      $sidebarToggle.on("click", function () {
        var isExpanded = $(this).attr("aria-expanded") === "true";
        $sidebarToggle.attr("aria-expanded", String(!isExpanded));
        $sidebarToggle.toggleClass("is-collapsed", isExpanded);
        $(".product__sidebar-nav").toggleClass("is-collapsed", isExpanded);
        $catalogLayout.toggleClass("product__catalog-layout--collapsed", isExpanded);
        $sidebarBody.stop(true, true).slideToggle(220);
      });
    }

    $(window).on("popstate", function () {
      catalogState.page = 1;
      applyCategory(getCategoryFromUrl(), false);
    });

    applyCategory(getCategoryFromUrl(), false);
  }

  function checkoutOrderFlow() {
    var $checkout = $(".checkout-minimal");

    if (!$checkout.length) {
      return;
    }

    var $cartList = $checkout.find("[data-checkout-cart]");
    var $emptyState = $checkout.find("[data-checkout-empty]");
    var $clearOrder = $checkout.find("[data-clear-order]");
    var $form = $checkout.find("[data-checkout-form]");
    var $name = $("#checkout-customer-name");
    var $phone = $("#checkout-customer-phone");
    var $category = $("#checkout-product-category");
    var $tool = $("#checkout-tool-name");
    var $plan = $("#checkout-plan-name");
    var $delivery = $("#checkout-delivery-method");
    var $paymentMethod = $("#checkout-payment-method");
    var $paymentStatus = $("#checkout-payment-status");
    var $paymentConfirmation = $("#checkout-payment-confirmation");
    var $whatsappLinks = $checkout.find("[data-whatsapp-order]");
    var $orderCount = $checkout.find("[data-order-count]");
    var $orderTotal = $checkout.find("[data-order-total]");

    var categoryLabels = {
      "ai-tools": "AI Tools",
      "ai-video-tools": "AI Video Tools",
      "ai-voice-tools": "AI Voice Tools",
      "writing-tools": "Writing Tools",
      "entertainment-streaming": "Entertainment Streaming",
      "iptv-streaming": "IPTV Streaming",
      "admin-panels": "Admin Panels",
      "editing-design-tools": "Editing & Design",
      "productivity-office-tools": "Productivity Tools",
      "seo-marketing-tools": "SEO & Marketing"
    };

    function updateSelectValue($select, value, text) {
      if (!$select.length) {
        return;
      }

      var safeValue = value || "";
      var displayText = text || safeValue || $select.find("option").first().text();
      var $existing = $select.find('option[value="' + safeValue.replace(/"/g, '\\"') + '"]');

      if (!$existing.length) {
        $select.append('<option value="' + escapeHtml(safeValue) + '">' + escapeHtml(displayText) + "</option>");
      }

      $select.val(safeValue);
      refreshNiceSelect($select);
    }

    function resetSelectValue($select) {
      if (!$select.length) {
        return;
      }

      $select.prop("selectedIndex", 0);
      refreshNiceSelect($select);
    }

    function getCart() {
      return getStoredCheckoutCart();
    }

    function saveCart(cart) {
      saveCheckoutCart(cart);
      renderOrder();
    }

    function renderOrder() {
      var cart = getCart();
      var html = [];
      var totalItems = 0;
      var totalPrice = 0;
      var hasCustomPrice = false;
      var firstItem = cart[0] || null;
      var multipleCategories = {};

      cart.forEach(function (item) {
        var quantity = item.quantity || 1;
        var numericPrice = parseNumericPrice(item.price);
        var itemTotalText = item.price;

        totalItems += quantity;
        multipleCategories[item.category] = true;

        if (numericPrice !== null) {
          totalPrice += numericPrice * quantity;
          itemTotalText = "PKR " + (numericPrice * quantity).toLocaleString();
        } else {
          hasCustomPrice = true;
        }

        html.push([
          '<div class="checkout-minimal__order-item" data-cart-key="' + escapeHtml(item.key) + '">',
          '<div class="checkout-minimal__order-item-main">',
          '<span class="checkout-minimal__order-badge">' + escapeHtml(item.badge || "Selected Product") + "</span>",
          '<h4 class="checkout-minimal__order-title">' + escapeHtml(item.title) + "</h4>",
          '<div class="checkout-minimal__order-meta">',
          '<span><strong>Plan:</strong> ' + escapeHtml(item.plan || "N/A") + "</span>",
          '<span><strong>Price:</strong> ' + escapeHtml(item.price || "Contact for Price") + "</span>",
          '<span><strong>Line Total:</strong> ' + escapeHtml(itemTotalText) + "</span>",
          "</div>",
          "</div>",
          '<div class="checkout-minimal__order-controls">',
          '<button type="button" class="checkout-minimal__qty-btn" data-cart-action="decrease">-</button>',
          '<span class="checkout-minimal__qty-value">' + quantity + "</span>",
          '<button type="button" class="checkout-minimal__qty-btn" data-cart-action="increase">+</button>',
          '<button type="button" class="checkout-minimal__remove-btn" data-cart-action="remove">Remove</button>',
          "</div>",
          "</div>"
        ].join(""));
      });

      $cartList.html(html.join(""));
      $emptyState.prop("hidden", cart.length !== 0);
      $cartList.prop("hidden", cart.length === 0);
      $clearOrder.prop("disabled", cart.length === 0);
      $orderCount.text(totalItems);
      $orderTotal.text(formatPriceTotal(totalPrice, hasCustomPrice));

      if (firstItem) {
        if (Object.keys(multipleCategories).length > 1) {
          updateSelectValue($category, "multi-category", "Multiple Categories");
        } else {
          updateSelectValue($category, firstItem.category, categoryLabels[firstItem.category] || firstItem.category);
        }

        updateSelectValue($tool, firstItem.key, cart.length > 1 ? firstItem.title + " + " + (cart.length - 1) + " more" : firstItem.title);
        updateSelectValue($plan, firstItem.plan, cart.length > 1 ? "Multiple plans in order" : firstItem.plan);
      } else {
        resetSelectValue($category);
        resetSelectValue($tool);
        resetSelectValue($plan);
      }
    }

    function updateCartItem(key, action) {
      var cart = getCart();
      var nextCart = [];

      cart.forEach(function (item) {
        if (item.key !== key) {
          nextCart.push(item);
          return;
        }

        if (action === "remove") {
          return;
        }

        if (action === "increase") {
          item.quantity = (item.quantity || 1) + 1;
          nextCart.push(item);
          return;
        }

        if (action === "decrease") {
          item.quantity = (item.quantity || 1) - 1;

          if (item.quantity > 0) {
            nextCart.push(item);
          }
        }
      });

      saveCart(nextCart);
    }

    function buildWhatsAppMessage() {
      var cart = getCart();
      var lines = [
        "Assalam o Alaikum, I want to confirm my order.",
        "",
        "*Customer Details*",
        "Name: " + ($name.val() || "-"),
        "Phone / WhatsApp: " + ($phone.val() || "-"),
        "",
        "*Selected Products*"
      ];

      if (!cart.length) {
        lines.push("- No product selected yet");
      } else {
        cart.forEach(function (item, index) {
          lines.push((index + 1) + ". " + item.title + " x" + (item.quantity || 1));
          lines.push("   Plan: " + (item.plan || "-"));
          lines.push("   Price: " + (item.price || "-"));
        });
      }

      lines.push("");
      lines.push("*Order Preferences*");
      lines.push("Category: " + ($category.find("option:selected").text() || "-"));
      lines.push("Tool: " + ($tool.find("option:selected").text() || "-"));
      lines.push("Plan: " + ($plan.find("option:selected").text() || "-"));
      lines.push("Delivery Method: " + ($delivery.find("option:selected").text() || "-"));
      lines.push("Payment Method: " + ($paymentMethod.find("option:selected").text() || "-"));
      lines.push("Payment Status: " + ($paymentStatus.find("option:selected").text() || "-"));
      lines.push("Payment Confirmation: " + ($paymentConfirmation.val() || "-"));
      lines.push("");
      lines.push("I am attaching payment proof / screenshot.");

      return lines.join("\n");
    }

    $cartList.on("click", "[data-cart-action]", function () {
      var $item = $(this).closest("[data-cart-key]");
      var cartKey = $item.attr("data-cart-key");
      var action = $(this).attr("data-cart-action");

      updateCartItem(cartKey, action);
    });

    $clearOrder.on("click", function () {
      saveCart([]);
    });

    $whatsappLinks.on("click", function (event) {
      var cart = getCart();
      var requiredName = ($name.val() || "").trim();
      var requiredPhone = ($phone.val() || "").trim();
      var paymentMethodText = $paymentMethod.find("option:selected").text();
      var paymentStatusText = $paymentStatus.find("option:selected").text();

      if (!cart.length || !requiredName || !requiredPhone || !paymentMethodText || paymentMethodText === "Select Payment Method" || !paymentStatusText || paymentStatusText === "Select Status") {
        event.preventDefault();
        alert("Please select at least one product and complete your name, phone, payment method, and payment status before opening WhatsApp.");
        return;
      }

      var message = buildWhatsAppMessage();
      var nextUrl = "https://wa.me/" + checkoutWhatsappNumber + "?text=" + encodeURIComponent(message);

      $(this).attr("href", nextUrl);
    });

    renderOrder();
  }




  $(".add").on("click", function () {
    if ($(this).prev().val() < 999) {
      $(this)
        .prev()
        .val(+$(this).prev().val() + 1);
    }
  });
  $(".sub").on("click", function () {
    if ($(this).next().val() > 1) {
      if ($(this).next().val() > 1)
        $(this)
        .next()
        .val(+$(this).next().val() - 1);
    }
  });




  // ===Checkout Payment===
  if ($(".checkout__payment__title").length) {

    $(".checkout__payment__item").find('.checkout__payment__content').hide();
    $(".checkout__payment__item--active").find('.checkout__payment__content').show();

    $(".checkout__payment__title").on("click", function (e) {
      e.preventDefault();


      $(this).parents('.checkout__payment').find('.checkout__payment__item').removeClass("checkout__payment__item--active");
      $(this).parents(".checkout__payment").find(".checkout__payment__content").slideUp();

      $(this).parent().addClass("checkout__payment__item--active");
      $(this).parent().find(".checkout__payment__content").slideDown();

    })
  }






  // Type Effect
  if ($('.typed-effect').length) {
    $('.typed-effect').each(function () {
      var typedStrings = $(this).data('strings');
      var typedTag = $(this).attr('id');
      var typed = new Typed('#' + typedTag, {
        typeSpeed: 100,
        backSpeed: 100,
        fadeOut: true,
        loop: true,
        strings: typedStrings.split(',')
      });
    });

  }








  if ($("#switch-toggle-tab").length) {
    var toggleSwitch = $("#switch-toggle-tab label.switch");
    var TabTitle = $("#switch-toggle-tab li");
    var monthTabTitle = $("#switch-toggle-tab li.month");
    var yearTabTitle = $("#switch-toggle-tab li.year");
    var monthTabContent = $("#month");
    var yearTabContent = $("#year");
    // hidden show deafult;
    monthTabContent.fadeIn();
    yearTabContent.fadeOut();

    function toggleHandle() {
      if (toggleSwitch.hasClass("on")) {
        monthTabContent.fadeIn();
        yearTabContent.fadeOut();
        monthTabTitle.addClass("active");
        yearTabTitle.removeClass("active");
      } else {
        monthTabContent.fadeOut();
        yearTabContent.fadeIn();
        yearTabTitle.addClass("active");
        monthTabTitle.removeClass("active");
      }
    }
    monthTabTitle.on("click", function () {
      toggleSwitch.addClass("on").removeClass("off");
      toggleHandle();
      return false;
    });
    yearTabTitle.on("click", function () {
      toggleSwitch.addClass("off").removeClass("on");
      toggleHandle();
      return false;
    });
    toggleSwitch.on("click", function () {
      toggleSwitch.toggleClass("on off");
      toggleHandle();
    });
  }








  //Main Slider 
  if ($(".main-slider__carousel").length) {
    $(".main-slider__carousel").owlCarousel({
      loop: true,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      margin: 0,
      nav: true,
      dots: true,
      smartSpeed: 900,
      navSpeed: 900,
      dotsSpeed: 900,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 8500,
      navText: [
        '<span class="icon-right-arrow-1"></span>',
        '<span class="icon-right-arrow-1"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        800: {
          items: 1,
        },
        992: {
          items: 1,
        },
      },
    });
  }










  //Brand One Carousel
  if ($(".brand-one__carousel").length) {
    $(".brand-one__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-next"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        540: {
          items: 2,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
        1320: {
          items: 4,
        },
      },
    });
  }







  //Portfolio One Carousel
  if ($(".portfolio-one__carousel").length) {
    $(".portfolio-one__carousel").owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
        1320: {
          items: 4,
        },
      },
    });
  }



  //Testimonial One Carousel
  if ($(".testimonial-one__carousel").length) {
    $(".testimonial-one__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1320: {
          items: 3,
        },
      },
    });
  }




  //Blog One Carousel
  if ($(".blog-one__carousel").length) {
    $(".blog-one__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1320: {
          items: 3,
        },
      },
    });
  }




  //Team One Carousel
  if ($(".team-one__carousel").length) {
    $(".team-one__carousel").owlCarousel({
      loop: false,
      margin: 30,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: false,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1320: {
          items: 1,
        },
      },
    });
  }





  //Testimonial Two Carousel
  if ($(".testimonial-two__carousel").length) {
    $(".testimonial-two__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      dots: false,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1320: {
          items: 1,
        },
      },
    });
  }






  //Portfolio Two Carousel
  if ($(".portfolio-two__carousel").length) {
    $(".portfolio-two__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 1,
        },
        1200: {
          items: 1,
        },
        1320: {
          items: 1,
        },
      },
    });
  }





  //Blog Two Carousel
  if ($(".blog-two__carousel").length) {
    $(".blog-two__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-left-arrow"></span>',
        '<span class="icon-right-arrow"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1320: {
          items: 3,
        },
      },
    });
  }







  //Blog Page Carousel
  if ($(".blog-carousel-style").length) {
    $(".blog-carousel-style").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-right-arrow-1"></span>',
        '<span class="icon-right-arrow-1"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1320: {
          items: 3,
        },
      },
    });
  }



  //Team Page Carousel
  if ($(".team-carousel-style").length) {
    $(".team-carousel-style").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-right-arrow-1"></span>',
        '<span class="icon-right-arrow-1"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 4,
        },
        1320: {
          items: 4,
        },
      },
    });
  }






  //Team Page Carousel
  if ($(".testimonial-carousel-style").length) {
    $(".testimonial-carousel-style").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: true,
      smartSpeed: 500,
      autoplay: true,
      autoplayTimeout: 7000,
      navText: [
        '<span class="icon-right-arrow-1"></span>',
        '<span class="icon-right-arrow-1"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
        1200: {
          items: 3,
        },
        1320: {
          items: 3,
        },
      },
    });
  }








  // custom coursor
  if ($(".custom-cursor").length) {

    var cursor = document.querySelector('.custom-cursor__cursor');
    var cursorinner = document.querySelector('.custom-cursor__cursor-two');
    var a = document.querySelectorAll('a');

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
    });

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      cursorinner.style.left = x + 'px';
      cursorinner.style.top = y + 'px';
    });

    document.addEventListener('mousedown', function () {
      cursor.classList.add('click');
      cursorinner.classList.add('custom-cursor__innerhover')
    });

    document.addEventListener('mouseup', function () {
      cursor.classList.remove('click')
      cursorinner.classList.remove('custom-cursor__innerhover')
    });

    a.forEach(item => {
      item.addEventListener('mouseover', () => {
        cursor.classList.add('custom-cursor__hover');
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('custom-cursor__hover');
      });
    })
  }








  //Progress Count Bar
  if ($(".count-bar").length) {
    $(".count-bar").appear(
      function () {
        var el = $(this);
        var percent = el.data("percent");
        $(el).css("width", percent).addClass("counted");
      }, {
        accY: -50
      }
    );
  }








  //Progress Bar / Levels
  if ($(".progress-levels .progress-box .bar-fill").length) {
    $(".progress-box .bar-fill").each(
      function () {
        $(".progress-box .bar-fill").appear(function () {
          var progressWidth = $(this).attr("data-percent");
          $(this).css("width", progressWidth + "%");
        });
      }, {
        accY: 0
      }
    );
  }










  //Fact Counter + Text Count
  if ($(".count-box").length) {
    $(".count-box").appear(
      function () {
        var $t = $(this),
          n = $t.find(".count-text").attr("data-stop"),
          r = parseInt($t.find(".count-text").attr("data-speed"), 10);

        if (!$t.hasClass("counted")) {
          $t.addClass("counted");
          $({
            countNum: $t.find(".count-text").text()
          }).animate({
            countNum: n
          }, {
            duration: r,
            easing: "linear",
            step: function () {
              $t.find(".count-text").text(Math.floor(this.countNum));
            },
            complete: function () {
              $t.find(".count-text").text(this.countNum);
            }
          });
        }
      }, {
        accY: 0
      }
    );
  }


  //Fact Counter + Text Count
  if ($(".count-box-2").length) {
    $(".count-box-2").appear(
      function () {
        var $t = $(this),
          n = $t.find(".count-text").attr("data-stop"),
          r = parseInt($t.find(".count-text").attr("data-speed"), 10);

        if (!$t.hasClass("counted")) {
          $t.addClass("counted");
          $({
            countNum: $t.find(".count-text").text()
          }).animate({
            countNum: n
          }, {
            duration: r,
            easing: "linear",
            step: function () {
              $t.find(".count-text").text(Math.floor(this.countNum));
            },
            complete: function () {
              $t.find(".count-text").text(this.countNum);
            }
          });
        }
      }, {
        accY: 0
      }
    );
  }




  // Accrodion
  if ($(".accrodion-grp").length) {
    var accrodionGrp = $(".accrodion-grp");
    accrodionGrp.each(function () {
      var accrodionName = $(this).data("grp-name");
      var Self = $(this);
      var accordion = Self.find(".accrodion");
      Self.addClass(accrodionName);
      Self.find(".accrodion .accrodion-content").hide();
      Self.find(".accrodion.active").find(".accrodion-content").show();
      accordion.each(function () {
        $(this)
          .find(".accrodion-title")
          .on("click", function () {
            if ($(this).parent().hasClass("active") === false) {
              $(".accrodion-grp." + accrodionName)
                .find(".accrodion")
                .removeClass("active");
              $(".accrodion-grp." + accrodionName)
                .find(".accrodion")
                .find(".accrodion-content")
                .slideUp();
              $(this).parent().addClass("active");
              $(this).parent().find(".accrodion-content").slideDown();
            }
          });
      });
    });
  }



  if ($(".contact-form-validated").length) {
    $(".contact-form-validated").each(function () {
      let self = $(this);
      self.validate({
        // initialize the plugin
        rules: {
          name: {
            required: true
          },
          email: {
            required: true,
            email: true
          },
          message: {
            required: true
          },
          subject: {
            required: true
          }
        },
        submitHandler: function (form) {
          // sending value with ajax request
          $.post(
            $(form).attr("action"),
            $(form).serialize(),
            function (response) {
              $(form).parent().find(".result").append(response);
              $(form).find('input[type="text"]').val("");
              $(form).find('input[type="email"]').val("");
              $(form).find("textarea").val("");
            }
          );
          return false;
        }
      });
    });
  }

  // mailchimp form
  if ($(".mc-form").length) {
    $(".mc-form").each(function () {
      var Self = $(this);
      var mcURL = Self.data("url");
      var mcResp = Self.parent().find(".mc-form__response");

      Self.ajaxChimp({
        url: mcURL,
        callback: function (resp) {
          // appending response
          mcResp.append(function () {
            return '<p class="mc-message">' + resp.msg + "</p>";
          });
          // making things based on response
          if (resp.result === "success") {
            // Do stuff
            Self.removeClass("errored").addClass("successed");
            mcResp.removeClass("errored").addClass("successed");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
          if (resp.result === "error") {
            Self.removeClass("successed").addClass("errored");
            mcResp.removeClass("successed").addClass("errored");
            Self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
        }
      });
    });
  }

  if ($(".video-popup").length) {
    $(".video-popup").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: true,

      fixedContentPos: false
    });
  }

  if ($(".img-popup").length) {
    var groups = {};
    $(".img-popup").each(function () {
      var id = parseInt($(this).attr("data-group"), 10);

      if (!groups[id]) {
        groups[id] = [];
      }

      groups[id].push(this);
    });

    $.each(groups, function () {
      $(this).magnificPopup({
        type: "image",
        closeOnContentClick: true,
        closeBtnInside: false,
        gallery: {
          enabled: true
        }
      });
    });
  }





  //=== CountDownTimer===
  if ($('.coming-soon-countdown').length) {
    $('.coming-soon-countdown').each(function () {
      var Self = $(this);
      var countDate = Self.data('countdown-time'); // getting date

      Self.countdown(countDate, function (event) {
        $(this).html('<li> <div class="box"> <span class="days">' + event.strftime('%D') + '</span> <span class="timeRef">days</span> </div> </li> <li> <div class="box"> <span class="hours">' + event.strftime('%H') + '</span> <span class="timeRef clr-1">hrs</span> </div> </li> <li> <div class="box"> <span class="minutes">' + event.strftime('%M') + '</span> <span class="timeRef clr-2">mins</span> </div> </li> <li> <div class="box"> <span class="seconds">' + event.strftime('%S') + '</span> <span class="timeRef clr-3">secs</span> </div> </li>');
      });
    });
  };






  //Show Popup menu
  $(document).on("click", ".megamenu-clickable--toggler > a", function (e) {
    var shouldTogglePopup =
      $(e.target).closest(".clickMe").length ||
      $(this).attr("href") === "#" ||
      $(this).hasClass("megamenu-trigger-only");

    if (!shouldTogglePopup) {
      return;
    }

    $("body").toggleClass("megamenu-popup-active");
    $(this).parent().find("ul").toggleClass("megamenu-clickable--active");
    e.preventDefault();
  });
  $(document).on("click", ".megamenu-clickable--close", function (e) {
    $("body").removeClass("megamenu-popup-active");
    $(".megamenu-clickable--active").removeClass("megamenu-clickable--active");
    e.preventDefault();
  });





  function dynamicCurrentMenuClass(selector) {
    let FileName = window.location.href.split("/").reverse()[0];

    selector.find("li").each(function () {
      let anchor = $(this).find("a");
      if ($(anchor).attr("href") == FileName) {
        $(this).addClass("current");
      }
    });
    // if any li has .current elmnt add class
    selector.children("li").each(function () {
      if ($(this).find(".current").length) {
        $(this).addClass("current");
      }
    });
    // if no file name return
    if ("" == FileName) {
      selector.find("li").eq(0).addClass("current");
    }
  }

  if ($(".main-menu__list").length) {
    // dynamic current class
    let mainNavUL = $(".main-menu__list");
    dynamicCurrentMenuClass(mainNavUL);
  }

  headerUtilityWorkflow();

  if ($(".main-menu__list").length && $(".mobile-nav__container").length) {
    let navContent = document.querySelector(".main-menu__list").outerHTML;
    let mobileNavContainer = document.querySelector(".mobile-nav__container");
    mobileNavContainer.innerHTML = navContent;
  }
  if ($(".sticky-header__content").length) {
    let navContent = document.querySelector(".main-menu").innerHTML;
    let mobileNavContainer = document.querySelector(".sticky-header__content");
    mobileNavContainer.innerHTML = navContent;
  }

  if ($(".mobile-nav__container .main-menu__list").length) {
    let dropdownAnchor = $(
      ".mobile-nav__container .main-menu__list .dropdown > a"
    );
    dropdownAnchor.each(function () {
      let self = $(this);
      let toggleBtn = document.createElement("BUTTON");
      toggleBtn.setAttribute("aria-label", "dropdown toggler");
      toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
      self.append(function () {
        return toggleBtn;
      });
      self.find("button").on("click", function (e) {
        e.preventDefault();
        let self = $(this);
        self.toggleClass("expanded");
        self.parent().toggleClass("expanded");
        self.parent().parent().children("ul").slideToggle();
      });
    });
  }

  if ($(".mobile-nav__toggler").length) {
    $(".mobile-nav__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mobile-nav__wrapper").toggleClass("expanded");
      $("body").toggleClass("locked");
    });
  }




  //Header Search
  if ($('.searcher-toggler-box').length) {
    $('.searcher-toggler-box').on('click', function () {
      $('body').addClass('search-active');
    });
    $('.close-search').on('click', function () {
      $('body').removeClass('search-active');
    });

    $('.search-popup .color-layer').on('click', function () {
      $('body').removeClass('search-active');
    });
  }




  if ($(".wow").length) {
    var wow = new WOW({
      boxClass: "wow", // animated element css class (default is wow)
      animateClass: "animated", // animation css class (default is animated)
      mobile: true, // trigger animations on mobile devices (default is true)
      live: true // act on asynchronously loaded content (default is true)
    });
    wow.init();
  }






  if ($(".tabs-box").length) {
    $(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
      e.preventDefault();
      var target = $($(this).attr("data-tab"));

      if ($(target).is(":visible")) {
        return false;
      } else {
        target
          .parents(".tabs-box")
          .find(".tab-buttons")
          .find(".tab-btn")
          .removeClass("active-btn");
        $(this).addClass("active-btn");
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .fadeOut(0);
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .removeClass("active-tab");
        $(target).fadeIn(300);
        $(target).addClass("active-tab");
      }
    });
  }












  // ===Portfolio===
  function projectMasonaryLayout() {
    if ($(".masonary-layout").length) {
      $(".masonary-layout").isotope({
        layoutMode: "masonry"
      });
    }
    if ($(".post-filter").length) {
      $(".post-filter li")
        .children(".filter-text")
        .on("click", function () {
          var Self = $(this);
          var selector = Self.parent().attr("data-filter");
          $(".post-filter li").removeClass("active");
          Self.parent().addClass("active");
          $(".filter-layout").isotope({
            filter: selector,
            animationOptions: {
              duration: 500,
              easing: "linear",
              queue: false
            }
          });
          return false;
        });
    }

    if ($(".post-filter.has-dynamic-filters-counter").length) {
      // var allItem = $('.single-filter-item').length;
      var activeFilterItem = $(".post-filter.has-dynamic-filters-counter").find(
        "li"
      );
      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $(".filter-layout").find(filterElement).length;
        $(this)
          .children(".filter-text")
          .append('<span class="count">' + count + "</span>");
      });
    }
  }













  function SmoothMenuScroll() {
    var anchor = $(".scrollToLink");
    if (anchor.length) {
      anchor.children("a").bind("click", function (event) {
        if ($(window).scrollTop() > 10) {
          var headerH = "90";
        } else {
          var headerH = "90";
        }
        var target = $(this);
        $("html, body")
          .stop()
          .animate({
              scrollTop: $(target.attr("href")).offset().top - headerH + "px"
            },
            1200,
            "easeInOutExpo"
          );
        anchor.removeClass("current");
        anchor.removeClass("current-menu-ancestor");
        anchor.removeClass("current_page_item");
        anchor.removeClass("current-menu-parent");
        target.parent().addClass("current");
        event.preventDefault();
      });
    }
  }
  SmoothMenuScroll();

  function OnePageMenuScroll() {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 117) {
      var menuAnchor = $(".one-page-scroll-menu .scrollToLink").children("a");
      menuAnchor.each(function () {
        var sections = $(this).attr("href");
        $(sections).each(function () {
          if ($(this).offset().top <= windscroll + 100) {
            var Sectionid = $(sections).attr("id");
            $(".one-page-scroll-menu").find("li").removeClass("current");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-ancestor");
            $(".one-page-scroll-menu").find("li").removeClass("current_page_item");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-parent");
            $(".one-page-scroll-menu")
              .find("a[href*=\\#" + Sectionid + "]")
              .parent()
              .addClass("current");
          }
        });
      });
    } else {
      $(".one-page-scroll-menu li.current").removeClass("current");
      $(".one-page-scroll-menu li:first").addClass("current");
    }
  }






  /*-- Handle Scrollbar --*/
  function handleScrollbar() {
    const bodyHeight = $("body").height();
    const scrollPos = $(window).innerHeight() + $(window).scrollTop();
    let percentage = (scrollPos / bodyHeight) * 100;
    if (percentage > 100) {
      percentage = 100;
    }
    $(".scroll-to-top .scroll-to-top__inner").css("width", percentage + "%");
  }




  // Animation gsap 
  function title_animation() {
    var tg_var = jQuery('.sec-title-animation');
    if (!tg_var.length) {
      return;
    }
    const quotes = document.querySelectorAll(".sec-title-animation .title-animation");

    quotes.forEach(quote => {

      //Reset if needed
      if (quote.animation) {
        quote.animation.progress(1).kill();
        quote.split.revert();
      }

      var getclass = quote.closest('.sec-title-animation').className;
      var animation = getclass.split('animation-');
      if (animation[1] == "style4") return

      quote.split = new SplitText(quote, {
        type: "lines,words,chars",
        linesClass: "split-line"
      });
      gsap.set(quote, {
        perspective: 400
      });

      if (animation[1] == "style1") {
        gsap.set(quote.split.chars, {
          opacity: 0,
          y: "90%",
          rotateX: "-40deg"
        });
      }
      if (animation[1] == "style2") {
        gsap.set(quote.split.chars, {
          opacity: 0,
          x: "50"
        });
      }
      if (animation[1] == "style3") {
        gsap.set(quote.split.chars, {
          opacity: 0,
        });
      }
      quote.animation = gsap.to(quote.split.chars, {
        scrollTrigger: {
          trigger: quote,
          start: "top 90%",
        },
        x: "0",
        y: "0",
        rotateX: "0",
        opacity: 1,
        duration: 1,
        ease: Back.easeOut,
        stagger: .02
      });
    });
  }
  ScrollTrigger.addEventListener("refresh", title_animation);







  // window load event
  $(window).on("load", function () {


    projectMasonaryLayout();
    fullHeight();
    title_animation();
    priceFilter();
    productCategoryFilter();
    checkoutOrderFlow();








    if ($(".post-filter").length) {
      var postFilterList = $(".post-filter li");
      // for first init
      $(".filter-layout").isotope({
        filter: ".filter-item",
        animationOptions: {
          duration: 500,
          easing: "linear",
          queue: false
        }
      });
      // on click filter links
      postFilterList.on("click", function () {
        var Self = $(this);
        var selector = Self.attr("data-filter");
        postFilterList.removeClass("active");
        Self.addClass("active");

        $(".filter-layout").isotope({
          filter: selector,
          animationOptions: {
            duration: 500,
            easing: "linear",
            queue: false
          }
        });
        return false;
      });
    }

    if ($(".post-filter.has-dynamic-filter-counter").length) {
      // var allItem = $('.single-filter-item').length;

      var activeFilterItem = $(".post-filter.has-dynamic-filter-counter").find(
        "li"
      );

      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $(".filter-layout").find(filterElement).length;
        $(this).append("<sup>[" + count + "]</sup>");
      });
    }





    if ($(".marquee_mode").length) {
      $('.marquee_mode').marquee({
        speed: 40,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        pauseOnHover: true,
        startVisible: true,
      });
    }




    // Curved Circle
    if ($(".why-choose-one__curved-circle").length) {
      $(".why-choose-one__curved-circle").circleType({
        position: "absolute",
        dir: 1,
        radius: 85,
        forceHeight: true,
        forceWidth: true,
      });
    }




  });











  // window scroll event

  $(window).on("scroll", function () {
    if ($(".stricked-menu").length) {
      var headerScrollPos = 130;
      var stricky = $(".stricked-menu");
      if ($(window).scrollTop() > headerScrollPos) {
        stricky.addClass("stricky-fixed");
      } else if ($(this).scrollTop() <= headerScrollPos) {
        stricky.removeClass("stricky-fixed");
      }
    }

    OnePageMenuScroll();

  });

  $(window).on("scroll", function () {
    handleScrollbar();
    if ($(".sticky-header--one-page").length) {
      var headerScrollPos = 130;
      var stricky = $(".sticky-header--one-page");
      if ($(window).scrollTop() > headerScrollPos) {
        stricky.addClass("active");
      } else if ($(this).scrollTop() <= headerScrollPos) {
        stricky.removeClass("active");
      }
    }

    var scrollToTopBtn = ".scroll-to-top";
    if (scrollToTopBtn.length) {
      if ($(window).scrollTop() > 500) {
        $(scrollToTopBtn).addClass("show");
      } else {
        $(scrollToTopBtn).removeClass("show");
      }
    }
  });











  $('select:not(.ignore)').niceSelect();



})(jQuery);
