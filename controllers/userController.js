const User = require("../models/User")

exports.logedIn = (req,res,next)=>{
    if(req.session.user){
        next()      
    }else{
        req.flash("errors","You have to login first!!")
        req.session.save(()=>{
            res.redirect('/')
        })
        
    }
}

exports.longin = function(req,res){
    user = new User(req.body)
    user.login().then((userId)=>{

        req.session.user= {username:user.data.username,_id:userId}
        req.session.save(function(){
            res.redirect('/')
        })
    }).catch((e)=>{
        req.flash("errors",e)
        req.session.save(()=>{
            res.redirect('/')
        })
    })
}
exports.longout = function(req,res){

    req.session.destroy(()=>{
        res.redirect('/')
    })

}
exports.register = function(req, res){
    let user = new User(req.body)
    user.register().then((userId)=>{
        console.log(user.data._id)
        req.session.user = {username:user.data.username, _id:userId}
        req.session.save(()=>{
            res.redirect('/')
        })

    }).catch((e)=>{
        req.flash("regErrors",e)
        req.session.save(()=>{
            res.redirect('/')
        })
    })

}
exports.home = function(req, res){
    if(req.session.user){
        res.render('home-dashboard',{username : req.session.user.username})
    }else{
        res.render("home-guest", {err:req.flash('errors'), regErr:req.flash("regErrors")})
    }


}

exports.isUserEsits = ()=>{
    
}