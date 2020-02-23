const HEX_RATIO = 2 / Math.sqrt(3)

function hexgrid (userOptions) {
  const options = {
    // Container dimensions
    width: userOptions.width,
    height: userOptions.height,
    // Total hex count
    totalCount: userOptions.totalCount,
    // Hex count per row
    count: userOptions.count,
    // Hex size
    size: userOptions.size,
    // Offset odd or even hex rows
    offset: userOptions.offset || hexgrid.offsets.odd,
    //
    orientation: userOptions.orientation
  }

  let columns
  let rows
  let width
  
  // Decide width by hex count
  if (options.count) {
    columns = options.count
    width = options.width / (columns + 0.5)
  // Decide hex count by width
  } else {
    columns = Math.floor((options.width - (options.size / 2)) / options.size)
    width = options.size
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
      const offset = row % 2 === options.offset
      for (let column = 0; column < columns; column++) {
        coordinates.push({
          x: width * column + (width * 0.5) + (offset * width * 0.5),
          y: height * 0.75 * row + (height * 0.5),
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

hexgrid.offsets = {
  even: 0,
  odd: 1
}

hexgrid.orientations = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export {
  hexgrid as default,
  HEX_RATIO
}
