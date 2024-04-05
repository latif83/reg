"use server"
import jwt from "jsonwebtoken";

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