import { expect } from "chai";
import sinon from "sinon";
import { Goal } from "../../../api/models/index.js";
import { faker } from "@faker-js/faker";

const getControllers = async () => {
  const { getGoals } = await import("../../../api/controllers/goal.controller.js");
  const { addGoal } = await import("../../../api/controllers/goal.controller.js");
  const { updateGoal } = await import("../../../api/controllers/goal.controller.js");
  const { deleteGoal } = await import("../../../api/controllers/goal.controller.js");
  return { getGoals, addGoal, updateGoal, deleteGoal };
};

describe("Goals Controller", () => {
  let req, res, next;
  let fakeUserId, fakeGoalId, fakeGoal;
  let controllers;

  before(async () => {
    controllers = await getControllers();
  });

  beforeEach(() => {
    fakeUserId = faker.database.mongodbObjectId();
    fakeGoalId = faker.database.mongodbObjectId();
    fakeGoal = {
      _id: fakeGoalId,
      goalType: faker.lorem.word(),
      targetValue: faker.number.int({ min: 1, max: 100 }),
      unit: faker.helpers.arrayElement(["km", "kg", "minutes"]),
      deadline: faker.date.future(),
      user: fakeUserId,
    };

    req = { user: { userId: fakeUserId }, params: { id: fakeGoalId }, body: {} };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub(), send: sinon.stub() };
    next = sinon.stub();
    sinon.restore();
  });

  // ✅ Test: Get Goals
  it("should fetch all goals for a user", async () => {
    const mockGoals = [fakeGoal, { ...fakeGoal, _id: faker.database.mongodbObjectId() }];
    sinon.stub(Goal, "find").resolves(mockGoals);

    await controllers.getGoals(req, res, next);

    expect(res.json.calledWith(mockGoals)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should handle errors when fetching goals", async () => {
    sinon.stub(Goal, "find").throws(new Error("Database error"));

    await controllers.getGoals(req, res, next);

    expect(next.called).to.be.true;
  });

  // ✅ Test: Add Goal
  it("should add a new goal", async () => {
    req.body = {
      goalType: fakeGoal.goalType,
      targetValue: fakeGoal.targetValue,
      unit: fakeGoal.unit,
      deadline: fakeGoal.deadline,
    };
    sinon.stub(Goal.prototype, "save").resolves(fakeGoal);

    await controllers.addGoal(req, res, next);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(fakeGoal)).to.be.true;
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = {}; // Missing goalType, targetValue, and unit

    await controllers.addGoal(req, res, next);

    expect(next.calledWithMatch({ status: 400, message: "Goal type, target value, and unit are required" })).to.be.true;
  });

  it("should handle errors when adding a goal", async () => {
    req.body = {
      goalType: fakeGoal.goalType,
      targetValue: fakeGoal.targetValue,
      unit: fakeGoal.unit,
    };
    sinon.stub(Goal.prototype, "save").throws(new Error("Save error"));

    await controllers.addGoal(req, res, next);

    expect(next.called).to.be.true;
  });

  // ✅ Test: Update Goal
  it("should update a goal", async () => {
    req.body = { goalType: faker.lorem.word(), targetValue: faker.number.int({ min: 1, max: 100 }) };
    const updatedGoal = { ...fakeGoal, ...req.body };
    sinon.stub(Goal, "findByIdAndUpdate").resolves(updatedGoal);

    await controllers.updateGoal(req, res, next);

    expect(res.json.calledWith(updatedGoal)).to.be.true;
  });

  it("should return 404 if goal to update is not found", async () => {
    sinon.stub(Goal, "findByIdAndUpdate").resolves(null);

    await controllers.updateGoal(req, res, next);

    expect(next.calledWithMatch({ status: 404, message: "Goal not found" })).to.be.true;
  });

  it("should handle errors when updating a goal", async () => {
    sinon.stub(Goal, "findByIdAndUpdate").throws(new Error("Update error"));

    await controllers.updateGoal(req, res, next);

    expect(next.called).to.be.true;
  });

  // ✅ Test: Delete Goal
  it("should delete a goal", async () => {
    sinon.stub(Goal, "findByIdAndDelete").resolves(fakeGoal);

    await controllers.deleteGoal(req, res, next);

    expect(res.status.calledWith(204)).to.be.true;
  });

  it("should return 404 if goal to delete is not found", async () => {
    sinon.stub(Goal, "findByIdAndDelete").resolves(null);

    await controllers.deleteGoal(req, res, next);

    expect(next.calledWithMatch({ status: 404, message: "Goal not found" })).to.be.true;
  });

  it("should handle errors when deleting a goal", async () => {
    sinon.stub(Goal, "findByIdAndDelete").throws(new Error("Delete error"));

    await controllers.deleteGoal(req, res, next);

    expect(next.called).to.be.true;
  });
});
