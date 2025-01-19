'use strict';

const jwt = require('jsonwebtoken');
const { logger } = require('../logMiddleware');

/**
 * Configuración para el servicio de autenticación.
 * @type {Object}
 * @property {string} secretKey - Clave secreta para firmar los tokens.
 * @property {Object} tokenOptions - Opciones por defecto para generar tokens.
 * @property {string} tokenOptions.expiresIn - Tiempo de expiración por defecto del token.
 */
const authConfig = {
    secretKey: process.env.JWT_SECRET_KEY || 'secretkey',
    tokenOptions: {
        expiresIn: '1h',
    },
};

class AuthService {
    /**
     * Crea una instancia de AuthService.
     * @param {Object} config - Configuración de autenticación.
     * @param {string} config.secretKey - Clave secreta para firmar los tokens.
     * @param {Object} config.tokenOptions - Opciones por defecto para generar tokens.
     */
    constructor(config) {
        this.secretKey = config.secretKey;
        this.tokenOptions = config.tokenOptions;
    }

    /**
     * Middleware para autenticar solicitudes mediante JWT.
     * @returns {Function} Middleware de autenticación.
     */
    authenticateToken() {
        return (req, res, next) => {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                logger.error('Access denied: No token provided');
                return res.status(401).json({
                    success: false,
                    message: 'Access denied: No token provided',
                    code: 'TOKEN_MISSING',
                });
            }

            jwt.verify(token, this.secretKey, (err, decoded) => {
                if (err) {
                    logger.error('Invalid token', { metadata: { error: err.message } });
                    return res.status(403).json({
                        success: false,
                        message: 'Invalid token',
                        code: 'TOKEN_INVALID',
                    });
                }

                req.user = decoded;
                next();
            });
        };
    }

    /**
     * Genera un nuevo token JWT.
     * @param {Object} payload - Datos a incluir en el token.
     * @param {Object} [options] - Opciones adicionales para el token.
     * @returns {string} Token generado.
     * @throws {Error} Si ocurre un error al generar el token.
     */
    generateToken(payload, options = {}) {
        try {
            const tokenOptions = { ...this.tokenOptions, ...options };
            return jwt.sign(payload, this.secretKey, tokenOptions);
        } catch (err) {
            logger.error('Error generating token', { metadata: { error: err.message } });
            throw new Error('Failed to generate token');
        }
    }

    /**
     * Middleware para verificar roles específicos.
     * @param {string[]} roles - Lista de roles permitidos.
     * @returns {Function} Middleware para la autorización basada en roles.
     */
    authorizeRoles(roles) {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                logger.warn('Access denied: Insufficient permissions', { metadata: { user: req.user } });
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: Insufficient permissions',
                    code: 'INSUFFICIENT_PERMISSIONS',
                });
            }
            next();
        };
    }
}
const authService = new AuthService(authConfig);

/**
 * Exporta las funciones principales del servicio de autenticación.
 * @module AuthService
 */
module.exports = {
    /**
     * Middleware de autenticación de tokens JWT.
     * @function
     */
    authenticateToken: () => authService.authenticateToken(),
    /**
     * Genera un token JWT.
     * @function
     * @param {Object} payload - Datos a incluir en el token.
     * @param {Object} [options] - Opciones adicionales.
     * @returns {string} Token JWT.
     */
    generateToken: (payload, options) => authService.generateToken(payload, options),
    /**
     * Middleware para verificar roles específicos.
     * @function
     * @param {string[]} roles - Lista de roles permitidos.
     * @returns {Function} Middleware de autorización.
     */
    authorizeRoles: (roles) => authService.authorizeRoles(roles),
};
