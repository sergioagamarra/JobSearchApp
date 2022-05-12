const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config")

function authValidation(req, res, next){
    const bearer = req.headers.authorization
    if (bearer && bearer.startsWith("Bearer")){
        const [,token] = bearer.split("Bearer ")
        if (token){
            try {
                const decoded = jwt.verify(token, jwtSecret)
                req.user = decoded
                return next()
            } catch ({name, message}) {
                if (name){
                    return res.status(403).json({
                        error: true,
                        type: name,
                        message
                    })
                }
            } 
        }
    }
    return res.status(403).json({
        error: true,
        message: "Insufficient permissions"
    })
}

function adminValidation(req, res, next){
    if(req.user.role === "admin"){
        return next()
    } else{
        return res.status(403).json({
            error: true,
            message: "Insufficient permissions"
        })
    }
}

function applicantValidation(req, res, next){
    if(req.user.role === "applicant"){
        return next()
    } else{
        return res.status(403).json({
            error: true,
            message: "Insufficient permissions"
        })
    }
}

function employerValidation(req, res, next){
    if(req.user.role === "employer"){
        return next()
    } else{
        return res.status(403).json({
            error: true,
            message: "Insufficient permissions"
        })
    }
}

function employerAdminValidation(req, res, next){
    if(req.user.role === "employer" || req.user.role === "admin"){
        return next()
    } else{
        return res.status(403).json({
            error: true,
            message: "Insufficient permissions"
        })
    }
}

function authMiddleware(type){
    let middlewares
    if(type === "employer"){
        middlewares = [authValidation,employerValidation]
    } else if(type === "employer-admin"){
        middlewares = [authValidation,employerAdminValidation]
    } else if(type === "applicant"){
        middlewares = [authValidation,applicantValidation]
    } else if(type === "admin"){
        middlewares = [authValidation,adminValidation]
    } else{
        middlewares = []
    }

    return middlewares
}

module.exports = authMiddleware
