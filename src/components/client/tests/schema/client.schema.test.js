import mongoose from "mongoose";
import { describe, it, beforeEach, afterEach } from 'mocha';
import { MongoMemoryServer } from "mongodb-memory-server";
import * as chai from 'chai';
const expect = chai.expect;
import validUser from '../../../auth/tests/mocks/adminUser.json' assert { type: 'json' };
import validClient from '../mocks/validClient.json' assert { type: 'json' };
import clientWithoutRequiredField from '../mocks/clientWithoutRequiredField.json' assert { type: 'json' };
import Client from "../../schema/client.schema.js";
import User from "../../../auth/schema/user.schema.js";

describe('Client Model test suite', function() {
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

  it("shouldn't create and save a client without required name field", async () => {
    const clientData = new Client(clientWithoutRequiredField);
    let err;

    try {
      await clientData.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).to.exist;
  });

  it('should create and save a client successfully', async () => {
    const user = new User(validUser);
    await user.save();

    const clientData = new Client({ ...validClient, createdBy: user._id });
    const savedClient = await clientData.save();

    expect(savedClient._id).to.exist;
    expect(savedClient.name).to.equal('John Doe');
    expect(savedClient.cnpj).to.equal('12345678000195');
    expect(savedClient.cpf).to.equal('12345678901');
    expect(savedClient.address.street).to.equal('Main St');
    expect(savedClient.address.state).to.equal('SP');
    expect(savedClient.address.zip).to.equal('12345-678');
    expect(savedClient.email).to.equal('johndoe@example.com');
    expect(savedClient.telephoneNumber).to.equal('1234567890');
    expect(savedClient.createdBy.toString()).to.equal(user._id.toString());
  });

  it('should update a client email successfully', async () => {
    const user = new User(validUser);
    await user.save();

    const clientData = new Client({ ...validClient, createdBy: user._id });
    await clientData.save();

    clientData.email = "newemail@example.com";
    clientData.updatedBy = user._id;
    clientData.updatedAt = new Date();
    await clientData.save();
    const updatedClient = await Client.findById(clientData._id);

    expect(updatedClient.email).to.equal("newemail@example.com");
    expect(updatedClient.updatedBy.toString()).to.equal(user._id.toString());
  });
});
