import { createClient } from "@supabase/supabase-js";

// This MUST point at the exact same Supabase project as the Jikmis Apartment
// admin app (jikmis-apartment/). Same VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY values as that project's .env — this site is a
// second, public-facing frontend for the same backend, not a new one.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && /^https?:\/\//.test(supabaseUrl)
);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars are missing. Copy .env.example to .env and fill in the SAME " +
      "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY used by the admin app, then restart `npm run dev`."
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key"
);
