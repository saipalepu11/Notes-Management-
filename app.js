const express=require("express");
const app=express();
const port=3000;
const ejs=require("ejs");
const path=require("path");
const mongoose=require("mongoose");
const User=require("./model/user");
const Note=require("./model/notes");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const bcrypt=require("bcrypt");
const user = require("./model/user");
const jwt= require("jsonwebtoken");
const auth=require("./middleware/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cors({
  exposedHeaders: ['x-token'], 
  allowedHeaders: ['x-token', 'Authorization', 'Content-Type']
}));
app.use(cookieParser());


// app.use(session({
//     secret: "mysecretkey",
//     resave: false,
//     saveUninitialized: true
// }));

// app.use(flash());
   


// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });




mongoose.connect("mongodb://localhost:27017/mern-prac2")
.then(()=>
{
    console.log("Connected to MongoDB");
}).catch((err)=>
{
    console.log("Failed to connect to MongoDB");
})





app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));



app.get("/",async(req,res)=>
{
   
    res.render("login");
})

app.get("/register",async(req,res)=>
{
    res.render("register");
})

app.get("/login",auth,async(req,res)=>
{
    const user=await User.findById(req.user.id);
    const id=req.user.id;
    const notes = await Note.find({ user: req.user.id });
    
    res.render("notes",{user,notes});
})

app.post("/register",async(req,res)=>
{
   const {name,email,password}=req.body;
  
   const userExists=await User.findOne({email});
   if(userExists)
   {
    return res.redirect("/register");
   }
   const newpass= await bcrypt.hash(password,10)
    const newUser=new User({
    name,email,password:newpass
   });
   
   await newUser.save();

   console.log(newUser);
   res.redirect("/");

})


app.post("/login",  async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email});

        if (!user) 
        {
            return res.status(404).send("User not found");
        }

        const hashed=await bcrypt.compare(password,user.password)
        
        if(!hashed)
        {
            return res.status(404).send("user not founding");
        }

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            "jwtkey",
            { expiresIn: "1h" },
            (err, token) => {
                if (err) throw err;

                
                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000
                });

                
                const notes = Note.find({ user: user._id });
                
                return res.render("notes",{user,notes});
            }
        );

    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});


app.post("/add/:id",auth,async(req,res)=>
{
    const {title,Date,content}=req.body;
    const note=new Note({
    title,Date,content,user: req.params.id
   });
    await note.save();
    
    const user= await User.findById(note.id)
    res.redirect("/login")

})

app.get("/profile",auth,async(req,res)=>
{
     const user=await User.findById(req.user.id);
     res.render("profile",{user});
})
app.post("/profile",auth,async(req,res)=>
{
    const {name}=req.body;
   const updated= await User.findByIdAndUpdate(req.user.id,{name});
   await updated.save();
   res.redirect("/login");

})

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

app.post("/delete/:id", auth, async (req, res) => 
{
  await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });
  res.redirect("/login");
});


app.listen(port,()=>
{
    console.log(`Server is running on http://localhost:${port}`)
})