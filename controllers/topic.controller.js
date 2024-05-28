const {fetchTopics} = require('../models/topic.model')

const getTopics = (req, res, next) => {
  fetchTopics()
  .then((topicData) => {
    // console.log(topicData)
    res.status(200).send({ topicData })
  })
  .catch(next)
}


 module.exports = { getTopics }
