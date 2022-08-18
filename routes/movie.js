const verify = require("../helper/verifyJWT");
const axios = require("axios");
const router = require("express").Router();
const ombd_base_url = process.env.OMDB_BASE_URL;
const omdb_api_key = process.env.OMDB_API_KEY;

const searchById = async function(id) {
    const result = await axios.get(`${ombd_base_url}?i=${id}&apikey=${omdb_api_key}`);
    return result;
};

const searchByTitle = async function(title) {
    const result = await axios.get(`${ombd_base_url}?s=${title}&apikey=${omdb_api_key}`);
    return result;
};



router.get("/search", verify, async (req,res) => {
    if(req.query.id){
        const response = await searchById(req.query.id);
        res.status(200).send({data: response.data})
    } else if(req.query.title) {
        const response = await searchByTitle(req.query.title);
        res.status(200).send({data: response.data.Search})
    } else {
        res.status(400).send({message: "BAD Request!"})
    }
})

module.exports = router;
