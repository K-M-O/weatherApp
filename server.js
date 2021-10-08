// Setup empty JS object to act as endpoint for all routes

var projectData = []

// Require Express to run server and routes

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()

// key generator

function generateHexString(length) {
    var ret = "";
    while (ret.length < length) {
      ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
}

//Here we are configuring express to use body-parser as middle-ware.

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())

// Cors for cross origin allowance

app.use(cors())

// Initialize the main project folder

app.use(express.static('website'));

// get route

app.get('/data',(req,res)=>{
    res.json(projectData[projectData.length-1])
})

// post route

app.post('/dataEntry',async (req,res)=>{
    var zip = req.body.zip
    var response = req.body.response
    var date = req.body.date
    var temp = req.body.temp
    projectData.push({[`object`]:{id:generateHexString(26),temp:temp,date:date,response:response,zip:zip}})
    console.log(projectData)
    res.cookie('entry','filled')
    res.redirect('/')
})

// Setup Server

app.listen(process.env.PORT || 3000,e=>{
    console.log('server is running')
})