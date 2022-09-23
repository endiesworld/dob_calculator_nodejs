const express = require('express') ;
const rateLimit = require("express-rate-limit") ;

let hostname = process.env.HOSTNAME;

if (hostname == null || hostname == "") {
    hostname = 'localhost';
}

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

const min_time = 0 ;
const today = Date.now();

const app = express() ;

const limiter = rateLimit({
	windowMs: 1 * 1 * 1000, 
	max: 3, 
	standardHeaders: true, 
	legacyHeaders: true, 
}) ;

// Apply the rate limiting middleware to all requests
app.use(limiter) ;

app.get('/howold', (req, res)=>{
    const {dob} = req.query ;
    if (dob && (dob > min_time) && ((dob * 1000) < today)) {
        const myDate = new Date(dob * 1000) ;
        const daysDiff = Math.round((today - myDate) / (1000 * 60 * 60  * 24)) ;
        const timestamp = dob ;
        const year = myDate.getFullYear() ;
        const month = myDate.getUTCMonth() + 1 ;
        const day = myDate.getDate() ;
        const age = Math.floor(daysDiff / 356) ;

        const content = {timestamp,  year,
                month, day, age} ;
        
        res.status(200).json(content) ;
    }
    else{

        res.status(400).json({'error': 'Invalid dob value'}) ;
    }
    
})

app.listen(port);

