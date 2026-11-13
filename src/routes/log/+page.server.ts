import { getDevLog } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ entries: getDevLog() });
