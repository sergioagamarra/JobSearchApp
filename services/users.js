const UserModel = require("../models/user")

class User{
    
    async getAll(){
        try {
            const users = await UserModel.find()
            return users
        } catch (error) {
            console.log(error);
        }
    }

    async create(data){
        try { 
            const user = await UserModel.create(data)
            return user
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

    async update(id, data){
        try {
            const user = await UserModel.findByIdAndUpdate(id, data, {new:true})
            return user
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id){
        try {
            const user = await UserModel.findByIdAndDelete(id)
            return user
        } catch (error) {
            console.log(error);
        }
    }

    async getByEmail(email){
        try {
            const user = await UserModel.findOne({email})
            return user  
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = User