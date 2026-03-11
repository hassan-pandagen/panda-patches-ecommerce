import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

/**
 * Google Shopping Product Feed API
 * Exports products in XML format for Google Merchant Center
 * Universal Commerce Protocol (UCP) ready
 */

interface ProductFeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  availability: string;
  price: string;
  brand: string;
  condition: string;
  sku?: string;
  gtin?: string;
  product_type?: string;
  google_product_category?: string;
  shipping_weight?: string;
  material?: string;
}

export async function GET() {
  try {
    // Fetch all products from Sanity
    const query = `*[_type in ["product", "customProduct"]] {
      _id,
      _type,
      title,
      description,
      "slug": slug.current,
      "image": coalesce(image.asset->url, heroImage.asset->url, gallery[0].asset->url),
      sku,
      gtin,
      availability,
      leadTime,
      pricingTiers,
      materials,
      dimensions,
      weight,
      basePrice,
      "productType": _type
    }`;

    const products = await client.fetch(query);

    // Generate XML feed
    const feedItems: ProductFeedItem[] = products.map((product: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandapatches.com';
      const productSlug = product.slug || product._id;

      // Determine product URL based on type
      let productUrl = `${baseUrl}/`;
      if (product._type === 'customProduct') {
        productUrl += `custom-products/${productSlug}`;
      } else {
        productUrl += `custom-patches/${productSlug}`;
      }

      // Get pricing
      let price = '$0.00';
      if (product.pricingTiers && product.pricingTiers.length > 0) {
        // Use the lowest price from pricing tiers
        const lowestPrice = Math.min(...product.pricingTiers.map((tier: any) => tier.unitPrice));
        price = `${lowestPrice.toFixed(2)} USD`;
      } else if (product.basePrice) {
        // Extract number from basePrice string (e.g., "Starting at $2.50")
        const priceMatch = product.basePrice.match(/\$?(\d+\.?\d*)/);
        if (priceMatch) {
          price = `${priceMatch[1]} USD`;
        }
      }

      // Map availability to Google Shopping format
      let availability = 'in_stock';
      switch (product.availability) {
        case 'InStock':
          availability = 'in_stock';
          break;
        case 'MadeToOrder':
        case 'PreOrder':
          availability = 'preorder';
          break;
        case 'OutOfStock':
          availability = 'out_of_stock';
          break;
        default:
          availability = 'in_stock';
      }

      // Format shipping weight
      let shipping_weight: string | undefined;
      if (product.weight?.value && product.weight?.unit) {
        shipping_weight = `${product.weight.value} ${product.weight.unit}`;
      }

      // Get material (first one if array)
      const material = product.materials?.length > 0 ? product.materials[0] : undefined;

      // Determine product type for Google Shopping
      let product_type = 'Apparel & Accessories > Clothing Accessories > Patches';
      if (product._type === 'customProduct') {
        if (product.title.toLowerCase().includes('pin')) {
          product_type = 'Apparel & Accessories > Jewelry > Brooches & Lapel Pins';
        } else if (product.title.toLowerCase().includes('coin')) {
          product_type = 'Arts & Entertainment > Hobbies & Creative Arts > Collectibles > Collectible Coins & Currency';
        } else if (product.title.toLowerCase().includes('keychain')) {
          product_type = 'Apparel & Accessories > Jewelry > Keychains';
        }
      }

      return {
        id: product.sku || product._id,
        title: product.title || 'Untitled Product',
        description: product.description || 'Custom made product',
        link: productUrl,
        image_link: product.image || `${baseUrl}/assets/logo-panda.svg`,
        availability,
        price,
        brand: 'Panda Patches',
        condition: 'new',
        sku: product.sku,
        gtin: product.gtin,
        product_type,
        google_product_category: product._type === 'customProduct' ? '166' : '175', // 166=Apparel Accessories, 175=Patches
        shipping_weight,
        material,
      };
    });

    // Generate XML
    const xml = generateGoogleShoppingXML(feedItems);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating product feed:', error);
    return NextResponse.json(
      { error: 'Failed to generate product feed' },
      { status: 500 }
    );
  }
}

/**
 * Generate Google Shopping XML Feed
 */
function generateGoogleShoppingXML(items: ProductFeedItem[]): string {
  const xmlItems = items.map((item) => {
    const escapedTitle = escapeXml(item.title);
    const escapedDescription = escapeXml(item.description);
    const escapedLink = escapeXml(item.link);
    const escapedImageLink = escapeXml(item.image_link);

    return `
    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:title>${escapedTitle}</g:title>
      <g:description>${escapedDescription}</g:description>
      <g:link>${escapedLink}</g:link>
      <g:image_link>${escapedImageLink}</g:image_link>
      <g:availability>${item.availability}</g:availability>
      <g:price>${item.price}</g:price>
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:condition>${item.condition}</g:condition>
      ${item.sku ? `<g:mpn>${escapeXml(item.sku)}</g:mpn>` : ''}
      ${item.gtin ? `<g:gtin>${escapeXml(item.gtin)}</g:gtin>` : ''}
      ${item.product_type ? `<g:product_type>${escapeXml(item.product_type)}</g:product_type>` : ''}
      ${item.google_product_category ? `<g:google_product_category>${item.google_product_category}</g:google_product_category>` : ''}
      ${item.shipping_weight ? `<g:shipping_weight>${escapeXml(item.shipping_weight)}</g:shipping_weight>` : ''}
      ${item.material ? `<g:material>${escapeXml(item.material)}</g:material>` : ''}
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Panda Patches - Custom Patches & Products</title>
    <link>https://pandapatches.com</link>
    <description>Custom embroidered patches, PVC patches, challenge coins, lapel pins, and more</description>
    ${xmlItems}
  </channel>
</rss>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
