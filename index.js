const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 3200;

app.get("/", (req, res) => {
    res.status(200).send({message: "success"});
});

app.listen(PORT, ()=> {console.log(`server running in port http://localhost:${PORT} 🚀`)});



// import routes
const authRoute = require("./routes/auth");
const movieRoute = require("./routes/movie")

// env variable access
// dotenv.config();

// database connection
mongoose .connect(process.env.DB_CONNECT, {
          useNewUrlParser: true,
          useUnifiedTopology: true,})   
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));


// enable json output
app.use(express.json(), cors());



app.use("/", authRoute);
app.use("/movie", movieRoute);

module.exports = app;