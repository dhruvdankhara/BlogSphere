import Yup from "yup";

export const createBlogPostSchema = Yup.object().shape({
  title: Yup.string().required(),
  content: Yup.string().required(),
  slug: Yup.string().required(),
});
