"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center"
        >
          <CheckCircle2 className="h-12 w-12 text-accent" aria-hidden="true" />
          <p className="font-display text-xl text-primary">Message sent</p>
          <p className="text-sm text-muted-foreground">
            Thanks for reaching out — we&apos;ll get back to you soon.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-surface p-8 shadow-sm"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-foreground">
              Full name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-border bg-surface px-3 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-border bg-surface px-3 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground">
                Phone <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-border bg-surface px-3 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your trip — group size, dates you have in mind, and any questions."
              className="mt-1.5 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          {status === "error" && errorMessage && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
