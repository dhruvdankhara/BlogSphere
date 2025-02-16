import { useEffect, useState } from "react";
import { BlogForm } from "../components/index";
import { getPost } from "../api";
import { useParams } from "react-router-dom";

function EditPost() {
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState({});

  const { blogId } = useParams();

  useEffect(() => {
    getPost(blogId)
      .then((response) => {
        console.log("🚀 ~ getPost ~ response:", response);
        setBlogData(response.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h1>Loading</h1>;
  }

  return <BlogForm blogData={blogData} />;
}

export default EditPost;
