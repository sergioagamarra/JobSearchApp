const {mongoose} = require("../config/db")

const Schema = mongoose.Schema

const jobSchema = new Schema({
    employer: {
        _id: String,
        name: String,
        email: String,
    },
    description: String,
    title: String,
    applicants: [{
        name: String,
        email: String
    }],
    category: [{
        name: String
    }]
    
})

const JobModel = mongoose.model("Job", jobSchema)

module.exports = JobModel