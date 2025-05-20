import mongoose, { Schema,Model } from 'mongoose';

const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,required:true,unique:true},
    password:String,
    provider:{type:String,default:'local'}
});

const User=mongoose.model('User',userSchema);


const tokenSchema=new mongoose.Schema({
    token:{type:Number,required:true},
    email:{type:String,required:true},
    expires:{type:Date,required:true}
})

tokenSchema.index({expires:1},{expireAfterSeconds:0});

const Token=mongoose.model('Token',tokenSchema);

export{User,Token}