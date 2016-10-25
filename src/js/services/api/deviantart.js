export default class deviantArt {
  static fetchItems(count) {
    const url = deviantArt.config.endpoints.items + '?';
    let calls = [];
    let counter = 0;
    while (counter < count) {
      let actualCount = Math.min(parseInt(count, 10), deviantArt.config.maxLimit);
      calls.push(fetch(url + 'limit=' + actualCount + '&offset=' + counter)
        .then(response => response.json())
        .then(json => json.results)
        .then(items => items.filter(deviantArt.filterItem).map(deviantArt.parseItem))
      );
      counter += actualCount;
    }
    return Promise.all(calls)
      .then(results => results.reduce((prev, curr) => prev.concat(curr), []));
  }

  static filterItem(item) {
    return 'thumbs' in item && item.thumbs.length;
  }

  static parseItem(item, index) {
    return {
      id: item.deviationid,
      url: item.url,
      dateTime: item.published_time,
      thumbnail: item.thumbs[2].width >= 100 && item.thumbs[2].height >= 100 ? item.thumbs[2].src : item.preview.src
    };
  }
}

deviantArt.config = {
  maxLimit: 24,
  endpoints: {
    items: '//www.miketilly.com/php/deviantart.php'
  }
};
