'use strict';

const DailyRotateFile = require('winston-daily-rotate-file');
const winston = require('winston');
const path = require('path');

const LOG_DIR = 'logs';
const MAX_SIZE = '10m';
const MAX_FILES = '7d';
const DATE_PATTERN = 'YYYY-MM-DD';
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * Asegura que el directorio de logs exista
 */
const fs = require('fs');
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

/**
 * @typedef {Object} LogLevels
 * @property {number} error - Nivel para errores críticos (0)
 * @property {number} warn - Nivel para advertencias (1)
 * @property {number} info - Nivel para información general (2)
 * @property {number} http - Nivel para solicitudes HTTP (3)
 * @property {number} verbose - Nivel para información detallada (4)
 * @property {number} debug - Nivel para depuración (5)
 * @property {number} silly - Nivel más bajo de logging (6)
 */
const logLevel = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};

/**
 * @typedef {Object} LogColors
 * @property {string} error - Color rojo para errores
 * @property {string} warn - Color amarillo para advertencias
 * @property {string} info - Color verde para información
 * @property {string} http - Color magenta para solicitudes HTTP
 * @property {string} verbose - Color cyan para logs detallados
 * @property {string} debug - Color azul para depuración
 * @property {string} silly - Color blanco para logs menos importantes
 */
const logColor = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'white'
};

winston.addColors(logColor);

/**
 * Formato para añadir información del proceso
 * @type {winston.Logform.Format}
 */
const processInfoFormat = winston.format((info) => {
    info.process_id = process.pid;
    info.nodejs_version = process.version;
    return info;
})();

/**
 * Formato personalizado para los logs que incluye timestamp, colores y manejo de stack traces
 * @type {winston.Logform.Format}
 */
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack, metadata = {} }) => {
        const metadataStr = Object.keys(metadata).length 
            ? `\nMetadata: ${JSON.stringify(metadata, null, 2)}`
            : '';
        
        return stack
            ? `${timestamp} [${level}]: ${message}\nStack: ${stack}${metadataStr}`
            : `${timestamp} [${level}]: ${message}${metadataStr}`;
    })
);

/**
 * Formato para archivos JSON
 * @type {winston.Logform.Format}
 */
const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
    processInfoFormat,
    winston.format.uncolorize(),
    winston.format.json()
);

/**
 * Configuración de los transportes para los logs
 * @type {winston.transport[]}
 */
const transports = [
    new winston.transports.Console({
        format: customFormat,
        handleExceptions: true,
        handleRejections: true
    }),
    new winston.transports.File({
        filename: path.join(LOG_DIR, 'error.log'),
        level: 'error',
        format: jsonFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }),
    new winston.transports.File({
        filename: path.join(LOG_DIR, 'combined.log'),
        format: jsonFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }),
    new DailyRotateFile({
        filename: path.join(LOG_DIR, 'application-%DATE%.log'),
        datePattern: DATE_PATTERN,
        zippedArchive: true,
        maxSize: MAX_SIZE,
        maxFiles: MAX_FILES,
        level: 'info',
        format: jsonFormat
    })
];

/**
 * Instancia principal del logger configurada con múltiples transportes
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels: logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports,
    exitOnError: false
});

/**
 * Middleware para registrar las solicitudes HTTP
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @param {import('express').NextFunction} next - Función next de Express
 */
const logMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const { method, url, headers, query, body } = req;

    logger.http('Incoming request', {
        metadata: {
            method,
            url,
            headers,
            query,
            body
        }
    });

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.http('Request completed', {
            metadata: {
                method,
                url,
                status: res.statusCode,
                duration: `${duration}ms`
            }
        });
    });

    next();
};

/**
 * Registra un error con stack trace y metadata adicional
 * @param {Error} error - Error a registrar
 * @param {Object} [metadata] - Metadata adicional
 */
const logError = (error, metadata = {}) => {
    logger.error(error.message, {
        stack: error.stack,
        metadata: {
            ...metadata,
            errorName: error.name,
            code: error.code
        }
    });
};

module.exports = {
    logger,
    logMiddleware,
    logError
};