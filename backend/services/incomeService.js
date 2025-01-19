'use strict';

const { Income } = require('../models');

class IncomeService {
  /**
   * Crea un nuevo ingreso.
   * @param {Object} incomeData - Datos del ingreso a crear.
   * @returns {Promise<Object>} - El ingreso creado.
   * @throws {Error} - Si ocurre un error al crear el ingreso.
   */
  static async createIncome(incomeData) {
    try {
      return await Income.create(incomeData);
    } catch (error) {
      console.error('Error creating income:', error.message);
      throw new Error('Failed to create income');
    }
  }

  /**
   * Obtiene un ingreso por su ID.
   * @param {number} incomeId - ID del ingreso a buscar.
   * @returns {Promise<Object|null>} - El ingreso encontrado o null si no existe.
   * @throws {Error} - Si ocurre un error al buscar el ingreso.
   */
  static async getIncomeById(incomeId) {
    try {
      const income = await Income.findByPk(incomeId);
      if (!income) return null;
      return income;
    } catch (error) {
      console.error('Error retrieving income:', error.message);
      throw new Error('Failed to retrieve income');
    }
  }

  /**
   * Actualiza un ingreso existente.
   * @param {number} incomeId - ID del ingreso a actualizar.
   * @param {Object} incomeData - Datos actualizados del ingreso.
   * @returns {Promise<Object>} - El ingreso actualizado.
   * @throws {Error} - Si el ingreso no existe o falla la actualización.
   */
  static async updateIncome(incomeId, incomeData) {
    try {
      const income = await Income.findByPk(incomeId);
      if (!income) throw new Error('Income not found');
      return await income.update(incomeData);
    } catch (error) {
      console.error('Error updating income:', error.message);
      throw new Error('Failed to update income');
    }
  }

  /**
   * Elimina un ingreso por su ID.
   * @param {number} incomeId - ID del ingreso a eliminar.
   * @returns {Promise<void>}
   * @throws {Error} - Si el ingreso no existe o falla la eliminación.
   */
  static async deleteIncome(incomeId) {
    try {
      const income = await Income.findByPk(incomeId);
      if (!income) throw new Error('Income not found');
      await income.destroy();
    } catch (error) {
      console.error('Error deleting income:', error.message);
      throw new Error('Failed to delete income');
    }
  }
}

module.exports = IncomeService;
