import { expect } from "chai";
import sinon from "sinon";
import { faker } from "@faker-js/faker"; // Use latest faker version

// Lazy-load controllers to prevent circular dependencies
const getControllers = async () => {
  const { createUser } = await import("../../../api/controllers/user.controller.js");
  const { updateProfile } = await import("../../../api/controllers/user.controller.js");
  const { getUserDetails } = await import("../../../api/controllers/user.controller.js");
  const { uploadAvatar } = await import("../../../api/controllers/user.controller.js");
  return { createUser, updateProfile, getUserDetails, uploadAvatar };
};

import { User } from "../../../api/models/index.js";
import { cloudinary } from "../../../api/config/index.js";

// Generate fake user data
const mockUserData = {
  _id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  age: faker.number.int({ min: 18, max: 80 }),
  gender: faker.helpers.arrayElement(["male", "female"]),
  weight: faker.number.int({ min: 40, max: 150 }),
  height: faker.number.int({ min: 140, max: 200 }),
  profileImage: faker.image.avatar(),
};

// Mock a Mongoose user instance
const mockUser = new User(mockUserData);

describe("User Controller - Unit Tests", () => {
  let controllers;

  before(async () => {
    controllers = await getControllers(); // Load controllers dynamically
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs after each test
  });

  // Test: Create User
  it("should create a new user successfully", async () => {
    const req = { body: mockUserData };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    sinon.stub(User, "findOne").resolves(null); // No existing user
    sinon.stub(User.prototype, "save").resolves(mockUser); // Mock save()

    await controllers.createUser(req, res, next);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: "User created successfully" })).to.be.true;
  });

  // Test: Prevent Duplicate User Creation
  it("should return error if email already exists", async () => {
    const req = { body: { email: mockUser.email } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    sinon.stub(User, "findOne").resolves(mockUser); // User already exists

    await controllers.createUser(req, res, next);

    expect(next.calledWithMatch({ status: 400, message: "Email already in use" })).to.be.true;
  });

    // Test: Update Profile (FIXED)
    it("should update user profile", async () => {
        const updatedUser = { ...mockUserData, firstName: "Updated Name" };

        const req = {
        user: { userId: mockUser._id, email: mockUser.email },
        body: { firstName: "Updated Name" }, // ✅ Ensure this matches what the controller expects
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        const next = sinon.stub();

        // ✅ Ensure `findByIdAndUpdate` returns the full updated user object
        sinon.stub(User, "findByIdAndUpdate").resolves(updatedUser);

        await controllers.updateProfile(req, res, next);

        // ✅ Ensure correct response
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch(updatedUser)).to.be.true; // ✅ Match full object
    });  

  // Test: Prevent Email Change
  it("should return error if user tries to change email", async () => {
    const req = {
      user: { userId: mockUser._id, email: mockUser.email },
      body: { email: "newemail@example.com" },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    await controllers.updateProfile(req, res, next);

    expect(next.calledWithMatch({ status: 400, message: "Email cannot be changed." })).to.be.true;
  });

  // Test: Upload Avatar
  it("should upload avatar and return new image URL", async () => {
    const req = {
      user: { userId: mockUser._id },
      file: { originalname: "avatar.jpg", buffer: Buffer.from("fake image data") },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    const mockUploadResult = { secure_url: faker.image.url() };

    sinon.stub(User, "findById").resolves(mockUser);
    sinon.stub(cloudinary.uploader, "upload").resolves(mockUploadResult);
    sinon.stub(cloudinary.uploader, "destroy").resolves({ result: "ok" });
    sinon.stub(mockUser, "save").resolves();

    await controllers.uploadAvatar(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ profileImage: mockUploadResult.secure_url })).to.be.true;
  });

  // Test: Handle No File Upload
  it("should return error if no file is uploaded", async () => {
    const req = { user: { userId: mockUser._id }, file: null };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    await controllers.uploadAvatar(req, res, next);

    expect(next.calledWithMatch({ status: 400, message: "No file uploaded!" })).to.be.true;
  });

  // Test: Handle Missing User in Upload
  it("should return error if user not found", async () => {
    const req = { user: { userId: faker.string.uuid() }, file: { buffer: Buffer.from("image") } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    sinon.stub(User, "findById").resolves(null);

    await controllers.uploadAvatar(req, res, next);

    expect(next.calledWithMatch({ status: 404, message: "User not found!" })).to.be.true;
  });

  // Test: Get User Details
  it("should return logged-in user details", async () => {
    const req = { user: mockUser };
    const res = { json: sinon.stub() };

    controllers.getUserDetails(req, res);

    expect(res.json.calledWith(mockUser)).to.be.true;
  });
});
