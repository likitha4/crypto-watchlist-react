const mongoose= require('mongoose')
const {Schema}= mongoose;

const watchListSchema= new Schema({
   coinId:{
        type:String,
        required:true
    },
    coinName:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

const Watchlist= mongoose.model('Watchlist',watchListSchema)
module.exports=Watchlist