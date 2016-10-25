import apis from './apis';

export default class GalleryService {
  static load(apiCount = 20) {
    return Promise.all(
      apis.map(function(api) {
        return api.fetchItems(apiCount);
      }))
      .then(results => results.reduce((prev, curr) => prev.concat(curr), []))
      .then(GalleryService.sortItems);
  }

  static sortItems(items) {
    return items.sort(function(a, b) {
      switch (false) {
        case !(a.dateTime > b.dateTime):
          return -1;
        case !(a.dateTime < b.dateTime):
          return 1;
        default:
          return 0;
      }
    });
  }

  static sliceItems(items, offset, rows, columns) {
    return items.slice(offset * columns, (offset + rows) * columns);
  }

  static itemClasses(index, columns) {
    let classes, xOffset, yOffset;
    classes = ['hexagon', 'hexAnim'];
    yOffset = Math.floor(index / columns);
    xOffset = (index % columns) * 2 + yOffset % 2;
    classes.push('hexOffsetX_' + xOffset, 'hexOffsetY_' + yOffset);
    return classes;
  }
}
