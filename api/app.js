const express = require('express')
const app = express()
const port = 5000

//****NOTE***
// Returning response status of front-end api only just
// because localStorage is only available in browsers on the Window object. The Window object is not available server side
//**********

app.get('/getOrders', (req, res) => {
    if (res.statusCode) {
        res.send({
            status: true
        })
    } else {
        res.send({
            status: false
        })
    }
})
app.post('/addOrder', (req, res) => {
    if (res.statusCode) {
        res.send({
            status: true
        })
    } else {
        res.send({
            status: false
        })
    }
})
app.put('/updateOrder', (req, res) => {
    if (res.statusCode) {
        res.send({
            status: true,
            id: req.query.id
        })
    } else {
        res.send({
            status: false,
            id: null
        })
    }
})
app.delete('/removeOrder', (req, res) => {
    if (res.statusCode) {
        res.send({
            status: true,
            id: req.query.id
        })
    } else {
        res.send({
            status: false,
            id: null
        })
    }
})
app.listen(port, () => {
    console.log(`API is running on port: ${port}`)
})
