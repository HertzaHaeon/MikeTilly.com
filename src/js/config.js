const config = {
  layout: {
    columns: {
      initial: 4,
      min: 3,
      max: 5,
      width: 150
    },
    rows: {
      initial: 3,
      min: 3,
      max: 5,
      height: 25
    },
    margin: {
      left: 450
    }
  },
  thumbnails: {
    minSize: 200
  },
  scroll: {
    step: 150
  },
  animation: {
    timing: 200,
  },
  api: {
    count: 25,
  }
};

export default config;