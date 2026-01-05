/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { formatDate } from "../Hooks/FormateDate";

function BlogCard({ _id, title, featureImage, author, createdAt, slug }) {
  return (
    <Link to={`/blog/${slug}`} key={_id}>
      <div className="mx-auto h-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pt-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:max-w-lg lg:max-w-xl">
        <img
          src={featureImage}
          alt={title}
          className="aspect-video h-56 w-full rounded-xl object-cover ring-1 ring-gray-200"
        />
        <div className="py-5">
          <div className="mb-3 flex items-center gap-3">
            <img
              src={author.avatar}
              alt={author.username}
              className="h-10 w-10 rounded-full border-2 border-gray-200 ring-2 ring-gray-100"
            />
            <span className="text-sm font-medium text-gray-700">
              {author.username}
            </span>
          </div>

          <h2 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors hover:text-blue-600 md:text-xl">
            {title}
          </h2>

          <p className="mt-2 text-sm text-gray-600">{formatDate(createdAt)}</p>

          <Link
            to={`/blog/${slug}`}
            className="mt-4 inline-block rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600"
          >
            Read More →
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
