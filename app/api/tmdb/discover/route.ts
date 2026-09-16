import { NextRequest, NextResponse } from 'next/server';
import { getPopularMovies, getPopularTV, searchAll } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
  const page = Number(searchParams.get('page') || '1');
  const genre = searchParams.get('genres') || undefined;
  const sortBy = searchParams.get('sort_by') || undefined;
  const country = searchParams.get('country') || undefined;
  const query = searchParams.get('query') || undefined;

  try {
    if (query && query.trim()) {
      // Direct TMDB live search filtered by media type
      const searchRes = await searchAll(query.trim());
      const filtered = type === 'movie' ? searchRes.movies : searchRes.tv;
      return NextResponse.json({
        results: filtered,
        total_pages: 1,
        total_results: filtered.length,
      });
    }

    if (type === 'tv') {
      const data = await getPopularTV({ page, genre, sortBy, country });
      return NextResponse.json(data);
    } else {
      const data = await getPopularMovies({ page, genre, sortBy, country });
      return NextResponse.json(data);
    }
  } catch (err: any) {
    console.error('[API tmdb/discover error]:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch catalog' }, { status: 500 });
  }
}
