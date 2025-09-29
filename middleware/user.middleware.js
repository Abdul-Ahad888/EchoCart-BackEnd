const jwt = require('jsonwebtoken')

const jwtKey = process.env.JWT_KEY || "wqryqwohraskbfasfaskjfnbasjkbf839479827489273489ksdnfknsefkj824y982y4nszf"


const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return res.status(401).json({ msg: "Access Denied. No Token Provided" })
        }
        // Verify Token
        const decoded = jwt.verify(token, jwtKey)
        req.user = decoded

        next()
    }

    catch (err) {
        res.status(401).json({ msg: "Invalid Or Expired Token" })
    }
}

module.exports = authenticateUser