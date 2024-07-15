import path from 'path';

function logError(message: string, error: Error) {
    const timestamp = new Date().toISOString();
    const fileName = path.basename(__filename);
    const lineNumber = (error.stack?.split('\n')[1].split(':')[1]) || 'unknown';
    console.error(`[${timestamp}] [${fileName}:${lineNumber}] ${message} - ${error.message}`);
}
 
function logInfo(message: string) {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] ${message}`);
}

function logWarning(message: string) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ${message}`);
}

export const logger = { error: logError, warn: logWarning, info: logInfo }; 