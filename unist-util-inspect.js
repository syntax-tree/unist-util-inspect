(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.unistUtilInspect = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unist:util:inspect
 * @fileoverview Unist node inspector.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var isEmpty = require('is-empty');

/*
 * Define ANSII color functions.
 */

/**
 * Factory to wrap values in ANSI colours.
 *
 * @param {string} open
 * @param {string} close
 * @return {function(string): string}
 */
function ansiColor(open, close) {
    return function (value) {
        return '\u001b[' + open + 'm' + value + '\u001b[' + close + 'm';
    };
}

var dim = ansiColor(2, 22);
var yellow = ansiColor(33, 39);
var green = ansiColor(32, 39);

/*
 * Define ANSII color removal functionality.
 */

var COLOR_EXPRESSION = new RegExp(
    '(?:' +
        '(?:\\u001b\\[)|' +
        '\\u009b' +
    ')' +
    '(?:' +
        '(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m]' +
    ')|' +
    '\\u001b[A-M]',
    'g'
);

/**
 * Remove ANSI colour from `value`.
 *
 * @param {string} value
 * @return {string}
 */
function stripColor(value) {
    return value.replace(COLOR_EXPRESSION, '');
}

/*
 * Define constants characters.
 */

var CHAR_HORIZONTAL_LINE = '─';
var CHAR_VERTICAL_LINE = '│';
var CHAR_SPLIT = '└';
var CHAR_CONTINUE_AND_SPLIT = '├';
var CONTINUE = CHAR_CONTINUE_AND_SPLIT + CHAR_HORIZONTAL_LINE + ' ';
var STOP = CHAR_SPLIT + CHAR_HORIZONTAL_LINE + ' ';

/**
 * Colored nesting formatter.
 *
 * @param {string} value
 * @return {string}
 */
function formatNesting(value) {
    return dim(value);
}

/**
 * Colored node formatter.
 *
 * @param {Node} node
 * @return {string}
 */
function formatNode(node) {
    var log = node.type;

    if (node.children && node.children.length) {
        log += dim('[') + yellow(node.children.length) + dim(']');
    } else {
        log += dim(': \'') + green(node.value) + dim('\'');
    }

    if (!isEmpty(node.data)) {
        log += ' [data=' + JSON.stringify(node.data) + ']';
    }

    return log;
}

/**
 * Inspects a node.
 *
 * @this {Node}
 * @return {string}
 */
function inspect(node, pad) {
    var result;
    var children;
    var index;
    var length;

    if (node && node.length && typeof node !== 'string') {
        length = node.length;
        index = -1;
        result = [];

        while (++index < length) {
            result[index] = inspect(node[index]);
        }

        return result.join('\n');
    }

    if (!node || !node.type) {
        return String(node);
    }

    result = [formatNode(node)];
    children = node.children;
    length = children && children.length;
    index = -1;

    if (!length) {
        return result[0];
    }

    if (!pad || typeof pad === 'number') {
        pad = '';
    }

    while (++index < length) {
        node = children[index];

        if (index === length - 1) {
            result.push(
                formatNesting(pad + STOP) + inspect(node, pad + '   ')
            );
        } else {
            result.push(
                formatNesting(pad + CONTINUE) +
                inspect(node, pad + CHAR_VERTICAL_LINE + '  ')
            );
        }
    }

    return result.join('\n');
}

/**
 * Inspects a node, without using color.
 *
 * @return {string}
 * @this {Node}
 */
function noColor(node, pad) {
    return stripColor(inspect(node, pad));
}

/*
 * Detect.
 */

var color = true;

try {
    color = 'inspect' in require('util');
} catch (exception) {
    /* istanbul ignore next - browser */
    color = false;
}

/*
 * Expose.
 */

inspect.color = noColor.color = inspect;
inspect.noColor = noColor.noColor = noColor;

/*
 * Expose.
 */

module.exports = color ? inspect : /* istanbul ignore next */ noColor;

},{"is-empty":2,"util":undefined}],2:[function(require,module,exports){

/**
 * Expose `isEmpty`.
 */

module.exports = isEmpty;


/**
 * Has.
 */

var has = Object.prototype.hasOwnProperty;


/**
 * Test whether a value is "empty".
 *
 * @param {Mixed} val
 * @return {Boolean}
 */

function isEmpty (val) {
  if (null == val) return true;
  if ('number' == typeof val) return 0 === val;
  if (undefined !== val.length) return 0 === val.length;
  for (var key in val) if (has.call(val, key)) return false;
  return true;
}
},{}]},{},[1])(1)
});