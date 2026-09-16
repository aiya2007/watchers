import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'IMGBB_API_KEY is not configured in .env.local. Please add IMGBB_API_KEY="your_api_key" to your .env.local.',
        },
        { status: 500 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let imagePayload: string | Blob | null = null;
    let expiration: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('image');
      if (file && (file instanceof Blob || typeof file === 'string')) {
        imagePayload = file;
      }
      const exp = formData.get('expiration');
      if (exp && typeof exp === 'string') {
        expiration = exp;
      }
    } else if (contentType.includes('application/json')) {
      const json = await request.json();
      imagePayload = json.image;
      if (json.expiration) expiration = String(json.expiration);
    }

    if (!imagePayload) {
      return NextResponse.json(
        { error: 'No image provided. Please select or provide an image to upload.' },
        { status: 400 }
      );
    }

    // Build FormData for ImgBB API
    const imgbbFormData = new FormData();
    if (typeof imagePayload === 'string') {
      // If it's a data URL, clean up the base64 prefix if present
      const cleanBase64 = imagePayload.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      imgbbFormData.append('image', cleanBase64);
    } else {
      imgbbFormData.append('image', imagePayload);
    }

    const uploadUrl = new URL('https://api.imgbb.com/1/upload');
    urlWithKey(uploadUrl, apiKey);
    if (expiration) {
      uploadUrl.searchParams.set('expiration', expiration);
    }

    const imgbbRes = await fetch(uploadUrl.toString(), {
      method: 'POST',
      body: imgbbFormData,
    });

    const imgbbData = await imgbbRes.json();

    if (!imgbbRes.ok || !imgbbData?.success) {
      return NextResponse.json(
        {
          error:
            imgbbData?.error?.message ||
            'Failed to upload image to ImgBB.',
        },
        { status: imgbbRes.status || 500 }
      );
    }

    const uploadedUrl =
      imgbbData.data?.display_url ||
      imgbbData.data?.url ||
      imgbbData.data?.image?.url;

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
      thumb: imgbbData.data?.thumb?.url,
      deleteUrl: imgbbData.data?.delete_url,
    });
  } catch (err: any) {
    console.error('ImgBB Upload Error:', err);
    return NextResponse.json(
      { error: err?.message || 'An error occurred while uploading to ImgBB.' },
      { status: 500 }
    );
  }
}

function urlWithKey(url: URL, key: string) {
  url.searchParams.set('key', key);
}

