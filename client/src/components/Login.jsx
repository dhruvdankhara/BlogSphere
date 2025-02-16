import { useState } from "react";
import { Button, Container, Input } from "./index";
import { loginUser } from "../api";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispacth = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const submit = async (data) => {
    setError(null);
    setLoading(true);

    const loginUserToast = toast.loading("Login user...");

    try {
      const response = await loginUser(data);
      console.log("🚀 ~ handleSubmit ~ response:", response);

      toast.success(`Welcome back, ${response.data.user.name}`, {
        id: loginUserToast,
      });

      dispacth(login(response.data.user));
      navigate("/");
    } catch (error) {
      console.log("🚀 ~ login user ~ error:", error);
      setError(error.response.data.message);

      toast.error(`Error: ${error.response.data.message}`, {
        id: loginUserToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <section className="rounded-3xl border-2 bg-white">
          <div className="mx-auto flex h-dvh flex-col items-center justify-center px-6 py-8">
            <div className="w-full max-w-lg rounded-xl border bg-white shadow-lg">
              <div className="flex flex-col gap-8 p-14">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Sign in to your account
                </h1>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit(submit)}
                >
                  <Input
                    label="email"
                    type="email"
                    placeholder="example@mail.com"
                    {...register("email", {
                      required: true,
                      value: "",
                    })}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: true,
                      value: "",
                    })}
                  />
                  <div className="flex items-center justify-start">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  {error ? (
                    <div className="text-wrap rounded-lg border border-red-800 bg-red-400/80 px-5 py-3 text-white">
                      {error}
                    </div>
                  ) : null}
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                  <p className="text-sm font-light text-gray-500">
                    Don’t have an account yet?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 hover:underline"
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
