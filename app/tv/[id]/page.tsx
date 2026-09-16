import React from 'react';
import { notFound } from 'next/navigation';
import MediaDetailView from '@/components/MediaDetailView';
import { getMediaDetails } from '@/lib/tmdb';

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export default async function TVDetailPage({ params }: TVPageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const media = await getMediaDetails(numId, 'tv');
  if (!media) notFound();

  return <MediaDetailView media={media} />;
}
