import { useEffect, useState } from "react";
import { BlogCard, Container } from "../components";
import { searchPost } from "../api/index.js";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;
    setLoading(true);
    searchPost(debouncedSearch)
      .then((response) => setPosts(response.data))
      .catch((error) => console.log("search error:", error))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  return (
    <div className="mt-8">
      <Container>
        <div className="flex flex-col space-y-6">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="search"
                className="text-3xl font-bold leading-none text-gray-900"
              >
                Search
              </label>
              <input
                onChange={(e) => setQuery(e.target.value)}
                type={"text"}
                value={query}
                className="focus-visible:ring-ring flex h-11 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-1 text-xl shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 md:text-sm"
                placeholder="Search for posts"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex h-full animate-pulse flex-col justify-between gap-5 rounded-3xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="h-10 w-40 animate-pulse rounded-md bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="h-10 w-full animate-pulse rounded-2xl bg-gray-300"></div>
                    <div className="h-10 w-full animate-pulse rounded-2xl bg-gray-300"></div>
                    <div className="h-10 w-full animate-pulse rounded-2xl bg-gray-300"></div>
                  </div>
                  <div className="h-52 w-full animate-pulse rounded-2xl bg-gray-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-full gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post._id} className="mb-4">
                  <BlogCard {...post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Search;
