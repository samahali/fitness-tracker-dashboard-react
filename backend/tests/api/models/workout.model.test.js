import { expect } from "chai";
import mongoose from "mongoose";
import Workout from "../../../api/models/workout.model.js";

describe("Workout Model", () => {
  before(async () => {
    process.env.NODE_ENV = "test";
    const mongoUri = process.env.MONGO_TEST_URI;
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await Workout.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should create a valid workout", async () => {
    const workoutData = {
      user: new mongoose.Types.ObjectId(),
      type: "cardio",
      exercise: "Running",
      duration: 30,
      caloriesBurned: 300,
      notes: "Morning run in the park",
    };

    const workout = new Workout(workoutData);
    const savedWorkout = await workout.save();

    expect(savedWorkout._id).to.exist;
    expect(savedWorkout.type).to.equal("cardio");
    expect(savedWorkout.exercise).to.equal("Running");
    expect(savedWorkout.duration).to.equal(30);
    expect(savedWorkout.caloriesBurned).to.equal(300);
    expect(savedWorkout.notes).to.equal("Morning run in the park");
  });

  it("should not allow invalid workout types", async () => {
    const invalidWorkout = new Workout({
      user: new mongoose.Types.ObjectId(),
      type: "invalid_type",
      exercise: "Push-ups",
      duration: 15,
    });

    try {
      await invalidWorkout.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors.type).to.exist;
    }
  });

  it("should not allow duration less than 1 minute", async () => {
    const invalidWorkout = new Workout({
      user: new mongoose.Types.ObjectId(),
      type: "strength",
      exercise: "Bench Press",
      duration: 0, // Values less than 1 are not allowed
    });

    try {
      await invalidWorkout.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors.duration).to.exist;
      expect(error.errors.duration.message).to.equal("Duration must be at least 1 minute");
    }
  });

  it("should set default caloriesBurned to 0", async () => {
    const workoutData = {
      user: new mongoose.Types.ObjectId(),
      type: "flexibility",
      exercise: "Yoga",
      duration: 20,
    };

    const workout = new Workout(workoutData);
    const savedWorkout = await workout.save();

    expect(savedWorkout.caloriesBurned).to.equal(0); // Default value should be 0
  });

  it("should trim extra spaces from exercise and notes", async () => {
    const workoutData = {
      user: new mongoose.Types.ObjectId(),
      type: "balance",
      exercise: "  Tai Chi  ", // Contains extra spaces
      duration: 25,
      notes: "  Focus on breathing  ",
    };

    const workout = new Workout(workoutData);
    const savedWorkout = await workout.save();

    expect(savedWorkout.exercise).to.equal("Tai Chi"); // Extra spaces should be removed
    expect(savedWorkout.notes).to.equal("Focus on breathing");
  });
});
