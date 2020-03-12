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
 * @type {{gridSize: number}}
 */
import * as style from "scss/_variables.scss";

const Gallery = ({ items, itemTabIndexOffset = 0 }) => {
  const [hexGrid, setHexGrid] = useState(null);
  const [width, setWidth] = useState(0);
  
  const hexSpaceElement = useRef(null);
  
  const { current: resizeObserver } = useRef(
    new ResizeObserver(([hexGridSize]) => {
      if (hexGridSize) {
        setWidth(hexGridSize.contentRect.width);
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
    let tileSize = style.gridSize * 10;
    if (width <= breakpoints.sm) {
      tileSize = style.gridSize * 4;
    } else if (width <= breakpoints.md) {
      tileSize = tileSize = style.gridSize * 6;
    } else if (width <= breakpoints.lg) {
      tileSize = tileSize = style.gridSize * 8;
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
                item={items[index]}
                tabIndex={index + itemTabIndexOffset}
              />
            )
        )}
    </div>
  );
};

export default Gallery;
