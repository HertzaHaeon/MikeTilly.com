const HEX_RATIO = 2 / Math.sqrt(3)

/**
 * Calculate the coordinates for a grid of hexagonal tiles within a given area
 * Tiles are fit into the grid width by count or width (one must be set)
 * Rows are fit into the grid first by its height or total tile count (one must be set)
 *
 * @param {object} userOptions
 * @param {number} [userOptions.gridWidth] - Width of the area
 * @param {number} [userOptions.gridHeight] - Height of the area
 * @param {number} [userOptions.rowOffset] - Whether even or odd rows are offset
 * @param {number} [userOptions.totalTileCount] - Total number of tiles to place
 * @param {number} [userOptions.rowTileCount] - Number of tiles to place per row
 * @param {number} [userOptions.tileSize] - Size of tile
 * @param {<string, string>} [userOptions.tileOrigin] - Tile point of origin (TOP|MIDDLE|BOTTOM LEFT|CENTER|RIGHT)
 * @returns {{ grid: { columns: number, rows: number, width: number, height: number }, tiles: { width: number, height: number, coordinates: [{x: number, y: number, column: number, row: number}]} }}
 */
function hexgrid (userOptions) {
  const options = {
    gridWidth: userOptions.gridWidth,
    gridHeight: userOptions.gridHeight,
    totalTileCount: userOptions.totalTileCount,
    rowTileCount: userOptions.rowTileCount,
    rowOffset: 'rowOffset' in userOptions && userOptions.rowOffset in HEXGRID_ROW_OFFSETS ? userOptions.rowOffset : HEXGRID_ROW_OFFSETS.ODD,
    tileSize: userOptions.tileSize,
    tileOrigin: userOptions.tileOrigin || [0.5, 0.5]
  }
  options.tileOrigin = Array.isArray(options.tileOrigin) ? options.tileOrigin : options.tileOrigin.split(' ')
  options.tileOrigin = options.tileOrigin.map(origin => {
    if (typeof origin === 'number') {
      return Math.max(Math.min(origin, 1), 0)
    } else {
      return origin in HEXGRID_TILE_ORIGINS ? HEXGRID_TILE_ORIGINS[origin] : 0
    }
  })
  if (!Number.isInteger(options.tileSize) && !Number.isInteger(options.rowTileCount)) throw new Error('hexgrid tileSize or rowTileCount must be set')
  if (!Number.isInteger(options.gridHeight) && !Number.isInteger(options.totalTileCount)) throw new Error('hexgrid gridHeight or totalTileCount must be set')

  let columns
  let rows
  let width
  // Decide tile width by row count
  if (options.rowTileCount) {
    columns = options.rowTileCount
    width = options.gridWidth / (columns + 0.5)
  // Decide row count by tile width
  } else {
    columns = Math.floor((options.gridWidth - (options.tileSize / 2)) / options.tileSize)
    width = options.tileSize
  }
  
  const height = width * HEX_RATIO
  
  // Fit hex rows into fixed height
  // Rows of grid contribute 75% of grid height, except for one row which contributes 100%
  if (options.gridHeight) {
    rows = Math.floor((options.gridHeight - height) / (height * 0.75)) + 1
  } else {
    rows = Math.ceil(options.totalTileCount / columns)
    // Calculate grid height
    options.gridHeight = ((rows - 1) * height * 0.75) + height
  }

  const coordinates = []
  if (columns > 0 && rows > 0) {
    for (let row = 0; row < rows; row++) {
      const offset = row % 2 === options.rowOffset
      for (let column = 0; column < columns; column++) {
        coordinates.push({
          x: width * column + (width * options.tileOrigin[0]) + (offset * width * 0.5),
          y: height * 0.75 * row + (height * options.tileOrigin[1]),
          column,
          row
        })
      }
    }
  }

  return {
    grid: {
      columns,
      rows,
      width: options.gridWidth,
      height: options.gridHeight,
    },
    tiles: {
      width,
      height,
      coordinates
    }
  }
}

const HEXGRID_ROW_OFFSETS = {
  EVEN: 0,
  ODD: 1
}

const HEXGRID_TILE_ORIGINS = {
  TOP: 0,
  MIDDLE: 0.5,
  BOTTOM: 1,
  LEFT: 0,
  CENTER: 0.5,
  RIGHT: 1,
}

export {
  hexgrid as default,
  HEX_RATIO,
  HEXGRID_ROW_OFFSETS,
  HEXGRID_TILE_ORIGINS,
}
