import * as React from "react";

/** Lightweight per-page SEO: sets the document title and meta description
 *  without pulling in a new dependency (no react-helmet-async in this
 *  project's stack). Good enough for a client-rendered SPA's basic on-page
 *  SEO; if you later add server-side rendering, move this into the render
 *  path instead. */
export function useSEO(title: string, description?: string) {
  React.useEffect(() => {
    document.title = `${title} | Jikmis Apartment`;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
