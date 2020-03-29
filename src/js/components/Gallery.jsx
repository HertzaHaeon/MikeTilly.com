import React, { useEffect, useRef, useState } from "react";
import { ResizeObserver } from '@juggle/resize-observer';

import hexgrid from "../services/hexgrid";
import Menu from "./Menu";
import GalleryItem from "./GalleryItem";
/**
 * @type {Object.<string, number>}
 */
import * as breakpoints from "scss/_breakpoints.scss";
/**
 * @type {Object.<string, number>}
 */
import * as hexSizes from "scss/_hexSizes.scss";

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
    if (width <= breakpoints.sm) {
      tileSize = parseInt(hexSizes.sm, 10);
    } else if (width <= breakpoints.md) {
      tileSize = parseInt(tileSize = hexSizes.md, 10);
    } else if (width <= breakpoints.lg) {
      tileSize = parseInt(hexSizes.lg, 10);
    } else {
      tileSize = parseInt(hexSizes.xl, 10);
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
                id={`GalleryItem-${items[index].id}`}
                height={hexGrid.height}
                width={hexGrid.width}
                x={hexCoords.x}
                y={hexCoords.y}
                animate={items[index].animate}
                titlePosition={hexCoords.y < viewportHeightLimit ? GalleryItem.titlePositions.BELOW : GalleryItem.titlePositions.ABOVE}
                item={items[index]}
                tabIndex={index + itemTabIndexOffset}
              />
            )
        )}
    </div>
  );
};

export default Gallery;
