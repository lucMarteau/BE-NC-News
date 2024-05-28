const express = require("express");
const app = express();
const { getTopics, getApi } = require("./controllers/topic.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/", getApi);

module.exports = app;
