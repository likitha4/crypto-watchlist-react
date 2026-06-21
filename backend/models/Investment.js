const mongoose= require("mongoose")

const investmentSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    coinId:{
        type:String,
        required:true
    },
    coinName:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    razorpayOrderId:{
        type:String
    },
    razorpayPaymentId:{
        type:String
    },
    status:{
        type:String,
        enum:['pending','success','fail'],
        default:'pending'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports= mongoose.model('Investment',investmentSchema)