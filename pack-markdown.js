const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const metaMarked = require('meta-marked')

const lists = glob.sync(path.join(__dirname, 'posts', 'articles', '*.md'))
const metaList = lists.map(p => {
  const cnt = metaMarked(fs.readFileSync(p, { encoding: 'utf8' }))

  const fileName = path.basename(p)
  const urlName = fileName.slice(0, fileName.length - 3)

  const date = new Date(cnt.meta.date)
  const year = '' + date.getUTCFullYear()
  let month = '0' + (date.getUTCMonth() + 1)
  month = month.slice(month.length - 2, month.length)
  let day = '0' + date.getUTCDate()
  day = day.slice(day.length - 2, day.length)

  const url = `${year}/${month}/${day}/${urlName}`
  try {
    const staticPath = p.slice(0, p.length - 3)
    fs.accessSync(staticPath)
    fs.copySync(staticPath, path.join(__dirname, 'public', year, month, day, urlName))
  } catch (e) {
    console.log('No static files')
  }

  const ret = Object.assign(cnt.meta, {
    url,
    name: urlName,
    markdown: cnt.markdown,
  })
  fs.ensureDirSync(path.join(__dirname, 'public', year, month, day))
  fs.writeJSONSync(path.join(__dirname, 'public', year, month, day, `${urlName}.json`), ret)

  delete ret.markdown
  return ret
})

const articleMap = new Map()
metaList.forEach(item => {
  articleMap.set(item.name, item)
})

metaList.sort((a, b) => (new Date(articleMap.get(b.name).date)).getTime() - (new Date(articleMap.get(a.name).date)).getTime())

const tags = {}
metaList.forEach(item => {
  if (Array.isArray(item.tags)) {
    item.tags.forEach(tag => {
      tags[tag] = [
        ...tags[tag] || [],
        item.name,
      ]
    })
  }
})
Object.keys(tags).forEach(tag => {
  tags[tag].sort((a, b) => (new Date(articleMap.get(b).date)).getTime() - (new Date(articleMap.get(a).date)).getTime())
})

const categories = {}
metaList.forEach(item => {
  if (typeof(item.categories) === 'string') {
    categories[item.categories] = [
      ...categories[item.categories] || [],
      item.name,
    ]
  }
})
Object.keys(categories).forEach(cat => {
  categories[cat].sort((a, b) => (new Date(articleMap.get(b).date)).getTime() - (new Date(articleMap.get(a).date)).getTime())
})

fs.writeJSONSync(path.join(__dirname, 'public', 'meta.json'), { metaList, tags, categories })
