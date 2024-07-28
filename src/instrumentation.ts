export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

// import { registerOTel } from '@vercel/otel';

// export function register() {
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     // await import('../sentry.server.config');
//     registerOTel('next-app');
//   }
// }
