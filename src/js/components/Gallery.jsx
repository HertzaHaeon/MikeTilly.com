import React, { useEffect, useRef, useState } from "react";
import { ResizeObserver } from '@juggle/resize-observer';

import hexgrid from "../services/hexgrid";
import Menu from "./Menu";
import GalleryItem from "./GalleryItem";
import { BREAKPOINTS } from 'enums';
/**
 * @type {Object.<string, number>}
 */
import * as STYLE_VARS from "scss/_variables.scss";
/**
 * @type {Object.<string, number>}
 */
import * as SCREEN_BREAKPOINTS from "scss/_breakpoints.scss";
/**
 * @type {Object.<string, string>}
 */
import * as HEX_SIZES from "scss/_hexSizes.scss";

const Gallery = ({ items, itemTabIndexOffset = 0 }) => {
  const [hexGrid, setHexGrid] = useState(null);
  const [width, setWidth] = useState(0);
  const [viewportHeightLimit, setViewportHeightLimit] = useState(0);
  
  const hexSpaceElement = useRef(null);
  
  const { current: resizeObserver } = useRef(
    new ResizeObserver(([hexGridSize]) => {
      if (hexGridSize) {
        setWidth(hexGridSize.contentRect.width);
        handleResizeScroll();
      }
    })
  );
  
  useEffect(() => {
    resizeObserver.observe(hexSpaceElement.current);
    return () => {
      resizeObserver.unobserve(hexSpaceElement.current);
    };
  }, [hexSpaceElement.current]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleResizeScroll)
    return () => {
      window.removeEventListener('scroll', handleResizeScroll)
    }
  })

  useEffect(() => {
    let tileSize;
    for (const breakpoint of Object.keys(BREAKPOINTS)) {
      if (width >= SCREEN_BREAKPOINTS[breakpoint]) {
        tileSize = parseInt(HEX_SIZES[breakpoint], 10);
        break;
      }
    }
    setHexGrid(
      hexgrid({
        width,
        tileSize,
        tileOrigin: [hexgrid.tileOrigins.top, hexgrid.tileOrigins.left],
        totalCount: items.length
      })
    );
  }, [width, items]);
  
  // Set middle of viewport plus scroll offset as breakpoint for titles flipping to top
  const handleResizeScroll = () => {
    setViewportHeightLimit(document.documentElement.scrollTop + document.documentElement.clientHeight / 2);
  }

  let firstGrid, otherGrid
  if (hexGrid) {
    [firstGrid, ...otherGrid] = hexGrid.coordinates;
  }

  return (
    <div className="Gallery" ref={hexSpaceElement}>
      {firstGrid && (
        <Menu
          height={hexGrid.height}
          width={hexGrid.width}
          x={firstGrid.x}
          y={firstGrid.y}
        />
      )}
      {otherGrid &&
        otherGrid.map(
          (hexCoords, index) =>
            items[index] && (
              <GalleryItem
                key={items[index].id}
                tabIndex={index + itemTabIndexOffset}
                id={`GalleryItem-${items[index].id}`}
                height={hexGrid.height}
                width={hexGrid.width}
                x={hexCoords.x}
                y={hexCoords.y}
                animate={items[index].animate}
                url={items[index].url}
                src={selectItemSource(items[index].thumbnails, hexGrid.width * STYLE_VARS.GalleryItem_hoverScale, hexGrid.height * STYLE_VARS.GalleryItem_hoverScale)}
                title={items[index].title}
                titlePosition={hexCoords.y < viewportHeightLimit ? GalleryItem.titlePositions.BELOW : GalleryItem.titlePositions.ABOVE}
                isMature={items[index].isMature}
              />
            )
        )}
    </div>
  );
};

function selectItemSource(sources, width, height) {
  let fallbackSource;
  for (const source of Object.values(sources)) {
    if (!fallbackSource) {
      fallbackSource = source;
    }
    if (source.width >= width || source.height >= height) {
      return source.url;
    }
  }
  return fallbackSource && (fallbackSource.url);
}

export default Gallery;
