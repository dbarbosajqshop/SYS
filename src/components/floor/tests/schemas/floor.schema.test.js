import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import validFloor from '../mocks/validFloor.json' assert { type: 'json' };
import floorWithoutRequiredField from '../mocks/floorWithoutRequiredField.json' assert { type: 'json' };
import Floor from "../../schema/floor.schema.js";

import validUser from '../../../auth/tests/mocks/validUser.json' assert { type: 'json' };
import validStock from '../../../stock/tests/mocks/validStock.json' assert { type: 'json' };
import validStreet from '../../../street/tests/mocks/validStreet.json' assert { type: 'json' };
import validBuild from '../../../build/tests/mocks/validBuild.json' assert { type: 'json' };

import User from "../../../auth/schema/user.schema.js";
import Stock from "../../../stock/schemas/stock.schema.js";
import Street from "../../../street/schemas/street.schema.js";
import Build from "../../../build/schema/build.schema.js";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

describe('Floor Model test suite', () => {
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

  it("shouldn't create and save a floor without required name field", async () => {
    const floorReceived = new Floor(floorWithoutRequiredField);
    let err;

    try {
      await floorReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).to.be.not.undefined;
  });

  it('should update a floor by code', async () => {
    const user = new User(validUser);
    await user.save();

    const stock = new Stock(validStock);
    await stock.save();

    const street = new Street({ StockId: stock._id, ...validStreet });
    await street.save();

    const build = new Build({ StreetId: street._id, ...validBuild, createdBy: user._id });
    await build.save();

    const floor = new Floor({ BuildId: build._id, ...validFloor, createdBy: user._id });

    floor.code = 'AAB';
    floor.updatedBy = user._id;
    floor.updatedAt = new Date();
    await floor.save();

    const updatedFloor = await Floor.findById(floor._id);

    // Comparação de ObjectId como string
    expect(updatedFloor.code).to.equal('AAB');
    expect(updatedFloor.updatedBy.toString()).to.equal(user._id.toString());
  });

  it('should create and save a floor successfully', async () => {
    const user = new User(validUser);
    await user.save();

    const stock = new Stock(validStock);
    await stock.save();

    const street = new Street({ StockId: stock._id, ...validStreet });
    await street.save();

    const build = new Build({ StreetId: street._id, ...validBuild, createdBy: user._id });
    await build.save();

    const floorReceived = new Floor({ BuildId: build._id, ...validFloor, createdBy: user._id });
    const savedFloor = await floorReceived.save();

    expect(savedFloor._id).to.be.not.undefined;
    expect(savedFloor.name).to.equal('AAA');
    expect(savedFloor.description).to.be.not.undefined;
    expect(savedFloor.code).to.equal('AAA');
    
    expect(savedFloor.createdBy.toString()).to.equal(user._id.toString());
  });
});
