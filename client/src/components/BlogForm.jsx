import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LuImage } from "react-icons/lu";
import { createPost, editPost } from "../api";
import { Container, Button, Input } from "./index";
import Editor from "./Editor";
import { v4 as uuidv4 } from "uuid";

function BlogForm({ blogData }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(blogData?.content || "");
  const isEdit = blogData ? true : false;

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const { handleSubmit, register, setValue, watch } = useForm();

  const featureImage = watch("featureImage");

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setValue("featureImage", e.target.files[0]);
    }
  };

  const submit = async ({ title, featureImage }) => {
    if (isEdit) {
      const editPostToast = toast.loading("Updating blog post...");
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (featureImage) {
        formData.append("featureImage", featureImage);
      }

      try {
        const response = await editPost({
          blogId: blogData.slug,
          data: formData,
        });
        console.log("🚀 ~ handleSubmit ~ response:", response);

        toast.success("Blog post Updated successfully.", {
          id: editPostToast,
        });
        navigate(`/blog/${response.data.slug}`);
      } catch (error) {
        console.log("🚀 ~ edit post submit ~ error:", error);

        toast.error(
          error.response?.data?.message || "Error in blog post editing.",
          {
            id: editPostToast,
          }
        );
      } finally {
        setLoading(false);
      }
    } else {
      const postingToast = toast.loading("Uploading blog post...");
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", uuidv4());
      formData.append("content", content);
      formData.append("featureImage", featureImage);

      try {
        const response = await createPost(formData);
        console.log("🚀 ~ create post submit ~ response:", response);

        toast.success("Blog post Uploaded successfully.", {
          id: postingToast,
        });
        navigate(`/blog/${response.data.slug}`);
      } catch (error) {
        console.log("🚀 ~ create post submit ~ error:", error);

        toast.error(
          error.response?.data?.message || "Error in blog post uploading.",
          {
            id: postingToast,
          }
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="my-10">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold">Create a New Blog Post</h1>
          <form className="space-y-4" onSubmit={handleSubmit(submit)}>
            <Input
              label="Title"
              placeholder="Enter your blog post title"
              {...register("title", {
                required: true,
                value: blogData?.title || "",
              })}
            />

            <Editor value={content} setValue={setContent} />

            <div>
              <label htmlFor="featureImage">Feature Image</label>
              <div className="mt-1 flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex w-full items-center justify-center border border-gray-300 bg-white text-zinc-900 shadow-sm hover:bg-slate-200/70"
                >
                  <LuImage className="mr-2 h-4 w-4" />
                  {featureImage ? "Change Image" : "Upload Image"}
                </Button>

                {featureImage && (
                  <Button
                    type="button"
                    onClick={() => {
                      setValue("featureImage", null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="flex items-center justify-center border border-gray-300 bg-white text-zinc-900 shadow-sm hover:bg-slate-200/70"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                id="featureImage"
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="mt-4 rounded-xl border-2 px-5 py-3">
                {featureImage && (
                  <>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Selected file: {featureImage.name}
                    </p>
                    <img
                      className="mx-auto aspect-video h-96 w-5/6 rounded-lg bg-cover object-cover"
                      src={URL.createObjectURL(featureImage)}
                      alt=""
                    />
                  </>
                )}
                {blogData && !featureImage ? (
                  <img
                    className="mx-auto aspect-video h-96 w-5/6 rounded-lg bg-cover object-cover"
                    src={blogData.featureImage}
                    alt=""
                  />
                ) : null}
              </div>
            </div>
            <Button
              type="submit"
              className="flex w-full items-center justify-center bg-zinc-800 hover:bg-zinc-900"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block size-6 animate-spin rounded-full border-4 border-e-slate-700"></span>
              ) : isEdit ? (
                "Update Post"
              ) : (
                "Publish Post"
              )}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default BlogForm;
