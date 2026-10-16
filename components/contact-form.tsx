"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage } from "@/app/contact/actions";
import { CONTACT_LIMITS, initialContactState, type ContactFieldName } from "@/lib/contact/validation";
import { buttonClasses, cx } from "./ui";

const inputClasses =
  "mt-2 block w-full rounded-none border bg-white px-3.5 py-2.5 text-base text-ink transition-colors hover:border-ink focus:border-brand focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand";

const fieldLabels: Record<ContactFieldName, string> = { name: "Name", email: "Email", message: "Message" };

/**
 * Contact form. Works without JavaScript (the server action handles a normal
 * form post); with JavaScript it adds pending feedback, focus management and
 * a character counter. All validation is repeated on the server.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);
  // null until the visitor types, so the counter matches restored values after a submission.
  const [typedLength, setTypedLength] = useState<number | null>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const values = "values" in state ? (state.values ?? {}) : {};
  const errors = "fieldErrors" in state ? (state.fieldErrors ?? {}) : {};
  const errorFields = Object.keys(errors) as ContactFieldName[];
  const messageLength = typedLength ?? values.message?.length ?? 0;

  // Record when the form became interactive (used for spam detection), and
  // move focus to the result of each submission so it is announced.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    if (state.status === "success") successRef.current?.focus();
    else if (state.status !== "idle") feedbackRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="measure border-l-2 border-brand py-2 pl-6 focus:outline-none">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12.5 2.5 2.5L16 9.5" />
        </svg>
        <h2 className="type-heading mt-3">Message sent</h2>
        <p className="mt-2 text-ink-muted">
          Thanks for getting in touch. Your message was accepted for delivery, and I’ll reply to the email address you
          provided.
        </p>
      </div>
    );
  }

  const describedBy = (field: ContactFieldName, extra?: string) =>
    [extra, errors[field] ? `${field}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form action={formAction} onSubmit={() => setTypedLength(null)} noValidate className="relative space-y-7" aria-describedby="contact-form-note">
      {state.status !== "idle" ? (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          role="alert"
          className={cx(
            "border-l-2 py-1 pl-4 focus:outline-none",
            state.status === "invalid" ? "border-danger" : "border-owner-line",
          )}
        >
          <p className={cx("font-semibold", state.status === "invalid" ? "text-danger" : "text-owner")}>{state.message}</p>
          {errorFields.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem] text-danger">
              {errorFields.map((field) => (
                <li key={field}>
                  <a href={`#contact-${field}`} className="underline underline-offset-2 hover:text-ink">
                    {fieldLabels[field]}: {errors[field]}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <p id="contact-form-note" className="text-sm text-ink-subtle">
        All fields are required.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-[0.9375rem] font-semibold">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name}
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            className={cx(inputClasses, errors.name ? "border-danger" : "border-field")}
          />
          <FieldError field="name" message={errors.name} />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-[0.9375rem] font-semibold">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={CONTACT_LIMITS.email}
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email", "email-hint")}
            className={cx(inputClasses, errors.email ? "border-danger" : "border-field")}
          />
          <p id="email-hint" className="mt-1.5 text-sm text-ink-subtle">
            Used only to reply to you.
          </p>
          <FieldError field="email" message={errors.email} />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="contact-message" className="text-[0.9375rem] font-semibold">
            Message
          </label>
          <span id="message-count" className={cx("font-mono text-xs", messageLength > CONTACT_LIMITS.messageMax ? "text-danger" : "text-ink-subtle")}>
            {messageLength.toLocaleString("en-US")} / {CONTACT_LIMITS.messageMax.toLocaleString("en-US")}
            <span className="sr-only"> characters</span>
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          rows={7}
          required
          maxLength={CONTACT_LIMITS.messageMax}
          defaultValue={values.message}
          onChange={(event) => setTypedLength(event.target.value.length)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", "message-hint message-count")}
          className={cx(inputClasses, "min-h-44 resize-y leading-relaxed", errors.message ? "border-danger" : "border-field")}
        />
        <p id="message-hint" className="mt-1.5 text-sm text-ink-subtle">
          Between {CONTACT_LIMITS.messageMin} and {CONTACT_LIMITS.messageMax.toLocaleString("en-US")} characters, with at most{" "}
          {CONTACT_LIMITS.maxLinks} links.
        </p>
        <FieldError field="message" message={errors.message} />
      </div>

      {/* Spam protection: humans never see or fill this field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      {/* No defaultValue: React re-applies it on every render, which would wipe the timestamp. */}
      <input ref={startedAtRef} type="hidden" name="startedAt" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={pending} className={buttonClasses("primary", "disabled:cursor-wait disabled:opacity-70")}>
          {pending ? (
            <>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 motion-safe:animate-spin" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
        <p role="status" className="text-sm text-ink-muted">
          {pending ? "Sending your message, please wait." : ""}
        </p>
      </div>
    </form>
  );
}

function FieldError({ field, message }: { field: ContactFieldName; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${field}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-danger">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-11.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4ZM10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
      <span>
        <span className="sr-only">Error: </span>
        {message}
      </span>
    </p>
  );
}
