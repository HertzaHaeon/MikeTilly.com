export default class localJson {
  static fetchItems() {
    return import("./local.json")
      .then(({items}) => items)
  }
}

localJson.config = {
  paths: {
    json: "./local.json"
  }
};
