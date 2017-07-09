import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import List from './components/List'
import Background from './components/Background'
import Header from './components/Header'
import { store, history } from './store/create-store'
import './styles.css'
import '!style-loader!css-loader!font-awesome/css/font-awesome.min.css'

const routes = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Header />
        <Switch>
          <Route path='/:tag(tag/[^/]*)?/:categories(categories/[^/]*)?/:archives(archives/[^/]*)?/:page(page/[^/]*)?' component={List} />
        </Switch>
        <Route component={Background}/>
      </div>
    </ConnectedRouter>
  </Provider>
)

ReactDOM.render(routes, document.getElementById('root'))
