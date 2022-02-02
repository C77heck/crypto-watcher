const axios = require('axios');

const getListings = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(process.env.API_ENDPOINT, {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
            });

            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
}

exports.getListings = getListings;

