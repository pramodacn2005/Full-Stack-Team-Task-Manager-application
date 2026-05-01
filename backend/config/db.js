const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://pramod:Pramod123@ac-bdqrse4-shard-00-00.uvmcrfe.mongodb.net:27017,ac-bdqrse4-shard-00-01.uvmcrfe.mongodb.net:27017,ac-bdqrse4-shard-00-02.uvmcrfe.mongodb.net:27017/?ssl=true&replicaSet=atlas-zh7qym-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
