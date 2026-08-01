import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/database.types";

/** Active add-on services (Laundry, Breakfast, Airport Pickup, etc.) from the
 *  same `services` table the admin app manages — shown as "available on
 *  request" line items, not yet bookable through the public flow. */
export function useServices() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    supabase
      .from("services")
      .select("*")
      .eq("status", "active")
      .order("price", { ascending: true })
      .then(({ data }) => {
        if (cancelled) return;
        setServices((data as Service[]) ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loading };
}
