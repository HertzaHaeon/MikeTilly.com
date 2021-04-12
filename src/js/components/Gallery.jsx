import React, { useEffect, useRef, useState } from "react"
import { ResizeObserver } from "@juggle/resize-observer"

import hexgrid, { HEXGRID_TILE_ORIGINS } from "../services/hexgrid"
import Menu from "./Menu"
import GalleryItem from "./GalleryItem"
import { BREAKPOINTS } from "enums"
import { HEX_SIZES, SCREEN_BREAKPOINTS, STYLE_VARS } from "style"

const Gallery = ({ items, itemTabIndexOffset = 0 }) => {
  const [hexGrid, setHexGrid] = useState(null)
  const [gridWidth, setGridWidth] = useState(0)
  const [viewportHeightLimit, setViewportHeightLimit] = useState(0)

  const hexSpaceElement = useRef(null)

  const { current: resizeObserver } = useRef(
    new ResizeObserver(([hexGridSize]) => {
      if (hexGridSize) {
        setGridWidth(hexGridSize.contentRect.width)
        handleResizeScroll()
      }
    })
  )

  useEffect(() => {
    resizeObserver.observe(hexSpaceElement.current)
    return () => {
      resizeObserver.unobserve(hexSpaceElement.current)
    }
  }, [hexSpaceElement.current])

  useEffect(() => {
    window.addEventListener("scroll", handleResizeScroll)
    return () => {
      window.removeEventListener("scroll", handleResizeScroll)
    }
  })

  useEffect(() => {
    let tileSize
    for (const breakpoint of Object.keys(BREAKPOINTS)) {
      tileSize = HEX_SIZES[breakpoint]
      if (window.innerWidth > SCREEN_BREAKPOINTS[breakpoint]) {
        break
      }
    }
    setHexGrid(
      hexgrid({
        gridWidth,
        tileSize,
        tileOrigin: [HEXGRID_TILE_ORIGINS.TOP, HEXGRID_TILE_ORIGINS.LEFT],
        totalTileCount: items.length,
      })
    )
  }, [window.innerWidth, gridWidth, items])

  // Set middle of viewport plus scroll offset as breakpoint for titles flipping to top
  const handleResizeScroll = () => {
    setViewportHeightLimit(document.documentElement.scrollTop + document.documentElement.clientHeight / 2)
  }

  let firstGrid, otherGrid
  if (hexGrid) {
    ;[firstGrid, ...otherGrid] = hexGrid.tiles.coordinates
  }

  return (
    <div className="Gallery" style={hexGrid && { height: hexGrid.grid.height + "px" }} ref={hexSpaceElement}>
      {firstGrid && <Menu height={hexGrid.tiles.height} width={hexGrid.tiles.width} x={firstGrid.x} y={firstGrid.y} />}
      {otherGrid &&
        otherGrid.map(
          (hexCoords, index) =>
            items[index] && (
              <GalleryItem
                key={items[index].id}
                tabIndex={index + itemTabIndexOffset}
                id={`GalleryItem-${items[index].id}`}
                height={hexGrid.tiles.height}
                width={hexGrid.tiles.width}
                x={hexCoords.x}
                y={hexCoords.y}
                provider={items[index].provider}
                url={items[index].url}
                src={selectItemSource(
                  items[index].thumbnails,
                  hexGrid.tiles.gridWidth * STYLE_VARS.GalleryItem_hoverScale,
                  hexGrid.tiles.height * STYLE_VARS.GalleryItem_hoverScale
                )}
                iconSrc={items[index].provider && `/img/icons/${items[index].provider}.svg`}
                title={items[index].title}
                titlePosition={
                  hexCoords.y < viewportHeightLimit
                    ? GalleryItem.titlePositions.BELOW
                    : GalleryItem.titlePositions.ABOVE
                }
                animate={items[index].animate}
                isMature={items[index].isMature}
              />
            )
        )}
    </div>
  )
}

function selectItemSource(sources, gridWidth, height) {
  let fallbackSource
  for (const source of Object.values(sources)) {
    if (!fallbackSource) {
      fallbackSource = source
    }
    if (source.gridWidth >= gridWidth || source.height >= height) {
      return source.url
    }
  }
  return fallbackSource && fallbackSource.url
}

export default Gallery
