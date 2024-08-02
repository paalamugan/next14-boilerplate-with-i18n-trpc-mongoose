/* eslint-disable import/no-extraneous-dependencies, import/extensions */
import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';

import { BASE_PATH, ENABLE_STATIC_EXPORT } from './src/next-helpers/next.constants.js';
import { redirects, rewrites } from './src/next-helpers/next.rewrites.js';
import {
  SENTRY_DSN,
  SENTRY_ENABLE,
  SENTRY_EXTENSIONS,
  SENTRY_TUNNEL,
} from './src/next-helpers/sentry.constants.js';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/env');

const withNextIntlConfig = withNextIntl('./src/i18n/index.ts');

const IS_ANALYZE = process.env.ANALYZE === 'true';
const bundleAnalyzer = withBundleAnalyzer({
  enabled: IS_ANALYZE,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Just to ensure that React is always on strict mode
  reactStrictMode: true,
  // We intentionally disable Next.js's built-in i18n support
  // as we dom have our own i18n and internationalisation engine
  i18n: null,
  // We want to always enforce that SWC minifies the sources even during Development mode
  // so that bundles are minified on-the-go. SWF minifying is fast, and has almost no penalties
  swcMinify: true,
  // We allow the BASE_PATH to be overridden in case that the Website
  // is being built on a subdirectory (e.g. /nodejs-website)
  basePath: BASE_PATH,
  images: {
    // We disable image optimisation during static export builds
    unoptimized: ENABLE_STATIC_EXPORT,
    // We allow SVGs to be used as images
    dangerouslyAllowSVG: true,
    // We add it to the remote pattern for the static images we use from GitHub
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/nodejs/**',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // On static export builds we want the output directory to be "build"
  distDir: ENABLE_STATIC_EXPORT ? 'build' : '.next',
  // On static export builds we want to enable the export feature
  output: ENABLE_STATIC_EXPORT ? 'export' : undefined,
  // This configures all the Next.js rewrites, which are used for rewriting internal URLs into other internal Endpoints
  // This feature is not supported within static export builds, hence we pass an empty array if static exports are enabled
  rewrites: !ENABLE_STATIC_EXPORT ? rewrites : undefined,
  // This configures all Next.js redirects
  redirects: !ENABLE_STATIC_EXPORT ? redirects : undefined,
  // We don't want to run Type Checking on Production Builds
  // as we already check it on the CI within each Pull Request
  typescript: { ignoreBuildErrors: true },
  // We don't want to run ESLint Checking on Production Builds
  // as we already check it on the CI within each Pull Request
  // we also configure ESLint to run its lint checking on all files (next lint)
  eslint: { dirs: ['.'], ignoreDuringBuilds: true },
  // Adds custom WebPack configuration to our Next.hs setup
  webpack(config, { webpack }) {
    // Next.js WebPack Bundler does not know how to handle `.mjs` files on `node_modules`
    // This is not an issue when using TurboPack as it uses SWC and it is ESM-only
    // Once Next.js uses Turbopack for their build process we can remove this
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false },
    });

    // Tree-shakes modules from Sentry Bundle
    config.plugins.push(new webpack.DefinePlugin(SENTRY_EXTENSIONS));

    // Ignore Sentry's Critical Dependency from Open Telemetry
    // (which is genuinely a cause of concern, but there is no work around at the moment)
    config.ignoreWarnings = [
      {
        module: /@opentelemetry\/instrumentation/,
        message: /Critical dependency/,
      },
    ];

    return config;
  },
  experimental: {
    // A list of packages that Next.js should automatically evaluate and optimise the imports for.
    // @see https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
    // optimizePackageImports: [
    //   '@radix-ui/react-avatar',
    //   '@radix-ui/react-select',
    //   '@radix-ui/react-toast',
    //   'tailwindcss',
    // ],
    // Removes the warning regarding the WebPack Build Worker
    webpackBuildWorker: false,
  },
};

/** @type {import('@sentry/cli').SentryCliOptions} */
const sentrySettings = {
  // We don't want Sentry to emit logs
  silent: true,
  // Define the Sentry Organisation
  org: 'nextjs-boilerplate-org',
  // Define the Sentry Project on our Sentry Organisation
  project: 'nextjs-boilerplate',
  // Sentry DSN for the Your Website
  dsn: SENTRY_DSN,
  // Sentry Auth Token for the Your Website
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

/** @type {import('@sentry/nextjs/types/config/types').UserSentryOptions} */
const sentryConfig = {
  // Upload Next.js or third-party code in addition to our code
  widenClientFileUpload: true,
  // Attempt to circumvent ad blockers
  tunnelRoute: SENTRY_TUNNEL(),
  // Prevent source map comments in built files
  hideSourceMaps: false,
  // Tree shake Sentry stuff from the bundle
  disableLogger: true,
  // Applies same WebPack Transpilation as Next.js. Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,
  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
};

// Next.js Configuration with `next.intl` enabled
const nextWithIntl = withNextIntlConfig(nextConfig);

// Next.js Configuration with `next.intl` and `bundle-analyzer` enabled
const nextIntlWithBundleAnalyzer = bundleAnalyzer(nextWithIntl);

// Next.js Configuration with `sentry` enabled
const nextWithSentry = withSentryConfig(
  // Next.js Config with i18n Configuration
  nextIntlWithBundleAnalyzer,
  // Default Sentry Settings
  sentrySettings,
  // Default Sentry Extension Configuration
  sentryConfig
);

// Decides whether enabling Sentry or not
// By default we only want to enable Sentry within a Vercel Environment
export default SENTRY_ENABLE
  ? nextWithSentry
  : IS_ANALYZE
    ? nextIntlWithBundleAnalyzer
    : nextWithIntl;
// export default IS_ANALYZE ? nextIntlWithBundleAnalyzer : nextWithIntl;
