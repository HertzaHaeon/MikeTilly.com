export default class Flickr {
  
  static fetchItems(count) {
    let url = `${Flickr.config.endpoints.items}?method=flickr.people.getPublicPhotos&api_key=${Flickr.config.apiKey}&user_id=${Flickr.config.userId}&extras=date_upload,url_s&per_page=${count}&format=json&nojsoncallback=1`;

    return fetch(url)
      .then(response => response.json())
      .then(response => {
        if (response.stat == 'fail') {
          throw response.message;
        }
        //localCache.set(url, response, Flickr.config.cacheRequestAge);
        return response.photos.photo;
      })
      .then(items => items.map(Flickr.parseItem))
  }

  static parseItem(item, index) {
    return {
      id: item.id,
      url: Flickr.config.endpoints.photo + item.id,
      dateTime: item.dateupload,
      isMature: false,
      thumbnail: item.url_s
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