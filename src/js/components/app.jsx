import React from 'react';
import config from '../config';
import GalleryService from '../services/gallery';
import Menu from './menu.jsx';
import Gallery from './gallery.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.initiated = false;
    this.reflow = this.reflow.bind(this);
    this.scrollerElement = undefined;
    this.state = {
      items: [],
      styles: {
        background: {
          height: '100%'
        },
        wrapper: {
          left: '0px',
          height: 'auto'
        }
      },
      pageDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollTop: 0,
        scrollMax: window.innerHeight
      }
    };
  }

  componentWillMount () {
    GalleryService.load(config.api.count)
      .then(items => GalleryService.sortItems(items))
      .then(items => {
        this.setState({
          items: items
        })
      });
  }

  componentDidMount() {
    this.scrollListener = this.scrollerElement.addEventListener('scroll', this.setDimensions.bind(this));
    this.resizeListener = window.addEventListener('resize', this.setDimensions.bind(this));
    this.setDimensions();
  }

  componentWillUnmount() {
    this.scrollerElement.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.resizeListener);
  }

  setDimensions() {
    this.setState({
      pageDimensions: Object.assign(this.state.pageDimensions, {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollTop: this.scrollerElement.scrollTop,
        scrollMax: this.scrollerElement.scrollHeight
      })
    });
  }

  reflow(data) {
    this.initiated = true;
    this.setState({
      styles: {
        background: {
          height: data.height + 'px'
        },
        wrapper: {
          height: this.state.pageDimensions.height + 'px',
          left: ((this.state.pageDimensions.width - data.width) / 2).toString() + 'px'
        }
      }
    });
  }

  render() {
    return (
      <div id="app">
        <div id="wrapper" style={this.state.styles.wrapper}>
          {this.initiated ? <Menu/> : null}
          <Gallery items={this.state.items} pageDimensions={this.state.pageDimensions} onReflow={this.reflow} />
        </div>
        <div id="scroller" ref={element => this.scrollerElement = element}>
          {this.initiated ? <div className="background" style={this.state.styles.background} /> : null}
          {this.initiated ? <div className="background" style={this.state.styles.background} /> : null}
        </div>
      </div>
    )
  }
}