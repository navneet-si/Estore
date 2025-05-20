import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User,Token} from '../models/User';
const mailer =require("nodemailer");

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.Key!, { expiresIn: '7d' });

    return res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Registration error:', err);  // <-- add this
    return res.status(500).json({ message: 'Error registering user' });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.Key!, { expiresIn: '7d' });

   return  res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
 console.log({ err });
  }
};


export const update=async (req:Request,res:Response)=>{

try{

  const token:number=Math.floor(Math.random()*(1e6));
  const expires=new Date(Date.now()+ 10*60*1000);
  const email=req.body.email;
  const result=await Token.find({email:email,token:token});
  
  if(result){
    await Token.deleteMany({email:email})
  };
  
  
  const response=new Token({
      token:token,
      email:email,
      expires:expires
    })
   await response.save();
    const transporter=mailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.mail_id,
        pass:process.env.mail_pass
      }
    });


    (async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.mail_id, // sender address
      to: email, // list of receivers
      subject: "Your verification code", // Subject line
      text: `Your verification code is ${token}`,
      html: `<p>Your verification code is: <b>${token}</b></p>`,

    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", mailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
})();

   

    console.log(token);
    return res.status(200).json({msg:"code sent to email"});
  }catch(err){
    console.log(err);
  }

    
  }


   export const verify=async (req:Request,res:Response)=>{
      const email=req.body.email;
      const token=req.body.token;
    try{

      const result=await Token.findOne({email,token});
      if(!result){
        return res.status(400).json("internal server error");
      }
      if(result.expires< new Date()){
        return res.status(400).json({error:"token has expired"});
      }
      
      await Token.deleteOne({_id:result._id});
      return res.status(200).json("token verified succesfully");
    }catch(error){
      console.log(error);
    }

  }