import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api/v1" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const login = (formData) => API.post("users/login", formData);
export const signup = (formData) => API.post("users/register", formData);

export const getPost = (search, page) =>
  API.get(`posts?searchQuery=${search}&page=${page}`);
export const getPostById = (id) => API.get(`posts/${id}`);
export const createPost = (formData) => API.post("posts", formData);
export const updatePost = (id, formData) => API.patch(`posts/${id}`, formData);
export const deletePost = (id) => API.delete(`posts/${id}`);

export const getCategory = () => API.get("categories");
export const createCategory = (formData) => API.post("categories", formData);
export const updateCategory = (id, formData) =>
  API.patch(`categories/${id}`, formData);
export const deleteCategory = (id) => API.delete(`categories/${id}`);

export const getTag = () => API.get("tags");
export const createTag = (formData) => API.post("tags", formData);
export const updateTag = (id, formData) => API.patch(`tags/${id}`, formData);
export const deleteTag = (id) => API.delete(`tags/${id}`);

export const getComments = () => API.get("comments");
export const createComment = (formData) => API.post("comments", formData);
export const updateComments = (id) => API.patch(`comments/${id}`);
export const deleteComment = (id) => API.delete(`comments/${id}`);
