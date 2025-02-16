import { useState } from "react";
import { Button, Container, Input } from "./index";
import { registerUser } from "../api";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispacth = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const submit = async (data) => {
    setError("");
    setLoading(true);

    const registerUserToast = toast.loading("Registering user...");

    try {
      const response = await registerUser(data);
      console.log("🚀 ~ Register User ~ response:", response);

      toast.success(`welcome, ${response.data?.user?.name || "user"}`, {
        id: registerUserToast,
      });

      dispacth(login(response.data.user));
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Error while register user.");

      toast.error(
        error.response?.data?.message || "Error while register user.",
        {
          id: registerUserToast,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <section className="rounded-3xl border-2 bg-white">
          <div className="flex h-dvh items-center justify-center">
            <div className="w-full max-w-lg rounded-xl border shadow-md">
              <div className="flex flex-col gap-8 p-14">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Create new account
                </h1>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(submit)}
                >
                  <Input
                    label="Name"
                    type="text"
                    placeholder="john doe"
                    {...register("name", {
                      required: true,
                      value: "",
                    })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="example@mail.com"
                    {...register("email", {
                      required: true,
                      value: "",
                    })}
                  />
                  <Input
                    label="Username"
                    type="text"
                    placeholder="user123"
                    {...register("username", {
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
                  {error ? (
                    <div className="text-wrap rounded-lg border border-red-800 bg-red-400/80 px-5 py-3 text-white">
                      {error}
                    </div>
                  ) : null}

                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
                    ) : (
                      "Register"
                    )}
                  </Button>
                  <p className="text-sm font-light text-gray-500">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Log in
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

export default Register;
