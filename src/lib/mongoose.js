import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env.VITE_MONGO_URI;

if (!MONGODB_URI) {
    throw new Error('Por favor, define la variable VITE_MONGO_URI en el archivo .env');
}

/**
 * Variable global para mantener la conexión en desarrollo
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
