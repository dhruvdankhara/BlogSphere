import { useForm } from "react-hook-form";
import { Input, Button } from "./index";
import { changePassword } from "../api";
import toast from "react-hot-toast";
import { useState } from "react";

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm();

  const submit = async (data) => {
    setError("");

    if (data.newPassword !== data.confirmPassword) {
      setError("New passsword and confirm password not match.");
      return;
    }

    setLoading(true);
    const changePasswordToast = toast.loxading("Changing password...");

    try {
      const response = await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      console.log("🚀 ~ submit ~ response:", response);

      toast.success("password changed successfully.", {
        id: changePasswordToast,
      });
    } catch (error) {
      console.log("🚀 ~ submit ~ error:", error);
      setError(error.response?.data?.message || "Error in change password");
      toast.error(error.response?.data?.message || "Error in change password", {
        id: changePasswordToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold">Change Password</h2>

      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <Input
          label="Current Password"
          type="password"
          {...register("currentPassword", {
            required: true,
          })}
        />
        <Input
          label="New Password"
          type="password"
          {...register("newPassword", {
            required: true,
          })}
        />
        <Input
          label="Confirm New Password"
          type="password"
          {...register("confirmPassword", {
            required: true,
          })}
        />
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-600 p-3 text-white">
            {error}
          </div>
        )}
        <Button
          disabled={loading}
          type="submit"
          className="flex w-full items-center justify-center bg-zinc-800 hover:bg-zinc-900"
        >
          {loading ? (
            <span className="inline-block size-6 animate-spin rounded-full border-4 border-e-slate-700"></span>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </>
  );
}

export default ChangePassword;
