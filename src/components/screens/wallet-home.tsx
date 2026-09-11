"use client";

import Link from "next/link";

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
  { label: "Send", icon: SendIcon, locked: true },
  { label: "Add", icon: CardIcon, locked: false },
  { label: "Card", icon: CardIcon, locked: true },
  { label: "More", icon: LockIcon, locked: true },
];

export function WalletHome() {
  const { status, referenceId } = useKyc();
  const pending = status === "pending";

  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HarborMark className="h-9 w-9 text-brand" />
            <div>
              <p className="text-[13px] text-slate">Harbor Wallet</p>
              <p className="text-[15px] font-semibold tracking-tight">
                Good afternoon, Alex
              </p>
            </div>
          </div>
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold"
            aria-hidden="true"
          >
            AR
          </div>
        </header>

        {pending ? (
          <div className="mb-4 rounded-3xl border border-gold/20 bg-gold-soft p-4">
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
            <p className="text-[13px] font-medium text-white/60">
              Complete identity check
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight">
              Verify to unlock your wallet
            </p>
            <p className="mt-1 text-sm text-white/70">
              About 2 minutes · encrypted and private
            </p>
            <span className="mt-3 inline-flex min-h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold">
              Start verification
            </span>
          </Link>
        )}

        <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(14_22_41_/_0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] text-slate">Available</p>
              <p className="mt-1 text-[34px] font-semibold tracking-tight">
                $2,480.00
              </p>
            </div>
            <LockIcon className="mt-1 text-slate" />
          </div>
          <p className="mt-2 text-sm text-slate">
            Send limit $200 until your identity is verified.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button size="md" disabled={pending}>
              Add money
            </Button>
            <Button size="md" variant="outline" disabled>
              Send
            </Button>
          </div>
        </section>

        <section className="mt-5">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate">
            Quick actions
          </p>
          <div className="grid grid-cols-4 gap-2">
            {actions.map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white px-2 py-3"
              >
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-ink">
                  <action.icon />
                  {action.locked ? (
                    <LockIcon className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white p-0.5 text-slate" />
                  ) : null}
                </span>
                <span className="text-[12px] font-medium">{action.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-4">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate">
            Activity
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Blue Bottle Coffee</p>
                <p className="text-slate">Today</p>
              </div>
              <p className="font-semibold">−$6.40</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payroll</p>
                <p className="text-slate">Mon</p>
              </div>
              <p className="font-semibold text-brand">+$1,840.00</p>
            </div>
          </div>
        </section>
      </div>
    </PhoneShell>
  );
}
