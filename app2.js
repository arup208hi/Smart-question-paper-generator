var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var XLSX = require("xlsx");
var multer = require("multer");
const { name } = require("ejs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

mongoose
  .connect("mongodb://localhost:27017/AU10", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log("error", error);
  });

var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

var excelSchema = new mongoose.Schema({
  "Name of the Program": String,
  "Paper Title": String,
  "Paper Code": String,
  "Semester": String,
  "Question": mongoose.Schema.Types.Mixed,
  "Course Outcome": Number,
  "Marks": Number,
});

var excelModel = mongoose.model("excelData", excelSchema);

var signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cpassword: String,
});
var signupModel = mongoose.model("signupData", signupSchema);

app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/faculty", (req, res) => {
  excelModel.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("faculty", { data: data });
    }
  });
});

app.get("*", (req, res) => {
  res.render("error");
});

app.post("/faculty", upload.single("excel"), (req, res) => {
  var workbook = XLSX.readFile(req.file.path);
  var sheet_namelist = workbook.SheetNames;
  var x = 0;
  sheet_namelist.forEach((element) => {
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
    excelModel.insertMany(xlData, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
    x++;
  });
  res.redirect("/faculty");
});

app.post("/", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "plz filed the property" });
  }

  try {
    const userexist = await signupModel.findOne({ email: email });
    if (userexist) {
      return res.status(422).json({ error: "email already exist" });
    }
    const user = new signupModel({ name, email, password, cpassword });
    const userRegister = await user.save();
    if (userRegister) {
      res.status(201).json({ message: "user successfully registered" });
    } else {
      res.status(500).json({ error: "failed to register" });
    }
  } catch (err) {
    console.log(err);
  }
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log("server run at " + port));
