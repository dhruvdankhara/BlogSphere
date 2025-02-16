/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function BlogCard({ _id, title, featureImage, author, createdAt, slug }) {
  return (
    <Link to={`/blog/${slug}`}>
      <div className="mx-auto h-full max-w-md overflow-hidden rounded-2xl bg-white px-5 pt-5 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg md:max-w-lg lg:max-w-xl">
        <img
          src={featureImage}
          alt={title}
          className="aspect-video h-56 w-full rounded-xl object-cover"
        />
        <div className="py-4">
          <div className="mb-2 flex items-center gap-3">
            <img
              src={author.avatar}
              alt={author.username}
              className="h-10 w-10 rounded-full border border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              {author.username}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900 transition-colors hover:text-blue-600 md:text-xl">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(createdAt).toDateString()}
          </p>

          <Link
            to={`/blog/${slug}`}
            className="mt-4 inline-block rounded-lg text-sm font-semibold"
          >
            Read More →
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
