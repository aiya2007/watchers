import { NextRequest, NextResponse } from 'next/server';
import { searchAll } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  
  try {
    const results = await searchAll(q);
    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Search failed' }, { status: 500 });
  }
}
