import React from 'react';
import { notFound } from 'next/navigation';
import MediaDetailView from '@/components/MediaDetailView';
import { getMediaDetails } from '@/lib/tmdb';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const media = await getMediaDetails(numId, 'movie');
  if (!media) notFound();

  return <MediaDetailView media={media} />;
}
