import React from "react";

import Mike from "img/Mike_avatar_hex.svg";

function Menu({ height, width, x, y }) {
  const Y_SCALE = 1.03345;
  const Y_OFFSET = -0.045;
  return (
    <div
      id="menu"
      style={{
        "--hex-size": `${width}px`
      }}
    >
      <ul className="hexMenu hexMenu--focusable">
        <li className="mike hex hex--visible hex--hoverZ11 hex--z10" tabIndex="1">
          <Mike
            style={{
              position: "absolute",
              height: height * Y_SCALE,
              width: width,
              top: height * Y_OFFSET
            }}
          />
        </li>
        <li className="hex hex--helper hex--z0 hex--offsetX-1 hex--offsetY1">
          <span />
        </li>
        <li className="deviantart hex hex--z9 hex--animate hex--delay1 hex--hoverDelay0 hex--hoverOffsetX2 hex--hoverOffsetY0 hex--offsetX0 hex--offsetY0" tabIndex={2}>
          <a href="http://hertzahaeon.deviantart.com/" />
        </li>
        <li className="flickr hex hex--z8 hex--animate hex--delay0 hex--hoverDelay1 hex--hoverOffsetX4 hex--hoverOffsetY0 hex--offsetX2 hex--offsetY0" tabIndex={3}>
          <a href="http://www.flickr.com/photos/hertzahaeon/" />
        </li>

        <li className="spotify hex hex--z7 hex--animate hex--delay2 hex--hoverDelay0 hex--hoverOffsetX1 hex--hoverOffsetY1 hex--offsetX0 hex--offsetY0" tabIndex={4}>
          <a href="https://open.spotify.com/user/hertzahaeon" />
        </li>
        <li className="goodreads hex hex--z6 hex--animate hex--delay1 hex--hoverDelay1 hex--hoverOffsetX3 hex--hoverOffsetY1 hex--offsetX1 hex--offsetY1" tabIndex={5}>
          <a href="http://www.goodreads.com/user/show/7193175-mikael-tilly" />
        </li>
        <li className="steam hex hex--z5 hex--animate hex--delay0 hex--hoverDelay2 hex--hoverOffsetX5 hex--hoverOffsetY1 hex--offsetX3 hex--offsetY1" tabIndex={6}>
          <a href="http://steamcommunity.com/id/hertzahaeon" />
        </li>

        <li className="github hex hex--z4 hex--animate hex--delay1 hex--hoverDelay1 hex--hoverOffsetX0 hex--hoverOffsetY2 hex--offsetX1 hex--offsetY1" tabIndex={7}>
          <a href="https://github.com/HertzaHaeon" />
        </li>
        <li className="linkedin hex hex--z3 hex--animate hex--delay0 hex--hoverDelay2 hex--hoverOffsetX2 hex--hoverOffsetY2 hex--offsetX0 hex--offsetY2" tabIndex={8}>
          <a href="http://www.linkedin.com/in/mikaeltilly" />
        </li>
      </ul>
    </div>
  );
}

export default Menu;
