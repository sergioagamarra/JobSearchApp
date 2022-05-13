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

    async getOne(id){
        try {
            const job = await JobModel.findById(id)
            return job
        } catch (error) {
            console.log(error);
        }
    }

    async create(data){
        try { 
            data.category = this.#toLowerCaseList(data.category)
            const job = await JobModel.create(data)
            return job
        } catch (error) {
            console.log(error);
        }
    }

    async apply(id, data){
        try {
            const validationJob = await this.#validationJob(id)
            const validationApplicant = await this.#validationApplicant(id, data.id)
            if (!validationJob.status){
                if(!validationApplicant.status){
                    const job = await JobModel.findByIdAndUpdate(id, { $push: {applicants: data}}, {new:true})
                    return job
                }
                return {
                    error: validationApplicant.status,
                    message: validationApplicant.message
                } 
                
            }
            return {
                error: validationJob.status,
                message: validationJob.message
            } 
        } catch (error) {
            console.log(error);
        }
    }

    async getJobByCategory(categories){
        try {
            categories.category = this.#toLowerCaseList(categories.category)
            const jobs = await JobModel.find({
                category: {
                    $all: categories.category
                }
            })
            if (jobs[0]) {
                return jobs
            }
            return {
                message: "There are no jobs for those categories"
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getJobByLocation(location){
        try {
            let jobs
            if (location.country){
                jobs = await JobModel.find({
                    "location.country": location.country
                })
            }
            if (location.province){
                jobs = await JobModel.find({
                    "location.province": location.province
                })
            }
            if (location.city){
                jobs = await JobModel.find({
                    "location.city": location.city
                })
            }
            /* console.log(data.country); */
            /* const jobs = await JobModel.find({location})
            console.log(jobs); */
            if (jobs[0]) {
                return jobs
            }
            return {
                message: "There are no jobs for those locations"
            }
        } catch (error) {
            console.log(error);
        }
    }

    async #validationJob(id){
        try {
            const job = await JobModel.findById(id)
            if (job) {
                return {
                    status: false,
                    message: ""
                }
            }
            return {
                status: true,
                message: "The job doesn't exist"
            }
            
        } catch (error) {
            console.log("error catch", error);
        }
    }

    async #validationApplicant(idJob, idApplicant){
        try {
            /* const applicant = await JobModel.findOne({_id: idJob, applicants: {$all: [{id: idApplicant}]}}) */
            const applicant = await JobModel.findById(idJob)
            let band = false
            applicant.applicants.forEach(a => {
                if(a.id === idApplicant){
                    band = true
                }
            });
            if (band){
                return {
                    status: true,
                    message: "You are already applied to the job"
                }
            }
            return {
                status: false,
                message: ""
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    #toLowerCaseList(category){
        for (let i = 0; i < category.length; i++) {
            category[i] = category[i].toLowerCase()
        }
        return category
    }
}

module.exports = Job