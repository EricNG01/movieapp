const express = require('express');
const logger = require('morgan');
const router = express.Router();
const axios = require("axios");

router.use(logger('tiny'));

const APIKey = process.env.MOVIEREVIEW_APIKEY
const basicUrl = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=' + APIKey + '&query='

//query
router.get('/:keywords', (req, res) => {
    url = basicUrl + req.params.keywords
    // console.log(url)
    axios(url)
        .then((res) => res.data.results)
        .then(data => {
            const reviews = []
            // console.log(data)
            if(data !== null) {
                for (var i = 0; i < data.length; i++) {
                // console.log(data[i].display_title)
                if (data[i].display_title == req.params.keywords)
                    reviews.push({
                        headline: data[i].headline,
                        summay: data[i].summary_short,
                        reviewer: data[i].byline,
                        link: data[i].link.url
                    })
                }
            }
            res.json(reviews)
        }).catch(err => console.log(err))
})

module.exports = router;