import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

class JWTService{
    static generateTokenForUser(user){
        const payload = {
            user
        }

        if(!JWT_SECRET){
            throw new Error("JWT_SECRET is not defined in the environment variables.")
        }
        const JWTtoken = JWT.sign(payload,JWT_SECRET);
        return JWTtoken;
    }

    static verifyToken(token){
        return JWT.verify(token, JWT_SECRET);
    }
}

export default JWTService;