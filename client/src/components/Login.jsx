import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { Container } from "./index";
import { loginUser } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const dispacth = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Enter a valid email";
    if (!password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    const loginUserToast = toast.loading("Logging in...");
    try {
      const response = await loginUser({ email: email.trim(), password });
      toast.success(`Welcome back, ${response.data.user.name}`, {
        id: loginUserToast,
      });
      dispacth(login(response.data.user));
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Try again.";
      setError(message);
      toast.error(message, { id: loginUserToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <section className="mt-20">
          <div className="mx-auto flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl">
              <div className="flex flex-col gap-8 p-12">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Sign in to your account
                </h1>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={"email"}
                      className="text-base font-medium capitalize text-gray-700"
                    >
                      email
                    </label>
                    <input
                      type="email"
                      placeholder="example@mail.com"
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        fieldErrors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                          : "border-gray-300"
                      }`}
                      id={"email"}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email)
                          setFieldErrors((f) => ({ ...f, email: undefined }));
                      }}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={
                        fieldErrors.email ? "email-error" : undefined
                      }
                    />
                    {fieldErrors.email && (
                      <p
                        id="email-error"
                        className="text-xs font-medium text-red-600"
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="text-base font-medium capitalize text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        fieldErrors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                          : "border-gray-300"
                      }`}
                      id={"password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password)
                          setFieldErrors((f) => ({
                            ...f,
                            password: undefined,
                          }));
                      }}
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={
                        fieldErrors.password ? "password-error" : undefined
                      }
                    />
                    {fieldErrors.password && (
                      <p
                        id="password-error"
                        className="text-xs font-medium text-red-600"
                      >
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>
                  {error && (
                    <div
                      className="text-wrap rounded-xl border border-red-300 bg-red-50 px-5 py-3 text-sm text-red-700"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}
                  <button
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:text-base"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-transparent border-t-blue-400"></div>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                  <p className="text-sm font-light text-gray-600">
                    Don&apos;t have an account yet?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default Login;
