import { expect } from "chai";
import { dbInstance } from "../../../api/config/index.js";
import mongoose from "mongoose";

describe("Database Connection", () => {
  it("should connect to the test database", async () => {
    const connection = await dbInstance.connect();

    // Ensure the connection is not null
    expect(connection).to.not.be.null;

    // Verify that the connection is of type Mongoose
    expect(mongoose.connection.readyState).to.equal(1); // 1 means the connection is active

    // Check that the connected database is correct
    expect(mongoose.connection.name).to.equal("testdb");
  });

  after(async () => {
    await mongoose.connection.close(); // Close the connection after the test
  });
});
