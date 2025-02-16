/* eslint-disable react/prop-types */
import { followUser, unfollowUser } from "../api/index";
import { Button } from "./index";
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
      const response = await followUser(userData.username);
      console.log("🚀 ~ follow ~ response:", response);

      setUserData((prev) => ({
        ...userData,
        isFollowing: !prev.isFollowing,
        followers: prev.followers + 1,
      }));

      toast.success("followed", {
        id: followToast,
      });
    } catch (error) {
      console.log("🚀 ~ follow ~ error:", error);
      toast.error(error.response?.data?.message || "error in follow", {
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
      const response = await unfollowUser(userData.username);
      console.log("🚀 ~ unfollow ~ response:", response);

      setUserData((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.followers - 1,
      }));
      toast.success("unfollowed", {
        id: unfollowToast,
      });
    } catch (error) {
      console.log("🚀 ~ unfollow ~ error:", error);

      toast.error(error.response?.data?.message || "Error in unfollow", {
        id: unfollowToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {userData.isFollowing ? (
        <Button onClick={unfollow} disabled={loading}>
          {loading ? (
            <div className="inline-block size-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
          ) : (
            "Unfollow"
          )}
        </Button>
      ) : (
        <Button onClick={follow} disabled={loading}>
          {loading ? (
            <div className="inline-block size-7 animate-spin rounded-full border-4 border-e-blue-700"></div>
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </div>
  );
}

export default FollowBtn;
