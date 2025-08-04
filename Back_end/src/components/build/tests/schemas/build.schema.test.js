import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Build from "../../schema/build.schema.js";
import buildWithoutRequiredField from '../mocks/buildWithoutRequiredField.json' assert { type: 'json' };
import validBuild from '../mocks/validBuild.json' assert { type: 'json' };

import validStock from '../../../stock/tests/mocks/validStock.json' assert { type: 'json' };
import validStreet from '../../../street/tests/mocks/validStreet.json' assert { type: 'json' };
import validUser from '../../../auth/tests/mocks/validUser.json' assert { type: 'json' };

import Stock from "../../../stock/schemas/stock.schema.js";
import Street from "../../../street/schemas/street.schema.js";
import User from "../../../auth/schema/user.schema.js";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

describe('Build Model test suite', () => {
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

  it("shouldn't create and save a build without required name field", async () => {
    const buildReceived = new Build(buildWithoutRequiredField);
    let err;

    try {
      await buildReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).to.be.not.undefined;
  });

  it('should update a build by code', async () => {
    const user = new User(validUser);
    await user.save();

    const stock = new Stock(validStock);
    await stock.save();

    const street = new Street({
      StockId: stock._id,
      ...validStreet
    });
    await street.save();

    const build = new Build({
      StreetId: street._id,  
      ...validBuild,
      createdBy: user._id
    });
    await build.save();

    build.code = '006';
    build.updatedBy = user._id;
    build.updatedAt = new Date();
    await build.save();

    const updatedBuild = await Build.findById(build._id);
    
    expect(updatedBuild.code).to.equal('006');
    expect(updatedBuild.updatedBy.toString()).to.equal(user._id.toString());  
  });

  it('should create and save a build successfully', async () => {
    const user = new User(validUser);
    await user.save();

    const stock = new Stock(validStock);
    await stock.save();

    const street = new Street({
      StockId: stock._id,
      ...validStreet
    });
    await street.save();

    const buildReceived = new Build({
      StreetId: street._id,
      ...validBuild,
      createdBy: user._id
    });
    const savedBuild = await buildReceived.save();

    expect(savedBuild._id).to.be.not.undefined;
    expect(savedBuild.name).to.equal('001');
    expect(savedBuild.description).to.be.not.undefined;
    expect(savedBuild.code).to.equal('001');
    
    // Comparação dos IDs como strings
    expect(savedBuild.createdBy.toString()).to.equal(user._id.toString());  
  });
});
