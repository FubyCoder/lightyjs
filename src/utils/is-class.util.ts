/**
 * Is ES6+ class
 * @param {any} value
 * @returns {boolean}
 */
export function isClass(value: any): boolean {
    return typeof value === "function" && value.toString().indexOf("class") === 0;
}
