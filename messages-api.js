const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const messages = []

const checkMessagesLimitMiddleware = (req, res, next) => {
    if (messages.length === 5) {
        res.status(429).end()
    }
    
    else {
        next()
    }
}

app.post('/messages', checkMessagesLimitMiddleware, (req, res) => {
    if (!req.body.text || req.body.text.trim().length === 0) {
        return res.status(400).end()
    }

    if (req.body.text) {
        console.log(req.body.text)
        messages.push(req.body.text)
        return res.json({
            "message": "Message received loud and clear"
        })
    }

    else {
        return res.status(400).end()
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))