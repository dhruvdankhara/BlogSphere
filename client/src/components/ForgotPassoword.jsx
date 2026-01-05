import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/index";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setStatus({
        type: "success",
        message: "If this email is registered, a reset link has been sent.",
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-11/12 max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your email address to receive a password reset link.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mb-6 font-semibold text-blue-600 hover:text-blue-800"
        >
          Back to Login
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md py-2 font-semibold text-white shadow-md transition-colors ${
              loading
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {status && (
          <div
            className={`mt-4 rounded-md p-3 text-center text-sm font-medium ${
              status.type === "success"
                ? "border border-green-200 bg-green-50 text-green-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
