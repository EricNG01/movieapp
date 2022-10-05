const express = require('express');
const logger = require('morgan');
const router = express.Router();
const axios = require("axios");

router.use(logger('tiny'));

const APIKey = process.env.YOUTUBE_APIKEY
const basicUrl = 'https://www.googleapis.com/youtube/v3/search?key='

// query
router.get('/:keywords', (req, res) => {
    url = basicUrl + APIKey
            + '&part=snippet&q=' + req.params.keywords + '%20trailer'
    console.log(url)
    axios(url)
        .then((res) => res.data)
        .then((data) => {
            if (data.items.length > 0) {
                var resp = []
                // console.log(data.items)

                // extract the video ID from the response
                resp.push({link: 'https://www.youtube.com/embed/' + data.items[0].id.videoId});
                res.json(resp)
            }
            
        })
        .catch(err => console.log(err))
})


module.exports = router;