/**
 * it takes care of the parsing and stringifying process and handles error gracefully.
 * @param obj
 * @returns
 */
const json = (obj, defaultReturn) => {
    if (typeof obj === 'string') {
        try {
            return JSON.parse(obj);
        } catch (e) {
            return defaultReturn;
        }
    }

    try {
        return JSON.stringify(obj);
    } catch (e) {
        return '';
    }
};

exports.json = json;
