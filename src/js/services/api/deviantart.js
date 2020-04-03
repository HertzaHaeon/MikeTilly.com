export default class deviantArt {
  static provider = 'deviantart';
  
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

  static parseItem(item) {
    return {
      provider: deviantArt.provider,
      id: item.deviationid,
      title: item.title,
      url: item.url,
      dateTime: item.published_time,
      isMature: item.is_mature,
      thumbnails: [...item.thumbs, item.preview].map(thumbnail => ({
        url: thumbnail.src,
        width: thumbnail.width,
        height: thumbnail.height
      }))
    };
  }
}

deviantArt.config = {
  maxLimit: 24,
  endpoints: {
    items: '//www.miketilly.com/php/deviantart.php'
  }
};
