require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
  console.log(req.params.name.toLowerCase());

  //assign a data to spirit and opportunity
  //curiousity is updats everyday. using a yesterday's

    try {
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=1GQnEpGo5TrFJcvqBu78maegnuu3dl2814tnZj1c`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})
//`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
