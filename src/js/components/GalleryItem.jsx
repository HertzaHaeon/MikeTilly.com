import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import clamp from "../utils/clamp";
import loadImage from "../utils/loadImage";

const ORIENTATION_RANGE = 45;

const GalleryItem = props => {
  const { height, width, x, y, animate = true, url, src, title, titlePosition, isMature, className, ...otherProps } = props;
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0.5, y: 0.5 });
  const elementRef = useRef(null);

  useEffect(() => {
    setBackgroundImage('');
    const [imageLoaded, cancel] = loadImage(src);
    imageLoaded.then(() => setBackgroundImage(src)).catch(() => {});
    return cancel;
  }, [src, width, setBackgroundImage]);

  useEffect(() => {
    if ("DeviceOrientationEvent" in window && animate && isFocused) {
      window.addEventListener("deviceorientation", orientationHandler);
      return () => {
        window.removeEventListener("deviceorientation", orientationHandler);
      };
    }
  }, [animate, isFocused]);

  const focusAndBlurHandler = event => {
    if (event.type === "focus") {
      setIsFocused(true);
    } else if (event.type === "blur") {
      setIsFocused(false);
    }
  };

  const orientationHandler = event => {
    const { gamma, beta } = event;
    const x = (clamp(gamma, 0 - ORIENTATION_RANGE, ORIENTATION_RANGE) + ORIENTATION_RANGE) / (ORIENTATION_RANGE * 2);
    const y =
      (clamp(beta, 90 - ORIENTATION_RANGE, 90 + ORIENTATION_RANGE) - ORIENTATION_RANGE) / (ORIENTATION_RANGE * 2);
    requestAnimationFrame(() => {
      setBackgroundPosition({ x, y });
    });
  };

  const mouseEnterHandler = () => {
    setIsFocused(true);
  };
  const mouseMoveHandler = event => {
    const { clientX, clientY } = event;
    const bounds = event.target.getBoundingClientRect();
    requestAnimationFrame(() => {
      setBackgroundPosition({ x: (clientX - bounds.left) / bounds.width, y: (clientY - bounds.top) / bounds.height });
    });
  };
  const mouseOutHandler = () => {
    requestAnimationFrame(() => {
      setBackgroundPosition({ x: 0.5, y: 0.5 });
    });
    setIsFocused(false);
  };

  return (
    <a
      href={url}
      className={classNames([
        "GalleryItem",
        !backgroundImage && "GalleryItem--loading",
        isMature && "GalleryItem--mature",
        className
      ])}
      style={{
        height,
        width,
        "--x": `${x}px`,
        "--y": `${y}px`
      }}
      ref={elementRef}
      onMouseEnter={animate ? mouseEnterHandler : null}
      onMouseMove={animate ? mouseMoveHandler : null}
      onMouseOut={animate ? mouseOutHandler : null}
      onFocus={focusAndBlurHandler}
      onBlur={focusAndBlurHandler}
      onTouchStart={touchStartHandler}
      onTouchEnd={touchEndHandler}
      {...otherProps}
    >
      <div
        className="GalleryItem__image"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
          backgroundPosition: `${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%`
        }}
      />
      <div
        className={classNames(
          "GalleryItem__title",
          titlePosition === GalleryItem.titlePositions.ABOVE && "GalleryItem__title--above"
        )}
        style={{ width }}
      >
        {title}
      </div>
    </a>
  );
};

GalleryItem.titlePositions = {
  BELOW: "BELOW",
  ABOVE: "ABOVE"
};

const touchStartHandler = event => {
  const el = event.currentTarget;
  if (document.activeElement === el) {
    el.click();
  } else {
    el.focus();
  }
};

const touchEndHandler = event => {
  event.preventDefault();
};

export default GalleryItem;
