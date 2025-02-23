const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express();

app.use(cors())

app.use(express.json()) //if we know this line we'll get an error(undefined body)

app.get('/', (req,res)=>{
    res.send('Hello World')
})

app.use('/ai', aiRoutes);

module.exports = app