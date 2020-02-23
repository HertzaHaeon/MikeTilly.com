const HEX_RATIO = 2 / Math.sqrt(3)

/**
 * Calculate the coordinates for hexagonal tiles within a given area
 *
 * @param {object} [userOptions]
 * @param {number} [userOptions.width] - Width of the grid
 * @param {number} [userOptions.height] - Height of the grid
 * @param {number} [userOptions.totalCount] - Total number of tiles to place
 * @param {number} [userOptions.rowCount] - Number of tiles to place per row
 * @param {number} [userOptions.rowOffset] - Whether even or odd rows are offset
 * @param {number} [userOptions.tileSize] - Size of tile
 * @param {<string, string>} [userOptions.tileOrigin] - Tile point of origin (top|middle|bottom left|center|right)
 * @returns {{columns: number, rows: number, width: number, height: number, coordinates: []}}
 */
function hexgrid (userOptions) {
  const options = {
    width: userOptions.width,
    height: userOptions.height,
    totalCount: userOptions.totalCount,
    rowCount: userOptions.rowCount,
    rowOffset: userOptions.rowOffset || hexgrid.rowOffsets.odd,
    tileSize: userOptions.tileSize,
    tileOrigin: userOptions.tileOrigin || [0.5, 0.5]
  }
  options.tileOrigin = Array.isArray(options.tileOrigin) ? options.tileOrigin : options.tileOrigin.split(' ')
  options.tileOrigin = options.tileOrigin.map(origin => {
    if (typeof origin === 'number') {
      return Math.max(Math.min(origin, 1), 0)
    } else {
      return origin in hexgrid.tileOrigins ? hexgrid.tileOrigins[origin] : 0
    }
  })
  console.log('hexgrid', options)

  let columns
  let rows
  let width
  
  // Decide width by hex rowCount
  if (options.rowCount) {
    columns = options.rowCount
    width = options.width / (columns + 0.5)
  // Decide hex rowCount by width
  } else {
    columns = Math.floor((options.width - (options.tileSize / 2)) / options.tileSize)
    width = options.tileSize
  }
  
  const height = width * HEX_RATIO
  
  // Fit hex rows into fixed height
  if (options.height) {
    if (options.height <= height) {
      rows = Math.floor(options.height / height)
    } else {
      rows = Math.floor((options.height - height) / (height * 0.75)) + 1
    }
  } else {
    rows = Math.ceil(options.totalCount / columns)
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
    columns,
    rows,
    width,
    height,
    coordinates
  }
}

hexgrid.rowOffsets = {
  even: 0,
  odd: 1
}

hexgrid.tileOrigins = {
  top: 0,
  middle: 0.5,
  bottom: 1,
  left: 0,
  center: 0.5,
  right: 1,
}

hexgrid.orientations = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export {
  hexgrid as default,
  HEX_RATIO
}
