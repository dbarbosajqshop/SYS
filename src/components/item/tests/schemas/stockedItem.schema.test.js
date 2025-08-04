import mongoose from "mongoose";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { MongoMemoryServer } from "mongodb-memory-server";
import * as chai from 'chai';
const expect = chai.expect;
import stockedItemErrorEnum from "../mocks/stocked-item-error-enum.json" assert { type: 'json' };
import StockedItem from "../../schema/stockedItem.schema.js";

describe('StockedItem Model test suite', function() {
  this.timeout(10000);
  
  let mongoServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("shouldn't save a stocked item with wrong type enum field", async () => {
    const itemReceived = new StockedItem(stockedItemErrorEnum);
    let err;
    
    try {
      await itemReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.type).to.exist;
  });

});