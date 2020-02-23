import React, { useState, useEffect } from "react";
import classNames from "classnames";

const mouseMoveHandler = event => {
  const bounds = event.target.getBoundingClientRect();
  event.currentTarget.style.backgroundPosition = `${((event.clientX - bounds.left) / bounds.width) *
    100}% ${((event.clientY - bounds.top) / bounds.height) * 100}%`;
};
const mouseOutHandler = event => {
  event.currentTarget.style.backgroundPosition = "50% 50%";
};
const touchStartHandler = event => {
  const el = event.currentTarget
  if (document.activeElement === el) {
    el.click()
  } else {
    el.focus()
  }
}
const touchEndHandler = event => {
  event.preventDefault()
}

function useImageLoader(src) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const image = new Image();
  const unlisten = () => {
    image.removeEventListener("load", onLoaded);
    image.removeEventListener("error", onError);
  };
  const onLoaded = () => {
    setLoading(false);
    unlisten();
  }
  const onError = error => {
    setError(error);
    unlisten();
  }
  useEffect(() => {
    image.addEventListener("load", onLoaded);
    image.addEventListener("error", onError);
    image.src = src;
    return unlisten;
  }, [src]);
  return [loading, error];
}

const GalleryItem = ({ item, height, width, x, y, animate = true, className, ...otherProps }) => {
  const [loading, error] = useImageLoader(item.thumbnail.url);
  if (error) {
    console.error("useImageLoader error", error.message);
  }
  return (
    <a
      href={item.url}
      className={classNames([
        "GalleryItem",
        loading && !error && "GalleryItem--loading",
        item.isMature && "GalleryItem--mature",
        className
      ])}
      style={{
        height: height,
        width: width,
        '--x': `${x}px`,
        '--y': `${y}px`,
      }}
      onTouchStart={touchStartHandler}
      onTouchEnd={touchEndHandler}
      {...otherProps}
    >
      <div
        style={{
          backgroundImage: loading ? "" : `url(${item.thumbnail.url})`
        }}
        onMouseMove={animate ? mouseMoveHandler : null}
        onMouseOut={animate ? mouseOutHandler : null}
      />
    </a>
  );
};

export default GalleryItem;
