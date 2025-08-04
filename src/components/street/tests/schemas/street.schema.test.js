import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Street from "../../schemas/street.schema.js";
import streetWithoutRequiredField from '../mocks/streetWithoutRequiredField.json' assert { type: 'json'};
import validStreet from '../mocks/validStreet.json' assert { type: 'json'};

import validStock from '../../../stock/tests/mocks/validStock.json' assert { type: 'json'};
import Stock from "../../../stock/schemas/stock.schema.js";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

describe('Street Model test suite', () => {
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

  it("shouldn't create and save a street without required name field", async () => {
    const streetReceived = new Street(streetWithoutRequiredField);
    let err;
    
    try {
      await streetReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).to.be.not.undefined;  // Correção aqui
  });

  it('should update a street by code', async () => {
    const stock = new Stock(validStock);
    const stockSaved = await stock.save();

    const street = new Street({
      StockId: stockSaved._id,
      ...validStreet
    });
    await street.save();

    street.code = 'RAM';
    street.updatedBy = 'admin';
    await street.save();

    const updatedStreet = await Street.findById(street._id);
    expect(updatedStreet.code).to.equal('RAM');
    expect(updatedStreet.updatedBy).to.equal('admin');
  });

  it('should create and save a street successfully', async () => {
    const stock = new Stock(validStock);
    const stockSaved = await stock.save();

    const streetReceived = new Street({
      StockId: stockSaved._id,
      ...validStreet
    });
    const savedStreet = await streetReceived.save();

    expect(savedStreet._id).to.be.not.undefined;
    expect(savedStreet.name).to.equal('Rua Amarela');
    expect(savedStreet.description).to.be.not.undefined;  // Correção aqui
    expect(savedStreet.code).to.equal('RAM');
    expect(savedStreet.createdBy).to.equal('admin');
  }); 
});
