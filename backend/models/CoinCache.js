const mongoose= require('mongoose')

const coinsCacheSchema= new mongoose.Schema({
    coins:{type:Array, required:true},
    fetchedAt:{type:Date, default:Date.now}
})


module.exports= mongoose.model('CoinCache',coinsCacheSchema)

