const verify = require("../helper/verifyJWT");
const axios = require("axios");
const router = require("express").Router();
const Movie = require("../models/movie");
const ombd_base_url = process.env.OMDB_BASE_URL;
const omdb_api_key = process.env.OMDB_API_KEY;

const upsertMovie = async function(result) {
    const movie = new Movie({
        id: result.data.imdbID,
        Title: result.data.Title,
        Director: result.data.Director,
        Actors: result.data.Actors,
        Plot: result.data.Plot,
        imdbRating: result.data.imdbRating,
        Year: result.data.Year
    });

    console.log(movie)

    var upsertMovie = movie.toObject();

    // id is immutable
    delete upsertMovie._id;

    const upsert = await Movie.updateOne( {id: upsertMovie.id}, upsertMovie, {upsert: true});

    console.log(upsert);
};


const searchById = async function(id) {
    const result = await axios.get(`${ombd_base_url}?i=${id}&apikey=${omdb_api_key}`);


    if(result.data.Response == "False") {
        return "Movie not found!"
    } else {

        const movie = await upsertMovie(result);
        return result.data;
    }
};

const searchByTitle = async function(title) {
    const result = await axios.get(`${ombd_base_url}?t=${encodeURI(title)}&apikey=${omdb_api_key}`);



    console.log(result);

    if(result.data.Response == "False") {
        return "Movie not found!"
    } else {

        const movie = await upsertMovie(result);
        return result.data;
    }
};



router.get("/search", verify, async (req,res) => {
    if(req.query.id){
        const response = await searchById(req.query.id);
        res.status(200).send({data: response})
    } else if(req.query.title) {
        const response = await searchByTitle(req.query.title);
        res.status(200).send({data: response})
    } else {
        res.status(400).send({message: "BAD Request!"})
    }
});


router.get("/toprated", verify, async (req,res) => {
    if(req.query.year){
        const response = await Movie.find({Year: req.query.year}, {_id: 0})
            .sort({imdbRating: -1})
            .limit(req.query.limit || 5)
            .select('-__v');

        console.log(response);
        res.status(200).send({data: response})
    } else {
        res.status(400).send({message: "BAD Request!"});
    }
});

module.exports = router;
