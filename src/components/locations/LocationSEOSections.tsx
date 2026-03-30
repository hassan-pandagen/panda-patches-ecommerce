import Link from "next/link";
import { ReactNode } from "react";
import { TRUSTPILOT_RATING, TRUSTPILOT_REVIEW_COUNT } from "@/lib/reviewConstants";

interface SEOSection {
  heading: string;
  content: ReactNode;
}

export default function LocationSEOSections({ slug }: { slug: string }) {
  const sectionsBySlug: Record<string, SEOSection[]> = {

    // =============================================
    // LOS ANGELES - Streetwear, entertainment, film
    // =============================================
    "custom-patches-los-angeles": [
      {
        heading: "Why LA Brands Choose Custom Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Los Angeles runs on visual identity. From Fairfax streetwear labels to studio wardrobe departments in Burbank, custom patches are part of how LA brands communicate who they are. We work with independent clothing lines on Melrose, film production crews that need unit patches for set identification, and sports teams across LA County. The demand here is specific: bold designs, fast turnaround, and the ability to handle small runs for limited drops alongside bulk orders for corporate uniforms. That is exactly how we operate. Every order starts with a free digital mockup within 24 hours so you see the patch before anything is produced.
          </p>
        )
      },
      {
        heading: "LA's Streetwear and Patch Culture",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            The LA streetwear scene has made patches a core part of brand identity. Labels use{" "}
            <Link href="/custom-patches/chenille" className="text-purple-600 hover:underline font-medium">chenille patches</Link>
            {" "}on varsity jackets, <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC patches</Link>
            {" "}on hats and bags, and <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">embroidered patches</Link>
            {" "}for limited-edition merch. Entertainment companies order custom patches for wrap gifts, tour merchandise, and fan club kits. If your design has full-color artwork or photographic elements, our <Link href="/custom-patches/printed" className="text-purple-600 hover:underline font-medium">printed patches</Link> handle that with no color limitations. We ship to anywhere in Greater LA, typically within 7 to 14 business days, with rush options available for time-sensitive drops.
          </p>
        )
      },
      {
        heading: "Patches for LA Sports Teams and Fan Gear",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Los Angeles is home to some of the most passionate sports communities in the country. Youth leagues, rec leagues, and fan clubs across the city order custom patches for jerseys, jackets, and hats. Whether you need 50 patches for a Little League team or 1,000 for a fan club event, our <Link href="/offers" className="text-purple-600 hover:underline font-medium">patch packages</Link> start at $1.20 per piece at quantity. All orders include free design help, unlimited revisions, and your approval before production.
          </p>
        )
      }
    ],

    // =============================================
    // HOUSTON - Oil, energy, NASA, rodeo, corporate
    // =============================================
    "custom-patches-houston": [
      {
        heading: "Houston's Patch Ordering Guide",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Houston is the energy capital of the world, and that industry drives a large share of our patch orders from Texas. Oil and gas companies use custom patches for field crew identification, safety compliance uniforms, and corporate branding. We produce{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">embroidered patches</Link>
            {" "}that hold up in demanding work environments, and{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC patches</Link>
            {" "}for crews working in wet or outdoor conditions where water resistance matters. Our standard delivery of 7 to 14 business days works well for planned uniform rollouts, and rush production is available for urgent field deployments.
          </p>
        )
      },
      {
        heading: "Oil and Energy Industry Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            The Houston energy sector has specific requirements for uniform patches. Name identification must be readable at arm's length. Company logos need to reproduce accurately across multiple garment types. Safety and compliance patches must meet visibility standards. We handle all of this. Our process starts with a free mockup, and we confirm size, thread colors, and material suitability before production begins. For bulk orders serving large field teams, our <Link href="/bulk-custom-patches" className="text-purple-600 hover:underline font-medium">bulk pricing</Link> reduces cost per piece significantly. We also produce patches for NASA contractor teams, Houston rodeo events, and western wear brands across the region.
          </p>
        )
      },
      {
        heading: "Texas-Sized Orders Welcome",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Everything is bigger in Texas, and that includes patch orders. We regularly handle orders from 50 pieces up to 10,000+ for Houston-area organizations. Corporate teams, school districts, church groups, and event organizers across Harris County and the Greater Houston metro rely on us for consistent quality and on-time delivery. Every order ships free to any Texas address. Check our <Link href="/offers" className="text-purple-600 hover:underline font-medium">current patch packages</Link> for pricing, or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link> for custom quantities.
          </p>
        )
      }
    ],

    // =============================================
    // NEW YORK - Fashion, garment district, streetwear
    // =============================================
    "custom-patches-in-new-york": [
      {
        heading: "NYC's Custom Patch Designers",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            New York City sets the standard for quality. Fashion houses in the Garment District, streetwear brands in Brooklyn, and corporate headquarters in Midtown all need patches that meet NYC expectations. We produce patches for New York clothing labels that sell in boutiques on the Lower East Side, for uniformed staff at Manhattan hotels and restaurants, and for FDNY and NYPD affiliated organizations ordering custom unit patches. Every patch starts with a free digital mockup. You approve before we produce. No exceptions.
          </p>
        )
      },
      {
        heading: "Patches for NY Fashion and Streetwear",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            New York's fashion industry has used patches as branding elements for decades. The Garment District pioneered many of the techniques still used today.{" "}
            <Link href="/custom-patches/woven" className="text-purple-600 hover:underline font-medium">Woven patches</Link>
            {" "}deliver the fine detail that luxury labels require.{" "}
            <Link href="/custom-patches/leather" className="text-purple-600 hover:underline font-medium">Leather patches</Link>
            {" "}add premium weight to denim and outerwear. Brooklyn streetwear brands favor{" "}
            <Link href="/custom-patches/chenille" className="text-purple-600 hover:underline font-medium">chenille patches</Link>
            {" "}for their varsity-inspired texture. NYC sneaker culture has also driven demand for small-run collector patches. We handle runs as small as 50 pieces with the same attention to detail as orders of 5,000.
          </p>
        )
      },
      {
        heading: "Brooklyn to Manhattan Delivery",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            We ship to all five boroughs and across the tri-state area. Standard delivery is 7 to 14 business days after mockup approval. For Fashion Week deadlines, trade show timelines, or product launch dates, rush production is available with exact delivery dates confirmed by email within hours of ordering. View our <Link href="/offers" className="text-purple-600 hover:underline font-medium">patch packages and pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">request a free quote</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // CHICAGO - Manufacturing, sports, Midwest hub
    // =============================================
    "custom-patches-in-chicago": [
      {
        heading: "Chicago Business Patch Solutions",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Chicago is the Midwest's business hub, and that means demand for professional-grade custom patches. Manufacturing companies, logistics firms, and corporate offices throughout the Chicago metro order patches for employee uniforms, branded merchandise, and event identification. Our{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">embroidered patches</Link>
            {" "}are the standard for corporate and industrial use. Dense stitching, colorfast thread, and durable backing that holds up through industrial laundering. We produce name patches, department identification patches, and company logo patches for organizations across Illinois.
          </p>
        )
      },
      {
        heading: "Midwest Manufacturing Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Chicago's central location means faster shipping to anywhere in the continental US. For Midwest businesses ordering patches for multi-location operations, this matters. We ship to distribution centers, branch offices, and retail locations across the region with consistent quality on every order. From the South Side to the suburbs, from O'Hare to Gary, our patches reach you within 7 to 14 business days standard, with economy (10% off) and rush options available.
          </p>
        )
      },
      {
        heading: "Chi-Town Sports and Culture",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Chicago sports culture runs deep. Bears, Cubs, Bulls, Blackhawks, White Sox, Fire. Fan clubs, tailgate groups, and youth leagues across Chicagoland order custom patches for jackets, jerseys, and gear. We also serve Chicago's music scene, neighborhood associations, and community organizations that use patches for identity and belonging. <Link href="/custom-sports-patches" className="text-purple-600 hover:underline font-medium">Custom sports patches</Link> start at $1.20 per piece at quantity. Free design, free shipping, free revisions. <Link href="/offers" className="text-purple-600 hover:underline font-medium">See pricing</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // BOSTON - Universities, tech, New England
    // =============================================
    "custom-patches-in-boston": [
      {
        heading: "New England's Patch Experts",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Boston's identity is built on its institutions. Harvard, MIT, Boston University, Northeastern, Tufts, Boston College. These universities and their student organizations drive consistent demand for custom patches. Greek life chapters, club sports teams, alumni groups, and campus organizations order patches for jackets, bags, and event merchandise. We produce patches for student groups that need small runs (50 to 100 pieces) as well as university bookstores that order thousands for retail.
          </p>
        )
      },
      {
        heading: "Boston University and College Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            University patches have specific requirements. School colors must match exactly.{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">Embroidered patches</Link>
            {" "}work well for bold crests and lettering.{" "}
            <Link href="/custom-patches/woven" className="text-purple-600 hover:underline font-medium">Woven patches</Link>
            {" "}handle the fine detail in intricate university seals. We match Pantone colors on request and provide a free mockup before production so you confirm the design is accurate. Beyond universities, we also serve Boston Marathon running groups, tech startups along the Route 128 corridor, and New England maritime organizations ordering nautical-themed patches.
          </p>
        )
      },
      {
        heading: "Historic City, Modern Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Boston blends tradition with innovation, and our patches do the same. Classic embroidered crests for historical societies alongside modern PVC patches for tech companies. We ship to all of New England with free delivery on every order. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // FLORIDA - Tourism, hospitality, year-round events
    // =============================================
    "custom-patches-in-florida": [
      {
        heading: "Florida's Patch Ordering Hub",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Florida's economy runs on tourism, hospitality, and year-round outdoor events. Hotels, resorts, theme parks, cruise lines, and event companies across the state need custom patches for staff uniforms, branded merchandise, and promotional giveaways. We produce patches for hospitality groups in Orlando, beach resort staff in Miami, fishing charter companies in the Keys, and event organizers from Jacksonville to Tampa. Florida's warm, humid climate makes{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC patches</Link>
            {" "}particularly popular here since they are waterproof and resist fading in direct sunlight.
          </p>
        )
      },
      {
        heading: "Beach and Tourism Business Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Tourism businesses in Florida use patches differently than most industries. Souvenir patches sell in gift shops across the state. Staff identification patches need to withstand outdoor heat and humidity. Event patches for music festivals, boat shows, and sporting events are ordered on tight timelines. We handle all of it. Standard delivery is 7 to 14 business days, with rush available for events with fixed dates. Economy shipping saves 10% for orders with flexible timelines.
          </p>
        )
      },
      {
        heading: "Year-Round Florida Events",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Unlike seasonal markets, Florida runs events year-round. That means a steady need for custom patches: spring break merchandise, summer camp patches, fall festivals, winter snowbird community events. We ship free to any Florida address. Whether you are in the Panhandle or the Keys, your patches arrive on time. <Link href="/offers" className="text-purple-600 hover:underline font-medium">See our patch packages</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">request a free quote</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // DALLAS - Corporate HQs, sports, Texas business
    // =============================================
    "custom-patches-dallas": [
      {
        heading: "Dallas-Fort Worth Patch Solutions",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            The Dallas-Fort Worth metroplex is home to more Fortune 500 headquarters than almost any other US metro. That corporate density drives demand for professional custom patches: employee uniforms, branded merchandise, conference giveaways, and team-building event patches. We serve corporate teams across DFW, from downtown Dallas high-rises to Fort Worth manufacturing plants to the tech corridor in Plano and Richardson.
          </p>
        )
      },
      {
        heading: "Corporate Texas Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Corporate patches need to be consistent across locations and teams. We maintain your exact brand colors (Pantone matching available), produce consistent quality across multiple orders, and deliver on schedules that align with your rollout timeline. For DFW companies with offices nationwide, we ship to multiple addresses from a single order. Our <Link href="/bulk-custom-patches" className="text-purple-600 hover:underline font-medium">bulk ordering</Link> process is built for organizations that need reliable, repeatable results.
          </p>
        )
      },
      {
        heading: "DFW Sports and Event Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Dallas loves its sports. Cowboys, Mavericks, Stars, FC Dallas, Rangers. Youth leagues, fan clubs, and sports organizations across the DFW metro order custom patches for jerseys, jackets, and caps. We also produce patches for the Texas State Fair, rodeo events, and the DFW conference circuit. <Link href="/custom-sports-patches" className="text-purple-600 hover:underline font-medium">Sports patches</Link> from $1.20/piece at quantity. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View all packages</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // PORTLAND - Indie, craft, PNW outdoor
    // =============================================
    "custom-patches-portland": [
      {
        heading: "Portland's Indie Patch Culture",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Portland's maker culture has made custom patches a natural fit for the city's independent brands. Craft breweries put patches on tap handles and merchandise. Coffee roasters brand their barista aprons with embroidered patches. Independent clothing labels use patches as the centerpiece of their brand identity. We work with Portland businesses that care about craftsmanship and are willing to invest in quality materials. Our{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">embroidered patches</Link>
            {" "}and{" "}
            <Link href="/custom-patches/woven" className="text-purple-600 hover:underline font-medium">woven patches</Link>
            {" "}deliver the detail and durability that Portland brands expect.
          </p>
        )
      },
      {
        heading: "PNW Outdoor and Adventure Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            The Pacific Northwest outdoor industry is a major patch market. Hiking groups, climbing clubs, ski teams, and outdoor gear companies across Oregon order patches for jackets, packs, and merchandise.{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC patches</Link>
            {" "}are popular with PNW outdoor brands because they handle rain, mud, and UV exposure without degrading. For brands that want a more traditional look,{" "}
            <Link href="/custom-patches/leather" className="text-purple-600 hover:underline font-medium">leather patches</Link>
            {" "}add a rugged, premium feel to outdoor apparel and gear.
          </p>
        )
      },
      {
        heading: "Keep Portland Patched",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Portland businesses value local, sustainable, and authentic. We produce patches with durable materials designed to last years, not months. No disposable quality. Every order includes a free mockup, unlimited revisions, and free shipping to Portland and anywhere in Oregon. <Link href="/offers" className="text-purple-600 hover:underline font-medium">See pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // SAN FRANCISCO - Tech, startups, Bay Area
    // =============================================
    "custom-patches-in-san-francisco": [
      {
        heading: "Bay Area Tech and Startup Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            San Francisco's tech industry uses custom patches for team identity, company swag, and hackathon merchandise. Startups order patches for employee onboarding kits. Larger tech companies order them for team offsites, internal events, and branded jackets. We also serve SF's vibrant food scene (restaurant uniforms), its cycling community (club patches), and nonprofit organizations across the Bay Area. Our minimum of 50 pieces fits the startup model, and our <Link href="/bulk-custom-patches" className="text-purple-600 hover:underline font-medium">bulk pricing</Link> scales for larger companies.
          </p>
        )
      },
      {
        heading: "Patches for SF's Creative Economy",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Beyond tech, San Francisco's creative economy drives demand for unique patch designs. Art collectives, music venues, independent bookstores, and community organizations use patches as membership markers and merchandise.{" "}
            <Link href="/custom-patches/chenille" className="text-purple-600 hover:underline font-medium">Chenille patches</Link>
            {" "}add texture for fashion-forward designs.{" "}
            <Link href="/custom-patches/printed" className="text-purple-600 hover:underline font-medium">Printed patches</Link>
            {" "}handle the full-color artwork that creative clients often need. Every design gets a free mockup before production.
          </p>
        )
      },
      {
        heading: "Shipping Across the Bay Area",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            We deliver to San Francisco, Oakland, San Jose, and everywhere in between. Free shipping on every order, 7 to 14 business days standard. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // COLORADO - Outdoor, ski, breweries
    // =============================================
    "custom-patches-colorado": [
      {
        heading: "Colorado Outdoor and Adventure Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Colorado's outdoor industry is built around the Rockies. Ski resorts, hiking outfitters, climbing gyms, and adventure tourism companies throughout the state use custom patches on gear, uniforms, and retail merchandise. We produce{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC patches</Link>
            {" "}that withstand Colorado's extreme temperature swings, UV exposure at altitude, and wet conditions. For brands that prefer fabric patches,{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">embroidered patches</Link>
            {" "}with merrowed borders hold up well on outerwear and base layers.
          </p>
        )
      },
      {
        heading: "Brewery and Craft Brand Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Colorado has one of the highest brewery densities in the country. Craft breweries in Denver, Fort Collins, Boulder, and across the Front Range use custom patches on merchandise, staff uniforms, and promotional giveaways. Brewery patches tend to feature detailed artwork and multiple colors. Our <Link href="/custom-patches/woven" className="text-purple-600 hover:underline font-medium">woven patches</Link> capture fine detail better than embroidery, making them ideal for intricate brewery logos and label art.
          </p>
        )
      },
      {
        heading: "Patches Built for the Rockies",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Colorado demands durability. Patches on ski jackets, hiking packs, and work gear face snow, rain, sun, and wind. We use colorfast threads, UV-resistant materials, and industrial-grade backing to make sure your patches look the same after a season of use. Free shipping to anywhere in Colorado. <Link href="/offers" className="text-purple-600 hover:underline font-medium">See pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // MIAMI - Nightlife, hospitality, beach culture
    // =============================================
    "custom-miami-patches": [
      {
        heading: "Miami's Custom Patch Scene",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Miami is a city of bold style. From South Beach hospitality to Wynwood art galleries to Little Havana culture, custom patches here need to match that energy. We produce vibrant, eye-catching patches for Miami nightlife venues, hotel and resort staff, event promoters, and fashion brands. Miami's Latin American trade connections also mean we serve businesses that need patches for international distribution with consistent quality across large orders.
          </p>
        )
      },
      {
        heading: "Beach Culture and Hospitality Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Miami's hospitality industry needs patches that survive heat, humidity, and daily wear.{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC patches</Link>
            {" "}are the top choice for Miami hotels, beach clubs, and outdoor venues because they are waterproof and will not fade in direct sunlight.{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">Embroidered patches</Link>
            {" "}remain the standard for restaurant and hotel staff uniforms. All orders include free design, free shipping, and a mockup before production. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View pricing</Link>.
          </p>
        )
      }
    ],

    // =============================================
    // Remaining cities with shorter but still unique content
    // =============================================
    "alabama-patches": [
      {
        heading: "Custom Patches for Alabama Teams and Businesses",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Alabama has a strong tradition of team pride and community identity. From Crimson Tide fan gear to high school football patches, from Birmingham corporate uniforms to Huntsville aerospace contractor badges, custom patches serve a real purpose across the state. We produce{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">embroidered patches</Link>
            {" "}for organizations, sports teams, and businesses throughout Alabama with free design services and free shipping on every order.
          </p>
        )
      },
      {
        heading: "Southern Quality, Nationwide Standards",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Alabama businesses expect quality and reliability. Every patch order includes a free mockup within 24 hours, unlimited revisions until you approve, and production that starts only after your sign-off. No surprises, no hidden fees. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View patch packages</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    "custom-austin-patches": [
      {
        heading: "Keep Austin Patched",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Austin's creative energy makes it one of the most active patch markets in Texas. Music venues on Sixth Street order patches for staff and merchandise. Tech companies along the I-35 corridor use patches for team swag and onboarding kits. Food trucks and indie brands across East Austin use patches as core brand elements. We serve Austin's creative economy with patches that match the city's independent spirit. Minimum 50 pieces, free design, free shipping.
          </p>
        )
      },
      {
        heading: "Austin Music, Tech, and Culture Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            SXSW, ACL, and hundreds of smaller events throughout the year drive demand for custom event patches and merchandise in Austin. Tech startups order patches for team identity. Music labels and venues order patches for artist merch. We handle short runs for limited releases and bulk orders for large-scale events. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">request a free quote</Link>.
          </p>
        )
      }
    ],

    "custom-california-patches": [
      {
        heading: "Golden State Custom Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            California is our largest state market. From LA streetwear to SF tech companies, from San Diego military bases to Sacramento state agencies, custom patches serve industries across the Golden State. The California flag patch remains one of the most requested designs in our system, and we produce custom versions for motorcycle clubs, outdoor brands, and state pride merchandise.{" "}
            <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">Embroidered</Link>,{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC</Link>, and{" "}
            <Link href="/custom-patches/woven" className="text-purple-600 hover:underline font-medium">woven patches</Link> all available with free shipping statewide.
          </p>
        )
      },
      {
        heading: "Patches for California Businesses Statewide",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            We ship to every California zip code with free delivery. Whether your business is in the Bay Area, Central Valley, Inland Empire, or anywhere in between, your patches arrive within 7 to 14 business days. <Link href="/offers" className="text-purple-600 hover:underline font-medium">See pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    "custom-denver-patches": [
      {
        heading: "Mile High City Custom Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Denver sits at the intersection of outdoor culture and urban business. Breweries on the RiNo Art District, outdoor outfitters along Broadway, Broncos fan groups, and corporate offices in LoDo all order custom patches. We serve Denver businesses with the same attention to detail whether you need 50 patches for a brewery tap room or 5,000 for a corporate uniform rollout. Free mockup, free shipping, free revisions on every order.
          </p>
        )
      },
      {
        heading: "Denver Sports, Breweries, and Business Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Broncos, Nuggets, Avalanche, Rockies, Rapids. Denver sports culture drives fan patch orders year-round. Beyond sports, Denver's 100+ craft breweries make it one of the top brewery patch markets in the country. We also serve Denver's growing tech sector and the military community connected to nearby bases. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View patch packages</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">request a quote</Link>.
          </p>
        )
      }
    ],

    "custom-patches-in-texas": [
      {
        heading: "Custom Patches for Texas Businesses Statewide",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Texas is our second-largest state market after California. From the energy sector in Houston to corporate headquarters in Dallas, from tech startups in Austin to military bases in San Antonio, custom patches serve every major Texas industry. We produce uniform patches, branded merchandise, event patches, and team gear for organizations across all 254 Texas counties. Free shipping to any Texas address on every order.
          </p>
        )
      },
      {
        heading: "Statewide Texas Delivery",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            We ship patches to every corner of Texas. Standard delivery is 7 to 14 business days. Rush options available for events and deadlines. Economy shipping saves 10% for flexible timelines. <Link href="/offers" className="text-purple-600 hover:underline font-medium">See pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    "kentucky-patches": [
      {
        heading: "Kentucky Custom Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Kentucky's bourbon industry, horse racing culture, and strong college sports traditions create steady demand for custom patches. Bourbon distilleries in Louisville and Lexington order branded patches for merchandise and staff uniforms. Derby events need commemorative patches. University of Kentucky and Louisville fan groups order team patches for game day gear. We serve Kentucky businesses and organizations with free design, free shipping, and a mockup approval process that ensures your patches match your vision.
          </p>
        )
      },
      {
        heading: "Bourbon Country and Derby Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Kentucky's signature industries demand quality branding. Bourbon distillery patches need to match the premium feel of the product they represent.{" "}
            <Link href="/custom-patches/leather" className="text-purple-600 hover:underline font-medium">Leather patches</Link>
            {" "}are a natural fit for bourbon brands. Derby event patches are often limited-run commemorative pieces. We handle both with the same care. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View pricing</Link>.
          </p>
        )
      }
    ],

    "custom-ohio-state-patches": [
      {
        heading: "Ohio Custom Patches for Buckeye State Businesses",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Ohio's diverse economy spans manufacturing in Cleveland, corporate headquarters in Columbus, healthcare in Cincinnati, and some of the most passionate college sports fans in the country. We produce custom patches for Ohio businesses, universities, sports teams, and community organizations. Whether you need patches for an Ohio State tailgate group or a Cleveland manufacturing plant, our quality and process are the same: free mockup, unlimited revisions, approval before production.
          </p>
        )
      },
      {
        heading: "Buckeye Pride and Business Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Ohio State pride runs deep, and so does demand for custom patches. Fan clubs, alumni groups, and student organizations order patches for jackets, bags, and merchandise. Beyond sports, Ohio's manufacturing sector orders uniform patches, safety patches, and branded merchandise in bulk. Free shipping to any Ohio address. <Link href="/offers" className="text-purple-600 hover:underline font-medium">See pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    "custom-utah-patches": [
      {
        heading: "Utah Outdoor and Adventure Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Utah's five national parks, world-class ski resorts, and outdoor recreation industry make it a natural market for durable custom patches. Outdoor brands in Salt Lake City and Park City use{" "}
            <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">PVC patches</Link>
            {" "}for gear that faces extreme conditions. Ski resorts order staff patches and souvenir merchandise patches. National park concessionaires need patches that represent the landscapes they serve. We build patches that are as tough as the terrain they are worn in.
          </p>
        )
      },
      {
        heading: "Beehive State Business Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Beyond outdoor recreation, Utah's growing tech sector (Silicon Slopes), its strong community organizations, and its active youth sports leagues all drive patch demand. Free shipping, free design, free revisions. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

    "custom-patches-in-washington": [
      {
        heading: "Washington State Custom Patches",
        content: (
          <p className="text-[17px] leading-[1.8] text-gray-600">
            Washington state's tech industry in Seattle, outdoor recreation across the Cascades, military presence at Joint Base Lewis-McChord, and agricultural businesses in Eastern Washington all create demand for custom patches. We serve Washington businesses with the same quality and process as every other market: free mockup, free revisions, free shipping, and production only after your approval. <Link href="/offers" className="text-purple-600 hover:underline font-medium">View pricing</Link> or <Link href="/contact" className="text-purple-600 hover:underline font-medium">get a free quote</Link>.
          </p>
        )
      }
    ],

  };

  const sections = sectionsBySlug[slug];
  if (!sections || sections.length === 0) return null;

  return (
    <section className="py-8 md:py-10 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-[860px] space-y-10">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-5 leading-tight">
              {section.heading}
            </h2>
            {section.content}
          </div>
        ))}
      </div>
    </section>
  );
}
