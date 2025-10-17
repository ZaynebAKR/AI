const request = require('supertest');
const app = require('../src/app'); 

beforeEach(() => {

  app.locals.todos.length = 0;
});

describe("TODO API", () => {
  it("POST /todos -> 201 + created object", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Acheter du pain" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Acheter du pain");
  });

  it("POST /todos duplicate title -> 400", async () => {

    const first = await request(app)
      .post("/todos")
      .send({ title: "Doublon test" });
    expect(first.statusCode).toBe(201);

    const res = await request(app)
      .post("/todos")
      .send({ title: "Doublon test" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Duplicate title not allowed"); 
  });

  it("GET /todos -> list", async () => {
    const res = await request(app).get("/todos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /todos/:id -> 404 if missing", async () => {
    const res = await request(app).put("/todos/9999").send({ completed: true });
    expect(res.statusCode).toBe(404);
  });

  it("DELETE /todos/:id -> 404 if missing", async () => {
    const res = await request(app).delete("/todos/doesnotexist");
    expect(res.statusCode).toBe(404);
  });

  it("load test: create many todos", async () => {
    for (let i = 0; i < 100; i++) {
      const res = await request(app).post("/todos").send({ title: `Task ${i}` });
      expect(res.statusCode).toBe(201);
    }
    const list = await request(app).get("/todos");
    expect(list.body.length).toBeGreaterThanOrEqual(100);
  });
});
