import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogForm, Loader } from "../components/index";
import { getPost } from "../api";

function EditPost() {
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState({});

  const { blogId } = useParams();

  useEffect(() => {
    getPost(blogId)
      .then((response) => {
        setBlogData(response.data);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <BlogForm blogData={blogData} />;
}

export default EditPost;
