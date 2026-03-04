import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN || 'your-secret-token';

export async function POST(request: NextRequest) {
  try {
    // Accept token from Authorization header (preferred) or query param (legacy)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');

    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { _type, slug } = body;

    switch (_type) {
      case 'hero':
      case 'process':
      case 'timeline':
      case 'content':
      case 'cta':
      case 'craftsmanship':
        revalidatePath('/');
        break;

      case 'productPage':
        if (slug?.current) {
          revalidatePath(`/custom-patches/${slug.current}`);
        }
        revalidatePath('/custom-patches');
        revalidatePath('/custom-products');
        break;

      case 'blog':
        if (slug?.current) {
          revalidatePath(`/${slug.current}`);
          revalidatePath(`/blogs/${slug.current}`);
        }
        revalidatePath('/blogs');
        break;

      case 'locationPage':
        if (slug?.current) {
          revalidatePath(`/${slug.current}`);
        }
        break;

      case 'patchStyle':
        if (slug?.current) {
          revalidatePath(`/${slug.current}`);
        }
        break;

      case 'patchTypes':
      case 'patchOption':
      case 'borderOptions':
      case 'threadOptions':
      case 'addonOptions':
      case 'ironOn':
        revalidatePath('/custom-patches');
        revalidatePath('/custom-products');
        break;

      default:
        revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      slug: slug?.current
    });

  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
