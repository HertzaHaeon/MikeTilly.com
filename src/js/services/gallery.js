import apis from "./apis"

export default class GalleryService {
  static subscribe(subscriber, userOptions = {}) {
    const options = {
      count: userOptions.count || 20,
      totalTileCount: userOptions.count || 20,
    }
    let items = []

    Promise.all(
      apis.map((api) =>
        api.fetchItems(options.count).then((results) => {
          items = GalleryService.sortItems(items.concat(results))
          subscriber.next(items)
        })
      )
    )
  }

  static sortItems(items) {
    return items.sort(function (a, b) {
      switch (false) {
        case !(a.dateTime > b.dateTime):
          return -1
        case !(a.dateTime < b.dateTime):
          return 1
        default:
          return 0
      }
    })
  }
}
