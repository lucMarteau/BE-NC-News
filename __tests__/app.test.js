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
})
describe("Errors on /api/articles/:article_id", () => {
  test("GET: 404 article should respond with Not found", () => {
    return request(app)
    .get("/api/random")
    .expect(404)
    .then((res) => {
      expect(res.body).toEqual({ msg: "Not Found" })
    })

  });
  test("GET: 404 and responds with an appropriate status and error message when given a valid but non existent query ", () => {
    return request(app)
      .get("/api/articles/1000")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ msg: "Not Found" });
      });
  });
});
