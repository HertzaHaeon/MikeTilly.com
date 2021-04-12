/**
 * @type {Object.<string, string>}
 */
import HEX_SIZES_STRINGS from "scss/export/_hexSizes"
/**
 * @type {Object.<string, string>}
 */
import SCREEN_BREAKPOINTS_STRINGS from "scss/export/_breakpoints"
/**
 * @type {Object.<string, string>}
 */
import STYLE_VARS_STRINGS from "scss/export/_variables"

/**
 *
 * @param {Object.<string, string>} obj
 * @returns {Object.<string, number>}
 */
const valuesToNumbers = obj => Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, parseInt(value, 10)]))

const HEX_SIZES = valuesToNumbers(HEX_SIZES_STRINGS)
const SCREEN_BREAKPOINTS = valuesToNumbers(SCREEN_BREAKPOINTS_STRINGS)
const STYLE_VARS = valuesToNumbers(STYLE_VARS_STRINGS)

export {
  HEX_SIZES,
  SCREEN_BREAKPOINTS,
  STYLE_VARS,
}