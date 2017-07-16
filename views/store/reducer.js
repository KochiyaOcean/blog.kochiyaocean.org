const initState = {
  metaList: [],
  tags: [],
  categories: [],
  archives: [],
  blog: {},
  loading: true,
}

const reducer = (state = initState, { type, value }) => {
  switch (type) {
  case '@@data/LoadStart': {
    state = {
      ...state,
      loading: true,
    }
    break
  }
  case '@@data/LoadFailed': {
    state = {
      ...state,
      loading: false,
    }
    break
  }
  case '@@data/ListLoad': {
    state = {
      ...state,
      ...value,
      loading: false,
    }
    break
  }
  }
  return state
}

export default reducer
