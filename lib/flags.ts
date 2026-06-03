import { vercelAdapter } from '@flags-sdk/vercel';
import { flag } from 'flags/next';

const isProduction = process.env.VERCEL_ENV === 'production';

export const dotRaces = flag<boolean>({
  key: 'dot-races',
  defaultValue: true,
  description: 'Controls whether the Dot Race fan-zone module is shown.',
  options: [
    { label: 'Off', value: false },
    { label: 'On', value: true },
  ],
  ...(process.env.FLAGS
    ? { adapter: vercelAdapter() }
    : {
        decide: () => {
          if (isProduction) {
            console.warn(
              'dot-races flag is using its default value because FLAGS is not configured.',
            );
          }
          return true;
        },
      }),
});
