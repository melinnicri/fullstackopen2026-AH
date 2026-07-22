import Book from './models/book.js';
import Author from './models/author.js';
import User from './models/user.js';
import bcrypt from 'bcrypt';         
import jwt from 'jsonwebtoken';    
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
    Query: {
        allBooks: async (root, args) => {
            let query = Book.find({});
            if (args.genre) {
                query = query.find({ genres: { $in: [args.genre] } });
            }
            return query;
        },
        allAuthors: async () => {
            return Author.find({});
        },
    },

    Book: {
        author: async (root, args, context) => {
            return context.authorLoader.load(root.author);
        },
    },

    Mutation: {
        addBook: async (root, args, context) => {
            let author = await Author.findOne({ name: args.author });
            if (!author) {
                author = new Author({ name: args.author });
                await author.save();
            }
            const book = new Book({ ...args, author: author._id });
            await book.save();
            
            const savedBook = book.toObject();
            savedBook.author = author;

            pubsub.publish('BOOK_ADDED', { bookAdded: savedBook });
            
            return savedBook;
        },
        
        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name });
            if (!author) return null;
            author.born = args.setBornTo;
            return author.save();
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            const passwordCorrect = user === null
                ? false
                : await bcrypt.compare(args.password, user.passwordHash);

            if (!(user && passwordCorrect)) {
                throw new Error("credenciales inválidas");
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
        },
    },
    
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
        },
    },
};

export default resolvers;