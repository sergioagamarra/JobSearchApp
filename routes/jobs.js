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

    router.post("/", async(req,res) => {
        const job = await jobServ.create(req.body)
        return res.json(job)
    })

    router.put("/apply/:id", async(req, res) => {
        const job = await jobServ.apply(req.params.id, req.body)
        return res.json(job)
    })

    /* router.put("/:id", async (req,res)=>{
        const user = await userServ.update(req.params.id, req.body)
        return res.json(user)
    })

    router.delete("/:id", async (req,res)=>{
        const user = await userServ.delete(req.params.id)
        return res.json(user)
    }) */
}

module.exports = jobs