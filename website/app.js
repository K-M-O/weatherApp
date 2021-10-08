/* Global Variables */

const weatherKey = 'aaea1c4eea88152e03c7ed065bcf558a'

const countryCodeKey = '37d88c09606cc6a6cc306e0a2080095788525153ce19ee8a49a0fd7f'

var lat,lon,weatherStats,temp

// get last entry data

var url = window.location.origin

// get cookie value

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

if (getCookieValue('entry') === 'filled'){
    entryDataFetch()
}

// fetch last entry

async function entryDataFetch(){
    try {
        const response = await fetch(`${url}/data`)
        response.json().then(result=>{
            dynamicallyChangeEntry(result['object'])
        })
    } catch (err) {
        console.error(err)
    }
}

// get user location (geolocation)

async function countryCodeFetch(){
    try {
        const response = await fetch(`https://api.ipdata.co/?api-key=${countryCodeKey}`)
        response.json().then(result=>{
            lat = result.latitude
            lon = result.longitude
        })
    } catch (err) {
        console.error(err);
    }
}

countryCodeFetch()

// get weather stats from openweathermap

async function weatherFetch(){
    console.log('fetching weather API...')
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&appid=${weatherKey}`)
        response.json().then(result=>{
            async function res(){
                var temp = await result
                saveTemp(temp)
            }
            res()
        })
    } catch (err) {
        console.error(err);
    }
}

// save the tempreture value

async function saveTemp(temp){
    var tempo = Promise.resolve(temp)
    tempo.then(res=>{
        document.getElementById('tempInput').value = res['list'][0]['main']['temp']
        recordTime()
    })
}

// record current date

function recordTime(){
    let d = new Date()
    let newDate = d.getMonth()+'/'+ d.getDate()+'/'+ d.getFullYear()
    document.getElementById('dateInput').value = newDate
    checkValues()
}

//check values

function checkValues(){
    if (document.getElementById('date').value === '') {
        alert('The website cant get your current date correctly please try again')
        return
    }
    if (document.getElementById('temp').value === '') {
        alert('The website cant get the weather stats for your city please make sure you are entering right zip code and not annoymous')
        return
    }
    if (document.getElementById('zip').value === '') {
        alert('You need to enter your city zip code to get weather stats')
        return
    }
    if (document.getElementById('response').value === '') {
        alert('you have to write answer "how are you feeling today" question to complete the entry')
        return
    }
    submitEntry()
}

// submit the entry

function submitEntry(){
    document.forms["entryForm"].submit()
    entryDataFetch()
}

// add event listener to generate button

document.getElementById('generate').addEventListener('click',e=>{
    weatherFetch()
})

function dynamicallyChangeEntry(result){
    document.getElementById('date').innerText = result.date
    document.getElementById('temp').innerText = result.temp
    document.getElementById('content').innerText = result.response
}