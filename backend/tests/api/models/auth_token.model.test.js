import { expect } from "chai";
import mongoose from "mongoose";
import AuthToken from "../../../api/models/auth_token.model.js";

describe("AuthToken Model", () => {
  before(async () => {
    process.env.NODE_ENV = "test";
    const mongoUri = process.env.MONGO_TEST_URI
    await mongoose.connect(mongoUri);

    // await dbInstance.connect(); // Ensure connection to the test database
  });

  afterEach(async () => {
    await AuthToken.deleteMany({}); // Clean up the collection after each test
  });

  after(async () => {
    await mongoose.connection.close(); // Close the connection after all tests are done
  });

  it("should create a valid AuthToken", async () => {
    const tokenData = {
      user: new mongoose.Types.ObjectId(), // Generate a random user ID
      token: "test-jwt-token",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // One hour from now
    };

    const authToken = new AuthToken(tokenData);
    const savedToken = await authToken.save();

    expect(savedToken._id).to.exist;
    expect(savedToken.token).to.equal("test-jwt-token");
  });

  it("should not allow duplicate tokens", async () => {
    const tokenData = {
      user: new mongoose.Types.ObjectId(),
      token: "duplicate-token",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    };

    await new AuthToken(tokenData).save(); // Save the first token

    try {
      await new AuthToken(tokenData).save(); // Attempt to save the same token again
    } catch (error) {
      expect(error).to.exist;
      expect(error.code).to.equal(11000); // MongoDB error code for duplicate key
    }
  });

  it("should delete expired tokens manually", async function () {
    this.timeout(5000); // Increase the test timeout
    
    const expiredToken = new AuthToken({
      user: new mongoose.Types.ObjectId(),
      token: "expired-token",
      expiresAt: new Date(Date.now() - 1000), // Expired
    });
  
    await expiredToken.save();

  // Manually delete expired tokens instead of relying on TTL Index
    await AuthToken.deleteMany({ expiresAt: { $lte: new Date() } });
  
    const foundToken = await AuthToken.findOne({ token: "expired-token" });
    expect(foundToken).to.be.null; // It should have been deleted
  });
  
});
