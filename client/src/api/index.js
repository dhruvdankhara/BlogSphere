import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 60000,
  withCredentials: true,
});

// Auth api calles

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

export const registerUser = async ({ name, username, email, password }) => {
  const response = await apiClient.post("/auth/register", {
    name,
    username,
    email,
    password,
  });
  return response.data;
};

export const getLogedInUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  const response = await apiClient.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};

// user profile calles

export const getUserProfile = async (username) => {
  const response = await apiClient.get(`/user/${username}`);
  return response.data;
};

export const updateUser = async (data) => {
  const response = await apiClient.post("/auth/update-user", data);
  return response.data;
};

export const updateAvatar = async (image) => {
  const response = await apiClient.post("/auth/update-avatar", image);
  return response.data;
};

// Blog releted calles

export const getPosts = async () => {
  const response = await apiClient.get("/blog");
  return response.data;
};

export const getPost = async (blogId) => {
  const response = await apiClient.get(`/blog/${blogId}`);
  return response.data;
};

export const getUserPosts = async (username) => {
  const response = await apiClient.get(`/user/${username}/blogs`);
  return response.data;
};

export const createPost = async (data) => {
  const response = await apiClient.post("/blog", data);
  return response.data;
};

export const deletePost = async (blogId) => {
  const response = await apiClient.delete(`/blog/${blogId}`);
  return response.data;
};

export const editPost = async ({ blogId, data }) => {
  const response = await apiClient.post(`/blog/${blogId}`, data);
  return response.data;
};

export const getPopularPost = async () => {
  const response = await apiClient.get("/blog/popular");
  return response.data;
};

// comment

export const createComment = async ({ blogId, content }) => {
  const response = await apiClient.post(`/blog/${blogId}/comment`, { content });
  return response.data;
};

export const getPostComments = async (blogId) => {
  const response = await apiClient.get(`/blog/${blogId}/comment`);
  return response.data;
};

export const followUser = async (username) => {
  const response = await apiClient.post(`/user/${username}/follow`);
  return response.data;
};

export const unfollowUser = async (username) => {
  const response = await apiClient.post(`/user/${username}/unfollow`);
  return response.data;
};

export const likeBlogPost = async (blogId) => {
  const response = await apiClient.post(`/blog/${blogId}/like`);
  return response.data;
};

export const unlikeBlogPost = async (blogId) => {
  const response = await apiClient.post(`/blog/${blogId}/unlike`);
  return response.data;
};

export const searchPost = async (query) => {
  const response = await apiClient.get(`/blog/search/${query}`);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await apiClient.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};

export default apiClient;
