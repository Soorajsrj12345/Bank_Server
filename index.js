//importing dataservice file
const dataservice=require('./service/dataservice')

//import cors
const cors=require("cors")

//import json  web token
const jwt=require('jsonwebtoken')

// import express
const express= require("express")

//create app using express
const app=express()

//connection string to frontend integration
app.use(cors({origin:'http://localhost:4200'}))

//to parse json data from req body
app.use(express.json())                          //to view json data in js format

//middleware
const jwtMiddleware=(req,res,next)=>{
   try { 
        const token=req.headers['access_token']
       //verify token
       const data= jwt.verify(token,"supersecretkey123")
       console.log(data);
       next() 
      }     
   catch{
       res.status(422).json({
        statusCode:422,
        status:false,
        message:'please login first'
       })
   }         
}

//register -post
app.post('/register',(req,res)=>{

    dataservice.register(req.body.uname,req.body.acno,req.body.psw).then(result=>{
   //convert object to json and send as response
   res.status(result.statusCode).json(result)

    })

    // console.log(req.body);                     //to view requested data .. view in terminal
    // res.send("success")
})


// login
app.post('/login',(req,res)=>{

     dataservice.login(req.body.acno,req.body.psw).then(result=>{
    //convert object to json and send as response
    res.status(result.statusCode).json(result)

     })

     // console.log(req.body);                     
     // res.send("success")
 })
 

// deposit
app.post('/deposit',jwtMiddleware,(req,res)=>{

     dataservice.deposit(req.body.acnum,req.body.password,req.body.amount).then(result=>{
    //convert object to json and send as response
    res.status(result.statusCode).json(result)

     })

     // console.log(req.body);                     
     // res.send("success")
 })



// withdraw
app.post('/withdraw',jwtMiddleware,(req,res)=>{

     dataservice.withdraw(req.body.acnum,req.body.password,req.body.amount).then(result=>{
     //convert object to json and send as response
    res.status(result.statusCode).json(result)

     })

     // console.log(req.body);                     
     // res.send("success")
 })



// getTransaction
app.post('/transaction',jwtMiddleware,(req,res)=>{

     dataservice.getTransaction(req.body.acno).then(result=>{
     //convert object to json and send as response
    res.status(result.statusCode).json(result)

     })

     // console.log(req.body);                     
     // res.send("success")
 })


// delete
app.delete('/delete/:acno',jwtMiddleware,(req,res)=>{
    dataservice.deleteAcc(req.params.acno).then(result=>{
        res.status(result.statuscode).json(result)
    })
})



//request
// app.get('/',(req,res)=>{
//     res.send('Get Method...123')
// })

// app.post('/',(req,res)=>{
//     res.send('Post Method')
// })


// app.put('/',(req,res)=>{
//     res.send('Put Method')
// })


// app.patch('/',(req,res)=>{
//     res.send('Patch Method')
// })


// app.delete('/',(req,res)=>{
//     res.send('Delete Method')
// })



//create port
app.listen(3001,()=>{console.log("sever started at port number 3001");})

