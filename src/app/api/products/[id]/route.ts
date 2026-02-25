import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

/**
 * Single Product API
 * UCP-ready endpoint for fetching individual product details
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Query can handle both _id and SKU
    const query = `*[_id == $id || sku == $id][0] {
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

      // Product details
      basePrice,
      idealFor,
      productTypes[] {
        title,
        description,
        "image": image.asset->url
      },

      // Additional fields for custom products
      option1Title,
      option1Cards[] {
        title,
        description,
        "image": image.asset->url
      },
      option2Title,
      option2Cards[] {
        title,
        description,
        "image": image.asset->url
      },
      option3Title,
      option3Cards[] {
        title,
        description,
        "image": image.asset->url
      }
    }`;

    const product = await client.fetch(query, { id });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform product data
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pandapatches.com';
    const productSlug = product.slug || product._id;

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

    // Compile customization options
    const customizationOptions = [];
    if (product.option1Title && product.option1Cards) {
      customizationOptions.push({
        title: product.option1Title,
        options: product.option1Cards,
      });
    }
    if (product.option2Title && product.option2Cards) {
      customizationOptions.push({
        title: product.option2Title,
        options: product.option2Cards,
      });
    }
    if (product.option3Title && product.option3Cards) {
      customizationOptions.push({
        title: product.option3Title,
        options: product.option3Cards,
      });
    }

    const transformedProduct = {
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
      customizationOptions: customizationOptions,
      idealFor: product.idealFor || [],
      metadata: {
        createdAt: product._createdAt,
        updatedAt: product._updatedAt,
      },
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
