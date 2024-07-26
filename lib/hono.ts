import { hc } from 'hono/client';
import { AppType } from '@/app/api/[[...route]]/route';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env';

export const client = hc<AppType>(NEXT_PUBLIC_APP_URL!);