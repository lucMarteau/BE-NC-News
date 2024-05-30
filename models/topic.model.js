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
const fetchArticles = () => {
  return db.query(`SELECT 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comment_id) AS comment_count
  FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`
).then(({ rows }) => {
  return rows.map(article => ({
    ...article,
    comment_count: parseInt(article.comment_count)
  }));
  });
}
const fetchArticleComments = (article_id) => {
  return db.query(`SELECT
  comments.comment_id,
  comments.votes,
  comments.created_at,
  comments.author,
  comments.body,
  comments.article_id
  FROM Comments WHERE article_id = $1 ORDER BY comments.created_at DESC`, [article_id]).then(({ rows }) => {
    return rows;
})
}
const addArticleComment = (article_id, username, body) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject(new Error("Not Found"));
      }
      return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
        [article_id, username, body]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
const updateArticleVotes = (article_id, inc_votes) => {
  return db.query(
    'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
    [inc_votes, article_id]
  )
  .then(({ rows }) => {
    return rows[0];
  })
}

module.exports = { fetchTopics, fetchArticleId, fetchArticles, fetchArticleComments, addArticleComment, updateArticleVotes };
