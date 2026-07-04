import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const Blog = ({ blog, updateLikes, deleteBlog, currentUser }) => {

  const handleLike = () => {
    // Tu lógica de userId está perfecta, mantenla igual
    const userId = blog.user && typeof blog.user === 'object' ? (blog.user.id || blog.user._id) : blog.user;
    updateLikes(blog.id, {
      user: userId,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    });
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  // Lógica de permisos simplificada
  const canDelete = currentUser && (
    (blog.user?.id || blog.user?._id || blog.user) === currentUser.id ||
    blog.user?.username === currentUser.username
  );

  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography color="text.secondary">por {blog.author}</Typography>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Likes: {blog.likes}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={handleLike}>Like</Button>
        {canDelete && (
          <Button size="small" variant="outlined" color="error" onClick={handleRemove}>
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Blog;