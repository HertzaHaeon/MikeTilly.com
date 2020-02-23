import React from "react"
import classNames from "classnames"

import { HEX_RATIO } from "../services/hexgrid"

const GalleryItem = ({ index, item, height, width, x, y, className, ...otherProps }) => {
  const mouseMoveHandler = event => {
    const bounds = event.target.getBoundingClientRect()
    event.currentTarget.style.backgroundPosition = `${((event.clientX - bounds.left) / bounds.width) *
      100}% ${((event.clientY - bounds.top) / bounds.height) * 100}%`
  }
  const mouseOutHandler = event => {
    event.currentTarget.style.backgroundPosition = "50% 50%"
  }
  return (
    <svg
      className={classNames(["GalleryItem", item.isMature && "GalleryItem--mature", className])}
      viewBox={`0 0 ${100 / HEX_RATIO} 100`}
      style={{
        height: height,
        width: width,
        left: x,
        top: y
      }}
      {...otherProps}
    >
      <defs>
        <pattern
          id={"pattern_" + index}
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          y={50}
        >
          <image
            className="GalleryItem__image"
            height="100"
            width="100"
            preserveAspectRatio="xMidYMid slice"
            xlinkHref={item.thumbnail.url}
          />
        </pattern>
      </defs>
      <a href={item.url}>
        <polygon
          points={`0,25 ${50 / HEX_RATIO},0 ${100 / HEX_RATIO},25 ${100 / HEX_RATIO},75 ${50 / HEX_RATIO},100 0,75`}
          fill={`url(#pattern_${index})`}
        />
      </a>
    </svg>
  );
};

export default GalleryItem;
