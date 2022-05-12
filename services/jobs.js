const res = require("express/lib/response");
const JobModel = require("../models/job")

class Job{

    async getAll(){
        try {
            const jobs = await JobModel.find()
            return jobs
        } catch (error) {
            console.log(error);
        }
    }

    async create(data){
        try { 
            const job = await JobModel.create(data)
            return job
        } catch (error) {
            if (error.code === 11000){
                const message = `El "${error.keyValue.email}" ya esta en uso`
                return {
                    error: true,
                    message
                } 
            }
           
        }
    }

    async apply(id, data){
        try {
            const job = await JobModel.findByIdAndUpdate(id, { $push: {applicants: data}}, {new:true})
            return job
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Job