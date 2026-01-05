import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CommentCard } from "./index";
import { createComment, getPostComments } from "../api";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Comment({ _id }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const [postingComment, setPostingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  const loggedInUser = useSelector((state) => state.auth.data);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const fetchComments = async () => {
    try {
      const response = await getPostComments(_id);
      setComments(response.data);
    } catch (error) {
      console.log("comment fetch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      toast.error("Enter comment !!!");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Login first to post comment");
      return;
    }

    const createCommentToast = toast.loading("uploading comment...");
    setPostingComment(true);

    try {
      await createComment({ blogId: _id, content });

      await fetchComments();

      toast.success("Comment posted successfully", {
        id: createCommentToast,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "error while posting comment",
        {
          id: createCommentToast,
        }
      );
    } finally {
      setPostingComment(false);
      setContent("");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchComments();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-gray-300 bg-white p-10 shadow-sm">
      <h1 id="comments" className="text-4xl font-bold text-gray-900">
        Comments
      </h1>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-5">
          <div className="aspect-square size-10">
            <img
              src={loggedInUser.avatar}
              className="aspect-square size-10 rounded-full object-cover ring-1 ring-gray-300"
              alt="user profile"
            />
          </div>
          <input
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="enter comment..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <button
            disabled={postingComment}
            className="w-36 rounded-xl bg-blue-600 px-5 py-2 text-lg font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {postingComment ? (
              <div className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-transparent border-t-white"></div>
            ) : (
              "Post"
            )}
          </button>
        </form>
      ) : (
        <p className="text-gray-600">
          Please{" "}
          <Link to="/login" className="font-bold text-blue-500">
            login
          </Link>{" "}
          to post comments.
        </p>
      )}
      {loading ? (
        <div className="mx-auto size-12 animate-spin rounded-full border-[5px] border-gray-300 border-b-blue-500"></div>
      ) : (
        <div className="flex flex-col">
          {comments.length > 0 &&
            comments.map((comment) => (
              <CommentCard key={comment._id} {...comment} />
            ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
