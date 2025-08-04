import sinon from 'sinon';
import mongoose from 'mongoose';
import Cashier from '../../schemas/cashier.schema.js';
import CashierService from '../../service/cashier.service.js';

import { expect } from 'chai';
import ErrorBase from '../../../../errors/base.error.js';


describe('CashierService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('addCreditCartAtCashier', () => {
    it('should update creditCartValue and return updated cashier', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const mockCashier = {
        _id: new mongoose.Types.ObjectId(),
        cashierUserLogin: mockUserId,
        active: true,
      };

      const mockUpdatedCashier = { ...mockCashier, creditCartValue: 100 };

      // Mock do `findOne`
      sinon.stub(Cashier, 'findOne').resolves(mockCashier);

      // Mock do `findByIdAndUpdate`
      sinon.stub(Cashier, 'findByIdAndUpdate').resolves(mockUpdatedCashier);

      const result = await CashierService.addCreditCartAtCashier(mockUserId, 100);

      expect(result).to.deep.equal(mockUpdatedCashier); // Asserção do resultado
      expect(Cashier.findOne.calledOnce).to.be.true;
      expect(Cashier.findByIdAndUpdate.calledOnce).to.be.true;
    });

    it('should throw an error if no active cashier is found', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
    
      // Simula a ausência de um caixa ativo
      sinon.stub(Cashier, 'findOne').resolves(null);
    
      try {
        await CashierService.addCreditCartAtCashier(mockUserId, 100);
        throw new Error('Test failed: Error not thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(ErrorBase); 
        expect(error.message).to.equal('Caixa de usuário não encontrado!');
        expect(error.status).to.equal(409); 
      } finally {
        sinon.restore();
      }
    });
    
  });

  describe('addDebitCartAtCashier', () => {
    it('should update debitCartValue and return updated cashier', async () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const mockCashier = {
        _id: new mongoose.Types.ObjectId(),
        cashierUserLogin: mockUserId,
        active: true,
      };

      const mockUpdatedCashier = { ...mockCashier, debitCartValue: 50 };

      // Mock do `findOne`
      sinon.stub(Cashier, 'findOne').resolves(mockCashier);

      // Mock do `findByIdAndUpdate`
      sinon.stub(Cashier, 'findByIdAndUpdate').resolves(mockUpdatedCashier);

      const result = await CashierService.addDebitCartAtCashier(mockUserId, 50);

      expect(result).to.deep.equal(mockUpdatedCashier); // Asserção do resultado
      expect(Cashier.findOne.calledOnce).to.be.true;
      expect(Cashier.findByIdAndUpdate.calledOnce).to.be.true;
    });

    it('should throw an error if no active cashier is found', async () => {
      const mockUserId = new mongoose.Types.ObjectId();

      sinon.stub(Cashier, 'findOne').resolves(null);
    
      try {
        await CashierService.addDebitCartAtCashier(mockUserId, 100);
        throw new Error('Test failed: Error not thrown');
      } catch (error) {
        expect(error).to.be.instanceOf(ErrorBase); // Verifica o tipo do erro
        expect(error.message).to.equal('Caixa de usuário não encontrado!'); // Verifica a mensagem do erro
        expect(error.status).to.equal(409); // Verifica o status correto
      } finally {
        // Restaura o comportamento original do stub
        sinon.restore();
      }
    });    
  });


});
