
import FolderNav from '../components/folderNav';
import Footer from '../components/footer';
import './App.css';
import React, { Component } from 'react';

class App extends Component {

  render(){
    return (
      <div className="app">
        <div className="content">
          <div className="content-inside">
            <div id="sideNavs">
              <FolderNav/>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
