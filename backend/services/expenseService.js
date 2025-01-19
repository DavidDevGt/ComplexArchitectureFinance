'use strict';

const { Expense } = require('../models');

class ExpenseService {
  /**
   * Crea un nuevo gasto.
   * @param {Object} expenseData - Datos del gasto a crear.
   * @returns {Promise<Object>} - El gasto creado.
   * @throws {Error} - Si ocurre un error al crear el gasto.
   */
  static async createExpense(expenseData) {
    try {
      return await Expense.create(expenseData);
    } catch (error) {
      console.error('Error creating expense:', error.message);
      throw new Error('Failed to create expense');
    }
  }

  /**
   * Obtiene un gasto por su ID.
   * @param {number} expenseId - ID del gasto a buscar.
   * @returns {Promise<Object|null>} - El gasto encontrado o null si no existe.
   * @throws {Error} - Si ocurre un error al buscar el gasto.
   */
  static async getExpenseById(expenseId) {
    try {
      const expense = await Expense.findByPk(expenseId);
      if (!expense) return null;
      return expense;
    } catch (error) {
      console.error('Error retrieving expense:', error.message);
      throw new Error('Failed to retrieve expense');
    }
  }

  /**
   * Actualiza un gasto existente.
   * @param {number} expenseId - ID del gasto a actualizar.
   * @param {Object} expenseData - Datos actualizados del gasto.
   * @returns {Promise<Object>} - El gasto actualizado.
   * @throws {Error} - Si el gasto no existe o falla la actualización.
   */
  static async updateExpense(expenseId, expenseData) {
    try {
      const expense = await Expense.findByPk(expenseId);
      if (!expense) throw new Error('Expense not found');
      return await expense.update(expenseData);
    } catch (error) {
      console.error('Error updating expense:', error.message);
      throw new Error('Failed to update expense');
    }
  }

  /**
   * Elimina un gasto por su ID.
   * @param {number} expenseId - ID del gasto a eliminar.
   * @returns {Promise<void>}
   * @throws {Error} - Si el gasto no existe o falla la eliminación.
   */
  static async deleteExpense(expenseId) {
    try {
      const expense = await Expense.findByPk(expenseId);
      if (!expense) throw new Error('Expense not found');
      await expense.destroy();
    } catch (error) {
      console.error('Error deleting expense:', error.message);
      throw new Error('Failed to delete expense');
    }
  }
}

module.exports = ExpenseService;
