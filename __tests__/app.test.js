const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endpointsObject = require("../endpoints.json");

const data = require("../db/data/test-data/");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET: 200 and get all topics from the endpoint", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("GET: 200 and responds with the correct length of the expected array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topicData } = body;
        expect(topicData.length).toBe(3);
        topicData.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
describe("/api", () => {
  test("GET: 200 and responds with an object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsObject);
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET: 200 and responds with an article object with the following properties: author, title, article_id, body, topic, created_at, votes, article_iage_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
});
describe("Errors on /api/articles/:article_id", () => {
  test("GET: 404 and responds with an appropriate status and error message when given a valid but non existent query ", () => {
    return request(app)
      .get("/api/articles/1000")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });
  });
});
describe("/api/articles", () => {
  test("GET: 200 and responds with an article object with the following properties: author, title, article_id, topic, created_at, votes, article_iage_url", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articleData } = body;
        expect(Array.isArray(articleData)).toBe(true);
        expect(articleData.length).toBe(13);
        articleData.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("GET: 200 and checks that articles have been sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articleData } = body;
        const sortedArticleData = [...articleData].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        expect(articleData).toEqual(sortedArticleData);
      });
  });
  test("GET: 404 article should respond with Not found", () => {
    return request(app)
      .get("/api/arcticals")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});
describe('/api/articles/:article_id/comments', () => {
  test('GET: 200 and responds with an empty array when article has no comments', () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(200)
      .then(({ body }) => {
        const { commentData } = body;
        expect(commentData).toEqual([]);
      });
  });
  test('GET: 200 and responds with an array of comment objects with expected properties', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { commentData } = body;
        commentData.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          });
        });
      });
  });
  test('GET: 200 and checks that comments have been sorted by date in descending order', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { commentData } = body;
        const sortedComments = [...commentData].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        expect(commentData).toEqual(sortedComments);
      });
  });
});
// Will need to add a 404 to test where user is present but does not exist
// Will need to add a 400 POST /api/articles/not-a-number/comments

describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 should add a comment to the specified article", () => {
    const newComment = {
      username: "lurker",
      body: "Testing comment 1",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { commentData } = body;
        expect(commentData).toMatchObject({
          comment_id: 19,
          article_id: 1,
          votes: 0,
          author: "lurker",
          body: "Testing comment 1",
        });
      });
  });
  test('POST: 400 if username is missing', () => {
    const newComment = {
      body: 'Testing comment 1'
    };

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Username and body required.');
      });
  });
  test('POST: 404 if the article does not exist', () => {
    const newComment = {
      username: 'lurker',
      body: 'This is a Test Comment'
    };

    return request(app)
      .post('/api/articles/9999/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('PATCH: 200 should update the article votes when given a number which will return an updated article', () => {
    return request(app)
    .patch("/api/articles/1")
    .send ({ inc_votes:1 })
    .expect(200)
    .then(({ body }) => {
      const { updatedArticle } = body;
      expect(updatedArticle).toMatchObject({
        article_id: 1,
        votes: 101
    })
  })
})
test('PATCH: 200 should update the article votes when given a number which will return an updated article', () => {
  return request(app)
  .patch("/api/articles/1")
  .send ({ inc_votes:-100 })
  .expect(200)
  .then(({ body }) => {
    const { updatedArticle } = body;
    expect(updatedArticle).toMatchObject({
      article_id: 1,
      votes: 0
  })
})
})
test('PATCH: 400 if inc_votes is not a number', () => {
  return request(app)
  .patch("/api/articles/1")
  .send ({ inc_votes: 'string' })
  .expect(400)
  .then(({ body }) => {
    expect(body.msg).toBe('Invalid input type');
})
})
test('POST: 404 if the article does not exist', () => {
  return request(app)
    .patch('/api/articles/9999')
    .send({ inc_votes: 1 })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Not Found');
    });
});
})
