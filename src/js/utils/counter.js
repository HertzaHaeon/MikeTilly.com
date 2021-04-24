function* counter(init = 0, step = 1) {
  let count = init
  yield count
  while (true) {
    count += step
    yield count
  }
}

export default counter
