const postCollection = require('../db').db().collection('posts')
let ObjectID = require('mongodb').ObjectID

let Post = function(data,userId){
    this.data = data
    this.userId = userId
    this.errors = []
}

Post.prototype.cleanUp = function(){

    if(typeof(this.data.title) != 'string') {this.data.title = ""}
    if(typeof(this.data.body) != 'string') {this.data.body = ""}

    this.data = {
        title:this.data.title,
        body:this.data.body,
        dateCreated: new Date(),
        author : ObjectID(this.userId)
    }
    
}

Post.prototype.validateField = function(){

    if(this.data.title == ""){this.errors.push("Please add something in title!")}
    if(this.data.body == ""){this.errors.push("Please add something in body!")}
    
}

Post.prototype.create = function(){

    return new Promise((resolve,reject)=>{
        this.cleanUp()
        this.validateField()

        if(!this.errors.length){
            postCollection.insertOne(this.data).then(()=>{
                resolve()
            }).catch(()=>{
                this.errors.push('Please try again later!')
                reject(this.errors)
            })

        }else{
            reject(this.errors)
        }
    })

}

Post.getSiglePost = function(id){
    return new Promise(async function(resolve,reject){

        if(typeof(id) != "string" ||  !ObjectID.isValid(id)){
            reject()
            return
        }else{
            let posts = await postCollection.aggregate([
                {$match : {_id :new ObjectID(id)}},
                {$lookup: {from : "users", localField: "author", foreignField: "_id", as: "authorDoc"}},
                {$project: {
                    title:1,
                    body:1,
                    dateCreated:1,
                    author:{$arrayElemAt:['$authorDoc',0]}
                }}
            ]).toArray()

            posts = posts.map(function(post){
                post.author = {
                    username : post.author.username
                }
                return post
            })

            if(posts.length){
                console.log(posts[0])
                resolve(posts[0])
            }else{
                reject()
            }
            
        }
    })
}

module.exports = Post