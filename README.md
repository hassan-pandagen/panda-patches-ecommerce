# 🐼 Panda Patches - Custom Iron-On Patches E-Commerce Platform

A modern, full-featured e-commerce platform for custom iron-on patches. Built with Next.js, React, TypeScript, and Sanity CMS, delivering a seamless experience for customers to design, quote, and order custom patches.

**Live Demo:** [panda-patches.com](https://panda-patches.com)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features Built](#features-built)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Current Status](#current-status)
- [Roadmap - Future Development](#roadmap---future-development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Admin CMS](#admin-cms)
- [Performance & SEO](#performance--seo)
- [Contributing](#contributing)

---

## 🎯 Project Overview

Panda Patches is a B2B/B2C e-commerce platform designed to streamline the custom patch ordering experience. The platform features:

- **9 Patch Categories** with dynamic pricing and specifications
- **4 Additional Products** (lapel pins, challenge coins, keychains, PVC shoe charms)
- **Real-Time Quote Generation** with instant price calculations
- **Admin Dashboard** (Sanity CMS) for content and product management
- **Customer Order Tracking** and quote history
- **Mobile-First Design** with responsive UI
- **SEO Optimized** with blog integration
- **Stripe Integration** for secure payments

---

## ✅ Features Built

### 🛍️ **E-Commerce Core**
- [x] Product catalog with 13+ product types
- [x] Dynamic pricing calculator based on:
  - Patch size and dimensions
  - Material type (embroidered, woven, PVC, chenille, leather, printed, sequin, 3D, silicone)
  - Quantity tiers
  - Backing options (iron-on, velcro, peel & stick)
  - Border types (merrowed, hot-cut)
  - Quantity discounts
- [x] Real-time quote generation
- [x] Shopping cart system
- [x] Stripe payment integration
- [x] Order confirmation emails
- [x] Order history tracking

### 🎨 **Product Pages**
- [x] **9 Category Pages** (each with unique specifications):
  - Custom Embroidered Patches
  - Custom 3D Embroidered Transfers
  - Custom Chenille Patches
  - Custom PVC Patches
  - Custom Woven Patches
  - Custom Leather Patches
  - Custom Silicone Labels
  - Custom Printed Patches
  - Custom Sequin Patches
- [x] **4 Additional Product Pages**:
  - Custom Lapel Pins
  - Custom Challenge Coins
  - Custom Keychains
  - Custom PVC Shoe Charms
- [x] Responsive carousel with blog-style navigation arrows
- [x] Product info sections with image/text zigzag layout
- [x] Backing and border options carousels

### 🏠 **Homepage**
- [x] Hero section with form
- [x] Product grid with 8+ featured products
- [x] 3-step process section
- [x] Industry use cases
- [x] Craftsmanship reel section (Instagram videos)
- [x] Blog preview/carousel
- [x] FAQ section
- [x] Trust badges and social proof

### 📱 **Mobile Optimization**
- [x] Full mobile responsiveness
- [x] Mobile-first navigation drawer
- [x] Touch-friendly interface
- [x] Optimized form inputs
- [x] Mobile carousel swiping
- [x] Reduced spacing/padding on small screens

### 🔒 **Admin & CMS**
- [x] Sanity Studio integration
- [x] Dynamic content management:
  - Product pages (hero, specs, options)
  - Backing options
  - Border options
  - Process section
  - Industry use cases
  - FAQs
  - Blog posts
  - Craftsmanship reels
- [x] Image optimization & CDN delivery
- [x] ISR (Incremental Static Regeneration) for fast updates

### 📝 **Blog System**
- [x] Dynamic blog posts with Sanity
- [x] Blog listing page
- [x] Individual blog post pages
- [x] Blog preview carousel on homepage
- [x] SEO-friendly blog URLs
- [x] Featured blog images

### 🔍 **Navigation & Routing**
- [x] Sticky navigation bar (3-pillar layout)
- [x] Dropdown menus for product categories
- [x] Mega menu for custom patches (9 types)
- [x] Mega menu for products (4 types)
- [x] Mobile hamburger menu with nested dropdowns
- [x] Active state highlighting
- [x] Category pages with slug routing

### 🎬 **Media & Content**
- [x] Craftsmanship reel section with video player
- [x] Lazy-loaded videos (on-demand loading)
- [x] Play/pause controls
- [x] Video thumbnail support
- [x] Instagram integration for 5-second video preview
- [x] Responsive image optimization
- [x] SVG logo and icon support

### 📊 **Forms & Validation**
- [x] Quote request form with validation
- [x] Contact form
- [x] Newsletter signup (placeholder)
- [x] File upload for design mockups
- [x] Form error handling and display
- [x] Success/error notifications

### 🌐 **SEO & Performance**
- [x] Meta tags for all pages
- [x] Open Graph tags
- [x] Structured data (JSON-LD)
- [x] Sitemap generation
- [x] Robot.txt configuration
- [x] Image lazy loading
- [x] Next.js Image optimization
- [x] CSS/JS code splitting
- [x] ISR for dynamic content updates

### 🔗 **Navigation Features**
- [x] Internal link structure with proper routing
- [x] Category page links from product grid
- [x] Breadcrumb navigation (planned)
- [x] Related products section
- [x] CTA buttons with proper link styling

### 🎨 **Design System**
- [x] Consistent color scheme (Panda Dark, Panda Yellow/Lime)
- [x] Tailwind CSS utility-first styling
- [x] Responsive typography
- [x] Consistent button styles
- [x] Card components
- [x] Modal/overlay components
- [x] Form input components
- [x] Navigation components

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI/Styling:** Tailwind CSS + Panda CSS (tokens)
- **State Management:** React Hooks
- **Component Library:** Lucide React (icons)
- **Form Handling:** Custom React forms
- **Image Optimization:** Next.js Image component

### **Backend & Services**
- **CMS:** Sanity.io (headless CMS)
- **Payments:** Stripe API
- **Hosting:** Vercel
- **Database:** Sanity (document-based)
- **Email:** Nodemailer/SendGrid (planned)

### **Developer Tools**
- **Package Manager:** npm
- **Code Quality:** ESLint
- **Type Checking:** TypeScript
- **Build Tool:** Next.js (Webpack)
- **Version Control:** Git/GitHub

### **Testing & Monitoring** (Planned)
- Jest & React Testing Library
- Cypress for E2E testing
- Sentry for error monitoring

---

## 🏗️ Architecture

### **Directory Structure**
```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── custom-patches/           # Patch category pages
│   │   ├── page.tsx             # Main patches page
│   │   └── [slug]/page.tsx       # Individual patch type pages
│   ├── custom-products/          # Product pages
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── blogs/                    # Blog pages
│   │   ├── page.tsx             # Blog listing
│   │   └── [slug]/page.tsx       # Individual blog post
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── sample-box/               # Sample box ordering
│   ├── assets/                   # Static asset pages
│   ├── success/                  # Order success page
│   └── error-payment/            # Payment error page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # 3-pillar navigation layout
│   │   ├── Footer.tsx            # Footer with links
│   │   └── Layout.tsx
│   ├── home/
│   │   ├── Hero.tsx              # Homepage hero section
│   │   ├── ProductGrid.tsx        # Featured products with links
│   │   ├── ProcessSteps.tsx       # 3-step process carousel
│   │   ├── BlogSwiper.tsx         # Blog carousel with arrows
│   │   ├── BlogSection.tsx        # Blog preview section
│   │   ├── Craftsmanship.tsx      # Video reel section
│   │   ├── ProductGrid.tsx        # Product showcase
│   │   ├── FAQ.tsx               # Frequently asked questions
│   │   ├── Promises.tsx          # Brand promises section
│   │   ├── CTASection.tsx        # Call-to-action
│   │   └── ...
│   ├── product/
│   │   ├── ProductHero.tsx       # Product page hero
│   │   ├── PatchTypes.tsx        # Types carousel with arrows
│   │   ├── ProductInfoCarousel.tsx # Backing/border options
│   │   ├── CategoryZigZag.tsx    # Category list
│   │   ├── BorderCarouselSection.tsx
│   │   └── ...
│   ├── about/
│   │   ├── PickPatch.tsx
│   │   └── FactorySection.tsx
│   ├── ui/
│   │   ├── Modal.tsx
│   │   ├── PandaLoader.tsx
│   │   └── ...
│   └── samplebox/
│
├── lib/
│   ├── sanity.ts                 # Sanity client configuration
│   ├── sanityQueries.ts          # Reusable Sanity queries
│   └── ...
│
├── styles/
│   └── globals.css               # Global Tailwind styles
│
└── public/
    └── assets/                   # Static images, SVGs
```

### **Data Flow**
```
User Request
    ↓
Next.js App Router
    ↓
React Components
    ↓
Sanity Queries (getProductData, getBlogs, etc.)
    ↓
Sanity CMS / API
    ↓
Render HTML/JSON
    ↓
Client (Browser)
```

### **Key Components & Their Relationships**

```
Navbar (sticky)
    ├── Logo
    ├── Navigation (centered)
    │   ├── Custom Patches Dropdown
    │   ├── Products Dropdown
    │   └── Other Links
    └── Action Buttons

HomePage
    ├── Hero (with form)
    ├── ProductGrid (links to category pages)
    ├── ProcessSteps
    ├── BlogSwiper (with navigation arrows)
    ├── Craftsmanship (videos)
    └── FAQ

CategoryPage (e.g., /custom-patches/embroidered)
    ├── ProductHero (form)
    ├── PatchTypes (carousel with arrows)
    ├── ProductInfoCarousel (backing options)
    ├── ProductInfoCarousel (border options)
    ├── FAQ
    └── Footer
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Sanity account (for CMS)
- Stripe account (for payments)
- Vercel account (for deployment)

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/hassan-pandagen/panda-patches-ecommerce.git
cd panda-patches-ecommerce
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (optional)
SENDGRID_API_KEY=your_sendgrid_key
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open in browser:**
Navigate to `http://localhost:3000`

---

## 📁 Project Structure Details

### **Pages**
| Route | Description | Status |
|-------|-------------|--------|
| `/` | Homepage with hero, products, blog | ✅ Complete |
| `/custom-patches` | All patch types listing | ✅ Complete |
| `/custom-patches/[slug]` | Individual patch type pages (9 total) | ✅ Complete |
| `/custom-products` | All products listing | ✅ Complete |
| `/custom-products/[slug]` | Individual product pages (4 total) | ✅ Complete |
| `/blogs` | Blog listing page | ✅ Complete |
| `/blogs/[slug]` | Individual blog posts | ✅ Complete |
| `/about` | About page | ✅ Complete |
| `/contact` | Contact form | ✅ Complete |
| `/sample-box` | Sample box ordering | ✅ Complete |
| `/assets/[slug]` | Static asset pages | ✅ Complete |
| `/success` | Order success page | ✅ Complete |
| `/error-payment` | Payment error page | ✅ Complete |

### **Components Summary**

| Component | Purpose | Features |
|-----------|---------|----------|
| **Navbar** | Navigation header | 3-pillar layout, sticky, mobile drawer |
| **Hero** | Page hero section | Form integration, trust badges |
| **ProductGrid** | Product showcase | Grid layout, link integration |
| **ProcessSteps** | 3-step process | Carousel, animated dots |
| **PatchTypes** | Patch types carousel | Arrows with yellow hover state |
| **ProductInfoCarousel** | Options showcase | Horizontal scroll, backing/borders |
| **BlogSwiper** | Blog preview | Swiper.js, navigation controls |
| **Craftsmanship** | Video section | Lazy loading, Instagram integration |
| **FAQ** | Frequently asked questions | Accordion, expandable sections |
| **Footer** | Footer links | Multi-column layout |

---

## 📊 Current Status

### **✅ Completed Features**
- Full e-commerce product catalog (9 patches + 4 products)
- Dynamic pricing calculator
- Real-time quote generation
- Stripe payment integration
- Responsive design (mobile, tablet, desktop)
- Admin CMS (Sanity) with content management
- Blog system with individual posts
- Video/media section with lazy loading
- SEO optimization (meta tags, sitemap, etc.)
- Sticky navigation with 3-pillar layout
- Product category pages with slug routing
- Internal linking between related products
- Image optimization and CDN delivery
- Mobile hamburger menu with nested dropdowns

### **🔄 In Progress**
- Order tracking system enhancements
- Email notification system
- Customer dashboard
- Admin order management interface
- Analytics integration (Google Analytics, Mixpanel)

### **⏳ Planned for Future**
- User accounts & login system
- Wishlist/favorites feature
- Advanced search filters
- Live chat integration (Tawk - partially done)
- Bulk order pricing tiers
- Custom API endpoints for integrations
- Payment plan options (installments)
- Inventory management
- Shipping integration (EasyPost, ShipStation)
- Returns/refunds system
- Customer reviews & ratings
- Mobile app (React Native)

---

## 🗺️ Roadmap - Future Development

### **Phase 1: Enhancement (Q1 2026)**
- [ ] User authentication & accounts
- [ ] Order history & tracking dashboard
- [ ] Admin order management panel
- [ ] Email notification system (SendGrid)
- [ ] Google Analytics integration
- [ ] Enhanced mobile performance

### **Phase 2: Features (Q2 2026)**
- [ ] Product wishlist
- [ ] Advanced product filters & search
- [ ] Customer reviews & ratings
- [ ] Referral program
- [ ] Bulk order system with special pricing
- [ ] PDF quote download

### **Phase 3: Integration (Q3 2026)**
- [ ] Shipping API integration
- [ ] Inventory management system
- [ ] GraphQL API for 3rd-party integrations
- [ ] Zapier integration
- [ ] Slack notifications for orders
- [ ] Automated return/refund system

### **Phase 4: Scale (Q4 2026)**
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support (i18n)
- [ ] Multi-currency support
- [ ] Warehouse management system
- [ ] Advanced analytics dashboard
- [ ] B2B portal for agency partners

---

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Deploy on Vercel:**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Set environment variables
- Click Deploy

3. **Custom Domain:**
- Go to Project Settings → Domains
- Add your custom domain (panda-patches.com)

### **Alternative: Self-Hosted**

```bash
# Build the project
npm run build

# Start production server
npm start
```

---

## 🔐 Environment Variables

### **Required**
```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# App
NEXT_PUBLIC_APP_URL=https://panda-patches.com
```

### **Optional**
```env
# Email
SENDGRID_API_KEY=your_api_key
EMAIL_FROM=noreply@panda-patches.com

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXXXXX

# Logging
SENTRY_DSN=https://...
```

---

## 🔌 API Routes

### **Payment**
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### **Email**
- `POST /api/email/quote` - Send quote email
- `POST /api/email/contact` - Send contact form email
- `POST /api/email/order-confirmation` - Send order confirmation

### **Content**
- `GET /api/products` - Fetch all products
- `GET /api/blogs` - Fetch blog posts
- `GET /api/categories` - Fetch product categories

---

## 🎨 Admin CMS (Sanity)

### **Access Sanity Studio**
```bash
npm run studio
# Opens at http://localhost:3333
```

### **Manage**
- Product pages and specifications
- Blog posts and featured images
- Pricing and options
- Hero banners and sections
- FAQ content
- Industry use cases
- Craftsmanship videos
- Trust badges

---

## ⚡ Performance & SEO

### **Performance Optimizations**
- ✅ Image optimization (WebP, responsive sizes)
- ✅ Code splitting (automatic with Next.js)
- ✅ CSS minification (Tailwind)
- ✅ ISR (Incremental Static Regeneration)
- ✅ CDN delivery (Vercel Edge Network)
- ✅ Lazy loading for videos & images
- ✅ Gzip compression

### **SEO Features**
- ✅ Meta tags & Open Graph
- ✅ Structured data (JSON-LD)
- ✅ Sitemap generation
- ✅ Robot.txt
- ✅ Canonical URLs
- ✅ Mobile optimization (100% responsive)
- ✅ Core Web Vitals optimized
- ✅ Internal linking strategy

### **Metrics**
| Metric | Target | Status |
|--------|--------|--------|
| Lighthouse Score | 90+ | ✅ |
| PageSpeed Insights | 90+ | ✅ |
| Core Web Vitals | All Green | ✅ |
| Mobile Friendly | Yes | ✅ |

---

## 🤝 Contributing

### **Development Workflow**
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push to GitHub: `git push origin feature/your-feature`
5. Create a Pull Request

### **Code Standards**
- Use TypeScript for type safety
- Follow Tailwind CSS conventions
- Keep components small and reusable
- Write meaningful commit messages
- Test responsive design on mobile

### **File Naming**
- Components: PascalCase (`ProductCard.tsx`)
- Utilities: camelCase (`calculatePrice.ts`)
- Styles: Use Tailwind classes (avoid separate CSS)

---

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [Stripe API](https://stripe.com/docs/api)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📞 Support

- **GitHub Issues:** Report bugs or request features
- **Email:** support@panda-patches.com
- **Live Chat:** Available on website (Tawk)

---

## 📄 License

This project is proprietary and not open source.

---

## 👨‍💻 Author

**Hassan Khan** - Full-stack Developer

---

**Last Updated:** February 2026
**Version:** 1.0.0

---

### 🎯 Quick Stats

- **13+ Product Types**
- **9 Category Pages** (each with unique specs)
- **4 Product Pages**
- **50+ Blog Posts** (integrated)
- **100% Mobile Responsive**
- **Production Ready** ✅
