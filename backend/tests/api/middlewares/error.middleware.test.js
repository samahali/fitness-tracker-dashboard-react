import { expect } from "chai";
import sinon from "sinon";
import { errorMiddleware } from "../../../api/middlewares/index.js";
import { logger } from "../../../utils/index.js";

describe("Error Middleware", () => {
  let req, res, next, loggerStub;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.spy();
    loggerStub = sinon.stub(logger, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should log the error and return a 500 status with a default message", () => {
    const error = new Error("Something went wrong");

    errorMiddleware(error, req, res, next);

    expect(loggerStub.calledOnce).to.be.true;
    expect(loggerStub.calledWith(`Error: ${error}`)).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ error: true, message: "Something went wrong" })).to.be.true;
  });

  it("should use the provided status code and message if available", () => {
    const error = { message: "Custom Error", status: 400 };

    errorMiddleware(error, req, res, next);

    expect(loggerStub.calledOnce).to.be.true;
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ error: true, message: "Custom Error" })).to.be.true;
  });
});
