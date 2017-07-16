const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const metaMarked = require('meta-marked')

const lists = glob.sync(path.join(__dirname, 'posts', 'articles', '*.md'))
const metaList = lists.map(p => {
  const cnt = metaMarked(fs.readFileSync(p, { encoding: 'utf8' }))

  const fileName = path.basename(p)
  const urlName = fileName.slice(0, fileName.length - 3)
  // eslint-disable-next-line no-console
  console.log(fileName)

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
    // eslint-disable-next-line no-console
    console.log('\tStatic files copied')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('\tNo static files')
  }

  const ret = Object.assign(cnt.meta, {
    url,
    name: urlName,
    markdown: cnt.markdown,
  })
  fs.ensureDirSync(path.join(__dirname, 'public', year, month, day))
  fs.writeJSONSync(path.join(__dirname, 'public', year, month, day, `${urlName}.json`), ret)
  // eslint-disable-next-line no-console
  console.log('\tBlog data written')

  delete ret.markdown
  return ret
})

const articleMap = new Map()
metaList.forEach(item => {
  articleMap.set(item.name, item)
})

metaList.sort((a, b) => (new Date(articleMap.get(b.name).date)).getTime() - (new Date(articleMap.get(a.name).date)).getTime())

const tags = []
metaList.forEach(item => {
  if (Array.isArray(item.tags)) {
    item.tags.forEach(tag => {
      if (!tags.find(i => i.tag === tag)) {
        tags.push({ tag, count: 1 })
      } else {
        tags.find(i => i.tag === tag).count++
      }
    })
  }
})
tags.sort((a, b) => a.tag > b.tag ? 1 : -1)

const categories = []
metaList.forEach(item => {
  if (typeof(item.categories) === 'string') {
    if (!categories.find(i => i.categories === categories)) {
      categories.push({ categories:item.categories, count: 1 })
    } else {
      categories.find(i => i.categories === categories).count++
    }
  }
})
categories.sort((a, b) => a.categories > b.categories ? 1 : -1)

const archives = []
metaList.forEach(item => {
  if (typeof(item.url) === 'string') {
    const ts = item.url.slice(0, 7)
    if (!archives.find(i => i.ts === ts)) {
      archives.push({ ts, count: 1 })
    } else {
      archives.find(i => i.ts === ts).count++
    }
  }
})
archives.sort((a, b) => a.ts < b.ts ? 1 : -1)

fs.writeJSONSync(path.join(__dirname, 'public', 'meta.json'), { metaList, tags, categories, archives })
// eslint-disable-next-line no-console
console.log('Metadata written!')
