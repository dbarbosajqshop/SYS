import mongoose from "mongoose";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { MongoMemoryServer } from "mongodb-memory-server";
import * as chai from 'chai';
const expect = chai.expect;
import validCart from '../mocks/validCart.json' assert { type: 'json' };
import validClient from '../../../client/tests/mocks/validClient.json' assert { type: 'json' };
import validStockedItem from '../../../item/tests/mocks/validStockedItem.json' assert { type: 'json' };
import validUser from '../../../auth/tests/mocks/validUser.json' assert { type: 'json' };
import validItem from '../../../item/tests/mocks/validItem.json' assert { type: 'json' };
import cartWithoutRequiredField from '../mocks/cartWithoutRequiredField.json' assert { type: 'json' };
import Cart from "../../schema/cart.schema.js";
import Client from "../../../client/schema/client.schema.js";
import StockedItem from "../../../item/schema/stockedItem.schema.js";
import User from "../../../auth/schema/user.schema.js";
import Item from "../../../item/schema/item.schema.js";

describe('Cart Model with StockedItem validation', function() {
  this.timeout(10000);

  let mongoServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const user = new User(validUser)
    await user.save();

    const item = new Item(validItem)
    await item.save();

    const stockedItem = new StockedItem({...validStockedItem, ItemId: item._id, createdBy: user._id});
    await stockedItem.save();

    const client = new Client({...validClient, createdBy: user._id});
    await client.save();

    validCart.ClientId = client._id;
    validCart.SellerId = user._id;
    validCart.createdBy = user._id;
    validCart.Items = [{ ItemId: item._id, quantity: 5 }];
  });

  afterEach(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('should create and save a cart successfully with valid stocked items and quantities', async () => {
    const cartReceived = new Cart(validCart);
    const savedCart = await cartReceived.save();

    expect(savedCart._id).to.exist;
    expect(savedCart.Items[0].quantity).to.equal(validCart.Items[0].quantity);
  });
});