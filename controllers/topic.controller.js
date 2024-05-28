const { fetchTopics } = require("../models/topic.model");
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

module.exports = { getTopics, getApi };
