import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Stock from "../../schemas/stock.schema.js";
import stockWithoutRequiredField from '../mocks/stockWithoutRequiredField.json' assert { type: 'json' };
import validStock from '../mocks/validStock.json' assert { type: 'json' };
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

describe('Stock Model test suite', () => {  
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

  it("shouldn't create and save a stock without required name field", async () => {
    const stockReceived = new Stock(stockWithoutRequiredField);
    let err;
    
    try {
      await stockReceived.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).to.be.not.undefined;  
  });

  it('should update a stock by code', async () => {
    const stock = new Stock(validStock);
    await stock.save();

    stock.code = 'LF1';
    stock.updatedBy = 'admin';
    await stock.save();
    
    const updatedStock = await Stock.findById(stock._id);
    expect(updatedStock.code).to.equal('LF1'); 
    expect(updatedStock.updatedBy).to.equal('admin'); 
  });
  
  it('should create and save a stock successfully', async () => {
    const stockReceived = new Stock(validStock);
    const savedStock = await stockReceived.save();

    expect(savedStock._id).to.be.not.undefined; 
    expect(savedStock.name).to.equal('Loja Física'); 
    expect(savedStock.description).to.be.not.undefined; 
    expect(savedStock.code).to.equal('LJF'); 
    expect(savedStock.createdBy).to.equal('admin'); 
  }); 
});
