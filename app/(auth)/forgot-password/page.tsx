import Link from "next/link";
import Header from "@/app/(public)/components/Header";
import ForgotPasswordForm from "../_components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot password</h1>
              <p className="text-gray-600">We will send you a reset link</p>
            </div>

            <ForgotPasswordForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remembered your password?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
