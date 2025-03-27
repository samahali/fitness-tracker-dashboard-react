import { expect } from "chai";
import {cloudinary} from "../../../api/config/index.js";

describe("Cloudinary Configuration", () => {
  it("should have a valid Cloudinary configuration", () => {
    expect(cloudinary.config().cloud_name).to.not.be.empty;
    expect(cloudinary.config().api_key).to.not.be.empty;
    expect(cloudinary.config().api_secret).to.not.be.empty;
  });
});
