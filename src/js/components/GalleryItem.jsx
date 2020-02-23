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

function useImageLoader(src) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const onLoaded = () => setLoading(false);
  const onError = error => setError(error);
  useEffect(() => {
    const image = new Image();
    image.addEventListener("load", onLoaded);
    image.addEventListener("error", onError);
    image.src = src;
    return () => {
      image.removeEventListener("load", onLoaded);
      image.removeEventListener("error", onError);
    };
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
        left: x,
        top: y
      }}
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
