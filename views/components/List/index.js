import React, { Component } from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import MasonryLayout from 'react-masonry-component'
import { push } from 'react-router-redux'
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card'
import Ripple from 'react-toolbox/lib/ripple'
import Avatar from 'react-toolbox/lib/avatar'
import Chip from 'react-toolbox/lib/chip'
import { getBlogList } from '../../store/action'

import styles from './styles.css'

const ARTICLES_PER_PAGE = 10

const RippleChip = Ripple({spread: 3})(Chip)


const mapStateToProps = (state, props) => {
  const { metaList } = state.blog
  let { page, tag, categories, archives } = props.match.params
  page = page ? parseInt(page.split('/')[1]) || 1 : 1
  tag = tag ? tag.split('/')[1] : ''
  categories = categories ? categories.split('/')[1] : ''
  archives = archives ? archives.split('/')[1] : ''

  return {
    metaList,
    page,
    tag,
    categories,
    archives,
  }
}

@connect(mapStateToProps)
class List extends Component {
  componentDidMount = async () => {
    this.props.dispatch(getBlogList())
  }

  handleRedirect = path => e => {
    e.stopPropagation()
    this.props.dispatch(push(path))
  }

  render() {
    let { metaList } = this.props
    const { page, tag, categories, archives } = this.props
    if (tag.length > 0) {
      metaList = metaList.filter(listItem => listItem.tags !== null && listItem.tags.includes(tag))
    }
    if (categories.length > 0) {
      metaList = metaList.filter(listItem => listItem.categories !== null && listItem.categories === categories)
    }
    if (archives.length > 0) {
      metaList = metaList.filter(listItem => listItem.date !== null && listItem.date.startsWith(archives))
    }
    metaList = metaList.slice(page * ARTICLES_PER_PAGE - ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE)
    return (
      <div className={styles.container}>
        <MasonryLayout
          id="blog-list"
          className={styles.listcontainer}>
          {
            metaList.map(listItem => (
              <div className={styles.listitem} key={listItem.name}>
                <Card className={styles.listitemcard}>
                  <CardTitle
                    title={listItem.title}
                    subtitle={(new Date(listItem.date)).toISOString().split('T')[0]}
                  />
                  <CardText>
                    <div>
                      <div className={styles.divider} />
                      { listItem.description != null && (
                        <div className={styles.description}>
                          { listItem.description }
                        </div>
                      )}
                      <section>
                        {listItem.categories != null && (
                          <RippleChip
                            className={styles.metachip}
                            onClick={this.handleRedirect(`/categories/${listItem.categories}`)}>
                            <Avatar><FontAwesome name='archive' /></Avatar>
                            <span>{listItem.categories}</span>
                          </RippleChip>
                        )}
                        <span>
                          {(listItem.tags || []).map(tag => (
                            <RippleChip
                              key={tag}
                              className={styles.metachip}
                              onClick={this.handleRedirect(`/tag/${tag}`)}>
                              <span>{tag}</span>
                            </RippleChip>
                          ))}
                        </span>
                      </section>
                    </div>
                  </CardText>
                </Card>
              </div>
            ))
          }
        </MasonryLayout>
      </div>
    )
  }
}

export default List
