export default class Flickr {
  
  static fetchItems(count) {
    let url = `${Flickr.config.endpoints.items}?method=flickr.people.getPublicPhotos&api_key=${Flickr.config.apiKey}&user_id=${Flickr.config.userId}&extras=date_upload,url_s,url_m&per_page=${count}&format=json&nojsoncallback=1`;

    return fetch(url)
      .then(response => response.json())
      .then(response => {
        if (response.stat === 'fail') {
          throw response.message;
        }
        //localCache.set(url, response, Flickr.config.cacheRequestAge);
        return response.photos.photo;
      })
      .then(items => items.map(Flickr.parseItem))
  }

  static parseItem(item) {
    return {
      id: item.id,
      title: item.title,
      url: Flickr.config.endpoints.photo + item.id,
      dateTime: item.dateupload,
      animate: true,
      isMature: false,
      thumbnail: {
        url: item.url_s,
        width: item.width_s,
        height: item.height_s
      },
      thumbnails: {
        s: {
          url: item.url_s,
          width: item.width_s,
          height: item.height_s
        },
        m: {
          url: item.url_m,
          width: item.width_m,
          height: item.height_m
        }
      }
    }
  }
}

Flickr.config = {
  userId: '63182451@N00',
  maxLimit: 24,
  apiKey: '9f05dc96d2390849636b2b1d5b6a92b5',
  endpoints: {
    items: 'https://api.flickr.com/services/rest/',
    photo: 'https://www.flickr.com/photos/63182451@N00/'
  }
};