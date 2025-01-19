'use strict';

const { Balance } = require('../models');


class BalanceService {
  /**
   * Crea un nuevo balance.
   * @param {Object} balanceData - Datos del balance a crear.
   * @returns {Promise<Object>} - El balance creado.
   * @throws {Error} - Si ocurre un error al crear el balance.
   */
  static async createBalance(balanceData) {
    try {
      return await Balance.create(balanceData);
    } catch (error) {
      console.error('Error creating balance:', error.message);
      throw new Error('Failed to create balance');
    }
  }

  /**
   * Obtiene un balance por su ID.
   * @param {number} balanceId - ID del balance a buscar.
   * @returns {Promise<Object|null>} - El balance encontrado o null si no existe.
   * @throws {Error} - Si ocurre un error al buscar el balance.
   */
  static async getBalanceById(balanceId) {
    try {
      const balance = await Balance.findByPk(balanceId);
      if (!balance) return null;
      return balance;
    } catch (error) {
      console.error('Error retrieving balance:', error.message);
      throw new Error('Failed to retrieve balance');
    }
  }

  /**
   * Obtiene el balance más reciente de un usuario por su ID.
   * @param {number} userId - ID del usuario.
   * @returns {Promise<Object|null>} - El balance más reciente o null si no existe.
   * @throws {Error} - Si ocurre un error al buscar el balance.
   */
  static async getLatestBalanceByUser(userId) {
    try {
      return await Balance.findOne({
        where: { userId },
        order: [['date', 'DESC']],
      });
    } catch (error) {
      console.error('Error retrieving latest balance for user:', error.message);
      throw new Error('Failed to retrieve latest balance');
    }
  }

  /**
   * Actualiza un balance existente.
   * @param {number} balanceId - ID del balance a actualizar.
   * @param {Object} balanceData - Datos actualizados del balance.
   * @returns {Promise<Object>} - El balance actualizado.
   * @throws {Error} - Si el balance no existe o falla la actualización.
   */
  static async updateBalance(balanceId, balanceData) {
    try {
      const balance = await Balance.findByPk(balanceId);
      if (!balance) throw new Error('Balance not found');
      return await balance.update(balanceData);
    } catch (error) {
      console.error('Error updating balance:', error.message);
      throw new Error('Failed to update balance');
    }
  }

  /**
   * Elimina un balance por su ID.
   * @param {number} balanceId - ID del balance a eliminar.
   * @returns {Promise<void>}
   * @throws {Error} - Si el balance no existe o falla la eliminación.
   */
  static async deleteBalance(balanceId) {
    try {
      const balance = await Balance.findByPk(balanceId);
      if (!balance) throw new Error('Balance not found');
      await balance.destroy();
    } catch (error) {
      console.error('Error deleting balance:', error.message);
      throw new Error('Failed to delete balance');
    }
  }
}

module.exports = BalanceService;
