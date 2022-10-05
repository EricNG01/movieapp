require('dotenv').config()
var AWS = require("aws-sdk");
const express = require('express');
const logger = require('morgan');
const router = express.Router();
const axios = require("axios");

router.use(logger('tiny'));

const bucketName = 'n10641343';
const key = 'key'
const s3Key = `s3-counter-${key}`;

// object to be uploaded to the s3-bucket
var uploadParams = {
    Bucket: bucketName,
    Key: s3Key,
    Body: ''
}
// object retreived from the s3-buckets
var getParams = {
    Bucket: bucketName,
    Key: s3Key
}

const bucketPromise = new AWS.S3({apiVersion: '2006-03-01'})

router.get('/', (req, res) => {
    bucketPromise.getObject(getParams, function(err, data) {
        if(err) {
            console.log(err)
        }
        if (data) {
            // get the count value, add 1 to it and parse it to the uploadParams
            uploadParams.Body = (parseInt(data.Body.toString('ascii')) + 1).toString()
            // console.log(uploadParams)

            // upload the updated count value
            bucketPromise.upload(uploadParams, function(err, data) {
            if(err) {
                console.log(err)
            }
            if (data) {
                console.log("Get count: ", uploadParams.Body)
                res.json(JSON.stringify(uploadParams.Body))
            }
        })
        }
    })
})

module.exports = router;