export default class localJson {
  static fetchItems(count) {
    return import("./local.json")
      .then(({items}) => items)
  }

  static filterItem(item) {
    return "thumbs" in item && item.thumbs.length;
  }

  static parseItem(item, index) {
    const thumbnail = item.thumbs[2].width >= 100 && item.thumbs[2].height >= 100 ? item.thumbs[2] : item.preview;
    return {
      id: item.deviationid,
      url: item.url,
      dateTime: item.published_time,
      isMature: item.is_mature,
      thumbnail: {
        url: thumbnail.src,
        width: thumbnail.width,
        height: thumbnail.height
      }
    };
  }
}

localJson.config = {
  paths: {
    json: "./local.json"
  }
};
