const express = require('express');
const logger = require('morgan');
const router = express.Router();
const axios = require("axios");
require("dotenv").config()

router.use(logger('tiny'));

const APIKey = process.env.TMDB_APIKEY
const basicUrl = 'https://api.themoviedb.org/3'
const imgUrl = 'https://image.tmdb.org/t/p/w500'

// default query
router.get('/', (req, res) => {
    // console.log(APIKey)
    url = basicUrl + 
            '/discover/movie?sort_by=popularity.desc&api_key=' + 
            APIKey
    // console.log(url)
    axios(url)
        .then((res) => res.data).then(
            data => {
                // Check if the GET query succeed in the server side
                // console.log(data.results)
                
                //
                var resp = [];
                if (data.results.length > 0) {
                    for (var i = 0; i < data.results.length; i++) {
                        resp.push({
                            id: data.results[i].id,
                            title: data.results[i].title,
                            date: data.results[i].release_date,
                            poster: data.results[i].poster_path? imgUrl + data.results[i].poster_path:null,
                            vote_avg: data.results[i].vote_average,
                            overview: data.results[i].overview
                    })
                    }
                    res.json(resp)
                }
            }
        ).catch(err => {})
    
});

// keywords query
router.get('/:keyword', (req, res) => {
    url = basicUrl + 
            '/search/movie?include_adult=false&page=1&query=' + req.params.keyword +
            '&api_key=' + APIKey
    // console.log(url)
    axios(url)
    .then((res) => res.data).then(
        data => {
            // Check if the GET query succeed in the server side
            // console.log(data.results)
            
            //
            var resp = [];
            if (data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    resp.push({
                        id: data.results[i].id,
                        title: data.results[i].title,
                        date: data.results[i].release_date,
                        poster: data.results[i].poster_path? imgUrl + data.results[i].poster_path:null,
                        vote_avg: data.results[i].vote_average,
                        overview: data.results[i].overview
                })
                }
                res.json(resp)
            }
        }
    ).catch(err => console.log(err))
})
module.exports = router;