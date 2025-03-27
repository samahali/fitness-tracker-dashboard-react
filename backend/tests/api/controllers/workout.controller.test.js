import { expect } from "chai";
import sinon from "sinon";
import { Workout } from "../../../api/models/index.js";
import { faker } from "@faker-js/faker";

const getControllers = async () => {
  const { getWorkouts } = await import("../../../api/controllers/workout.controller.js");
  const { addWorkout } = await import("../../../api/controllers/workout.controller.js");
  const { updateWorkout } = await import("../../../api/controllers/workout.controller.js");
  const { deleteWorkout } = await import("../../../api/controllers/workout.controller.js");
  return { getWorkouts, addWorkout, updateWorkout, deleteWorkout };
};

describe("Workout Controller", () => {
  let req, res, next;
  let fakeUserId, fakeWorkoutId, fakeWorkout;
  let controllers;

  before(async () => {
    controllers = await getControllers();
  });

  beforeEach(() => {
    fakeUserId = faker.database.mongodbObjectId();
    fakeWorkoutId = faker.database.mongodbObjectId();
    fakeWorkout = {
      _id: fakeWorkoutId,
      user: fakeUserId,
      type: faker.helpers.arrayElement(["Cardio", "Strength", "Yoga"]),
      exercise: faker.lorem.words(2),
      duration: faker.number.int({ min: 10, max: 120 }),
      caloriesBurned: faker.number.int({ min: 100, max: 1000 }),
      notes: faker.lorem.sentence(),
    };

    req = { user: { userId: fakeUserId }, params: { id: fakeWorkoutId }, body: {} };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub(), send: sinon.stub() };
    next = sinon.stub();
    sinon.restore();
  });

  // ✅ Test: Get Workouts
  it("should fetch all workouts for a user", async () => {
    const mockWorkouts = [fakeWorkout, { ...fakeWorkout, _id: faker.database.mongodbObjectId() }];
    sinon.stub(Workout, "find").resolves(mockWorkouts);

    await controllers.getWorkouts(req, res, next);

    expect(res.json.calledWith(mockWorkouts)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should handle errors when fetching workouts", async () => {
    sinon.stub(Workout, "find").throws(new Error("Database error"));

    await controllers.getWorkouts(req, res, next);

    expect(next.called).to.be.true;
  });

  // ✅ Test: Add Workout
  it("should add a new workout", async () => {
    req.body = {
      type: fakeWorkout.type,
      exercise: fakeWorkout.exercise,
      duration: fakeWorkout.duration,
      caloriesBurned: fakeWorkout.caloriesBurned,
      notes: fakeWorkout.notes,
    };
    sinon.stub(Workout.prototype, "save").resolves(fakeWorkout);

    await controllers.addWorkout(req, res, next);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(fakeWorkout)).to.be.true;
  });

  it("should handle errors when adding a workout", async () => {
    req.body = {
      type: fakeWorkout.type,
      exercise: fakeWorkout.exercise,
      duration: fakeWorkout.duration,
    };
    sinon.stub(Workout.prototype, "save").throws(new Error("Save error"));

    await controllers.addWorkout(req, res, next);

    expect(next.called).to.be.true;
  });

  // ✅ Test: Update Workout
  it("should update a workout", async () => {
    req.body = { type: "Updated Type", duration: 45 };
    const updatedWorkout = { ...fakeWorkout, ...req.body };
    sinon.stub(Workout, "findOneAndUpdate").resolves(updatedWorkout);

    await controllers.updateWorkout(req, res, next);

    expect(res.json.calledWith(updatedWorkout)).to.be.true;
  });

  it("should return 404 if workout to update is not found", async () => {
    sinon.stub(Workout, "findOneAndUpdate").resolves(null);

    await controllers.updateWorkout(req, res, next);

    expect(next.calledWithMatch({ status: 404, message: "Workout not found" })).to.be.true;
  });

  it("should handle errors when updating a workout", async () => {
    sinon.stub(Workout, "findOneAndUpdate").throws(new Error("Update error"));

    await controllers.updateWorkout(req, res, next);

    expect(next.called).to.be.true;
  });

  // ✅ Test: Delete Workout
  it("should delete a workout", async () => {
    sinon.stub(Workout, "findOneAndDelete").resolves(fakeWorkout);

    await controllers.deleteWorkout(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: "Workout deleted successfully" })).to.be.true;
  });

  it("should return 404 if workout to delete is not found", async () => {
    sinon.stub(Workout, "findOneAndDelete").resolves(null);

    await controllers.deleteWorkout(req, res, next);

    expect(next.calledWithMatch({ status: 404, message: "Workout not found" })).to.be.true;
  });

  it("should handle errors when deleting a workout", async () => {
    sinon.stub(Workout, "findOneAndDelete").throws(new Error("Delete error"));

    await controllers.deleteWorkout(req, res, next);

    expect(next.called).to.be.true;
  });
});
