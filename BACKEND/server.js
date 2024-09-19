require('dotenv').config()
const express= require('express')

const workout= require('./routes/work')
const userroutes=require('./routes/user')
const mongoose= require('mongoose')
const app=express()
const cors=require("cors")

app.use(express.json())

app.use((req,res,next)=>
{
    console.log(req.path, req.method)
    next()
})
app.use('/api/work',workout)
app.use('/api/user',userroutes)

app.use(cors())
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{

        app.listen(process.env.PORT,() =>
            {
                console.log("Listening!")
            }
            )
})
    .catch(()=>{
        console.log("error found")
    })
