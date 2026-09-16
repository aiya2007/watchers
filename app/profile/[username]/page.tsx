import React from 'react';
import UserProfileView from '@/components/UserProfileView';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  return <UserProfileView username={username} />;
}
