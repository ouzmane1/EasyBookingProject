function isEmailValid(email) {
    if (typeof email !== 'string') return false;
    // Regex simple mais robuste pour la plupart des cas courants
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

module.exports = { isEmailValid };
