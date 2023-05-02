  const jwt=require('jsonwebtoken')   //importing library for using tokens
  const db=require('./db.js')
  // userDetails={
  //   1000:{acno:1000,username:"anu",password:"abc123",balance:0,transaction:[]},
  //   1001:{acno:1001,username:"amal",password:"abc123",balance:0,transaction:[]},
  //   1003:{acno:1003,username:"arun",password:"abc123",balance:0,transaction:[]},
  //   1004:{acno:1004,username:"akhil",password:"abc123",balance:0,transaction:[]}

  // }


register = (uname,acno,psw)=>{                                     //arrow function... removing (this.) bcz no class here
    // if(acno in userDetails){
     return db.User.findOne({acno}).then(User=>{
        if(User){
          return {
            status:false,
            message:'user already present',
            statusCode:401
        }
     }
     else{
         //create a new object in db
         const newuser = new db.User({
          acno,username:uname,password:psw,balance:0,transaction:[]
         })

         //save in db
         newuser.save()

         return{
          status:true,
          message:'register success',
          statusCode:200
  
        } 
     }
  })
      
  }


  login=(acno,psw)=>{
    // if(acno in userDetails){
     return db.User.findOne({acno,password:psw}).then(user=>{
        if(user){
          currentUser=user.username
          // console.log(this.currentUser);
          currentAcno=acno
  
          const token=jwt.sign({currentAcno},"supersecretkey123")
            
           return{
              status:true,
              message:'login success',
              statusCode:200,
              currentUser,
              currentAcno,
              token
           }
        }
        else{
          return {
           status:false,
           message:'incorrect acno or password',
           statusCode:401
   
            } 
          }
 
      })

   }

  
  deposit=(acnum,password,amount)=>{
    // let userDetails=this.userDetails
    //convert stirng amount to number
    var amnt=parseInt(amount)

    // if(acnum in userDetails){
     return db.User.findOne({acno:acnum,password}).then(user=>{
      if(user){
           //update balance
            user.balance+=amnt

           //transaction data store
           user.transaction.push({Type:"CREDIT",amount:amnt})
            
          //for changes and updations save in db
           user.save()

        // return current balance
        return{                 
          status:true,
          message:`${amnt} is credited to your ac and the balance 
                     ${user.balance}`,
                     
          statusCode:200 
       }
        
      }
      else{
        return{
          status:false,
          message:'incorrect acno or password',
          statusCode:401
  
        } 
      }
  
    })

  }


  withdraw=(acnum,password,amount)=>{
    var amnt=parseInt(amount)

    // if(acnum in userDetails){
      return db.User.findOne({acno:acnum,password}).then(user=>{
        if(user){
          if(amnt<=user.balance){
            user.balance-= amnt
  
            user.transaction.push({Type:"DEBIT",amount:amnt})
  
            user.save()
  
            return{
            
                  status:true,
                  message:`${amnt} is withdrawed.current balance is ${user.balance}`,                
                  statusCode:200 
                 } 
          }
          else{
            return {
              status:false,
              message:'insufficient balance',
             statusCode:401
            }
          }
  
        }
        else{
          return {
            status:false,
            message:'incorrect acno or password',
           statusCode:401
          }
        }

      })

    }

  

  getTransaction=(acno)=>{
    return db.User.findOne({acno}).then(user=>{
      if(user){

        return{
          status:true,
          statusCode:200,
          transaction: user.transaction
    
         } 
    
       }
    })
    
  }

  deleteAcc=(acno)=>{
    return db.User.deleteOne({acno}).then(user=>{
      if(user){
        return{
          status:true,
          statuscode:200,
          message:'account deleted'
        }
      }
      else{
        return{
          status:false,
          statuscode:401,
          message:'user not exist'

        }
      }
    })
  }


  // exporting function for using in other files

  module.exports ={
    register,login,deposit,withdraw,getTransaction,deleteAcc
  }

