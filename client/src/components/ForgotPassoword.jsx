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
      const response = await forgotPassword(email);
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-11/12 max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email address to receive a password reset link.
        </p>

        <button
          onClick={() => navigate("/login")} // Navigate to the login page
          className="mb-6 font-semibold text-red-500 hover:text-blue-700"
        >
          Back to Login
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md border px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md py-2 font-semibold text-white shadow-md ${
              loading
                ? "cursor-not-allowed bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {status && (
          <div
            className={`mt-4 rounded-md p-2 text-center text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
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
