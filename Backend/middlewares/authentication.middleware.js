
const jwt = require("jsonwebtoken");
const connection = require("../server");

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(403).json({ error: "Unauthenticated" });
    }
    const accessToken = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = { ...payload };
        next();
    } catch (error) {
        return res.status(403).json({ error: error.message });
    }
};

module.exports = auth;