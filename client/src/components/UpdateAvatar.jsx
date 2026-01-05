import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { updateAvatar } from "../api";
import { login } from "../features/auth/authSlice";

function UpdateAvatar({ userData, setUserData }) {
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const dispatch = useDispatch();

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!file) {
      return "Please select a file";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WebP files are allowed";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const updateUserAvatar = async (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    const updateAvatarToast = toast.loading("Updating Avatar...");

    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const response = await updateAvatar(formData);
      console.log("🚀 ~ updateAvatar ~ response:", response);

      dispatch(login(response.data));
      setUserData(response.data);

      toast.success("Avatar updated successfully.", {
        id: updateAvatarToast,
      });
    } catch (error) {
      console.log("🚀 ~ updateAvatar ~ error:", error);
      const message =
        error?.response?.data?.message || "Failed to update avatar";
      setFileError(message);
      toast.error(`Error: ${message}`, {
        id: updateAvatarToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Profile Picture
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <img
          className="size-40 rounded-full object-cover ring-4 ring-gray-300/60"
          src={userData?.avatar || "/placeholder-avatar.png"}
          alt="Profile"
        />

        <button
          disabled={loading}
          className={`flex items-center rounded-xl border bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all duration-300 hover:border-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-base ${
            fileError ? "border-red-500/70" : "border-gray-300"
          }`}
        >
          {loading ? (
            <span className="inline-block size-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></span>
          ) : (
            <>
              <label
                className="flex cursor-pointer items-center justify-center gap-3 text-base"
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
                accept="image/*"
              />
            </>
          )}
        </button>

        {fileError && (
          <p className="text-center text-xs font-medium text-red-600">
            {fileError}
          </p>
        )}
      </div>
    </>
  );
}

UpdateAvatar.propTypes = {
  userData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
};

export default UpdateAvatar;
