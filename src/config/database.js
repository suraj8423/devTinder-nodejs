const {mongoose} = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://NodesProject:Password%40123@nodeproject.agk14.mongodb.net/devTinder')
}

module.exports = {connectDB}