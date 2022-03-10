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

const removeDuplicates = (array) => {
    return Array.from(new Set(array));
}

const objectToArray = (object) => {
    const arr = [];
    for (const prop in object) {
        if (object.hasOwnProperty(prop)) {
            arr.push(object[prop]);
        }
    }

    return arr;
};


exports.json = json;
exports.removeDuplicates = removeDuplicates;
exports.objectToArray = objectToArray;
