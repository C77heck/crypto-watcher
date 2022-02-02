const axios = require('axios');

const getLatestListings = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${process.env.API_ENDPOINT_LISTINGS}latest`, {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
                query: {
                    convert: 'HUF'
                }
            });

            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
}

const getNewListings = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${process.env.API_ENDPOINT_LISTINGS}new`, {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
                query: {
                    convert: 'HUF'
                }
            });

            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
}
const getAllCryptos = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${process.env.API_ENDPOINT_CRYPTOS}map`, {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
                query: {
                    convert: 'HUF'
                }
            });

            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
}

exports.getLatestListings = getLatestListings;
exports.getNewListings = getNewListings;
exports.getAllCryptos = getAllCryptos;

