const { fetchTopics, fetchArticleId } = require("../models/topic.model");
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

module.exports = { getTopics, getApi, getArticleId };
