import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import config from '../config';
import GalleryService from '../services/gallery';
import classNames from 'classnames';

function GalleryDisplay(props) {
  const mouseMoveHandler = event => {
    const bounds = event.target.getBoundingClientRect();
    event.currentTarget.style.backgroundPosition = `${((event.clientX - bounds.left) / bounds.width) * 100}% ${((event.clientY - bounds.top) / bounds.height) * 100}%`;
  };
  const mouseOutHandler = event => {
    event.currentTarget.style.backgroundPosition = "50% 50%";
  };

  const itemClasses = function(item, index, columns) {
    let classes, xOffset, yOffset;
    classes = ['hexagon', 'hexAnim'];
    if (item.isMature) classes.push('galleryItem__mature');
    yOffset = Math.floor(index / columns);
    xOffset = (index % columns) * 2 + yOffset % 2;
    classes.push('hexOffsetX_' + xOffset, 'hexOffsetY_' + yOffset);
    return classes;
  };

  const {items, columns} = props;
  return (
    <div id="gallery">
      <ReactCSSTransitionGroup
        transitionName="ng"
        transitionEnterTimeout={config.animation.timing}
        transitionLeaveTimeout={config.animation.timing}
        transitionAppear={true}
        transitionAppearTimeout={config.animation.timing}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            onMouseMove={mouseMoveHandler}
            onMouseOut={mouseOutHandler}
            className={classNames(itemClasses(item, index, columns))}
            style={{backgroundImage: 'url("' + item.thumbnail + '")'}}
          >
            <a href={item.url} />
          </div>
        ))}
      </ReactCSSTransitionGroup>
    </div>
  );
}

export default GalleryDisplay;
