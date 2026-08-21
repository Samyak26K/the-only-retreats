"use client";

import { useState } from "react";

export function NewsletterForm({
  placeholder,
  buttonText,
}: {
  placeholder: string;
  buttonText: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-3">
        <p className="text-sm text-gold">✦ Welcome to the journey.</p>
        <p className="mt-0.5 text-xs text-white/40">
          You&apos;ll hear from us soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={placeholder}
        className="h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold/40 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="h-11 rounded-lg border border-gold/30 bg-gold/20 text-sm font-medium text-gold transition-colors hover:bg-gold/30 disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : buttonText}
      </button>
      {status === "error" ? (
        <p className="text-xs text-red-400">Something went wrong. Try again.</p>
      ) : null}
    </div>
  );
}
