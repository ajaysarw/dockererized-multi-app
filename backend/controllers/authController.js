var bcrypt = require('bcryptjs');

const { UserModel } = require("../models/users");


exports.signup = async(req, res, next) => {
    const {username, password} = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);    

    try {
        const UserDetails = await UserModel.create({
            username,
            password:hashPassword
        })

        req.session.user = UserDetails;

        return res.status(200).send ({
            staus: "Ok",
            data: {UserDetails}
        })
    } catch (error) {
        return res.status(400).send ({
            staus: "faild", 
            data: {user: req.body}
        })
    }
}

exports.login = async(req, res, next) => {
    const {username, password} = req.body;
 
    try {
        const UserDetails = await UserModel.findOne({username});
        if (!UserDetails) return res.status(404).send({status: "fail, user not found"})
        
        const isValidPassword = await bcrypt.compare(password, UserDetails.password);        
        if(!isValidPassword) return res.status(400).send({status: "fail with bad password"})
        
        req.session.user = UserDetails;
        return res.status(200).send({status: "success", extraData: req.session.user})        
        
    } catch (error) {
        console.log(error);
       return res.status(500).send({status: "Bad happened"})
    }

   
}

exports.getUsers = async(req, res, next) => {
    return res.send(
        {
            data: await UserModel.find()
        }
    )
}