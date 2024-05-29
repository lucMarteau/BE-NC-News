const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
const fetchArticleId = (article_id) => {
  return db.query(`SELECT * FROM Articles WHERE article_id = $1`, [article_id])
  .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found"})
      }
      return rows[0]
  });
};
module.exports = { fetchTopics, fetchArticleId };
