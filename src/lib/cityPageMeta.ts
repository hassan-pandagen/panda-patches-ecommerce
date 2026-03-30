/**
 * City-specific metadata for location pages.
 * Each city gets a unique title and description to avoid templated doorway page patterns.
 * Based on local industry angles and genuine use cases per market.
 */

interface CityMeta {
  title: string;
  description: string;
  ogDescription: string;
}

const cityPageMeta: Record<string, CityMeta> = {
  "custom-patches-los-angeles": {
    title: "Custom Patches in Los Angeles | LA's Streetwear Patch Experts",
    description: "Custom embroidered patches made for Los Angeles brands, streetwear labels and entertainment crews. Fast LA-area turnaround. Get a free quote today.",
    ogDescription: "LA's go-to patch maker for streetwear brands, film crews and entertainment merch. Free mockup within 24 hours.",
  },
  "custom-patches-houston": {
    title: "Custom Patches Houston TX | Oil, Energy and Corporate Patches",
    description: "Houston's source for custom embroidered patches. Serving oil and energy companies, corporate teams and organizations across Texas. Free shipping + free quote.",
    ogDescription: "Custom patches for Houston's oil, energy and corporate sectors. Free design, fast delivery anywhere in Texas.",
  },
  // Atlanta has no dedicated page slug in the current site, skipping
  "custom-patches-in-chicago": {
    title: "Custom Patches Chicago IL | Midwest's Patch Manufacturing Hub",
    description: "Chicago custom embroidered patches for businesses, sports teams and organizations. Central US location means faster shipping nationwide. Free quote.",
    ogDescription: "Chicago's custom patch maker for businesses, sports teams and Midwest organizations. Free mockup, fast shipping.",
  },
  "custom-patches-in-boston": {
    title: "Custom Patches Boston MA | University and New England Patches",
    description: "Boston's custom embroidered patch source. Serving New England universities, tech companies and organizations. Premium quality, free shipping. Get a quote.",
    ogDescription: "Custom patches for Boston universities, tech startups and New England organizations. Free design + free shipping.",
  },
  "custom-patches-in-new-york": {
    title: "Custom Patches New York City | NYC Fashion and Streetwear Patches",
    description: "New York City's custom patch experts. From Manhattan fashion houses to Brooklyn streetwear, we craft patches that match NYC quality standards. Free quote.",
    ogDescription: "NYC custom patches for fashion brands, streetwear labels and corporate teams. Free mockup within 24 hours.",
  },
  "custom-patches-dallas": {
    title: "Custom Patches Dallas TX | Corporate and DFW Business Patches",
    description: "Dallas-Fort Worth custom embroidered patches for corporate teams, sports fans and Texas businesses. Fast turnaround, free shipping. Get a quote.",
    ogDescription: "Custom patches for DFW corporate teams, sports organizations and Texas businesses. Free design + fast shipping.",
  },
  "custom-patches-in-florida": {
    title: "Custom Patches Florida | Patches for Sunshine State Businesses",
    description: "Florida's custom patch experts. Serving tourism, hospitality and businesses statewide from Miami to Jacksonville. Free shipping + free design help.",
    ogDescription: "Custom patches for Florida tourism, hospitality and businesses. Miami to Jacksonville. Free mockup + free shipping.",
  },
  "custom-patches-portland": {
    title: "Custom Patches Portland OR | PNW Indie and Outdoor Patches",
    description: "Portland custom patches for indie brands, outdoor companies and PNW businesses. Eco-conscious options available. Free design mockup + free quote.",
    ogDescription: "Custom patches for Portland's indie brands and PNW outdoor companies. Free mockup, eco-friendly options.",
  },
  "custom-patches-colorado": {
    title: "Custom Patches Colorado | Outdoor and Adventure Brand Patches",
    description: "Colorado custom patches for outdoor brands, ski resorts, breweries and adventure companies. Durable patches built for the Rockies. Free quote.",
    ogDescription: "Custom patches for Colorado outdoor brands, breweries and adventure companies. Free design + free shipping.",
  },
  "custom-patches-in-san-francisco": {
    title: "Custom Patches San Francisco | Bay Area Tech and Startup Patches",
    description: "San Francisco custom patches for tech companies, startups and Bay Area brands. Premium quality patches with free design services. Get a free quote.",
    ogDescription: "Custom patches for SF tech companies, startups and Bay Area brands. Free mockup within 24 hours.",
  },
  "custom-miami-patches": {
    title: "Custom Patches Miami FL | Beach Culture and Hospitality Patches",
    description: "Miami custom patches for hospitality brands, nightlife venues, beach culture and South Florida businesses. Vibrant designs, free shipping.",
    ogDescription: "Custom patches for Miami hospitality, nightlife and beach culture brands. Free design + fast delivery.",
  },
  "custom-patches-in-texas": {
    title: "Custom Patches Texas | Statewide Patch Delivery for TX Businesses",
    description: "Texas custom patches for businesses, organizations and teams statewide. From Houston to Dallas to Austin. Free design, free shipping anywhere in TX.",
    ogDescription: "Custom patches delivered statewide across Texas. Free mockup, free shipping. Get a quote today.",
  },
  "custom-california-patches": {
    title: "Custom Patches California | Golden State Brand Patches",
    description: "California custom patches for brands, teams and organizations statewide. From LA streetwear to SF tech. Free design services and free shipping.",
    ogDescription: "Custom patches for California brands from LA to SF. Free mockup within 24 hours, free shipping statewide.",
  },
  "custom-denver-patches": {
    title: "Custom Patches Denver CO | Mile High City Brand Patches",
    description: "Denver custom patches for breweries, outdoor brands, sports teams and Colorado businesses. Durable designs made for the Mile High City. Free quote.",
    ogDescription: "Custom patches for Denver breweries, outdoor brands and Colorado businesses. Free design + free shipping.",
  },
  "alabama-patches": {
    title: "Custom Patches Alabama | Southern Pride and Team Patches",
    description: "Alabama custom patches for businesses, sports teams and organizations. From Crimson Tide to corporate branding. Free design, free shipping.",
    ogDescription: "Custom patches for Alabama teams, businesses and organizations. Free mockup + free shipping.",
  },
  "custom-austin-patches": {
    title: "Custom Patches Austin TX | Keep Austin Patched",
    description: "Austin custom patches for indie brands, tech companies, music venues and Texas businesses. Unique designs that match Austin's creative spirit. Free quote.",
    ogDescription: "Custom patches for Austin's indie brands, tech scene and music culture. Free mockup within 24 hours.",
  },
  "kentucky-patches": {
    title: "Custom Patches Kentucky | Bourbon Country and Derby Patches",
    description: "Kentucky custom patches for bourbon brands, Derby events, sports teams and Bluegrass State businesses. Premium quality, free shipping.",
    ogDescription: "Custom patches for Kentucky bourbon brands, Derby events and Bluegrass businesses. Free design + shipping.",
  },
  "custom-ohio-state-patches": {
    title: "Custom Patches Ohio | Buckeye State Business Patches",
    description: "Ohio custom patches for businesses, universities, sports teams and organizations statewide. Free design services and free shipping on every order.",
    ogDescription: "Custom patches for Ohio businesses, universities and sports teams. Free mockup + free shipping.",
  },
  "custom-utah-patches": {
    title: "Custom Patches Utah | Outdoor Adventure and Brand Patches",
    description: "Utah custom patches for outdoor brands, national park gear, ski resorts and Beehive State businesses. Durable patches for rugged environments. Free quote.",
    ogDescription: "Custom patches for Utah outdoor brands, ski resorts and adventure companies. Free design + free shipping.",
  },
  "custom-patches-in-washington": {
    title: "Custom Patches Washington | Pacific Northwest Business Patches",
    description: "Washington state custom patches for PNW businesses, tech companies, outdoor brands and Seattle organizations. Free design and free shipping.",
    ogDescription: "Custom patches for Washington state businesses and Seattle organizations. Free mockup + free shipping.",
  },
};

export default cityPageMeta;
