/* eslint-disable react/prop-types */
import { followUser, unfollowUser } from "../api/index";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";

function FollowBtn({ userData, setUserData }) {
  const [loading, setLoading] = useState(false);

  const isUserLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const follow = async () => {
    const followToast = toast.loading("Following user...");

    if (!isUserLoggedIn) {
      toast.error("Login to follow users.", {
        id: followToast,
      });
      return;
    }

    setLoading(true);

    try {
      await followUser(userData.username);

      setUserData((prev) => ({
        ...userData,
        isFollowing: !prev.isFollowing,
        followers: prev.followers + 1,
      }));

      toast.success("followed", {
        id: followToast,
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        id: followToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async () => {
    const unfollowToast = toast.loading("Unfollowing user...");

    setLoading(true);

    try {
      await unfollowUser(userData.username);

      setUserData((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.followers - 1,
      }));
      toast.success("unfollowed", {
        id: unfollowToast,
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        id: unfollowToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {userData.isFollowing ? (
        <button
          className={
            "rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 md:text-base"
          }
          onClick={unfollow}
          disabled={loading}
        >
          {loading ? (
            <div className="inline-block size-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
          ) : (
            "Unfollow"
          )}
        </button>
      ) : (
        <button
          className="rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 md:text-base"
          onClick={follow}
          disabled={loading}
        >
          {loading ? (
            <div className="inline-block size-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
          ) : (
            "Follow"
          )}
        </button>
      )}
    </div>
  );
}

export default FollowBtn;
