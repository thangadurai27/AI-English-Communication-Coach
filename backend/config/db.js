import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    // Don't exit - let the app run without DB for now
    console.log('⚠️ Continuing without database connection...');
  }
};

export default connectDB;
