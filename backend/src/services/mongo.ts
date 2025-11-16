// src/services/mongo.ts
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri: string = process.env.MONGO_URI ?? '';
const dbName = process.env.MONGO_DB || 'datapulse';

if (!uri) throw new Error('MONGO_URI is not set');

let client: MongoClient;
let db: Db;

export async function connectMongo() {
  if (db) return db;
  client = new MongoClient(uri, { connectTimeoutMS: 10000 });
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB: ${dbName}`);
  return db;
}

export function getDb() {
  if (!db) throw new Error('Mongo not initialized. Call connectMongo() first.');
  return db;
}

export async function closeMongo() {
  await client?.close();
}
