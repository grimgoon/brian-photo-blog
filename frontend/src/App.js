import React, { Component } from 'react';
import './App.css';
import  {Route, Switch} from 'react-router-dom';

import Content from './components/Content/Content';
import Admin from './components/Admin/Admin';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
            <Route path="/" exact component={Content}/>
            <Route path="/admin" exact component={Admin}/>
            <Route path="/category" component={Content}/>
          </Switch>
      </div>
    );
  }
}

export default App;
