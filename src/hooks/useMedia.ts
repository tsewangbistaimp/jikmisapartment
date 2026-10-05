import * as React from "react";
import { supabase } from "@/lib/supabase";

export interface ManagedMedia {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  media_type: "image" | "video";
  file_url: string;
}

/** Enabled media for the given categories, managed from the admin app's
 *  "Media Management" page (table `media_items`, ordered by sort_order).
 *  Returns an empty list if nothing is managed yet or the request fails, so
 *  callers can fall back to the built-in files in /public. */
export function useMedia(categories: string[]) {
  const [items, setItems] = React.useState<ManagedMedia[]>([]);
  const [loading, setLoading] = React.useState(true);
  const key = categories.join(",");

  React.useEffect(() => {
    let cancelled = false;
    supabase
      .from("media_items")
      .select("id, title, caption, category, media_type, file_url")
      .in("category", key.split(","))
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        setItems(error ? [] : ((data as ManagedMedia[]) ?? []));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { items, loading };
}
