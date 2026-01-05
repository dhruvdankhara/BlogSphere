import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../api/index";
import { logout } from "../features/auth/authSlice";

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
      toast.error(error.response?.data?.message || "Error while logout user", {
        id: logoutToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-900 md:text-base"
    >
      {loading ? (
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-e-blue-700"></div>
      ) : (
        "Log out"
      )}
    </button>
  );
}

export default LogoutBtn;
