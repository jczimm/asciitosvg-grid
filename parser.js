// const escapeAscii = ascii =>
//     ascii
//         .replace(/(\S)/g, '`$1')
//         .replace(/(\s|\\)/g, '\\$1');
// const unescapeAscii = escapedAscii =>
//     escapedAscii
//         .replace(/\\(\s|\\)/g, '$1')
//         .replace(/`(\S)/g, '$1');


const atob = require('atob');
const btoa = require('btoa');

const toHexCharCode = char => char.charCodeAt(0).toString(16).padStart(2, '0');
const miniUni = {
    encode(plain) {
        return unescape( // enter unicode escape codes land
            plain.match(/[\s\S]{1,2}/g) // split string into pairs of letters
            .map(pair => '%u' + toHexCharCode(pair[0]) + toHexCharCode(pair[1] || ' ')) // encode each pair as a unicode escape code
            .join('') // concatenate the escape codes as a string
        ); // exit escape codes land; return actual unicode characters
    },
    decode(encoded) {
        return unescape( // enter unicode escape codes land
            escape(encoded) // convert the input into escape codes
            .replace(/u(..)/g, '$1%') // map each first two code digits to a separate code to encode an ascii character
        ); // exit escape codes land; return the plaintext
    }
};

module.exports = {
    escapeAscii: ascii => ascii.replace(/([\S\s])/g, '\\$1'),
    unescapeAscii: escapedAscii => escapedAscii.replace(/\\([\S\s])/g, '$1'),
    // All ASCII punctuation characters come through as unescaped
    // https://spec.commonmark.org/0.28/#backslash-escapes
    parseUriEscapedAscii: ascii => ascii.replace(/\\([^!-@\[-`{-~])/g, '$1'),
    util: { miniUni, atob, btoa }
};