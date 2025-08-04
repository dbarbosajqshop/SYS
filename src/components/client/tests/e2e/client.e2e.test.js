//client.e2e.test.js
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;
import sinon from 'sinon';
import ClientController from '../../client.controller.js';
import Client from '../../schema/client.schema.js';
import validClient from '../mocks/validClient.json' assert { type: 'json' };
import paginable from '../../../../middlewares/paginable.manipulator.js';
import arrayValidClients from '../mocks/arrayValidClients.json' assert { type: 'json' };

describe('ClientController', function() {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: { limit: '2', page: '1', ordenacao: '_id:-1' },
      result: arrayValidClients,
      params: { id: '60a0c43b5f4b5c23d8d7e57a'},
      body: validClient,
      userId: '60a0c43b5f4b5c23d8d7e57a'
    };
    
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub(),
    };
    
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAll', () => {
    it('Deve retornar clientes cadastrados corretamente', async () => {
      const clientsMock = arrayValidClients;

      sinon.stub(Client, 'find').resolves(clientsMock);

      await ClientController.getAll(req, res, next);
      await paginable(req, res, next);

      expect(res.status.calledWith(200)).to.be.true; 
      expect(res.json.calledWith({
        data: clientsMock.slice(0, 2),
        totalItems: clientsMock.length,
        totalPages: Math.ceil(clientsMock.length / 2),
        currentPage: 1,
        limit: 2,
      })).to.be.true; 
      expect(next.called).to.be.true; 
    });

    it('Deve retornar erro 404 quando não há clientes cadastrados', async () => {
      sinon.stub(Client, 'find').resolves([])

      await ClientController.getAll(req, res, next)

      expect(next.calledWithMatch({ message: 'Nenhum cliente cadastrado.' })).to.be.true
    });
  });

  describe('getById', () => {
    it('Deve retornar um cliente com sucesso', async () => {
      sinon.stub(Client, 'findOne').resolves(req.body);

      await ClientController.getById(req, res, next);

      expect(res.send.calledWith(req.body)).to.be.true;
    });

    it('Deve retornar erro 404 quando cliente não é encontrado', async () => {
      sinon.stub(Client, 'findOne').resolves(null);

      await ClientController.getById(req, res, next);

      expect(next.calledWithMatch({ message: 'Cliente não cadastrado.' })).to.be.true
    });
  });

  describe('create', () => {
    it('Deve criar um novo cliente com sucesso', async () => {
      req.body = validClient
      req.userId = '60a0c43b5f4b5c23d8d7e57a'

      sinon.stub(Client, 'find').resolves([]);

      const saveStub = sinon.stub(Client.prototype, 'save').resolves(req.body)
      await ClientController.create(req, res, next);
      expect(saveStub.calledOnce).to.be.true
      expect(res.send.calledWith(req.body)).to.be.true
    });

    it('Deve retornar erro de conflito ao tentar criar cliente existente', async () => {
      req.body = validClient

      sinon.stub(Client, 'find').resolves([req.body])

      await ClientController.create(req, res, next)

      expect(next.calledWithMatch({ message: 'Conflito em cliente já existente' })).to.be.true
    })
  });

  describe('update', () => {
    it('Deve atualizar um cliente com sucesso', async () => {
      const updatedClient = new Client(req.body);

      sinon.stub(Client, 'findByIdAndUpdate').resolves(updatedClient);

      await ClientController.update(req, res, next);

      expect(res.send.calledWith(updatedClient)).to.be.true;
    });

    it('Deve retornar erro quando a atualização do cliente falhar', async () => {
      const error = new Error('Erro na atualização do cliente');

      sinon.stub(Client, 'findByIdAndUpdate').rejects(error);

      await ClientController.update(req, res, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('delete', () => {
    it('Deve deletar um cliente com sucesso', async () => {
      const deletedClient = new Client(req.body);
      sinon.stub(Client, 'findByIdAndUpdate').resolves(deletedClient);
      await ClientController.delete(req, res, next);
      expect(res.send.calledWith({ message: `Cliente ${deletedClient.name} inativado.`})).to.be.true;
    });
  
    it('Deve retornar erro quando a deleção do cliente falhar', async () => {
      const error = new Error('Erro na deleção do cliente');
      sinon.stub(Client, 'findByIdAndUpdate').rejects(error);
      await ClientController.delete(req, res, next);
      expect(next.calledWith(error)).to.be.true;
    });
  });
});
