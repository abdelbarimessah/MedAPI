const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const twoFactorService = {
  generateSecret(email) {
    const secret = speakeasy.generateSecret({
      name: `technapsBackend:${email}`
    });
    return {
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32
    };
  },

  verifyToken(token, secret) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 1
    });
  },

  async generateQRCode(otpauthUrl) {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      throw new Error('Error generating QR code');
    }
  }
};

module.exports = twoFactorService;