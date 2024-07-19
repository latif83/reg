"use server"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const verifyToken = (token) => {
    try{
        const decodedToken = jwt.verify(token, "your-secret-key"); 
        return {status:true,decodedToken}
    }
    catch(err){
        // cookies().delete('access-token')
        // console.log(err)
        return {status:false}
    }
}

export const IsReset = async (password)=>{
    try{
        const checkPass = await bcrypt.compare("password@123", password)

        return checkPass ? true : false
    }
    catch(err){
        console.log(err)
        return false
    }
}