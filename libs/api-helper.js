const axios = require('axios');
const {CONSTANTS: {CURRENCY}} = require('../libs/constants');

const latestListings = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${process.env.API_ENDPOINT_LISTINGS}latest`, {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
                params: {
                    convert: CURRENCY,
                    limit: 5000,
                }
            });
            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
}

const newListings = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${process.env.API_ENDPOINT_LISTINGS}new`, {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
                params: {
                    convert: CURRENCY
                }
            });

            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
}

const allCryptos = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${process.env.API_ENDPOINT_CRYPTOS}map`, {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                }
            });

            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
}

exports.latestListings = latestListings;
exports.newListings = newListings;
exports.allCryptos = allCryptos;

