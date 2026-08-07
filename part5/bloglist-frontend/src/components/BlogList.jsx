import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const BlogList = ({ blogs }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
        <TableHead>
            <TableRow>
            <TableCell>Blog Title</TableCell>
            <TableCell>Author</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
            <TableRow key={blog.id}>
                <TableCell>
                <Link to={`/blogs/${blog.id}`}>
                    {blog.title}
                </Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    );
};

export default BlogList;