import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../schema/user.schema.js";

import validUser from '../mocks/validUser.json' assert { type: 'json' };
import userWithoutRequiredField from '../mocks/userWithoutRequiredField.json' assert { type: 'json' };

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

describe('User Model test suite', () => {
  let mongoServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("shouldn't create and save a user without name", async () => {
    const userReceived = new User(userWithoutRequiredField);
    let err;

    try {
      await userReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).to.be.not.undefined;
  });

  it('should update a user by email', async () => {
    const user = new User(validUser);
    await user.save();

    user.email = 'contato@johndoe.com';
    user.updatedBy = 'admin';
    await user.save();

    const updatedUser = await User.findById(user._id);

    expect(updatedUser.email).to.equal('contato@johndoe.com');
    expect(updatedUser.updatedBy).to.equal('admin');
  });

  it('should create and save a user successfully', async () => {
    const userReceived = new User(validUser);
    const savedUser = await userReceived.save();

    expect(savedUser._id).to.be.not.undefined;
    expect(savedUser.name).to.equal('John Doe');
    expect(savedUser.email).to.equal('john.doe@example.com');
    expect(savedUser.createdBy).to.equal('admin');
  });
});
