// src/lib/mongodb.js
import { MongoClient } from 'mongodb';
import { Alert } from 'react-native';


const MONGODB_URI = "mongodb+srv://abhinavbirajdar28:<db_password>@cluster1.e0odslf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";


const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

// In development, use a global variable to maintain connection across hot-reloads
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

// Helper function to get a database connection
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("shesafe"); // Replace with your database name
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    Alert.alert(
      "Connection Error",
      "Unable to connect to the database. Please check your internet connection."
    );
    throw error;
  }
}

// User-related database functions
export const userService = {
  // Create a new user
  async createUser(userData) {
    const { db } = await connectToDatabase();
    const users = db.collection("users");
    
    // Check if user with this email already exists
    const existingUser = await users.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("A user with this email already exists");
    }
    
    // Add created timestamp
    const userToInsert = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await users.insertOne(userToInsert);
    return result;
  },
  
  // Find user by email and password (for sign-in)
  async findUserByCredentials(email, password) {
    const { db } = await connectToDatabase();
    const users = db.collection("users");
    
    // In a real app, you should never store plaintext passwords
    // This is just for demonstration - use proper password hashing!
    const user = await users.findOne({ email, password });
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    // Don't return the password to the client
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  // Update user profile
  async updateUser(userId, updateData) {
    const { db } = await connectToDatabase();
    const users = db.collection("users");
    
    const result = await users.updateOne(
      { _id: userId },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        } 
      }
    );
    
    return result;
  }
};