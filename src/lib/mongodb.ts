import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) throw new Error('Please add MONGODB_URI to .env')

const uri = process.env.MONGODB_URI
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDb() {
  const c = await clientPromise
  return c.db(process.env.MONGODB_DB || 'finance')
}
