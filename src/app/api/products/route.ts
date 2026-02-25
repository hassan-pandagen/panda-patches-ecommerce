import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

/**
 * Products Listing API
 * Universal Commerce Protocol (UCP) ready
 * Provides full product data for AI agents and integrations
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Query parameters
    const type = searchParams.get('type'); // 'patch' or 'custom'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const availability = searchParams.get('availability');
    const material = searchParams.get('material');

    // Build Sanity query
    let filters: string[] = [];

    if (type === 'patch') {
      filters.push('_type == "product"');
    } else if (type === 'custom') {
      filters.push('_type == "customProduct"');
    } else {
      filters.push('_type in ["product", "customProduct"]');
    }

    if (availability) {
      filters.push(`availability == "${availability}"`);
    }

    if (material) {
      filters.push(`"${material}" in materials`);
    }

    const filterString = filters.length > 0 ? filters.join(' && ') : 'true';

    const query = `*[${filterString}] | order(_createdAt desc) [${offset}...${offset + limit}] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      "image": coalesce(image.asset->url, heroImage.asset->url, gallery[0].asset->url),
      "gallery": coalesce(gallery[].asset->url, workSamples[].asset->url),

      // Commerce fields
      sku,
      gtin,
      availability,
      leadTime,
      pricingTiers[] {
        minQuantity,
        maxQuantity,
        unitPrice
      },
      materials,
      dimensions {
        width,
        height,
        depth
      },
      weight {
        value,
        unit
      },

      // Product type specific
      basePrice,
      idealFor,
      productTypes[] {
        title,
        description,
        "image": image.asset->url
      }
    }`;

    const products = await client.fetch(query);

    // Get total count
    const countQuery = `count(*[${filterString}])`;
    const total = await client.fetch(countQuery);

    // Transform products for UCP/API consumption
    const transformedProducts = products.map((product: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandapatches.com';
      const productSlug = product.slug || product._id;

      // Determine product URL
      let url = `${baseUrl}/`;
      if (product._type === 'customProduct') {
        url += `custom-products/${productSlug}`;
      } else {
        url += `custom-patches/${productSlug}`;
      }

      // Calculate price range
      let priceRange = {
        min: 0,
        max: 0,
        currency: 'USD',
      };

      if (product.pricingTiers && product.pricingTiers.length > 0) {
        const prices = product.pricingTiers.map((tier: any) => tier.unitPrice);
        priceRange.min = Math.min(...prices);
        priceRange.max = Math.max(...prices);
      } else if (product.basePrice) {
        const priceMatch = product.basePrice.match(/\$?(\d+\.?\d*)/);
        if (priceMatch) {
          priceRange.min = parseFloat(priceMatch[1]);
          priceRange.max = parseFloat(priceMatch[1]);
        }
      }

      return {
        id: product._id,
        sku: product.sku || product._id,
        type: product._type,
        name: product.title,
        description: product.description,
        url,
        images: {
          main: product.image,
          gallery: product.gallery || [],
        },
        availability: {
          status: product.availability || 'MadeToOrder',
          leadTime: product.leadTime || '7-14 days',
        },
        pricing: {
          range: priceRange,
          tiers: product.pricingTiers || [],
        },
        specifications: {
          materials: product.materials || [],
          dimensions: product.dimensions || null,
          weight: product.weight || null,
          gtin: product.gtin || null,
        },
        variants: product.productTypes || [],
        idealFor: product.idealFor || [],
        metadata: {
          createdAt: product._createdAt,
          updatedAt: product._updatedAt,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
