const express = require("express")
const authMiddleware = require("../middleware/authValidation")
const adminValidation = require("../middleware/authValidation")
const JobService = require("../services/jobs")

function jobs(app){
    const router = express.Router()
    const jobServ = new JobService()

    app.use("/api/jobs",router)
    
    router.get("/", async(req,res) => {
        const jobs = await jobServ.getAll()
        return res.json(jobs)
        
    })

    router.get("/:id", async(req,res) => {
        const jobs = await jobServ.getOne(req.params.id)
        return res.json(jobs)
        
    })

    router.post("/", ...authMiddleware("employer"), async (req,res) => {
        const data = req.body
        data.employer = req.user
        const job = await jobServ.create(data)
        return res.json(job)
    })

    router.put("/apply/:id", ...authMiddleware("applicant"), async (req, res) => {
        const applicant = req.user
        const job = await jobServ.apply(req.params.id, applicant)
        return res.json(job)
    })

    router.get("/category", ...adminValidation("applicant"), async (req, res) => {
        const jobs = await jobServ.getJobByCategory(req.body)
        return res.json(jobs)
    })

    router.get("/location", ...adminValidation("applicant"), async (req, res) => {
        const jobs = await jobServ.getJobByLocation(req.body)
        return res.json(jobs)
    })


}

module.exports = jobs