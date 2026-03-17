require('dotenv').config();

const port = process.env.PORT;

if (!port) {
    throw new Error('El puerto no está definido');
}

module.exports = {
    PORT: port
};
