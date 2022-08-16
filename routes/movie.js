const verify = require("../helper/verifyJWT");

const router = require("express").Router();

router.get("/search", verify, async (req,res) => {
    res.status(200).send("Success")
})

module.exports = router;
