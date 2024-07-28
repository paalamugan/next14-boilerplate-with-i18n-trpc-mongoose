'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { type FC, useEffect } from 'react';

import Button from '@/components/Common/Button';
import BaseLayout from '@/layouts/BaseLayout';
import { CenteredLayout } from '@/layouts/CenteredLayout';
import { Providers } from '@/providers/providers';

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  params: { locale: string };
  reset: () => void;
};
const GlobalErrorPage: FC<GlobalErrorPageProps> = ({ error, params, reset }) => {
  const t = useTranslations();
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang={params.locale}>
      <body>
        <Providers>
          <BaseLayout>
            <CenteredLayout>
              <main className="flex flex-col gap-3 text-center">
                <h1 className="text-4xl font-semibold"> 500 </h1>
                <h1 className="special mt-4">{t('layouts.error.internalServerError.title')}</h1>
                <p className="mt-4 max-w-sm text-center text-lg">
                  {t('layouts.error.internalServerError.description')}
                </p>
                <Button href="/">
                  {t('layouts.error.backToHome')}
                  <ArrowRightIcon />
                </Button>
                <Button
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    // Attempt to recover by trying to re-render the segment

                    reset();
                  }}
                >
                  {t('layouts.error.refresh')}
                  <ArrowRightIcon />
                </Button>
              </main>
            </CenteredLayout>
          </BaseLayout>
        </Providers>
      </body>
    </html>
  );
};

export default GlobalErrorPage;
