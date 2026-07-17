"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
  dict: {
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
}

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ dict }: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-semibold text-zinc-800">
          {dict.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.emailPlaceholder}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className="block text-sm font-semibold text-zinc-800">
          {dict.subjectLabel}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={dict.subjectPlaceholder}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm font-semibold text-zinc-800">
          {dict.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={dict.messagePlaceholder}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 disabled:opacity-60"
        >
          {status === "sending" ? dict.sending : dict.submit}
        </Button>
        {status === "success" && (
          <p className="text-sm font-medium text-green-600">{dict.success}</p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-600">{dict.error}</p>
        )}
      </div>
    </form>
  );
}
