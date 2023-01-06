const mongoose = require('mongoose')
const mongoURL = "mongodb+srv://histmetadata:Heidenhain@histology-metadata.gtdly.mongodb.net/?retryWrites=true&w=majority"
// const mongoURL = "mongodb://localhost:27017/histDB"
module.exports = async () => {
    await mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology : true
    })

    return mongoose
}