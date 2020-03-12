import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import clamp from "../utils/clamp";

const ORIENTATION_RANGE = 45;

const GalleryItem = props => {
  const { item, height, width, x, y, animate = true, className, ...otherProps } = props;
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0.5, y: 0.5 });
  const elementRef = useRef(null);
  
  useEffect(() => {
    let whenLoaded;
    let cancel = () => {};
    if (isFocused) {
      if ('m' in item.thumbnails && backgroundImage !== item.thumbnails.m.url) {
        [whenLoaded] = loadImage(item.thumbnails.m.url)
      }
    } else {
      if (!backgroundImage) {
        [whenLoaded, cancel] = loadImage(item.thumbnails.s.url)
      }
    }
    if (whenLoaded) {
      whenLoaded
        .then(src => setBackgroundImage(src))
        .catch(error => {
          if (error.message !== 'canceled') {
            console.error(error);
          }
        })
    }
    return cancel;
  }, [item, isFocused, backgroundImage, setBackgroundImage])
  
  useEffect(() => {
    if ('DeviceOrientationEvent' in window && animate && isFocused) {
      window.addEventListener('deviceorientation', orientationHandler)
      return () => {
        window.removeEventListener('deviceorientation', orientationHandler)
      };
    }
  }, [animate, isFocused]);
  
  const focusAndBlurHandler = event => {
    if (event.type === 'focus') {
      setIsFocused(true)
    } else if (event.type === 'blur') {
      setIsFocused(false)
    }
  }
  
  const orientationHandler = event => {
    const { gamma, beta } = event;
    const x = (clamp(gamma, 0 - ORIENTATION_RANGE, ORIENTATION_RANGE) + ORIENTATION_RANGE) / (ORIENTATION_RANGE * 2);
    const y = (clamp(beta, 90 - ORIENTATION_RANGE, 90 + ORIENTATION_RANGE) - ORIENTATION_RANGE) / (ORIENTATION_RANGE * 2);
    requestAnimationFrame(() => {
      setBackgroundPosition({x, y})
    })
  }

  const mouseEnterHandler = () => {
    setIsFocused(true);
  }
  const mouseMoveHandler = event => {
    const { clientX, clientY } = event;
    const bounds = event.target.getBoundingClientRect();
    requestAnimationFrame(() => {
      setBackgroundPosition({x: (clientX - bounds.left) / bounds.width, y: (clientY - bounds.top) / bounds.height});
    });
  };
  const mouseOutHandler = () => {
    requestAnimationFrame(() => {
      setBackgroundPosition({x: 0.5, y: 0.5});
    });
    setIsFocused(false);
  };
  
  return (
    <a
      href={item.url}
      className={classNames([
        "GalleryItem",
        !backgroundImage && "GalleryItem--loading",
        item.isMature && "GalleryItem--mature",
        className
      ])}
      style={{
        height: height,
        width: width,
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
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
          backgroundPosition: `${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%`,
        }}
      />
    </a>
  );
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

const getBackgroundImage = (images, isLoading, isFocused) => {
  if (isLoading) {
    return ''
  } else if (isFocused) {
    return images.s.url || images.m.url
  }
}

const loadImage = src => {
  let cancel = () => {};
  return [new Promise((resolve, reject) => {
    const image = new Image();
    const unlisten = () => {
      image.removeEventListener("load", onLoaded);
      image.removeEventListener("error", onError);
    };
    cancel = () => {
      unlisten();
      reject(new Error('canceled'));
    }
    const onLoaded = () => {
      unlisten();
      resolve(src);
    };
    const onError = error => {
      unlisten();
      reject(error);
    };
    image.addEventListener("load", onLoaded);
    image.addEventListener("error", onError);
    image.src = src;
  }), cancel]
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

export default GalleryItem;
