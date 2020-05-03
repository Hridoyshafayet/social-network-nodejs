const Post = require('../models/Post')
exports.createPostView =(req,res)=>{
    res.render('create-post')
}
exports.create = (req,res)=>{
    let post = new Post(req.body, req.session.user._id)

    post.create().then(function(){
        res.send("post created")
    }).catch(function(err){
        console.log(err)

    })
}

exports.signlePostView =async function(req,res){

    try{
        let post =await Post.getSiglePost(req.params.id)
        res.render('view-single-post',{post:post})
    }catch{
        res.render("404")
    }




        // .then((result)=>{
        //     res.render('view-single-post',{result:post})
        // }).catch(()=>{
        //     res.send("404")
        // })
        

}