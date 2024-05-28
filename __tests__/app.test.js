const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endpointsObject = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

const data = require("../db/data/test-data/");
beforeEach(() => {
  return seed(data);
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
        console.log(endpointsObject)
        expect(body).toEqual(endpointsObject);
      });
  });
});
