import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { IconButton } from 'react-toolbox/lib/button'
import Drawer from 'react-toolbox/lib/drawer'
import Avatar from 'react-toolbox/lib/avatar'
import Ripple from 'react-toolbox/lib/ripple'
import Switch from 'react-toolbox/lib/switch'
import { Collapse } from 'react-collapse'
import FontAwesome from 'react-fontawesome'
import classnames from 'classnames'

import { enableLoop, disableLoop } from '../../3rd/mesh'

import styles from './styles.css'

import headerBG from './header-bg.jpg'
import avatar from './avatar.svg'

const MenuItem = ({ children, theme, ...props }) => (
  <div {...props}>{ children }</div>
)
const RippleMenuItem = Ripple({spread: 3})(MenuItem)


const mapStateToProps = (state, props) => {
  const { categories, tags, archives } = state.blog
  return {
    categories,
    tags,
    archives,
  }
}

@connect(mapStateToProps)
class Header extends Component {
  state = {
    background: localStorage.getItem('blog.kochiyaocean.org') !== 'false',
    drawer: false,
    links: false,
    tags: false,
    categories: false,
    archives: false,
  }

  handleToggle = target => e => {
    e.stopPropagation()
    if (target === 'background') {
      if (this.state.background) {
        disableLoop()
        localStorage.setItem('blog.kochiyaocean.org', 'false')
      } else {
        enableLoop()
        localStorage.setItem('blog.kochiyaocean.org', 'true')
      }
    }
    this.setState({
      [target]: !this.state[target],
    })
  }

  handleRedirect = path => e => {
    this.props.dispatch(push(path))
  }

  handleOpenLink = path => e => {
    window.open(path)
  }

  render () {
    return (
      <div className={styles.header}>
        <IconButton onClick={this.handleToggle('drawer')} className={styles.menubtn} icon={<FontAwesome name='bars' />} inverse />
        <Drawer active={this.state.drawer} onOverlayClick={this.handleToggle('drawer')} className={styles.drawer}>
          <div className={styles.drawerheader} style={{ backgroundImage: `url(${headerBG})` }}>
            <div className={styles.avatarcontainer}>
              <Avatar className={styles.avatar} image={avatar} />
            </div>
            <RippleMenuItem className={classnames(styles.name, { [styles.active]: this.state.links })}
              onClick={this.handleToggle('links')}>
              東風谷オーシャンの神社
              <b className={styles.caret} />
            </RippleMenuItem>
          </div>
          <div className={styles.drawermenu}>
            <Collapse isOpened={this.state.links}>
              <RippleMenuItem onClick={this.handleOpenLink("https://www.kochiyaocean.org/")}
                className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}>
                <FontAwesome className={styles.icon} name='flag' /> 主页
              </RippleMenuItem>
              <RippleMenuItem onClick={this.handleOpenLink("https://github.com/KochiyaOcean")}
                className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}>
                <FontAwesome className={styles.icon} name='github' /> GitHub
              </RippleMenuItem>
              <RippleMenuItem onClick={this.handleOpenLink("https://t.me/KochiyaOcean")}
                className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}>
                <FontAwesome className={styles.icon} name='telegram' /> Telegram
              </RippleMenuItem>
              <RippleMenuItem onClick={this.handleOpenLink("https://www.facebook.com/KochiyaOcean")}
                className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}>
                <FontAwesome className={styles.icon} name='facebook-official' /> Facebook
              </RippleMenuItem>
              <RippleMenuItem onClick={this.handleOpenLink("https://twitter.com/KochiyaOcean")}
                className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}>
                <FontAwesome className={styles.icon} name='twitter' /> Twitter
              </RippleMenuItem>
            </Collapse>
            <RippleMenuItem className={classnames(styles.drawermenuitem)}
              onClick={this.handleRedirect('/')}>
              <FontAwesome className={styles.icon} name='home' />
              首页
            </RippleMenuItem>
            <RippleMenuItem className={classnames(styles.drawermenuitem, { [styles.active]: this.state.categories })}
              onClick={this.handleToggle('categories')}>
              <FontAwesome className={styles.icon} name='th-list' />
              分类
              <b className={styles.caret} />
            </RippleMenuItem>
            <Collapse isOpened={this.state.categories}>
              {
                this.props.categories.map(({ categories, count }) => (
                  <RippleMenuItem onClick={this.handleRedirect(`/categories/${categories}`)}
                    className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}
                    key={categories}>
                    { categories }
                    <span className={styles.badge}>
                      { count }
                    </span>
                  </RippleMenuItem>
                ))
              }
            </Collapse>
            <RippleMenuItem className={classnames(styles.drawermenuitem, { [styles.active]: this.state.tags })}
              onClick={this.handleToggle('tags')}>
              <FontAwesome className={styles.icon} name='tags' />
              标签
              <b className={styles.caret} />
            </RippleMenuItem>
            <Collapse isOpened={this.state.tags}>
              {
                this.props.tags.map(({ tag, count }) => (
                  <RippleMenuItem onClick={this.handleRedirect(`/tag/${tag}`)}
                    className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}
                    key={tag}>
                    { tag }
                    <span className={styles.badge}>
                      { count }
                    </span>
                  </RippleMenuItem>
                ))
              }
            </Collapse>
            <RippleMenuItem className={classnames(styles.drawermenuitem, { [styles.active]: this.state.archives })}
              onClick={this.handleToggle('archives')}>
              <FontAwesome className={styles.icon} name='archive' />
              归档
              <b className={styles.caret} />
            </RippleMenuItem>
            <Collapse isOpened={this.state.archives}>
              {
                this.props.archives.map(({ ts, count }) => (
                  <RippleMenuItem onClick={this.handleRedirect(`/archives/${ts}`)}
                    className={classnames(styles.drawermenuitem, styles.drawersubmenuitem)}
                    key={ts}>
                    { ts }
                    <span className={styles.badge}>
                      { count }
                    </span>
                  </RippleMenuItem>
                ))
              }
            </Collapse>
          </div>
          <RippleMenuItem onClick={this.handleToggle('background')}
            className={classnames(styles.drawermenuitem)}>
            背景动画
            <span className={styles.switch}>
              <Switch
                checked={this.state.background}
              />
            </span>
          </RippleMenuItem>
        </Drawer>
      </div>
    )
  }
}


export default Header
