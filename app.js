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

mongoose.connect("mongodb://localhost:27017/mern-prac2")
.then(()=>{ console.log("Connected to MongoDB"); })
.catch(()=>{ console.log("Failed to connect to MongoDB"); });

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));




app.get("/", (req, res) => res.render("login"));

app.get("/register", (req, res) => res.render("register"));

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.redirect("/register");
  const newpass = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: newpass });
  await newUser.save();
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    const hashed = await bcrypt.compare(password, user.password);
    if (!hashed) return res.status(404).send("Invalid credentials");

    const payload = { user: { id: user._id } };
    jwt.sign(payload, "jwtkey", { expiresIn: "1h" }, async (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
      const notes = await Note.find({ user: user._id }).sort({ pinned: -1, createdAt: -1 });
      return res.render("notes", { user, notes });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});



app.get("/login", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  const search = req.query.search || "";
  const sort   = req.query.sort === "oldest" ? 1 : -1;

  const query = { user: req.user.id };
  if (search) {
    query.$or = [
      { title:   { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];
  }

 
  const notes = await Note.find(query).sort({ pinned: -1, createdAt: sort });

  res.render("notes", { user, notes, search, sort: req.query.sort || "newest" });
});



app.post("/add/:id", auth, async (req, res) => {
  const { title, Date, content, tag, color } = req.body;
  const note = new Note({
    title,
    Date,
    content,
    tag:   tag   || "Other",
    color: color || "#ffffff",
    user: req.params.id
  });
  await note.save();
  res.redirect("/login");
});




app.get("/edit/:id", auth, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) return res.redirect("/login");
  res.render("edit", { note });
});

app.post("/edit/:id", auth, async (req, res) => {
  const { title, content, tag, color } = req.body;
  await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title, content, tag, color }   // updatedAt auto-updates via timestamps
  );
  res.redirect("/login");
});


// ─── DELETE NOTE ────────────────────────────────────────────────────

app.post("/delete/:id", auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.redirect("/login");
});


// ─── FEATURE 2: PIN / UNPIN ─────────────────────────────────────────

app.post("/pin/:id", auth, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) return res.redirect("/login");
  note.pinned = !note.pinned;
  await note.save();
  res.redirect("/login");
});


// ─── PROFILE ────────────────────────────────────────────────────────

app.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile", { user });
});

app.post("/profile", auth, async (req, res) => {
  const { name } = req.body;
  await User.findByIdAndUpdate(req.user.id, { name });
  res.redirect("/login");
});


// ─── SERVER ─────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
