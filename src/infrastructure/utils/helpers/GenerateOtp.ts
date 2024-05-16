import crypto from 'crypto'

export const generateOTP = () => {
    // Generate a random buffer of 2 bytes
    const buffer = crypto.randomBytes(2);
    // Convert buffer to hexadecimal string
    const otp = buffer.toString('hex');
    // Convert hexadecimal string to decimal and ensure it's a 4-digit number
    return (parseInt(otp, 16) % 10000).toString().padStart(4, '0');
}

