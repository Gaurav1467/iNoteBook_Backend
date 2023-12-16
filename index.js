const connectToMongo = require('./db');
var cors = require('cors')
const express = require('express')
const app = express()
const port = 5000


app.use(cors())


connectToMongo();

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`iNotebook app listen at ${port}. `)
})


