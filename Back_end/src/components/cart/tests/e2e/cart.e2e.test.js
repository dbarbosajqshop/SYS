import { describe, it, beforeEach, afterEach } from 'mocha';
import * as chai from 'chai';
import sinon from 'sinon';
import CartController from '../../cart.controller.js';
import Cart from '../../schema/cart.schema.js';
import validEmptyCart from '../mocks/validEmptyCart.json' assert {type: 'json'}
import mongoose from 'mongoose';
import CartService from '../../cart.service.js';

const expect = chai.expect;

describe('CartController', function() {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: { limit: '2', page: '1', ordenacao: '_id:-1' },
      result: validEmptyCart,
      body: validEmptyCart,
      params: { id: '60a0c43b5f4b5c23d8d7e57a' },
      userId: '60a0c43b5f4b5c23d8d7e57b',
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

  describe('getCartById', () => {
    it('should get a cart successfully', async () => {
      sinon.stub(CartService, 'getCart').resolves(validEmptyCart);
      sinon.stub(Cart, 'findOne').resolves(validEmptyCart);

      await CartController.getCartById(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(validEmptyCart)).to.be.true;
    });

    it('should return error when cart is not found', async () => {
      sinon.stub(Cart, 'findOne').resolves(null);

      await CartController.getCartById(req, res, next);

      expect(next.called).to.be.true;
      expect(next.getCall(0).args[0].message).to.equal('Carrinho não encontrado.');
    });
  });

  describe('createEmptyCart', () => {
    it('should create a cart successfully', async () => {
      const newCart = validEmptyCart;

      sinon.stub(Cart, 'findOne').resolves(null);
      sinon.stub(Cart.prototype, 'save').resolves(newCart);
      
      await CartController.createEmptyCart(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith(newCart)).to.be.true;
    });
  });
});
