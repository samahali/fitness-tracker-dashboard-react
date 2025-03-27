import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { authController } from "../../../api/controllers/index.js";
import { User } from "../../../api/models/index.js";

describe("Auth Controller", () => {
  let fakeUserData;

  beforeEach(() => {
    fakeUserData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
      age: faker.number.int({ min: 18, max: 60 }),
      gender: faker.helpers.arrayElement(["male", "female", "other"]),
      weight: faker.number.float({ min: 50, max: 100, precision: 0.1 }),
      height: faker.number.float({ min: 150, max: 200, precision: 0.1 }),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should register a new user and return a token", async () => {
    const req = { body: fakeUserData };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    // Mock User.findOne to return null (user does not exist)
    sinon.stub(User, "findOne").resolves(null);

    // Mock User.prototype.save to resolve successfully
    sinon.stub(User.prototype, "save").resolves();

    // Mock JWT signing
    const fakeToken = faker.string.uuid();
    sinon.stub(jwt, "sign").returns(fakeToken);

    await authController.register(req, res, next);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(sinon.match({ token: fakeToken }))).to.be.true;
  });

  it("should return 400 if email is already in use", async () => {
    const req = { body: fakeUserData };
    const res = {};
    const next = sinon.stub();

    // Mock User.findOne to return an existing user
    sinon.stub(User, "findOne").resolves(fakeUserData);

    await authController.register(req, res, next);

    expect(next.calledWith(sinon.match({ status: 400, message: "Email is already in use" }))).to.be.true;
  });

  it("should log in an existing user and return a token", async () => {
    const req = { body: { email: fakeUserData.email, password: fakeUserData.password } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();
    const mockUser = {
        _id: faker.database.mongodbObjectId(),
        email: fakeUserData.email,
        password: fakeUserData.password,
        comparePassword: sinon.stub().resolves(true),  // Ensure it returns a Promise!
        toObject: () => ({ ...fakeUserData, password: undefined }),
      };

    sinon.stub(User, "findOne").callsFake(() => ({
        select: sinon.stub().resolves(mockUser),
    }));
      
    sinon.stub(jwt, "sign").returns(faker.string.uuid());
  
    await authController.login(req, res, next);
  
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("token"))).to.be.true;
  });

  it("should return 401 if email or password is incorrect", async () => {
    const req = { body: { email: fakeUserData.email, password: "wrongpassword" } };
    const res = {};
    const next = sinon.stub();
  
    // Properly stub User.findOne().select() to return null
    sinon.stub(User, "findOne").callsFake(() => ({
      select: sinon.stub().resolves(null), // Ensures `select()` returns null
    }));
  
    await authController.login(req, res, next);
  
    expect(next.calledWith(sinon.match({ status: 401, message: "Invalid email or password" }))).to.be.true;
  });  

});
