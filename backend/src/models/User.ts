import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,required:true,unique:true},
    password:String,
    provider:{type:String,default:'local'}
});

export default mongoose.model('User',userSchema);
