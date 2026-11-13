import { getChangelog } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ notes: getChangelog() });
