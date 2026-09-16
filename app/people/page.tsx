import React from 'react';
import PeopleCatalog from '@/components/PeopleCatalog';
import { getTrendingPeople } from '@/lib/tmdb';

export const revalidate = 3600;

export default async function PeoplePage() {
  const people = await getTrendingPeople();
  return <PeopleCatalog initialPeople={people} />;
}
