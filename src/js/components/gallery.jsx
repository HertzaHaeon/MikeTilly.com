import React from 'react';
import config from '../config';
import bound from '../utils/bound';
import GalleryService from '../services/gallery';
import GalleryDisplay from './galleryDisplay.jsx';

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: {
        height: 0,
        width: 0,
        offset: 0,
        total: {
          rows: 0
        },
        visible: {
          columns: config.layout.columns.initial,
          rows: config.layout.rows.initial
        }
      },
      visibleItems: []
    };
    this.oldHeight = 0;
  }

  componentWillReceiveProps(props) {
    const layout = this.transform(props.items, props.pageDimensions, this.state.layout);
    const visibleItems = this.resize(props.items, layout);
    this.setState({
      layout,
      visibleItems
    });
  }

  resize(items, layout, force = false) {
    if (force || (layout.height && layout.height != this.oldHeight)) {
      this.oldHeight = layout.height;
      this.props.onReflow(layout);
    }
    return GalleryService.sliceItems(items, layout.offset, layout.visible.rows, layout.visible.columns);
  }

  transform(items, pageDimensions, layout) {
    // Visible columns
    layout.visible.columns = Math.floor((pageDimensions.width - config.layout.margin.left) / config.layout.columns.width);
    layout.visible.columns = bound(layout.visible.columns, config.layout.columns.min, config.layout.columns.max);
    // Total rows
    layout.total.rows = Math.ceil(items.length / layout.visible.columns);
    // Visible rows
    layout.visible.rows = Math.floor(pageDimensions.height / config.layout.rows.height);
    layout.visible.rows = bound(layout.visible.rows, config.layout.rows.min, config.layout.rows.max);
    // Layout dimensions
    layout.width = layout.visible.columns * config.layout.columns.width + config.layout.margin.left;
    layout.height = layout.total.rows * config.layout.rows.height;
    // Row scroll offset
    layout.offset = Math.floor((pageDimensions.scrollTop / pageDimensions.scrollMax) * layout.total.rows);
    return layout;
  }

  render() {
    return <GalleryDisplay items={this.state.visibleItems} columns={this.state.layout.visible.columns} />;
  }
}

Gallery.propTypes = {
  pageDimensions: React.PropTypes.object,
  onReflow: React.PropTypes.func
};
Gallery.defaultProps = {
  pageDimensions: {}
};