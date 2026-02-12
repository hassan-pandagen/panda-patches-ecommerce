import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret token to secure the webhook
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN || 'your-secret-token';

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Sanity
    const token = request.nextUrl.searchParams.get('token');

    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { _type, slug } = body;

    console.log('🔄 Revalidating:', { _type, slug });

    // Revalidate based on content type
    switch (_type) {
      case 'hero':
      case 'process':
      case 'timeline':
      case 'content':
      case 'cta':
      case 'craftsmanship':
        // Homepage content changed
        revalidatePath('/');
        console.log('✅ Revalidated homepage');
        break;

      case 'productPage':
        // Product page changed
        if (slug?.current) {
          revalidatePath(`/custom-patches/${slug.current}`);
          console.log(`✅ Revalidated /custom-patches/${slug.current}`);
        }
        revalidatePath('/custom-patches');
        revalidatePath('/custom-products');
        console.log('✅ Revalidated product pages');
        break;

      case 'blog':
        // Blog post changed
        if (slug?.current) {
          revalidatePath(`/${slug.current}`);
          revalidatePath(`/blogs/${slug.current}`);
          console.log(`✅ Revalidated blog: ${slug.current}`);
        }
        revalidatePath('/blogs');
        console.log('✅ Revalidated blogs listing');
        break;

      case 'locationPage':
        // Location page changed
        if (slug?.current) {
          revalidatePath(`/${slug.current}`);
          console.log(`✅ Revalidated location: ${slug.current}`);
        }
        break;

      case 'patchStyle':
        // Patch style page changed
        if (slug?.current) {
          revalidatePath(`/${slug.current}`);
          console.log(`✅ Revalidated patch style: ${slug.current}`);
        }
        break;

      case 'patchTypes':
      case 'patchOption':
      case 'borderOptions':
      case 'threadOptions':
      case 'addonOptions':
      case 'ironOn':
        // Configuration changed - revalidate all product pages
        revalidatePath('/custom-patches');
        revalidatePath('/custom-products');
        console.log('✅ Revalidated configuration-dependent pages');
        break;

      default:
        // Revalidate everything if we're unsure
        revalidatePath('/', 'layout');
        console.log('✅ Revalidated all pages');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      slug: slug?.current
    });

  } catch (err) {
    console.error('❌ Revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
