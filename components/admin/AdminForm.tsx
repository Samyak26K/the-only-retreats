"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useRef,
  useTransition,
  type ComponentProps,
  type FormEvent,
} from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export type AdminFormState = { error?: string; success?: string } | null;

export type AdminFormAction = (
  state: AdminFormState,
  formData: FormData,
) => Promise<AdminFormState>;

const PendingContext = createContext(false);

type AdminFormProps = Omit<ComponentProps<"form">, "action" | "onSubmit"> & {
  action: AdminFormAction;
  confirmMessage?: string;
  /** Clear the inputs after a successful submit (e.g. "add" forms). */
  resetOnSuccess?: boolean;
};

/**
 * Server-action form with a pending state and inline error/success messages.
 * Submits via startTransition (not <form action>) so React does not reset the
 * user's input when the action returns an error.
 */
export function AdminForm({
  action,
  confirmMessage,
  resetOnSuccess,
  children,
  ...props
}: AdminFormProps) {
  const [state, formAction] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state?.success) {
      formRef.current?.reset();
    }
  }, [resetOnSuccess, state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form
      {...props}
      ref={formRef}
      onSubmit={handleSubmit}
      aria-busy={isPending}
    >
      <PendingContext.Provider value={isPending}>
        {children}
      </PendingContext.Provider>
      {!isPending && state?.error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}
      {!isPending && state?.success ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {state.success}
        </p>
      ) : null}
    </form>
  );
}

type SubmitButtonProps = ComponentProps<typeof Button> & {
  pendingLabel?: string;
};

/** Works inside AdminForm and inside plain `<form action={serverAction}>`. */
export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  disabled,
  ...props
}: SubmitButtonProps) {
  const contextPending = useContext(PendingContext);
  const { pending: formPending } = useFormStatus();
  const pending = contextPending || formPending;

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
