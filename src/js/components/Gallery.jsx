import React, { useEffect, useRef, useState } from "react";

import hexgrid from "../services/hexgrid";
import Menu from "./Menu";
import GalleryItem from "./GalleryItem";

const Gallery = ({ items, itemTabIndexOffset = 0 }) => {
  const [width, setWidth] = useState(0);
  const [hexGrid, setHexGrid] = useState(null);
  const hexSpaceElement = useRef(null);

  useEffect(() => {
    resizeObserver.observe(hexSpaceElement.current);
    return () => {
      resizeObserver.unobserve(hexSpaceElement.current);
    };
  }, [hexSpaceElement.current]);

  const { current: resizeObserver } = useRef(
    new ResizeObserver(([hexGridSize]) => {
      if (hexGridSize) {
        setWidth(hexGridSize.contentRect.width);
      }
    })
  );

  useEffect(() => {
    let size = 150;
    if (width <= 500) {
      size = 100;
    } else if (width <= 300) {
      size = 75;
    } else if (width <= 200) {
      size = 50;
    }
    setHexGrid(
      hexgrid({
        size,
        width,
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
