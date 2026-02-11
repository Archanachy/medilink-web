"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordData } from "../schema";
import { useState, useTransition } from "react";
import { handleForgotPassword } from "@/lib/actions/auth-action";
import { useToast } from "@/app/context/ToastContext";

export default function ForgotPasswordForm() {
  const { addToast } = useToast();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await handleForgotPassword(data.email);
        if (!response.success) {
          throw new Error(response.message);
        }
        setSent(true);
        addToast(response.message || "Reset email sent", "success");
      } catch (err: Error | any) {
        const errorMsg = err.message || "Forgot password failed";
        setError(errorMsg);
        addToast(errorMsg, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {sent && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
          Check your email for the reset link.
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting || pending ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
