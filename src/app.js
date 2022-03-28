const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utills/geocode')
const forecast = require('./utills/forecast')

const app = express()
const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views',viewPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicPath))


app.get('',(req, res)=>{
    res.render('index',{
        title: 'Weather App',
        name: 'Yash Desai'
    })
})

app.get('/about',(req, res)=>{
    res.render('about',{
        title: 'About Us',
        name : 'Yash Desai'
    })
})

app.get('/help',(req, res)=>{
    res.render('help', {
        title : 'Need Help?',
        contact : 'Contact Us',
        name : 'Yash Desai'
    })
})

//routing to weather page
app.get('/weather', (req, res)=>{
    if(!req.query.address){
     return res.send({
         error: 'Please enter address'
     })   
    }

    geocode(req.query.address,(error,{latitude, longitude, location}={})=>{
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData)=>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast : forecastData,
                location,
                address: req.query.address
            })
        })
    })
   
})

app.get('/products',(req, res)=>{
    if(!req.query.search){
        return res.send({
            error:'Please enter search term'
        })
    }
    console.log(req.query.search);
    res.send({
        products:[]
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title : '404',
        name :'Yash Desai',
        errorMessage : 'Help article not found.'
    })
})

app.get('*',(req, res)=>{
    res.render('404',{
        title: '404',
        name:'Yash Desai',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, ()=>{
    console.log('Server is up on port'+ port);
})