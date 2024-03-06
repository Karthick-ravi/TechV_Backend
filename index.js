const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors')
const server = express();
const port = 3000;

const fileRoutes = require('./routes/fileRoute');

server.use(cors());

server.use(express.json());

// Use example routes
server.use('/api', fileRoutes);




server.listen(port, () => {
  console.log(`server running at port ${port}`)
})

