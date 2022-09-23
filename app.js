const express = require('express')
const rateLimit = require("express-rate-limit")


const min_time = 0
const today = Date.now();

const app = express()

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	max: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: true, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.get('/howold', (req, res, next)=>{
    const {dob} = req.query
    if (dob && (dob > min_time) && ((dob * 1000) < today)) {
        const myDate = new Date(dob * 1000)
        const daysDiff = Math.round((today - myDate) / (1000 * 60 * 60  * 24))
        const timestamp = dob
        const year = myDate.getFullYear()
        const month = myDate.getUTCMonth() + 1
        const day = myDate.getDate()
        const age = Math.floor(daysDiff / 356)

        const content = {timestamp,  year,
                month, day, age}
        
        res.status(200).json(content)
    }
    else{

        res.status(400).json({'error': 'Invalid dob value'})
    }
    
})

app.listen(3000)

