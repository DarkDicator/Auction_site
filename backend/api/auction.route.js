const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()

const user = require('./schemas/user.js')
const validateUser = require('./validationSchemas/validateUser.js')
const { json } = require('express')

const validateReq = (schema) => async (req, res, next) => {
    const reqBody = req.body
    console.log(reqBody)
    try{
        await schema.validate(reqBody)
        next()
    }catch(e){
        res.status(400).json(e.message)
    }
}

router.post('/register', validateReq(validateUser), async (req, res) => {
    console.log(req.body)
    const newUser = new user({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    
    try{
        const addUser = await newUser.save()
        res.status(201).json({message: "User added"})        
    }catch(e){
        res.status(400).json(e.message)
    }
})

router.post('/login', async (req, res) => {
    const User = await user.findOne({email: req.body.email})
    bcrypt.compare(req.body.password, User.password, (err, result) => {
        if(err) res.status(500).json(err)
        if(result){
            const accessToken = jwt.sign(User.toJSON(), process.env.SECRET_ACCESS_TOKEN)
            res.status(200).json({user: User, token: accessToken})
        }else{
            res.status(500).json({message: "Passwords do not match"})
        }
    })
})



module.exports = router