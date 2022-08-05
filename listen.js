const express = require("express");
const app = express();

const { PORT = 9999 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
