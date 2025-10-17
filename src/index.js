
import request from "supertest";
import app from "../app.js";

describe("TODO API", () => {
  let createdTodoId;

  beforeEach(() => {

    app.locals.todos = [];
  });

  describe("Health check", () => {
    it("should return status ok", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });

  describe("POST /todos", () => {
    it("should create a todo", async () => {
      const res = await request(app).post("/todos").send({ title: "Test Todo" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Test Todo");
      createdTodoId = res.body.id;
    });

    it("should not create a todo with empty title", async () => {
      const res = await request(app).post("/todos").send({ title: "" });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe("Title is required");
    });

    it("should not create a todo with title > 100 chars", async () => {
      const longTitle = "a".repeat(101);
      const res = await request(app).post("/todos").send({ title: longTitle });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe("Title must be <= 100 characters");
    });

    it("should not create duplicate title", async () => {
      await request(app).post("/todos").send({ title: "Duplicate" });
      const res = await request(app).post("/todos").send({ title: "Duplicate" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Duplicate title not allowed");
    });
  });

  describe("GET /todos", () => {
    it("should return empty array initially", async () => {
      const res = await request(app).get("/todos");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return list of todos", async () => {
      await request(app).post("/todos").send({ title: "Todo 1" });
      const res = await request(app).get("/todos");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /todos/:id", () => {
    it("should get todo by id", async () => {
      const post = await request(app).post("/todos").send({ title: "Todo 2" });
      const res = await request(app).get(`/todos/${post.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Todo 2");
    });

    it("should return 404 for non-existing id", async () => {
      const res = await request(app).get("/todos/12345");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Not found");
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update title and completed", async () => {
      const post = await request(app).post("/todos").send({ title: "Todo 3" });
      const res = await request(app)
        .put(`/todos/${post.body.id}`)
        .send({ title: "Updated", completed: true });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated");
      expect(res.body.completed).toBe(true);
    });

    it("should return 404 for non-existing id", async () => {
      const res = await request(app).put("/todos/12345").send({ title: "X" });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Not found");
    });

    it("should not allow invalid title", async () => {
      const post = await request(app).post("/todos").send({ title: "Todo 4" });
      const res = await request(app).put(`/todos/${post.body.id}`).send({ title: "" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid title");
    });

    it("should not allow duplicate title", async () => {
      await request(app).post("/todos").send({ title: "Existing" });
      const post = await request(app).post("/todos").send({ title: "Todo 5" });
      const res = await request(app).put(`/todos/${post.body.id}`).send({ title: "Existing" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Duplicate title not allowed");
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete todo by id", async () => {
      const post = await request(app).post("/todos").send({ title: "To Delete" });
      const res = await request(app).delete(`/todos/${post.body.id}`);
      expect(res.status).toBe(204);
    });

    it("should return 404 for non-existing id", async () => {
      const res = await request(app).delete("/todos/12345");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Not found");
    });
  });
});
