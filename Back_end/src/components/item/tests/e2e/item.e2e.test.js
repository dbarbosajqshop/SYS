import { describe, it, beforeEach, afterEach } from 'mocha'
import * as chai from 'chai';
const expect = chai.expect;
import sinon from 'sinon'
import ItemController from '../../item.controller.js'
import Item from '../../schema/item.schema.js'
import validItem from '../mocks/validItem.json' assert { type: 'json' };
import arrayValidItems from '../mocks/arrayValidItems.json' assert { type: 'json' };
import itemWithoutRequiredField from '../mocks/itemWithoutRequiredField.json' assert { type: 'json' };
import paginable from '../../../../middlewares/paginable.manipulator.js';

describe('ItemController', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      query: { limit: '2', page: '1', ordenacao: '_id:-1' },
      result: arrayValidItems, 
    };
    
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub(),
    };
    
    next = sinon.stub();
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('getAll', () => {
    it('Deve retornar itens paginados corretamente', async () => {
      const itemsMock = arrayValidItems;

      sinon.stub(Item, 'find').resolves(itemsMock);

      await ItemController.getAll(req, res, next);
      await paginable(req, res, next);

      expect(res.status.calledWith(200)).to.be.true; 
      expect(res.json.calledWith({
        data: itemsMock.slice(0, 2),
        totalItems: itemsMock.length,
        totalPages: Math.ceil(itemsMock.length / 2),
        currentPage: 1,
        limit: 2,
      })).to.be.true; 
      expect(next.called).to.be.true; 
    });

    it('Deve retornar erro 404 quando não há itens cadastrados', async () => {
      sinon.stub(Item, 'find').resolves([])

      await ItemController.getAll(req, res, next)

      expect(next.calledWithMatch({ message: 'Nenhum item cadastrado.' })).to.be.true
    })
  })

  describe('create', () => {
    it('Deve criar um novo item com sucesso', async () => {
      req.body = validItem
      req.userId = '60a0c43b5f4b5c23d8d7e57a'

      sinon.stub(Item, 'find').resolves([])

      const saveStub = sinon.stub(Item.prototype, 'save').resolves(req.body)
      await ItemController.create(req, res, next)
      expect(saveStub.calledOnce).to.be.true
      expect(res.send.calledWith(req.body)).to.be.true
    })

    it('Deve retornar erro de conflito ao tentar criar item existente', async () => {
      req.body = validItem

      sinon.stub(Item, 'find').resolves([req.body])

      await ItemController.create(req, res, next)

      expect(next.calledWithMatch({ message: 'Conflito em item já existente' })).to.be.true
    })
  })
})