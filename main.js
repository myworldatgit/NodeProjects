require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const session=require("express-session");
const app=express();
const PORT=process.env.PORT ||3000;



//db connection
// mongoose.connect(process.env.DB_URL, {useNewUrlParser:true,useUnifiedTopology:true});
//this is depreciated parameters from node version 4;
mongoose.connect(process.env.DB_URL);
const db=mongoose.connection;
// db.on("error",(error)=>console.log(error));
db.on("open",()=>console.log("Conected to the server"));


//if error occur while connecting to the databse try
// 1.change the port Number
// 2.go to control panel->windows tools>mongo right click start
// 3.open cmd and npm install mongodb




//middlewares
//through which database can be managed from the node application

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret:"my key",
    saveUninitialized:true,
    resave:false,

})
);

app.use((req,res,next)=>{
    res.locals.message=req.session.message; // requested session msg store in response to locals and then delete and move next
    delete req.session.message;
    next();
})


app.use(express.static("uploads"));
//setting the template engine
//wasted nearly half hour mistake was app.set is used to set the engine not app.use;
app.set('view engine','ejs');


// 1 st way
// app.get("/",(req,res)=>{
//     res.send("hii");
// })
app.use('/',require('./routes/routes'));

//2 nd way
//include routes folder and in that folder include all routes as Router.get instead of app.get



app.listen(PORT,()=>{
    console.log(`Listenning at port http://localhost:${PORT}`);
})
