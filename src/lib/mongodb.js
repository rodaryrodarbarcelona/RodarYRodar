import { MongoClient } from 'mongodb';

let client;
let clientPromise;

const uri = import.meta.env.VITE_MONGO_URI;

if (!uri) {
    throw new Error('Please add your Mongo URI to .env');
}

if (process.env.NODE_ENV === 'development') {
    // En desarrollo, usamos una variable global para preservar la conexión entre recargas de HMR
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // En producción, es mejor crear una nueva conexión por solicitud
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
