import { NextRequest, NextResponse } from 'next/server';
import { getMediaDetails } from '@/lib/tmdb';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  if ((type !== 'movie' && type !== 'tv') || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid media identifier' }, { status: 400 });
  }

  try {
    const media = await getMediaDetails(Number(id), type);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json(media);
  } catch (err: any) {
    console.error('[API tmdb/details error]:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch media details' }, { status: 500 });
  }
}