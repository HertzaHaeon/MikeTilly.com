import React from 'react';

export default function Menu() {
  return (
    <div id="menu">
      <ul className="hex">
        <li className="mike noHex hexOffsetX_0 hexOffsetY_1"><img src="/img/Mike_avatar_hex.svg" alt="" /></li>
        <li className="helperHex helperHex_3x hexZ_0 hexOffsetX_0 hexOffsetY_1"><span /></li>
        <li className="deviantart hexZ_9 hexAnim hexDelay_1 hexHoverDelay_0 hexHoverOffsetX_1 hexHoverOffsetY_0 hexOffsetX_0 hexOffsetY_1">
          <a href="http://hertzahaeon.deviantart.com/" />
        </li>
        <li className="flickr hexZ_8 hexAnim hexDelay_1 hexHoverDelay_0 hexHoverOffsetX_2 hexHoverOffsetY_1 hexOffsetX_0 hexOffsetY_1">
          <a href="http://www.flickr.com/photos/hertzahaeon/" />
        </li>
        <li className="linkedin hexZ_8 hexAnim hexDelay_1 hexHoverDelay_0 hexHoverOffsetX_-1 hexHoverOffsetY_0 hexOffsetX_0 hexOffsetY_1">
          <a href="http://www.linkedin.com/in/mikaeltilly" />
        </li>
        <li className="goodreads hexZ_8 hexAnim hexDelay_1 hexHoverDelay_1 hexHoverOffsetX_-1 hexHoverOffsetY_2 hexOffsetX_0 hexOffsetY_1">
          <a href="http://www.goodreads.com/user/show/7193175-mikael-tilly" />
        </li>
        <li className="lastfm hexZ_8 hexAnim hexDelay_1 hexHoverDelay_1 hexHoverOffsetX_1 hexHoverOffsetY_2 hexOffsetX_0 hexOffsetY_1">
          <a href="http://www.last.fm/user/HertzaHaeon" />
        </li>
        <li className="steam hexZ_8 hexAnim hexDelay_1 hexHoverDelay_1 hexHoverOffsetX_-2 hexHoverOffsetY_1 hexOffsetX_0 hexOffsetY_1">
          <a href="http://steamcommunity.com/id/hertzahaeon" />
        </li>
        <li className="github hexZ_7 hexAnim hexDelay_0 hexHoverDelay_2 hexHoverOffsetX_0 hexHoverOffsetY_3 hexOffsetX_-1 hexOffsetY_2">
          <a href="https://github.com/HertzaHaeon" />
        </li>
      </ul>
    </div>
  );
}