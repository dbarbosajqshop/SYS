import mongoose from "mongoose";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { MongoMemoryServer } from "mongodb-memory-server";
import * as chai from 'chai';
const expect = chai.expect;
import validUser from '../../../auth/tests/mocks/adminUser.json' assert { type: 'json' };
import validPurchase from '../mocks/validPurchase.json' assert { type: 'json' };
import purchaseWithoutRequiredField from '../mocks/purchaseWithoutRequiredField.json' assert { type: 'json' };
import User from "../../../auth/schema/user.schema.js";
import Purchase from "../../schema/purchase.schema.js";

describe('Purchase Model test suite', function() {
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

  /*it("shouldn't create and save a purchase without required field", async () => {
    const purchaseReceived = new Purchase(purchaseWithoutRequiredField);
    let err;

    try {
      await purchaseReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.purchaseDate).to.exist;
  });

  it('should create and save a purchase successfully', async () => {
    const user = new User(validUser);
    await user.save();

    const purchaseReceived = new Purchase({ ...validPurchase, createdBy: user._id });
    const savedPurchase = await purchaseReceived.save();

    expect(savedPurchase.Items).to.be.an('array').that.is.not.empty;
    expect(savedPurchase.Items[0].itemId.toString()).to.be.a('string').and.to.equal('66f467b34e6636006b2f0b04')
    expect(savedPurchase.boxQuantity).to.be.a('number')
  });*/

  /*it('should update an item by code', async () => {
    const user = new User(validUser);
    await user.save();

    const item = new Item({ ...validItem, createdBy: user._id });
    await item.save();

    item.upc = 193218784021;
    item.updatedBy = user._id;
    item.updatedAt = new Date();
    await item.save();
    const updatedItem = await Item.findById(item._id);

    expect(updatedItem.upc).to.equal(193218784021);
    expect(updatedItem.updatedBy.toString()).to.equal(user._id.toString());
  });*/
});