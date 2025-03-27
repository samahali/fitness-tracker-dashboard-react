import { expect } from "chai";
import mongoose from "mongoose";
import Goal from "../../../api/models/goal.model.js";

describe("Goal Model", () => {
  before(async () => {
        process.env.NODE_ENV = "test";
        const mongoUri = process.env.MONGO_TEST_URI;
        await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await Goal.deleteMany({}); // Clean up data after each test
  });

  after(async () => {
    await mongoose.connection.close(); // Close the connection after all tests are completed
  });

  it("should create a valid Goal", async () => {
    const goalData = {
      user: new mongoose.Types.ObjectId(), // Random user ID
      goalType: "weight_loss",
      targetValue: 10,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // One month later
    };

    const goal = new Goal(goalData);
    const savedGoal = await goal.save();

    expect(savedGoal._id).to.exist;
    expect(savedGoal.goalType).to.equal("weight_loss");
    expect(savedGoal.unit).to.equal("kg"); // Default should be "kg"
    expect(savedGoal.status).to.equal("in_progress"); // Default value
  });

  it("should not allow invalid goalType values", async () => {
    const invalidGoal = new Goal({
      user: new mongoose.Types.ObjectId(),
      goalType: "invalid_goal_type", // Not allowed
      targetValue: 10,
    });

    try {
      await invalidGoal.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors.goalType).to.exist;
    }
  });

  it("should set the correct default unit based on goalType", async () => {
    const goalData = {
      user: new mongoose.Types.ObjectId(),
      goalType: "strength",
      targetValue: 50,
    };

    const goal = new Goal(goalData);
    const savedGoal = await goal.save();

    expect(savedGoal.unit).to.equal("reps"); // Default should be "reps"
  });

  it("should allow optional deadline", async () => {
    const goalData = {
      user: new mongoose.Types.ObjectId(),
      goalType: "flexibility",
      targetValue: 30,
    };

    const goal = new Goal(goalData);
    const savedGoal = await goal.save();

    expect(savedGoal.deadline).to.be.undefined;
  });
});
