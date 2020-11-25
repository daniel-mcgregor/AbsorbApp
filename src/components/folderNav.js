import React from 'react';
import './folderNav.css';
import { Link } from 'react-router-dom';
import Manage from '../components/manage';
import Absorb from '../util/absorb';


class FolderNav extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          folders: [],
          loadedFolder: null
        };

        this.createFolderList = this.createFolderList.bind(this);
      }
    
      componentDidMount() {
        Absorb.getFolders().then(folders => {
          if (folders.length){
            this.setState({folders: folders.map(folder => folder.name)});
          }
        });
      }

      loadFolder(folderId){
        this.setState({loadedFolder: folderId});
      }
      
      createFolderList(){
        const folders = this.state.folders.map((folder) =>
        <li class="folderNavItem" onClick={this.loadFolder.bind(this, folder)} key={folder.id}>{folder}</li>);
        return folders;
      }

   
      
    render(){
        return(
            <div className="folderNav">
              <h3 id="appTitle">Absorb</h3>
                <ul id="topNav">
                  <li class="folderNavItem">Manage</li>
                  <li class="folderNavItem">Test</li>
                </ul>
                <h4 id="folderTitle">Folders</h4>
                <ul id="folderList">
                  {this.createFolderList()}
                </ul>
                <Manage loadedFolder={this.state.loadedFolder}/>    
            </div>
        )
    }
}

export default FolderNav;