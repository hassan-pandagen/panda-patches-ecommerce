import Link from "next/link";
import { ReactNode } from "react";
import { Shirt, Trophy, Beer, Briefcase, Mountain } from "lucide-react";
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

    "patches-for-hats": [
      {
        heading: "Which Hat Types Work Best with Patches",
        content: (
          <div className="space-y-4">
            <p className="text-[16px] leading-[1.8] text-gray-600 mb-6">Not every hat takes a patch the same way. Here is how each hat style works with custom patches so you order the right backing the first time.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { hat: "Dad Hat", backing: "Iron-on or Sew-on", panel: "Unstructured, curved front panel", best: "Embroidered or Woven" },
                { hat: "Snapback", backing: "Sew-on recommended", panel: "Structured flat front panel", best: "Embroidered or Leather" },
                { hat: "Trucker Hat", backing: "Iron-on or Sew-on", panel: "Foam front, flat panel", best: "Embroidered or PVC" },
                { hat: "Fitted Cap", backing: "Sew-on recommended", panel: "Structured curved panel", best: "Embroidered or Woven" },
                { hat: "Beanie", backing: "Sew-on only", panel: "Knit fabric, no structure", best: "Woven or small Embroidered" },
                { hat: "Bucket Hat", backing: "Iron-on or Sew-on", panel: "Soft fabric, front or side", best: "Embroidered or Woven" },
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-[12px] p-4 bg-white">
                  <p className="font-black text-panda-dark text-[15px] mb-1">{item.hat}</p>
                  <p className="text-[13px] text-gray-500 mb-1"><span className="font-semibold text-gray-700">Panel:</span> {item.panel}</p>
                  <p className="text-[13px] text-gray-500 mb-1"><span className="font-semibold text-gray-700">Best backing:</span> {item.backing}</p>
                  <p className="text-[13px] text-panda-green font-semibold"><span className="text-gray-700 font-semibold">Best patch type:</span> {item.best}</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        heading: "",
        content: (
          <div className="bg-panda-green/5 border border-panda-green/20 rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[15px] text-gray-700 font-medium leading-[1.6] max-w-[520px]">Not sure which patch type fits your hat? Get a free mockup and see it before you order.</p>
            <a href="#quote-form" className="flex-shrink-0 bg-panda-green text-white font-black text-[14px] px-6 py-3 rounded-full hover:bg-panda-dark transition-colors whitespace-nowrap">Get Your Free Mockup</a>
          </div>
        )
      },
      {
        heading: "Hat Patch Size Guide",
        content: (
          <div>
            <p className="text-[16px] leading-[1.8] text-gray-600 mb-6">Size is the most common mistake with hat patches. Too large and the patch overhangs the panel. Too small and it gets lost. Use this guide before you order.</p>
            <div className="overflow-x-auto rounded-[12px] border border-gray-200">
              <table className="w-full text-[14px] text-left">
                <thead className="bg-panda-dark text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold">Size</th>
                    <th className="px-4 py-3 font-bold">Best Placement</th>
                    <th className="px-4 py-3 font-bold">Works On</th>
                    <th className="px-4 py-3 font-bold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { size: '1.5" x 1.5"', placement: "Side panel", works: "All hat types", notes: "Good for secondary logo or flag" },
                    { size: '2" x 2"', placement: "Front center", works: "Dad hat, fitted cap", notes: "Most popular hat patch size" },
                    { size: '2.5" x 2.5"', placement: "Front center", works: "Snapback, trucker", notes: "Fills the front panel cleanly" },
                    { size: '3" x 2"', placement: "Front center", works: "Trucker, snapback", notes: "Good for horizontal logos" },
                    { size: '3" x 3"', placement: "Front center", works: "Trucker, large panel hats", notes: "Max size for most hat fronts" },
                    { size: '4" x 1.5"', placement: "Brim or side", works: "Dad hat, bucket hat", notes: "Text or horizontal logo strips" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-bold text-panda-dark">{row.size}</td>
                      <td className="px-4 py-3 text-gray-600">{row.placement}</td>
                      <td className="px-4 py-3 text-gray-600">{row.works}</td>
                      <td className="px-4 py-3 text-gray-500">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-gray-400 mt-3">Not sure which size fits your hat? Send us your hat and design and we will confirm the right dimensions before production.</p>
          </div>
        )
      },
      {
        heading: "",
        content: (
          <div className="bg-blue-50 border border-blue-100 rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[15px] text-gray-700 font-medium leading-[1.6] max-w-[520px]">Need help choosing the right size? Our design team will recommend the perfect dimensions for your hat style.</p>
            <Link href="/contact" className="flex-shrink-0 bg-panda-dark text-white font-black text-[14px] px-6 py-3 rounded-full hover:bg-panda-green transition-colors whitespace-nowrap">Ask Our Design Team</Link>
          </div>
        )
      },
      {
        heading: "Best Patch Types for Hats: Side by Side",
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                type: "Embroidered",
                best: "Uniforms, sports teams, classic brands",
                pros: "Raised texture, bold visibility, classic look",
                cons: "Not ideal for fine text under 8pt",
                price: "From $1.20/pc",
                tag: "Most Popular",
                href: "/custom-patches/embroidered",
              },
              {
                type: "Woven",
                best: "Streetwear brands, logos with fine detail",
                pros: "Flat profile, sharp text, lightweight",
                cons: "No raised texture",
                price: "From $1.40/pc",
                tag: "Best for Detail",
                href: "/custom-patches/woven",
              },
              {
                type: "Leather",
                best: "Premium hat lines, motorcycle brands",
                pros: "Luxury feel, debossed or printed logo",
                cons: "Higher cost per piece",
                price: "From $1.80/pc",
                tag: "Premium Look",
                href: "/custom-patches/leather",
              },
              {
                type: "PVC",
                best: "Outdoor, tactical, waterproof hats",
                pros: "100% waterproof, holds shape, vibrant color",
                cons: "Heavier than embroidered",
                price: "From $1.50/pc",
                tag: "Most Durable",
                href: "/custom-patches/pvc",
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-[12px] p-5 bg-white hover:border-panda-green transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Link href={item.href} className="font-black text-panda-dark text-[16px] hover:text-panda-green">{item.type}</Link>
                  <span className="text-[11px] font-bold text-panda-green bg-panda-light px-2.5 py-1 rounded-full">{item.tag}</span>
                </div>
                <p className="text-[12px] text-gray-500 mb-2"><span className="font-semibold text-gray-700">Best for:</span> {item.best}</p>
                <p className="text-[12px] text-gray-500 mb-2"><span className="font-semibold text-gray-700">Pros:</span> {item.pros}</p>
                <p className="text-[12px] text-gray-500 mb-3"><span className="font-semibold text-gray-700">Cons:</span> {item.cons}</p>
                <p className="text-[13px] font-black text-panda-dark">{item.price} at 50 pieces</p>
              </div>
            ))}
          </div>
        )
      },
      {
        heading: "",
        content: (
          <div className="bg-amber-50 border border-amber-100 rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[15px] text-gray-700 font-medium leading-[1.6] max-w-[520px]">Want to see the difference in person? Order a free sample patch before your full order.</p>
            <Link href="/contact" className="flex-shrink-0 bg-panda-dark text-white font-black text-[14px] px-6 py-3 rounded-full hover:bg-panda-green transition-colors whitespace-nowrap">Request a Free Sample</Link>
          </div>
        )
      },
      {
        heading: "Backing Options for Hat Patches",
        content: (
          <div>
            <p className="text-[16px] leading-[1.8] text-gray-600 mb-6">The backing determines how the patch attaches to your hat. Choose the wrong one and the patch will lift, shift, or not adhere at all.</p>
            <div className="overflow-x-auto rounded-[12px] border border-gray-200">
              <table className="w-full text-[14px] text-left">
                <thead className="bg-panda-dark text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold">Backing</th>
                    <th className="px-4 py-3 font-bold">How It Attaches</th>
                    <th className="px-4 py-3 font-bold">Best Hat Material</th>
                    <th className="px-4 py-3 font-bold">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { backing: "Iron-On", how: "Heat adhesive bonds to fabric", material: "Cotton, canvas, polyester", cost: "FREE" },
                    { backing: "Sew-On", how: "Thread stitched around patch edge", material: "All hat types including wool", cost: "FREE" },
                    { backing: "Velcro", how: "Hook attaches to loop panel on hat", material: "Tactical, military, outdoor hats", cost: "+$30" },
                    { backing: "Sticker / Peel", how: "Peel and stick adhesive", material: "Temporary use, smooth panels only", cost: "FREE" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-bold text-panda-dark">{row.backing}</td>
                      <td className="px-4 py-3 text-gray-600">{row.how}</td>
                      <td className="px-4 py-3 text-gray-600">{row.material}</td>
                      <td className={`px-4 py-3 font-bold ${row.cost === "FREE" ? "text-panda-green" : "text-gray-700"}`}>{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-gray-400 mt-3">Not sure which backing to choose? Tell us your hat material when requesting your quote and we will recommend the right option.</p>
          </div>
        )
      },
      {
        heading: "Who Orders Custom Hat Patches",
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <Shirt className="text-panda-green" size={28} />,
                title: "Streetwear and Apparel Brands",
                body: "Hat patches are a core branding element for streetwear labels. Woven patches and leather patches on structured snapbacks and dad hats give independent brands a premium product identity without expensive embroidery directly on the hat. Low minimums starting at 50 pieces make it practical for small-batch drops and seasonal releases."
              },
              {
                icon: <Trophy className="text-panda-green" size={28} />,
                title: "Sports Teams and Athletic Programs",
                body: "Youth leagues, high school programs, and amateur clubs order embroidered patches for team hats and caps. A standard 2x2 inch embroidered patch with team logo and year is the most common order. We handle orders from 50 to 5,000 pieces with consistent color matching across reorders."
              },
              {
                icon: <Beer className="text-panda-green" size={28} />,
                title: "Breweries, Restaurants, and Hospitality",
                body: "Branded staff hats with custom patches are standard across the hospitality industry. Breweries in particular use leather and embroidered hat patches as merchandise items sold at taprooms alongside growlers and glassware. We work with breweries across the US on recurring seasonal patch orders."
              },
              {
                icon: <Briefcase className="text-panda-green" size={28} />,
                title: "Corporate and Promotional Merchandise",
                body: "Companies order branded hat patches for employee uniforms, trade show giveaways, and client gift kits. A custom hat patch ships flat and can be applied to any hat the recipient already owns, making it a cost-effective branded merchandise item compared to ordering pre-decorated hats."
              },
              {
                icon: <Mountain className="text-panda-green" size={28} />,
                title: "Outdoor, Tactical, and Workwear Brands",
                body: (<>PVC patches with velcro backing are the standard for outdoor and tactical brands. Waterproof, UV-resistant, and built to hold shape in rough conditions. We produce <Link href="/custom-patches/pvc" className="text-purple-600 hover:underline font-medium">custom PVC hat patches</Link> for hunting brands, fishing outfitters, construction companies, and military-adjacent apparel lines.</>)
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[16px] p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
                <div className="w-12 h-12 bg-panda-green/10 rounded-[12px] flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <h3 className="font-black text-panda-dark text-[16px]">{item.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.7]">{item.body}</p>
              </div>
            ))}
          </div>
        )
      },
      {
        heading: "Hat Patch Pricing",
        content: (
          <div>
            <p className="text-[16px] leading-[1.8] text-gray-600 mb-6">All hat patch orders include a free digital mockup within 24 hours, unlimited revisions, free US shipping, and production only after your approval.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { qty: "50 pcs", from: "From $180", per: "$3.60/pc" },
                { qty: "100 pcs", from: "From $240", per: "$2.40/pc" },
                { qty: "500 pcs", from: "From $750", per: "$1.50/pc" },
                { qty: "1,000 pcs", from: "From $1,200", per: "$1.20/pc" },
              ].map((tier, i) => (
                <a
                  key={i}
                  href="#quote-form"
                  className="bg-panda-dark rounded-[12px] p-4 text-center block hover:bg-panda-green transition-colors duration-200 cursor-pointer"
                >
                  <p className="text-panda-yellow font-black text-[14px] mb-1">{tier.qty}</p>
                  <p className="text-white font-black text-[18px] mb-1">{tier.from}</p>
                  <p className="text-gray-400 text-[12px]">{tier.per}</p>
                </a>
              ))}
            </div>
            <p className="text-[14px] text-gray-500">Prices shown for embroidered patches under 4 inches. <Link href="/offers" className="text-panda-green font-semibold hover:underline">View all hat patch packages on our Offers page</Link> or <Link href="/contact" className="text-panda-green font-semibold hover:underline">get a free custom quote</Link> for larger quantities or other patch types.</p>
          </div>
        )
      },
      {
        heading: "",
        content: (
          <div className="bg-panda-dark rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[15px] text-white font-medium leading-[1.6] max-w-[520px]">Custom hat patches from $0.71/pc. Get your exact quote in under 24 hours.</p>
            <Link href="/contact" className="flex-shrink-0 bg-panda-yellow text-panda-dark font-black text-[14px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">Get Your Free Quote</Link>
          </div>
        )
      },
      {
        heading: "Custom Hat Patches — Everything You Need to Know",
        content: (
          <div className="space-y-5 text-[16px] leading-[1.8] text-gray-600">
            <p>
              Custom hat patches are one of the most versatile branding tools in the apparel industry. A well-made patch on a structured snapback or classic dad hat communicates brand identity instantly, outlasts direct embroidery in most applications, and can be swapped between hat styles without reprinting an entire inventory. At Panda Patches, we produce <strong>custom patches for hats</strong> in every construction method — embroidered, woven, leather, and PVC — with backing options matched to your specific hat material and use case.
            </p>
            <p>
              The most popular choice for hat front panels is the <Link href="/custom-patches/embroidered" className="text-purple-600 hover:underline font-medium">custom embroidered patch</Link>. The raised thread construction gives a premium, tactile feel that stands out on both structured and unstructured caps. For logos with fine detail, small text, or complex artwork, <Link href="/custom-patches/woven" className="text-purple-600 hover:underline font-medium">woven patches</Link> deliver sharper reproduction at a flatter profile — ideal for dad hats and fitted caps where a low-profile look is preferred. Streetwear brands and premium hat lines frequently use <Link href="/custom-patches/leather" className="text-purple-600 hover:underline font-medium">leather patches</Link> for the label-like aesthetic that positions a hat as a retail product rather than promotional merchandise.
            </p>
            <p>
              Every hat patch order at Panda Patches starts with a <strong>free digital mockup within 24 hours</strong>. Our design team reviews your artwork against the size and hat type you have specified, flags any issues before production, and sends a visual representation of exactly how the patch will look on your hat. You request changes until it is right — no limit on revisions, no charge. Production does not start until you give final approval. Nothing ships without your sign-off.
            </p>
            <p>
              Standard delivery is <strong>7-14 business days</strong> after approval. Rush production is available. All orders ship free to anywhere in the US. For custom quantities, mixed patch types, or patches for a hat collection launch, <Link href="/contact" className="text-purple-600 hover:underline font-medium">contact us directly</Link> or call (302) 250-4340.
            </p>
          </div>
        )
      },
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
            {section.heading && (
              <h2 className="text-2xl md:text-3xl font-black text-panda-dark mb-5 leading-tight">
                {section.heading}
              </h2>
            )}
            {section.content}
          </div>
        ))}
      </div>
    </section>
  );
}
