import { createContext, useState, useEffect } from 'react';
import blogService from '../services/blogs';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
    blogService.getAll().then(data => setBlogs(data));
    }, []);

    const likeBlog = async (blog) => {
        const updatedBlog = { ...blog, votes: blog.votes + 1 };
        const response = await blogService.update(blog.id, updatedBlog);
        setBlogs(blogs.map(b => b.id !== blog.id ? b : response));
    };

    const deleteBlog = async (id) => {
    await blogService.remove(id);
    setBlogs(blogs.filter(b => b.id !== id));
    };

    return (
        <BlogContext.Provider value={{ blogs, likeBlog, deleteBlog }}>
        {children}
        </BlogContext.Provider>
    );
};