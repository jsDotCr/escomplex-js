/*globals require, exports */

'use strict';

var check, espree, walker, escomplex;

check = require('check-types');
espree = require('espree');
walker = require('escomplex-ast-moz');
escomplex = require('escomplex');

exports.analyse = analyse;
exports.ecmaFeatures = {
    // enable parsing of let/const
    blockBindings: true,

    // enable parsing of regular expression y flag
    regexYFlag: true,

    // enable parsing of regular expression u flag
    regexUFlag: true,

    // enable parsing of binary literals
    binaryLiterals: true,

    // enable parsing of ES6 octal literals
    octalLiterals: true,

    // enable parsing unicode code point escape sequences
    unicodeCodePointEscapes: true,

    // enable parsing of default parameters
    defaultParams: false,

    // enable parsing of for-of statement
    forOf: true,

    // enable parsing computed object literal properties
    objectLiteralComputedProperties: true,

    // enable parsing of shorthand object literal methods
    objectLiteralShorthandMethods: true,

    // enable parsing of shorthand object literal properties
    objectLiteralShorthandProperties: true,

    // Allow duplicate object literal properties (except '__proto__')
    objectLiteralDuplicateProperties: true,

    // enable parsing of generators/yield
    generators: true,

    // React JSX parsing
    jsx: true
};

function analyse (source, options) {
    if (check.array(source)) {
        return analyseSources(source, options);
    }

    return analyseSource(source, options);
}

function analyseSources (sources, options) {
    return performAnalysis(sources.map(function (source) {
        try {
            return {
                path: source.path,
                ast: getSyntaxTree(source.code, options)
            };
        } catch (error) {
            error.message = source.path + ': ' + error.message;
            throw error;
        }
    }), options);
}

function getSyntaxTree (source, options) {
    options = options || {
        ecmaFeatures: exports.ecmaFeatures
    };
    return espree.parse(source, { loc: true, ecmaFeatures: options.ecmaFeatures });
}

function performAnalysis (ast, options) {
    return escomplex.analyse(ast, walker, options);
}

function analyseSource (source, options) {
    return performAnalysis(getSyntaxTree(source, options), options);
}

