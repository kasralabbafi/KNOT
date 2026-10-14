const protect = (req, res, next) => {
    const auth = req.headers.authorization
    if(!auth || ! auth.startsWith("Bearer")){
        return res.status(401).json({
            message: "Not authorized"
        })
    }
    try {
        const payload = jwt.verify(auth.split(" ")[1])
    } catch (error) {
        next()
    }
}

module.exports = protect