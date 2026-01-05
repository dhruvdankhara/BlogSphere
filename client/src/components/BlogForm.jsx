/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuImage, LuSparkles } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";
import { createPost, editPost, generateImageApi } from "../api";
import { Container } from "./index";
import RichEditor from "./RichEditor.jsx";

function BlogForm({ blogData }) {
  const isEdit = blogData ? true : false;

  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const [title, setTitle] = useState(blogData?.title || "");
  const [content, setContent] = useState(blogData?.content || "");
  const [featureImage, setFeatureImage] = useState();
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFeatureImage(e.target.files[0]);
      setGeneratedImageUrl("");
    }
  };

  const handleGenerateImage = async () => {
    const prompt = (title || "").trim();

    if (!prompt) {
      toast.error("Please enter a title first.");
      return;
    }

    const genToast = toast.loading("Generating image...");
    setGeneratingImage(true);

    try {
      const response = await generateImageApi(prompt);
      const url = response?.data?.imageUrl;

      if (!url) {
        throw new Error("No image URL returned");
      }

      setGeneratedImageUrl(url);
      setFeatureImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Image generated.", { id: genToast });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to generate image";
      toast.error(message, { id: genToast });
      console.log("🚀 ~ generate image ~ error:", error);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      const editPostToast = toast.loading("Updating blog post...");
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (featureImage) {
        formData.append("featureImage", featureImage);
      } else if (generatedImageUrl) {
        formData.append("featureImageUrl", generatedImageUrl);
      }

      try {
        const response = await editPost({
          blogId: blogData?.slug,
          data: formData,
        });

        toast.success("Blog post Updated successfully.", {
          id: editPostToast,
        });
        navigate(`/blog/${response.data.slug}`);
      } catch (error) {
        console.log("🚀 ~ edit post submit ~ error:", error);

        toast.error(error.response.data.message, {
          id: editPostToast,
        });
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

      if (featureImage) {
        formData.append("featureImage", featureImage);
      } else if (generatedImageUrl) {
        formData.append("featureImageUrl", generatedImageUrl);
      }

      try {
        const response = await createPost(formData);

        toast.success("Blog post Uploaded successfully.", {
          id: postingToast,
        });
        navigate(`/blog/${response.data.slug}`);
      } catch (error) {
        toast.error(error.response.data.message, {
          id: postingToast,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="my-10">
      <Container>
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Blog Post" : "Create a New Blog Post"}
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={"title"}
                    className="text-base font-medium capitalize text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type={"text"}
                    placeholder="Enter your blog post title"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    id={"title"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={"content"}
                    className="text-base font-medium capitalize text-gray-700"
                  >
                    Content
                  </label>
                  <RichEditor value={content} setValue={setContent} />
                </div>
              </div>

              <div>
                <label
                  htmlFor="featureImage"
                  className="text-base font-medium capitalize text-gray-700"
                >
                  Feature Image
                </label>

                <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <LuSparkles className="h-4 w-4 text-blue-700" />
                    <p className="text-sm font-semibold text-blue-900">
                      AI image generation
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-blue-800/80">
                    Generate a cover image from the title above.
                  </p>

                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex flex-col gap-2 md:flex-row">
                      <button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={generatingImage || !title.trim()}
                        className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                      >
                        {generatingImage ? (
                          <span className="inline-block size-6 animate-spin rounded-full border-4 border-transparent border-t-white"></span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <LuSparkles className="h-4 w-4" />
                            Generate Image
                          </span>
                        )}
                      </button>

                      {generatedImageUrl && (
                        <button
                          type="button"
                          onClick={() => setGeneratedImageUrl("")}
                          className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:bg-gray-50 md:text-base"
                        >
                          Remove Generated
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:bg-gray-50 md:text-base"
                  >
                    <LuImage className="mr-2 h-4 w-4" />
                    {featureImage ? "Change Image" : "Upload Image"}
                  </button>

                  {(featureImage || generatedImageUrl) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFeatureImage(null);
                        setGeneratedImageUrl("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:bg-gray-50 md:text-base"
                    >
                      Remove
                    </button>
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

                {featureImage && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file:{" "}
                      <span className="text-gray-900">{featureImage.name}</span>
                    </p>
                    <img
                      className="mx-auto aspect-video h-80 w-full rounded-lg object-cover ring-1 ring-gray-200"
                      src={URL.createObjectURL(featureImage)}
                      alt="Selected feature"
                    />
                  </div>
                )}

                {generatedImageUrl && !featureImage && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
                    <p className="mt-2 text-sm text-gray-600">
                      Using generated image
                    </p>
                    <img
                      className="mx-auto aspect-video h-80 w-full rounded-lg object-cover ring-1 ring-gray-200"
                      src={generatedImageUrl}
                      alt="Generated cover"
                    />
                  </div>
                )}

                {blogData && !featureImage && !generatedImageUrl && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
                    <img
                      className="mx-auto aspect-video h-80 w-full rounded-lg object-cover ring-1 ring-gray-200"
                      src={blogData.featureImage}
                      alt="Current feature"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex w-full justify-stretch md:justify-end">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-72 md:text-base"
                disabled={loading || generatingImage}
              >
                {loading ? (
                  <span className="inline-block size-6 animate-spin rounded-full border-4 border-transparent border-t-white"></span>
                ) : isEdit ? (
                  "Update Post"
                ) : (
                  "Publish Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default BlogForm;
