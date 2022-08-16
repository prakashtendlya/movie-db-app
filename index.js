const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 3200;

app.get("/", (req, res) => {
    res.send("success")
});

app.listen(PORT, ()=> {console.log(`server running in port ${PORT}`)});



// import routes
const authRoute = require("./routes/auth");
const movieRoute = require("./routes/movie")

// env variable access
// dotenv.config();

// database connection
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to db ")
  );


// enable json output & disable cors
app.use(express.json(), cors());



app.use("/", authRoute);
app.use("/movie", movieRoute);
