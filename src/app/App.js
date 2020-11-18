
import FolderNav from '../components/folderNav';
import Footer from '../components/footer';
import './App.css';
import React, { Component } from 'react';
import { Link, HashRouter as Router, Route, BrowserRouter } from 'react-router-dom';

class App extends Component {

  render(){
    return (
      <BrowserRouter basename="/" >
      <div className="app">
        <div className="content">
          <div className="content-inside">
            <div id="sideNavs">
              <Route exact path="/" component={FolderNav} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
