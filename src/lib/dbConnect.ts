import mongoose from "mongoose";

type connectionObject={
    isConnected?: number
}

const connection:connectionObject = {}

async function dbConnect (): Promise<void>{
    if(connection.isConnected){
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI!)
        connection.isConnected = db.connections[0].readyState
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("Error connecting to MongoDB: " + error)
        process.exit(1)
    }
}

export default dbConnect