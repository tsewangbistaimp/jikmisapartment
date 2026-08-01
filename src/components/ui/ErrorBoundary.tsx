import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/** Catches any render-time crash anywhere on the site (a bad realtime
 *  subscription, an unexpected API response shape, a bug in a page) and
 *  shows a recoverable screen instead of React's default behavior of
 *  unmounting the whole tree into a blank white page with no way to
 *  recover short of already knowing to hit refresh. */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Jikmis Apartment site crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 text-center">
        <div className="max-w-md">
          <AlertTriangle className="mx-auto h-8 w-8 text-gold-400" />
          <h1 className="mt-4 font-display text-xl font-semibold text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-navy-200">
            This page hit an unexpected error — often a one-off. Reloading almost always fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400"
          >
            <RefreshCw className="h-4 w-4" /> Reload page
          </button>
        </div>
      </div>
    );
  }
}
