import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "./index";
import { logoutUser } from "../api/index";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";

function LogoutBtn() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClick = async () => {
    setLoading(true);
    const logoutToast = toast.loading("Logging out...");

    try {
      await logoutUser();
      dispatch(logout());

      toast.success("User Logout successfully", {
        id: logoutToast,
      });
    } catch (error) {
      console.log("🚀 ~ logout ~ error:", error);
      toast.error(error.response?.data?.message || "Error while logout user", {
        id: logoutToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="bg-red-600 hover:bg-red-900"
    >
      {loading ? (
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-e-blue-700"></div>
      ) : (
        "Log out"
      )}
    </Button>
  );
}

export default LogoutBtn;
