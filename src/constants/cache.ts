export const STALE_TIME = 60 * 60 * 1000;
export const GC_TIME = 60 * 60 * 1000;

export const DEFAULT_CACHE_TIME = {
  stale: 3600, // 1 hour until considered stale
  revalidate: 7200, // 2 hours until revalidated
  expire: 86400, // 1 day until expired
};
