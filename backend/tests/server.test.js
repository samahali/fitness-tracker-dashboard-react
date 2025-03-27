import { app, startServer, stopServer } from "../server.js";
import request from "supertest";
import { expect } from "chai";

describe("Express API Tests", () => {
  before(async () => {
    process.env.NODE_ENV = "test"; // Set test environment
    await startServer(); // Start server before tests
  });

  after(async () => {
    await stopServer(); // Stop server after tests
  });

  it("should return 200 for GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Fitness Tracker API Running!");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).to.equal(404);
  });
});
