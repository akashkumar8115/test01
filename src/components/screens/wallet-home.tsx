"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useKyc } from "@/components/kyc/kyc-provider";
import { PhoneShell } from "@/components/kyc/phone-shell";
import { Button } from "@/components/ui/button";
import {
  CardIcon,
  HarborMark,
  LockIcon,
  SendIcon,
} from "@/components/ui/icons";

const actions = [
  { id: "send", label: "Send", icon: SendIcon, locked: true },
  { id: "add", label: "Add", icon: CardIcon, locked: false },
  { id: "card", label: "Card", icon: CardIcon, locked: true },
  { id: "more", label: "More", icon: LockIcon, locked: true },
] as const;

export function WalletHome() {
  const router = useRouter();
  const { status, referenceId } = useKyc();
  const pending = status === "pending";
  const [balance, setBalance] = useState(2480);
  const [notice, setNotice] = useState<string | null>(
    pending ? null : "Verify your identity to unlock Send, Card, and higher limits.",
  );
  const [showVerifyCta, setShowVerifyCta] = useState(!pending);

  function flash(message: string, verify = false) {
    setNotice(message);
    setShowVerifyCta(verify);
  }

  function requireVerified(action: string) {
    if (status === "idle") {
      flash(`${action} is locked until you verify your identity.`, true);
      return false;
    }
    if (status === "pending") {
      flash(`${action} unlocks after your documents are approved.`);
      return false;
    }
    return true;
  }

  function addMoney() {
    setBalance((value) => value + 100);
    flash("$100 added. Sending still needs identity verification.", status === "idle");
  }

  function sendMoney() {
    if (!requireVerified("Send")) return;
    setBalance((value) => Math.max(0, value - 25));
    flash("$25 sent to Jordan Lee.");
  }

  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col bg-canvas px-5 pb-6 pt-4 text-ink">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HarborMark className="h-9 w-9 text-brand" />
            <div>
              <p className="text-[13px] font-medium text-muted">Harbor Wallet</p>
              <p className="text-[15px] font-semibold tracking-tight text-ink">
                Good afternoon, Alex
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Open profile"
            onClick={() =>
              flash(
                pending
                  ? `Alex Rivera · verification ${referenceId ?? "in review"}`
                  : "Alex Rivera · unverified. Start KYC to unlock the full wallet.",
                !pending,
              )
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-ink"
          >
            AR
          </button>
        </header>

        {pending ? (
          <div className="mb-4 rounded-3xl border border-gold/30 bg-gold-soft p-4">
            <p className="text-[13px] font-semibold text-gold">
              Verification in review
            </p>
            <p className="mt-1 text-sm leading-5 text-ink-soft">
              We’re checking your documents
              {referenceId ? ` · ${referenceId}` : ""}. This usually takes a few
              minutes.
            </p>
          </div>
        ) : (
          <Link
            href="/verify"
            className="mb-4 block rounded-3xl bg-ink p-4 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <p className="text-[13px] font-medium text-white/80">
              Complete identity check
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-white">
              Verify to unlock your wallet
            </p>
            <p className="mt-1 text-sm text-white/85">
              About 2 minutes · encrypted and private
            </p>
            <span className="mt-3 inline-flex min-h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white">
              Start verification
            </span>
          </Link>
        )}

        {notice ? (
          <div
            role="status"
            className="mb-4 rounded-2xl border border-line bg-white p-3.5 text-sm leading-5 text-ink"
          >
            <p>{notice}</p>
            <div className="mt-3 flex gap-2">
              {showVerifyCta ? (
                <Button size="sm" onClick={() => router.push("/verify")}>
                  Verify now
                </Button>
              ) : null}
              <Button size="sm" variant="outline" onClick={() => setNotice(null)}>
                Dismiss
              </Button>
            </div>
          </div>
        ) : null}

        <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(14_22_41_/_0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-muted">Available</p>
              <p className="mt-1 text-[34px] font-semibold tracking-tight text-ink">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <LockIcon className="mt-1 text-muted" />
          </div>
          <p className="mt-2 text-sm text-muted">
            Send limit $200 until your identity is verified.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button size="md" onClick={addMoney}>
              Add money
            </Button>
            <Button size="md" variant="outline" onClick={sendMoney}>
              Send
            </Button>
          </div>
        </section>

        <section className="mt-5">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
            Quick actions
          </p>
          <div className="grid grid-cols-4 gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  if (action.id === "add") {
                    addMoney();
                    return;
                  }
                  if (action.id === "send") {
                    sendMoney();
                    return;
                  }
                  if (action.id === "card") {
                    if (!requireVerified("Cards")) return;
                    flash("Your virtual card is ready to use.");
                    return;
                  }
                  flash("Settings, statements, and help will open here.");
                }}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white px-2 py-3 text-ink"
              >
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-ink">
                  <action.icon />
                  {action.locked ? (
                    <LockIcon className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white p-0.5 text-muted" />
                  ) : null}
                </span>
                <span className="text-[12px] font-medium text-ink">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-4">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
            Activity
          </p>
          <div className="space-y-3 text-sm text-ink">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">Blue Bottle Coffee</p>
                <p className="text-muted">Today</p>
              </div>
              <p className="font-semibold text-ink">−$6.40</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">Payroll</p>
                <p className="text-muted">Mon</p>
              </div>
              <p className="font-semibold text-brand">+$1,840.00</p>
            </div>
          </div>
        </section>
      </div>
    </PhoneShell>
  );
}
