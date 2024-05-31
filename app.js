const express = require("express");
const app = express();
const {
  getTopics,
  getApi,
  getArticleId,
  getArticles,
  getArticleIdComments,
  postArticleComment,
  patchUpdateVotes,
  deleteComment,
  getUsers
} = require("./controllers/topic.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/", getApi);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleIdComments);
app.post("/api/articles/:article_id/comments", postArticleComment);
app.patch("/api/articles/:article_id", patchUpdateVotes);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } 
});

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
