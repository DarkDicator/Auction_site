const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required:true, index:{unique: true}},
    password: {type: String, required:true}
})

userSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        return next()
    }catch(e){
        return next(e)
    }
    
})

module.exports = mongoose.model('users', userSchema)