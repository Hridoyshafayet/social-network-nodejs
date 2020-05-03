const validator = require('validator')
const userCollection = require('../db').db().collection("users")
const bcrypt = require('bcryptjs')

let User = function(data){
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function(){
    if(typeof(this.data.username) != "string") this.data.username = ""
    if(typeof(this.data.email) != "string") this.data.email = ""
    if(typeof(this.data.password) != "string") this.data.password = ""

    data = {
        username : this.data.username.trim().toLowerCase(),
        email : this.data.email.trim().toLowerCase(),
        password : this.data.password,
    }
}

User.prototype.validate = function(){
    return new Promise(async (resolve,reject)=>{

        if(this.data.username == "") {this.errors.push("Enter an username !")}
        if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain numbers and latters!")}
        if(!validator.isEmail(this.data.email)) {this.errors.push("Enter a valid email !")}
        if(this.data.password == "") {this.errors.push("Enter an password !")}
        if(this.data.username.length < 3 ) {this.errors.push("Username have to be grater than  3 latter!")}
        if(this.data.username.length > 15 ) {this.errors.push("Username can't  be grater than  15 latter!")}
    
        if(this.data.password.length < 3 ) {this.errors.push("Password have to be greter than 3 latter !")}
        if(this.data.password.length > 15 ) {this.errors.push("Password can't  be grater than  15 latter!")}
    
    
        //check user name and email already exists or not
        if(this.data.username < 3 && !this.data.username > 15 && validator.isAlphanumeric(this.data.username)){
            let userExists = await userCollection.findOne({username:this.data.username})
            if(userExists){
                this.errors.push("This username is already taken!")
            }
        }
    
        if(validator.isEmail(this.data.email)){
            let emailExists = await userCollection.findOne({email:this.data.email})
            if(emailExists){
                this.errors.push("This email is already taken!")
            }
        
        }

        resolve()
    })
}

User.prototype.login = function(){
    return new Promise((resolve, reject)=>{
        this.cleanUp()
        userCollection.findOne({"username":this.data.username}).then((user)=>{
            if(user &&  bcrypt.compareSync(this.data.password,user.password)){
                resolve(user._id)
            }else{
                reject("Invalid username/password!!")
            }
        }).catch((e)=>{
            reject("Something went wrong!")
        })
    })
}

User.prototype.register =  function(){
    return new Promise(async(resolve,reject)=>{
        this.cleanUp()
        await this.validate()
    
        if(!this.errors.length){
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password,salt)
    
            userCollection.insertOne(this.data).then((user)=>{
                resolve(user._id)
            }).catch(()=>{
                this.errors.push("Please try again later!!")
                reject(this.errors)
            })
            
            
        }else{
            reject(this.errors)
        }
        
    }
    )
}
module.exports = User
