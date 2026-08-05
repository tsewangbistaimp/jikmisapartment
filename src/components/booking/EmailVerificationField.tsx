import * as React from "react";
import { CheckCircle2, Loader2, MailCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { useEmailVerification } from "@/hooks/useEmailVerification";

/** The email OTP send/verify UI, inline under the booking form's email
 *  field. Purely a UX layer — the actual gate is server-side (see
 *  create_public_booking()'s p_verification_token check); this just walks
 *  the guest through getting one. */
export function EmailVerificationField({
  email,
  disabled,
  verification,
}: {
  email: string;
  /** True while the email field itself fails its own format validation —
   *  no point offering to send a code to something that isn't a valid
   *  address yet. */
  disabled: boolean;
  verification: ReturnType<typeof useEmailVerification>;
}) {
  const [code, setCode] = React.useState("");
  const { status, error, verified, cooldown, sendCode, verifyCode } = verification;

  const handleSend = async () => {
    setCode("");
    await sendCode();
  };

  const handleVerify = async () => {
    const ok = await verifyCode(code);
    if (ok) setCode("");
  };

  if (verified) {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="h-3.5 w-3.5" /> Email verified
      </p>
    );
  }

  if (status === "idle" || status === "error") {
    return (
      <div className="mt-2 space-y-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSend}
          disabled={disabled || !email}
          className="w-full sm:w-auto"
        >
          <MailCheck className="h-3.5 w-3.5" /> Send Verification Code
        </Button>
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {error}
          </p>
        )}
        {!error && (
          <p className="text-xs text-slate-400">We'll email a 6-digit code to verify this address before you can book.</p>
        )}
      </div>
    );
  }

  if (status === "sending") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending verification code…
      </p>
    );
  }

  // sent / verifying — show the code entry row
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="sm:max-w-[160px]"
        />
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={handleVerify} loading={status === "verifying"} disabled={code.length !== 6}>
            Verify
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleSend} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
          </Button>
        </div>
      </div>
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      ) : (
        <p className="text-xs text-slate-400">Check {email} for your code — it expires in 10 minutes.</p>
      )}
    </div>
  );
}
