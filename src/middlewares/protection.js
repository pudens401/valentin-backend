// isLogged, isAdmin, isFinder, isOWner,isVerified, isResetAllowed
const usersDb = require("../db/users")

const isLogged = async (req,res,next)=>{
    try {
        const{sessionToken} = req.body
        if(!sessionToken) return res.status(401).json({success:false,message:`No session token provided`})
        const retrievedUser = await usersDb.getUserBySessionToken(sessionToken)
        if(!retrievedUser) return res.status(401).json({success:false,message:`Not logged in or invalid session token`})
        req.retrievedUser = retrievedUser
        next()
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}


module.exports = {isLogged}