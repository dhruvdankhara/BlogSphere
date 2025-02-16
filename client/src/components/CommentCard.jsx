import React from "react";
import { Link } from "react-router-dom";

export default function CommentCard({ createdAt, content, author, _id }) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()]; // Get month name
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  return (
    <div className="flex w-full gap-3 p-3" key={_id}>
      <div className="aspect-square size-11">
        <img
          src={author.avatar}
          className="aspect-square rounded-full object-cover"
          alt="user profile "
        />
      </div>
      <div className="flex w-full flex-col gap-3 rounded-md border px-3 py-5">
        <p>
          <Link
            to={`/u/${author.username}`}
            className="inline rounded-md p-2 text-lg font-semibold transition-all duration-200 hover:bg-gray-200"
          >
            @{author.username}
          </Link>
          <span>{formatDate(createdAt)}</span>
        </p>
        <p className="p-2 text-xl font-normal">{content}</p>
      </div>
    </div>
  );
}
