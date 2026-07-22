const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/; // 10 chiffres, commence par 0

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

function isValidPhone(phone) {
  if (!phone) return true; // téléphone optionnel dans le schema
  return PHONE_REGEX.test(phone.trim());
}

module.exports = { isValidEmail, isValidPhone };