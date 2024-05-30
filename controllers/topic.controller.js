const { fetchTopics, fetchArticleId, fetchArticles, fetchArticleComments, addArticleComment, updateArticleVotes, updateDeletedComment } = require("../models/topic.model");
const apiEndpoints = require("../endpoints.json");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topicData) => {
      res.status(200).send({ topicData });
    })
    .catch(next);
};
const getApi = (req, res, next) => {
  res.status(200).send(apiEndpoints);

};
const getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
const getArticles = (req, res, next) => {
  fetchArticles()
  .then((articleData) => {
    res.status(200). send({ articleData })
  })
  .catch(next);
}
const getArticleIdComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleComments(article_id)
    .then((commentData) => {
      res.status(200).send({ commentData });
    })
    .catch(next);
}
const postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Username and body required." });
  }

  addArticleComment(article_id, username, body)
    .then((commentData) => {
      res.status(201).send({ commentData });
    })
    .catch((err) => {
      if (err.message === "Not Found") {
        res.status(404).send({ msg: "Not Found" });
      } else {
        next(err);
      }
    });
};
const patchUpdateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== 'number') {
    return res.status(400).send({ msg: 'Invalid input type' });
  }
  updateArticleVotes(article_id, inc_votes)
  .then((updatedArticle) => {
    res.status(200).send({ updatedArticle });
  })
  .catch((err) => {
    if (err.message === "Not Found") {
      res.status(404).send({ msg: "Not Found" });
    } else {
      next(err);
    }
  });
}
const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  updateDeletedComment(comment_id)
  .then((commentData) => {
    console.log(commentData)
    res.status(204).send(commentData);
})
.catch(next)
}
module.exports = { getTopics, getApi, getArticleId, getArticles, getArticleIdComments, postArticleComment, patchUpdateVotes, deleteComment };
