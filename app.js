const express = require('express')
const session = require('express-session')
const app = express()
const router = require('./router')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

app.use(express.static("public"))
app.use(flash())
sessionOpetions = session({
    secret:"this is cool",
    store: new MongoStore({client:require('./db')}),
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge: 1000*60*60*24, httpOnly:true}
    
})
app.use(sessionOpetions)
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.set('views','views')
app.set('view engine', 'ejs')

app.use((req,res,next)=>{
    res.locals.user = req.session.user
    next()
})

app.use('/',router)

module.exports = app