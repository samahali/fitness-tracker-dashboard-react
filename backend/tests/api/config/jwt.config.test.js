import { expect } from "chai";
import { jwtSecret, jwtExpiresIn } from "../../../api/config/index.js";

describe("JWT Configuration", () => {
  it("should have a JWT secret key", () => {
    expect(jwtSecret).to.not.be.empty;
  });

  it("should have a default expiration time of 1 hour", () => {
    expect(jwtExpiresIn).to.equal("1h");
  });
});
