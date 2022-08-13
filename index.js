const express = require("express");
const app = express();
const PORT = process.env.PORT || 3200;

app.get("/", (req, res) => {
    res.send("success")
});

app.listen(PORT, ()=> {console.log(`server running in port ${PORT}`)});