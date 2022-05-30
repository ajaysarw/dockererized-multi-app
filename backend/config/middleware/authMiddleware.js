module.exports.AuthProctected = (req, res, next) => {
    const {user }= req.session;
    if (!user) return res.status(401).send({status:"fail", message:"Unauhenticated"});

    req.user = user;
    next();
}