import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../../../api/middlewares/index.js";

describe("Authentication Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: sinon.stub() };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    next = sinon.stub();
  });

  it("should return 401 if no token is provided", () => {
    req.header.returns(null); // No token provided

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Access denied. No token provided." })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should return 401 if token is invalid", () => {
    req.header.returns("Bearer invalidtoken");
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Invalid or expired token" })).to.be.true;
    expect(next.notCalled).to.be.true;

    jwt.verify.restore(); // Restore the original function after modification
  });

  it("should call next() if token is valid", () => {
    const validUser = { id: "12345", email: "user@example.com" };
    req.header.returns(`Bearer validtoken`);
    sinon.stub(jwt, "verify").returns(validUser);

    authMiddleware(req, res, next);

    expect(req.user).to.deep.equal(validUser);
    expect(next.calledOnce).to.be.true;

    jwt.verify.restore();
  });
});

