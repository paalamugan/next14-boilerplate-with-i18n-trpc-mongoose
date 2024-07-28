import { availableLocaleCodes, defaultLocale, localePrefix } from './next.locales.js';

/** @type {import('../types/index.js').SiteConfig} */
const site = {
  title: 'Next14 boilerplate with Next Auth and Next Intl',
  description:
    'Next14 is a Starter Next.js boilerplate with Mongoose, i18n, TRPC, Tailwind CSS, and Internationalization support.',
  favicon: '/static/favicons/favicon.png',
  github: {
    repoLink: 'https://github.com/paalamugan/next14-boilerplate-with-i18n-trpc-mongoose',
  },
  twitter: {
    username: '@next14',
    card: 'summary',
    img: '/static/images/logo-hexagon-card.png',
    imgAlt: 'The Next14 Logo',
    title: 'summary',
  },
  locale: {
    locales: availableLocaleCodes,
    defaultLocale: defaultLocale.code,
    localePrefix: localePrefix,
    timeZone: 'Etc/UTC',
  },
  featuredImage: '/static/images/hero.png',
  lightAccentColor: '#333',
  darkAccentColor: '#333',
  og: {
    imgType: '/static/images/og-image.png',
    imgHeight: '630',
    imgWidth: '1200',
  },
};

export default site;
