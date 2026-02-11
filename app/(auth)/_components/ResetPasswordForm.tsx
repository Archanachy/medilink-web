"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordData } from "../schema";
import { useState, useTransition } from "react";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { useToast } from "@/app/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const tokenFromQuery = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      token: tokenFromQuery,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await handleResetPassword(data.token, data.newPassword, data.confirmPassword);
        if (!response.success) {
          throw new Error(response.message);
        }
        addToast(response.message || "Password reset successfully", "success");
        router.push("/login");
      } catch (err: Error | any) {
        const errorMsg = err.message || "Reset password failed";
        setError(errorMsg);
        addToast(errorMsg, "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
          Reset Token
        </label>
        <input
          id="token"
          type="text"
          {...register("token")}
          placeholder="Paste your reset token"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {errors.token && (
          <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          {...register("newPassword")}
          placeholder="Create a new password"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm your new password"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting || pending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
