import { Suspense } from 'react';
import { CollectionShield } from '@/app/(main)/collections/[brandSlug]/components/collection-shield';

interface CollectionPageProps {
  params: Promise<{
    brandSlug: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  return (
    <Suspense>
      <CollectionShield params={params} />
    </Suspense>
  );
}
