import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import { createAuthorLoader } from './loader.js';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
import bcrypt from 'bcrypt';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

async function startServer() {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a MongoDB exitosamente');

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminUsername && adminPassword) {
            const existingUser = await User.findOne({ username: adminUsername });
            if (!existingUser) {
                const saltRounds = 10;
                const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
                
                const newUser = new User({
                    username: adminUsername,
                    passwordHash,
                });

                await newUser.save();
                console.log(`Usuario administrador '${adminUsername}' creado automáticamente.`);
            }
        }

    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }

    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(cors());
    app.use(express.json());

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }) => {
                const auth = req ? req.headers.authorization : null;
                let currentUser = null;

                if (auth && auth.startsWith('Bearer ')) {
                    try {
                        const decodedToken = jwt.verify(
                            auth.substring(7), 
                            process.env.JWT_SECRET
                        );
                        currentUser = await User.findById(decodedToken.id);
                    } catch (error) {
                    }
                }

                return {
                    user: currentUser,
                    authorLoader: createAuthorLoader(),
                };
            },
        })
    );

    const PORT = 4000;
    
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Servidor listo en http://localhost:${PORT}/graphql`);
}

startServer();