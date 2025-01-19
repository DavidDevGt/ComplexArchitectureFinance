'use strict';

const { User } = require('../models');

class UserService {
  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario a crear
   * @returns {Promise<Object>} - Usuario creado
   * @throws {Error} - Si no se pueden guardar los datos
   */
  static async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param {number} userId - ID del usuario a buscar
   * @returns {Promise<Object|null>} - Usuario encontrado o null si no existe
   * @throws {Error} - Si ocurre un error en la consulta
   */
  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) return null;
      return user;
    } catch (error) {
      console.error('Error retrieving user:', error.message);
      throw new Error('Failed to retrieve user');
    }
  }

  /**
   * Actualiza un usuario existente
   * @param {number} userId - ID del usuario a actualizar
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   * @throws {Error} - Si el usuario no existe o falla la actualización
   */
  static async updateUser(userId, userData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('User not found');
      return await user.update(userData);
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Elimina un usuario por ID (eliminación lógica si está habilitada)
   * @param {number} userId - ID del usuario a eliminar
   * @returns {Promise<void>}
   * @throws {Error} - Si el usuario no existe o falla la eliminación
   */
  static async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('User not found');
      await user.destroy();
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw new Error('Failed to delete user');
    }
  }
}

module.exports = UserService;
