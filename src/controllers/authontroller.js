import axios from "axios";
import bcrypt from "bcrypt";
import { prismaClient } from "../clients/db";
import JWTService from "../services/jwt";

const verifyEmailAndPassword = async ({email,password})=>{
    const user = await prismaClient.user.findUnique({
        where: {email: email},
        // select: {email:true,password:true}
    });
    if(user && typeof user.password === "string"){
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw new Error("Password Invalid")
        }
        return user;
    } 
    return null;
}

const verifyGoogleCred = async (token, isSignup) => {
    try{
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set(`id_token`,token);
        const {data} = await axios.get(googleOauthURL.toString(),
        {
            responseType: "json",
        }
    );
    let user = await prismaClient.user.findUnique({
        where: {
            email: data.email
        }
    })
    if(user && isSignup){
        throw new Error("User already registered with this email, please login")
    }
    if(!user && isSignup){
        user = await prismaClient.user.create({
            data:{
                email: data.email,
                firstName: data.given_name,
                lastName: data.family_name,
                profileImageURL: data.picture,
                googleId: data.sub
            }
        })
    }

    return user;

    }catch(error){
        throw error;
    }
}

export const signIn = async (req, res)=>{
    const {token,email,password} = req.body;
    let user;
    if(email && password){
        try{
            user = await verifyEmailAndPassword({email,password});
        }catch(error){
            res.status(400).json({error:'Invalid password'})
            return;
        }
    } else if(token) {
        try{
            user = await verifyGoogleCred(token, false);
        }catch(error){
        res.status(400).json({error:'Invalid token provided.'});
        return;
        }
        
    } else{
        res.status(400).json({error:"Bad request, login details not provided properly."});
        return;
    }

    if(user){
        const JWTtoken = JWTService.generateTokenForUser(user);
        res.status(200).json({token:JWTtoken});
        return;
    } else{
        res.status(404).json({error:"User not found, please signup"})
        return;
    }
}

export const signUp = async (req,res) => {
    const {firstName, lastName, email, password, token} = req.body;
    
    let userInDB;
    if(token){
        try{
            userInDB = await verifyGoogleCred(token, true);
        }catch(error){
            if(error instanceof Error){
                res.status(500).json({error:"User already registered with this email, please login"});
            } else{
                res.status(500).json({error:"An unexpected error occurred"});
            }
            return;
        }
        
    } else if(firstName && email && password){

        userInDB = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        })
        if(userInDB){
            res.status(500).json({error:"User already registered with this email, please login"});
            return;
        }
        const hashedPassword = await bcrypt.hash(password,10);
        userInDB = await prismaClient.user.create({
            data:{
                email: email,
                firstName: firstName,
                password: hashedPassword
            }
        })
    } else{
        res.status(400).json({message:"required fields are not provided."})
        return;
    }

    if(!userInDB){
        res.status(500).json({message:"User creation failed."})
        return;
    }else {
        res.status(200).json({message:"user signup successfull. please login now."})
        return;
    }
}

export const verifyToken = async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(token){
        const user = JWTService.verifyToken(token);
        
        res.status(200).json(user)
    }else{
        res.status(404).json({error:"token not found please login again"})
    }
}

//  this will verify the JWT and act as middleware to other protected routes
export const verifySignIn = async(req, res,next) => {
    try{
        
        const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.status(401).json({error:"token not found please login again"})
        return
    }
    const user = JWTService.verifyToken(token);
    req.user = user;
    next();
    }catch(error){
        res.status(500).json({error:"Failed to authenticate token"})
    }  
}