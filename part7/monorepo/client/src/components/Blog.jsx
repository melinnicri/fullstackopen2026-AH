import { useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import { styles } from '../styles';

const Blog = ({ blog }) => {
    const { likeBlog, deleteBlog } = useContext(BlogContext);

    return (
        <div style={styles.card}>
            <div>
                {blog.content}
                <button 
                    style={{ ...styles.button, marginLeft: '10px' }} 
                    onClick={() => likeBlog(blog)}
                >
                    Like
                </button>
            </div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={() => deleteBlog(blog.id)}>Eliminar</button>
            </div>
        </div>
    );
};

export default Blog