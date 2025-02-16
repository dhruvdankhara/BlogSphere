import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "./index";
import { updateAvatar } from "../api";
import { login } from "../features/auth/authSlice";

function UpdateAvatar({ userData, setUserData }) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const updateUserAvatar = async (e) => {
    setLoading(true);
    const updateAvatarToast = toast.loading("Updating Avatar...");

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    try {
      const response = await updateAvatar(formData);
      console.log("🚀 ~ updateAvatar ~ response:", response);

      dispatch(login(response.data));
      setUserData(response.data);

      toast.success("Avatar update successfully.", {
        id: updateAvatarToast,
      });
    } catch (error) {
      console.log("🚀 ~ updateAvatar ~ error:", error);

      toast.error(`Error: ${error.response.data.message}`, {
        id: updateAvatarToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold">Profile Picture</h2>

      <div className="flex flex-col items-center space-y-4">
        <img
          className="size-40 rounded-full object-cover"
          src={userData.avatar}
          alt=""
        />

        <button
          disabled={loading}
          className="flex items-center rounded-xl border-2 border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-black shadow-sm transition-all duration-300 hover:bg-zinc-100 md:text-base"
        >
          {loading ? (
            <span className="inline-block size-6 animate-spin rounded-full border-4 border-e-slate-700"></span>
          ) : (
            <>
              <label
                className="flex items-center justify-center gap-3 text-base"
                htmlFor="avatar"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
                <span>Change Avatar</span>
              </label>
              <input
                onChange={async (e) => await updateUserAvatar(e)}
                className="hidden"
                id="avatar"
                type="file"
              />
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default UpdateAvatar;
