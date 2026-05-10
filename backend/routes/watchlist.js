const express=require('express')
const router= express.Router()
const authMiddleware= require('../middleware/authMiddleware')
const Watchlist=require('../models/Watchlist')

router.get('/', authMiddleware, async(req,res)=>{

})

router.post('/', authMiddleware, async(req,res)=>{
    
})
router.delete('/', authMiddleware, async(req,res)=>{
    
})