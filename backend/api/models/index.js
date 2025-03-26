/**
 * Model Index File.
 *
 * This module imports and exports all Mongoose models, making it easier to 
 * manage and use them in different parts of the application.
 *
 * @module models
 *
 * @requires ./user.model.js - User model for storing user-related data.
 * @requires ./workout.model.js - Workout model for managing workout records.
 * @requires ./goal.model.js - Goal model for tracking fitness goals.
 * @requires ./auth_token.model.js - AuthToken model for handling authentication tokens.
 *
 * @example
 * import { User, Workout, Goal, AuthToken } from './models/index.js';
 * const users = await User.find();
 */
import User from "./user.model.js";
import Workout from "./workout.model.js";
import Goal from "./goal.model.js";
import AuthToken from "./auth_token.model.js";

export {
  User,
  Workout,
  Goal,
  AuthToken,
};
