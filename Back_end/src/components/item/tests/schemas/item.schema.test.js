import mongoose from "mongoose";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { MongoMemoryServer } from "mongodb-memory-server";
import * as chai from 'chai';
const expect = chai.expect;
import validUser from '../../../auth/tests/mocks/adminUser.json' assert { type: 'json' };
import validItem from '../mocks/validItem.json' assert { type: 'json' };
import itemWithoutRequiredField from '../mocks/itemWithoutRequiredField.json' assert { type: 'json' };
import Item from "../../schema/item.schema.js";
import User from "../../../auth/schema/user.schema.js";

describe('Item Model test suite', function() {
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

  it("shouldn't create and save an item without required name field", async () => {
    const itemReceived = new Item(itemWithoutRequiredField);
    let err;

    try {
      await itemReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).to.exist;
  });

  it('should create and save an item successfully', async () => {
    const user = new User(validUser);
    await user.save();

    const itemReceived = new Item({ ...validItem, createdBy: user._id });
    const savedItem = await itemReceived.save();

    expect(savedItem._id).to.exist;
    expect(savedItem.sku).to.equal('ARM012SJX');
    expect(savedItem.name).to.equal('Arma de bolinha de gel');
    expect(savedItem.description).to.equal('Arma de disparos de bolinha de gel, comporta 1000 bolinhas');
    expect(savedItem.price).to.equal(60.9);
    expect(savedItem.height).to.equal(6);
    expect(savedItem.width).to.equal(12);
    expect(savedItem.depth).to.equal(3);
    expect(savedItem.weight).to.equal(1.4);
    expect(savedItem.quantityBox).to.equal(20);
    expect(savedItem.color).to.equal('blue');
    expect(savedItem.createdBy.toString()).to.equal(user._id.toString());
  });

  it('should update an item by code', async () => {
    const user = new User(validUser);
    await user.save();

    const item = new Item({ ...validItem, createdBy: user._id });
    await item.save();

    item.upc = '193218784021';
    item.updatedBy = user._id;
    item.updatedAt = new Date();
    await item.save();
    const updatedItem = await Item.findById(item._id);

    expect(updatedItem.upc).to.equal('193218784021');
    expect(updatedItem.updatedBy.toString()).to.equal(user._id.toString());
  });
});