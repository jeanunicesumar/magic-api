import mongoose from "mongoose";
import { Role } from "../../src/users/roles/role";

export const users = [
    {
        _id: new mongoose.Types.ObjectId('64b43c6d5b6e3c8f1a2d3e4f'),
        email: 'jean@gmail.com',
        username: 'jean',
        password: '$2b$10$.wbjAJ/6t2trWkIPxl4i/OqKzSuktjzzraaSOoejXlmT8YEhSlln6',
        role: Role.ADMIN,
    },
    {
        _id: new mongoose.Types.ObjectId('64b43c6d5b6e3c8f1a2d3e50'),
        email: 'carlos@gmail.com',
        username: 'carlos',
        password: '$2b$10$.wbjAJ/6t2trWkIPxl4i/OqKzSuktjzzraaSOoejXlmT8YEhSlln6',
        role: Role.GUEST,
    },
    {
        _id: new mongoose.Types.ObjectId('64b43c6d5b6e3c8f1a2d3e51'),
        email: 'ricardo@gmail.com',
        username: 'ricardo',
        password: '$2b$10$.wbjAJ/6t2trWkIPxl4i/OqKzSuktjzzraaSOoejXlmT8YEhSlln6',
        role: Role.GUEST, 
    },
];