import React from 'react';
import './folderNav.css';
import { Link } from 'react-router-dom';

import Absorb from '../util/absorb';


class FolderNav extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          folders: []
        };
      }
    
      componentDidMount() {
        Absorb.getFolders().then(folders => {
          if (folders.length){
            this.setState({folders: folders.map(folder => folder.name)});
          }
        });
      }

      createFolderList(){
        const folderItems = this.state.folders.map((folder) =>
        <Link to={`/#/:${folder}`}><li onclickkey={folder.id}>{folder}</li></Link>);
        return folderItems;
      }
      
    render(){
        return(
            <div className="folderNav">
                <ul>
                  <li><b>Absorb</b></li>
                  <li>Manage</li>
                  <li>Test</li>
                </ul>
                <ul>
                  <li><b>Folders</b></li>
                  {this.createFolderList()}
                </ul>    
            </div>
        )
    }
}

export default FolderNav;