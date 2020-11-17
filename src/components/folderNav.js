import React from 'react';
import './folderNav.css';
import { Link } from 'react-router-dom';
import Manage from '../components/manage';
import Absorb from '../util/absorb';
import e from 'cors';


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
        alert(folderId)
      }
      
      createFolderList(){
        const folderItems = this.state.folders.map((folder) =>
        <Link to={`/`}><li onClick={this.loadFolder.bind(this, folder)} key={folder.id}>{folder}</li></Link>);
        return folderItems;
      }

   
      
    render(){
        return(
            <div className="folderNav">
                <ul id="topNav">
                  <li><b>Absorb</b></li>
                  <li>Manage</li>
                  <li>Test</li>
                </ul>
                <ul id="folderList">
                  <li><b>Folders</b></li>
                  {this.createFolderList()}
                </ul>
                <Manage loadedFolder={this.state.loadedFolder}/>    
            </div>
        )
    }
}

export default FolderNav;