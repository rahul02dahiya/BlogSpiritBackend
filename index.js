const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')
connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json())




app.post('/', (req, res) => 
  res.send('Hello World!')
)


app.listen(port, () => {
  console.log(`BlogSpirit listening at http://localhost:${port}`)
})

