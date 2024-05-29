const express = require("express");
const app = express();
const {
  getTopics,
  getApi,
  getArticleId,
  getArticles,
  getArticleIdComments
} = require("./controllers/topic.controller");

// app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/", getApi);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getArticleIdComments)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
