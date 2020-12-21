const Router = require('express').Router();

Router.route('/')
.get((req, res)=>{
    res.send("Get at /")
})


module.exports = Router;