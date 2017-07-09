const handleRequest = url => fetch(url).then(response => response.json())
const handleLoadList = value => ({ type: '@@data/ListLoad', value })
const handleLoadFailed = value => ({ type: '@@data/LoadFailed' })

export const getBlogList = () => (dispatch, getState) => {
  return handleRequest(`${location.origin}/meta.json`).then(res => {
    dispatch(handleLoadList(res))
  }).catch(e => {
    dispatch(handleLoadFailed())
  })
}
