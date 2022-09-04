const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()

const user = require('./schemas/user.js')
const item = require('./schemas/item.js')
const validateUser = require('./validationSchemas/validateUser.js')



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

router.post('/items', authenticateToken, async (req, res) => {
    const newItem = new item({
        name: req.body.name,
        image: req.body.image || null,
        price: req.body.price,
        userId: req.user._id
    })

    try{
        const addItem = await newItem.save()
        res.status(201).json({message: "Item added"})        
    }catch(e){
        res.status(400).json(e.message)
    }
})

router.get('/items', authenticateToken, async (req, res) => {
    const itemsPerPage = 10
    const page = req.query.page ? parseInt(req.query.page, 10) : 0
    let cursor

    try{
        cursor = await item.find().limit(itemsPerPage).skip(itemsPerPage * page)
    }catch(e){
        res.status(500).json(e.message)
    }

    try{
        const itemList = cursor
        res.status(200).json({items: itemList})
    }catch(e){
        res.status(500).json(e.message)
    }
    
    
})


function authenticateToken(req, res, next){
    const authHeader= req.headers["authorization"]
    const token = authHeader
    console.log(token)
    if (token == null) return res.status(401).json({message: "Token not provided"})

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (e, user) => {
        if(e) return res.status(401).json({message: e.message})
        console.log(user)
        req.user = user
        next()
    })
}




module.exports = router