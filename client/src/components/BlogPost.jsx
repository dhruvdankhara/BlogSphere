/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import parse from "html-react-parser";
import { marked } from "marked";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { Comment, LikeBtn } from "./index";
import { deletePost, getUserProfile } from "../api/index";
import { formatDate } from "../Hooks/FormateDate";

function BlogPost({
  title,
  featureImage,
  content,
  author,
  _id,
  createdAt,
  slug,
  visits,
  isLiked,
  likes,
  setPost,
  comments,
}) {
  const [deletingPost, setDeletingPost] = useState(false);

  const user = useSelector((state) => state.auth.data);
  const navigate = useNavigate();

  const handleDeletePost = async () => {
    const deleteBlogToast = toast.loading("Deleting Blog Post...");
    setDeletingPost(true);

    try {
      await deletePost(slug);

      toast.success("Blog Post deleted successfully.", {
        id: deleteBlogToast,
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message, {
        id: deleteBlogToast,
      });
    } finally {
      setDeletingPost(false);
    }
  };

  useEffect(() => {
    getUserProfile(author.username).then((response) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      author = response.data;
    });
  }, []);

  return (
    <div className="my-5">
      <div className="flex flex-col gap-8">
        {author._id == user._id && (
          <div className="flex items-center gap-4 rounded-3xl border border-gray-300 bg-gray-100 p-4 shadow">
            <button
              onClick={() => navigate(`/blog/edit/${slug}`)}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 md:text-base"
            >
              Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 md:text-base"
              disabled={deletingPost}
            >
              {deletingPost ? (
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-e-blue-700"></div>
              ) : (
                "Delete"
              )}
            </button>
            <p className="text-gray-600">*This button only displays to you.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h1 className="truncat text-wrap text-5xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="flex items-center justify-start gap-2">
            <FaRegEye className="h-5 w-5" />{" "}
            <p>
              <span className="font-semibold">{visits}</span> views
            </p>
          </p>
          <p className="text-lg font-semibold text-gray-600">
            {formatDate(createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-5 flex border-b border-t border-gray-300">
              <LikeBtn
                _id={_id}
                isLiked={isLiked}
                likes={likes}
                setPost={setPost}
              />
              <a href="#comments" className="flex gap-2 p-5">
                <MdOutlineComment className="h-7 w-7" />
                <p className="text-lg font-bold text-gray-700">{comments}</p>
              </a>
            </div>
            <img
              className="mx-auto aspect-video rounded-2xl object-cover ring-1 ring-gray-300"
              src={featureImage}
              alt={title}
            />
            <div className="post-content mb-10 text-gray-800">
              {parse(marked.parse(content))}
            </div>
            <Comment
              {...{ title, featureImage, content, author, _id, slug, visits }}
            />
          </div>

          <div className="col-span-1">
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
              <p className="text-gray-600">Author</p>
              <Link
                to={`/u/${author.username}`}
                className="flex items-center gap-4"
              >
                <img
                  className="h-12 w-12 rounded-2xl object-cover ring-1 ring-gray-300"
                  src={author.avatar}
                  alt=""
                />
                <div>
                  <p className="font-bold text-gray-900">{author.name}</p>
                  <p className="font-light text-gray-600">@{author.username}</p>
                </div>
              </Link>
              <div>
                <div className="flex gap-5 text-center">
                  <p>
                    <span className="font-bold text-gray-900">
                      {author.posts}
                    </span>
                    <br />
                    <span className="text-gray-600">Posts</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-900">
                      {author.followers}
                    </span>
                    <br />
                    <span className="text-gray-600">Followers</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-900">
                      {author.following}
                    </span>
                    <br />
                    <span className="text-gray-600">Following</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
