require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const { userExtractor } = require('./utils/middleware');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => ('¡Conectado a MongoDB Atlas!'))
  .catch((error) => console.error('Error conectando a MongoDB:', error.message));

app.use((req, res, next) => {
  ('Petición recibida:', req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

app.use(userExtractor); 

app.use('/api/blogs', blogsRouter); 
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  (`Servidor corriendo en puerto ${PORT}`);
});