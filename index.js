const express = require("express");
const cors = require("cors");
const route = require('./routes/router');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', route);

const port = 4000;
app.listen(port, () => console.log("Up & Running on port ", port));

