import React from 'react';
import { notFound } from 'next/navigation';
import PersonDetailView from '@/components/PersonDetailView';
import { getPersonDetails } from '@/lib/tmdb';

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const person = await getPersonDetails(numId);
  if (!person) notFound();

  return <PersonDetailView person={person} />;
}
