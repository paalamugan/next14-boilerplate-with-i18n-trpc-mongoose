'use client';

import { type FC, use } from 'react';

export const ServerFetch: FC<{ dataPromise: any }> = ({ dataPromise }) => {
  const data = use(dataPromise);
  return (
    <div className="[&_p]:my-6">
      <h1 className="font-bold">Data fetched in Server</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
