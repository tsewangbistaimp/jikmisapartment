import { lazy, type ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModule = { default: ComponentType<any> };

const RELOAD_KEY = "jikmis-site-chunk-reload-attempted";

/** Wraps React.lazy() so a stale/missing JS chunk — the classic cause of a
 *  blank screen right after a new deploy, since a browser tab left open from
 *  before Vercel replaced the build tries to fetch an old hashed chunk
 *  filename that no longer exists — forces exactly one full page reload to
 *  pick up the fresh build instead of throwing an uncaught error. Same
 *  pattern as jikmisaptadmin/src/lib/lazy-retry.ts.
 *
 *  sessionStorage guards against a reload loop: if the same session still
 *  fails to load the chunk after one reload (a genuine network/deploy
 *  problem, not a stale cache), it gives up and lets the error surface to
 *  <ErrorBoundary> instead of reloading forever. */
export function lazyWithRetry<T extends AnyModule>(importer: () => Promise<T>) {
  return lazy(async () => {
    try {
      const mod = await importer();
      window.sessionStorage.removeItem(RELOAD_KEY);
      return mod;
    } catch (error) {
      const alreadyRetried = window.sessionStorage.getItem(RELOAD_KEY) === "1";
      if (!alreadyRetried) {
        window.sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
        return new Promise<T>(() => {});
      }
      throw error;
    }
  });
}
