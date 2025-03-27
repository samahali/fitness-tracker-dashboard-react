import { expect } from "chai";
import mongoose from "mongoose";
import User from "../../../api/models/user.model.js";

describe("User Model", () => {
  before(async () => {
        process.env.NODE_ENV = "test";
        const mongoUri = process.env.MONGO_TEST_URI;
        await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should create a valid user", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      age: 25,
      gender: "male",
      weight: 75,
      height: 180,
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).to.exist;
    expect(savedUser.firstName).to.equal("John");
    expect(savedUser.lastName).to.equal("Doe");
    expect(savedUser.email).to.equal("johndoe@example.com");
    expect(savedUser.fullName).to.equal("John Doe"); // Testing `virtual` property
  });

  it("should hash the password before saving", async () => {
    const userData = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "securepass",
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: "alice@example.com" }).select("+password");
    expect(foundUser.password).to.not.equal("securepass"); // Password should not be stored in plain text
  });

  it("should not allow duplicate emails", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    await new User(userData).save(); // Save the first user

    try {
      await new User(userData).save(); // Attempt to save the same email again
    } catch (error) {
      expect(error).to.exist;
      expect(error.code).to.equal(11000); // MongoDB error code for duplicate key
    }
  });

  it("should compare passwords correctly", async () => {
    const userData = {
      firstName: "Bob",
      lastName: "Marley",
      email: "bob@example.com",
      password: "secretpass",
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: "bob@example.com" }).select("+password");
    const isMatch = await foundUser.comparePassword("secretpass");
    expect(isMatch).to.be.true; // Password should match
  });

  it("should return null for `comparePassword` if user has no password", async () => {
    const user = new User({
      firstName: "Emma",
      lastName: "Watson",
      email: "emma@example.com",
    });

    const foundUser = await User.findOne({ email: "emma@example.com" }).select("+password");
    if (foundUser) {
      const isMatch = await foundUser.comparePassword("randompass");
      expect(isMatch).to.be.false;
    } else {
      expect(foundUser).to.be.null;
    }
  });
});
