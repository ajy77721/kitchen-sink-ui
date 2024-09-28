// src/utils/customMessage.js
import { message as msg } from 'antd';

// Store the original message functions
const originalError = msg.error;
const originalSuccess = msg.success;

// Override the msg.error function
msg.error = (message, duration = 4) => {
    return originalError(message, duration); // Calls the original function with the default duration
};

// Override the msg.success function
msg.success = (message, duration = 1) => {
    return originalSuccess(message, duration); // Calls the original function with the default duration
};

// Export the modified message object directly
const customMessage = {
    error: msg.error,
    success: msg.success,
};

// Default export
export default customMessage;
