/**
 * @jest-environment node
 */
const http = require("http");

const config = require("../config");
const app = require("../server");

let server;
let port;

beforeAll((done) => {
  config.latencyMs = 0;
  server = app.listen(0, () => {
    port = server.address().port;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

// http.get keeps the raw path, unlike fetch which normalises "..".
const get = (rawPath) =>
  new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port, path: rawPath }, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      })
      .on("error", reject);
  });

describe("GET /images", () => {
  test("returns three items for a category page", async () => {
    const { status, body } = await get("/images?category=nature&page=2");
    const images = JSON.parse(body);

    expect(status).toBe(200);
    expect(images.map((image) => image.name)).toEqual([
      "nature_4",
      "nature_5",
      "nature_6",
    ]);
    expect(images[0]).toEqual({
      category: "nature",
      name: "nature_4",
      url: `http://localhost:${config.port}/static/images/nature/nature_4.jpeg`,
    });
  });

  test("defaults to page 1", async () => {
    const { body } = await get("/images?category=fashion");
    expect(JSON.parse(body).map((image) => image.name)).toEqual([
      "fashion_1",
      "fashion_2",
      "fashion_3",
    ]);
  });

  test("returns a short final page and an empty page past the end", async () => {
    const last = await get("/images?category=architecture&page=8");
    const past = await get("/images?category=architecture&page=9");

    expect(JSON.parse(last.body).map((image) => image.name)).toEqual([
      "architecture_22",
      "architecture_23",
    ]);
    expect(JSON.parse(past.body)).toEqual([]);
  });

  test.each(["0", "-1", "1.5", "abc", "1e3", "", "10001"])(
    "rejects page=%p instead of wrapping around",
    async (page) => {
      const { status } = await get(`/images?category=nature&page=${page}`);
      expect(status).toBe(400);
    }
  );

  test.each(["../config", "Nature", "nature%00", "unknown"])(
    "rejects unknown category %p",
    async (category) => {
      const { status } = await get(`/images?category=${category}`);
      expect(status).toBe(400);
    }
  );

  test("rejects a repeated category param", async () => {
    const { status } = await get("/images?category=nature&category=fashion");
    expect(status).toBe(400);
  });
});

describe("GET /static", () => {
  test("serves fixture images", async () => {
    const { status } = await get("/static/images/nature/nature_1.jpeg");
    expect(status).toBe(200);
  });

  test.each([
    "/static/../config.js",
    "/static/%2e%2e/config.js",
    "/static/images/..%2f..%2fconfig.js",
    "/static/images/%2e%2e%2f%2e%2e%2fserver.js",
  ])("does not escape the public folder via %s", async (rawPath) => {
    const { status, body } = await get(rawPath);
    expect([400, 403, 404]).toContain(status);
    expect(body).not.toMatch(/module\.exports|require\(/);
  });
});
