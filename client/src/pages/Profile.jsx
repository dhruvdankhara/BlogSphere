import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getUserPosts, getUserProfile } from "../api/index";
import {
  Container,
  BlogCard,
  LogoutBtn,
  FollowBtn,
  Loader,
} from "../components/index";

function Profile() {
  const { username } = useParams();

  const [userData, setUserData] = useState({});
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stateUserData = useSelector((state) => state.auth.data);

  useEffect(() => {
    (async () => {
      try {
        const [userProfileResponse, userPostResponse] = await Promise.all([
          getUserProfile(username),
          getUserPosts(username),
        ]);

        setUserData(userProfileResponse.data);
        setBlogs(userPostResponse.data);
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="my-10">
        <Container>
          <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-700">
            <p className="text-center text-2xl font-bold">{error}</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="my-10">
      <Container>
        <div className="">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <div className="sticky top-40 flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-md md:items-start">
                <div>
                  <img
                    className="h-24 w-24 rounded-full ring-2 ring-gray-300"
                    src={userData.avatar}
                    alt={userData.name}
                  />
                </div>
                <div className="flex flex-col items-center gap-1 md:items-start">
                  <p className="text-2xl font-bold text-gray-900">
                    {userData.name}
                  </p>
                  <p className="text-base text-gray-600">
                    @{userData.username}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="text-gray-700">
                    <span className="font-bold text-gray-900">
                      {userData.followers}{" "}
                    </span>
                    Followers
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-gray-900">
                      {userData.following}{" "}
                    </span>
                    Following
                  </p>
                </div>
                {userData._id == stateUserData._id ? (
                  <div className="flex gap-3">
                    <Link
                      className="rounded-2xl bg-blue-600 px-5 py-2 font-semibold text-white transition-all duration-300 hover:bg-blue-700"
                      to={`/edit-user`}
                    >
                      Edit
                    </Link>
                    <LogoutBtn />
                  </div>
                ) : (
                  <FollowBtn userData={userData} setUserData={setUserData} />
                )}
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-1 gap-5 md:col-span-2">
              <h3 className="text-4xl font-bold">Recent Posts</h3>
              <div>
                {blogs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {blogs.map((blog) => (
                      <BlogCard key={blog._id} {...blog} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
                    <p className="text-center text-3xl font-bold text-gray-700">
                      No Post Found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Profile;
