import * as React from "react";
import { supabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_S = 60;

export type EmailVerificationStatus = "idle" | "sending" | "sent" | "verifying" | "verified" | "error";

/** Drives the guest email-verification gate on the booking form: send a
 *  6-digit code (send-email-otp), let the guest type it back in, verify it
 *  (verify-email-otp). On success this holds a verification_token that the
 *  form passes straight through to create_public_booking() — the database
 *  re-checks that token server-side, so this hook's local `verified` state
 *  is a UX convenience only, never the actual security boundary. See
 *  jikmis-apartment/supabase/migrations/20260803000000_verification_and_payment_review.sql. */
export function useEmailVerification(email: string) {
  const [status, setStatus] = React.useState<EmailVerificationStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [verificationToken, setVerificationToken] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const verifiedEmailRef = React.useRef<string | null>(null);

  // If the guest edits the email after verifying it, the old token no
  // longer applies to the new address — drop back to unverified rather
  // than silently letting a stale token through (create_public_booking()
  // would reject it anyway since it checks the token against THIS email,
  // but resetting here gives an honest UI instead of a confusing server
  // error at submit time).
  React.useEffect(() => {
    if (verifiedEmailRef.current && verifiedEmailRef.current !== email.trim().toLowerCase()) {
      setStatus("idle");
      setVerificationToken(null);
      verifiedEmailRef.current = null;
    }
  }, [email]);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const sendCode = React.useCallback(async () => {
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      setError("Please enter a valid email address");
      setStatus("error");
      return false;
    }
    setStatus("sending");
    setError(null);
    const { data, error: fnError } = await supabase.functions.invoke("send-email-otp", { body: { email: normalized } });
    if (fnError || (data as { error?: string } | null)?.error) {
      setStatus("error");
      setError((data as { error?: string } | null)?.error ?? "Couldn't send the verification code. Please try again.");
      return false;
    }
    setStatus("sent");
    setCooldown(RESEND_COOLDOWN_S);
    return true;
  }, [email]);

  const verifyCode = React.useCallback(
    async (code: string) => {
      const normalized = email.trim().toLowerCase();
      if (!code || code.trim().length !== 6) {
        setError("Enter the 6-digit code from your email");
        setStatus("error");
        return false;
      }
      setStatus("verifying");
      setError(null);
      const { data, error: fnError } = await supabase.functions.invoke("verify-email-otp", {
        body: { email: normalized, code: code.trim() },
      });
      const result = data as { verified?: boolean; verification_token?: string; error?: string } | null;
      if (fnError || !result?.verified || !result.verification_token) {
        setStatus("sent"); // back to "code sent, try again" rather than a full reset
        setError(result?.error ?? "Email verification failed. Please request a new verification code.");
        return false;
      }
      setVerificationToken(result.verification_token);
      verifiedEmailRef.current = normalized;
      setStatus("verified");
      return true;
    },
    [email]
  );

  const reset = React.useCallback(() => {
    setStatus("idle");
    setError(null);
    setVerificationToken(null);
    verifiedEmailRef.current = null;
  }, []);

  return {
    status,
    error,
    verified: status === "verified",
    verificationToken,
    cooldown,
    sendCode,
    verifyCode,
    reset,
  };
}
