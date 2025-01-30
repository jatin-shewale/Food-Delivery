import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not authorized, login again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: token_decode.id }; // Set req.user with the user ID
        req.body.userId = token_decode.id; // Keep this line if needed
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Invalid token" });
    }
}
export default authMiddleware;