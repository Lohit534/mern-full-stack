import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        // In this project structure, we just verify the token is valid. 
        // If we want more security, we could check if the id belongs to an admin in the database.
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export default adminAuth;
