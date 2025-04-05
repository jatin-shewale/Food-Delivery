import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            // Fallback to token in headers
            token = req.headers.token;
        }

        if (!token) {
            return res.json({ success: false, message: "Not authorized, login again" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: token_decode.id };
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        res.json({ success: false, message: "Invalid token" });
    }
}
export default authMiddleware;