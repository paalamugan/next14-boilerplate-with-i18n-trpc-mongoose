'use client';

import { api } from '@/trpc/client';

export const ClientFetch = () => {
  const { data, isPending } = api.user.userById.useQuery();
  return (
    <div className="[&_p]:my-6">
      <h1 className="font-bold">Data fetched in Client</h1>
      {isPending ? 'Loading...' : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
