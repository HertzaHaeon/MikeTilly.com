import xmlParser from 'fast-xml-parser'

export default class DeviantArt {
  static fetchItems(count) {
    return fetch(DeviantArt.config.endpoints.items)
      .then(response => response.text())
      .then(r => {
        const data = xmlParser.parse(r, {
          ignoreAttributes: false
        })
        return data.rss.channel.item
      })
      .then(items => items.filter(DeviantArt.filterItem).map(DeviantArt.parseItem).sort(DeviantArt.sortItem))
  }

  static filterItem(item) {
    return 'media:thumbnail' in item
  }

  static parseItem(item) {
    
    const id = item.link.substr(item.link.lastIndexOf('-') + 1)
    const thumbnail = item['media:thumbnail'][1]
    console.log('parseItem',  {
      id,
      url: item.link,
      dateTime: new Date(item['pubDate']),
      animate: true,
      isMature: item['media:rating'] !== 'nonadult',
      thumbnail: {
        url: thumbnail['@_url'],
        width: thumbnail['@_width'],
        height: thumbnail['@_height']
      }
    })
    return {
      id,
      url: item.link,
      dateTime: new Date(item['pubDate']).toISOString(),
      animate: true,
      isMature: item['media:rating'] !== 'nonadult',
      thumbnail: {
        url: thumbnail['@_url'],
        width: thumbnail['@_width'],
        height: thumbnail['@_height']
      }
    };
  }
  
  static sortItem(a, b)  {
    if (a.dateTime > b.dateTime) return -1
    else if (a.dateTime < b.dateTime) return 1
    else return 0
  }
}

DeviantArt.config = {
  maxLimit: 24,
  endpoints: {
    items: "https://backend.deviantart.com/rss.xml?q=gallery%3Ahertzahaeon"
  }
};
