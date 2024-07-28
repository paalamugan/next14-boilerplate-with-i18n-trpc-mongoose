/* eslint-disable react/no-danger */
import { getTranslations } from 'next-intl/server';

import { getMe } from '@/server/api/helpers/session';

import { HelloClient } from './HelloClient';

const Hello = async () => {
  const t = await getTranslations('Dashboard');
  const user = await getMe();

  return (
    <>
      <p>
        👋{' '}
        <span
          dangerouslySetInnerHTML={{
            __html: t('hello_message', { username: user?.user?.username }),
          }}
        />
      </p>
      <pre>
        <HelloClient />
      </pre>
    </>
  );
};

export { Hello };
