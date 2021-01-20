import React from 'react';
import './folderNav.css';
import { Link } from 'react-router-dom';
import Manage from '../components/manage';
import Absorb from '../util/absorb';
import pencil from '../images/pencil.png';
import pencil1 from '../images/pencil1.png';


class FolderNav extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          folders: [],
          loadedFolder: null,
          folderOpen: "closed",
          newFolder: null,
          deleteFolder: null,
          verify: "none",
          currentPage: {
            manage: "700",
            test: "300"
          },
          refreshFolderItems: false
        };

        this.createFolderList = this.createFolderList.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.loadFolder = this.loadFolder.bind(this);
      }
    
      componentDidMount() {
        this.getFolders();
      }

      componentDidUpdate(prevState) {

        if (this.state.newFolder != prevState.newFolder) {
          this.fetchPencil();
        }
        
        if (this.state.folders != prevState.folders) {
          this.getFolders();
        }
      }

      nameNewFolder(event) {
        this.setState({newFolder: event.target.value});
      }


      handleKeyDown(event) {
        if(event.keyCode === 13) { 
            this.createFolder();
      }
    }


      getFolders() {
        Absorb.getFolders().then(folders => {
            this.setState({folders: folders.map(folder => folder.name)});
        });
      }

      deleteFolder(folder) {
        this.setState({deleteFolder: folder});
        this.setState({verify: "block"});
      }

      removeFolder() {
        Absorb.deleteFolder(this.state.deleteFolder).then(folders => {
            this.setState({folders: folders.map(folder => folder.name)});
        });
        this.setState({verify: "none"});
        this.getFolders();
        
        if (this.state.loadedFolder == this.state.deleteFolder) {
          window.location.reload();
        }
      }


      loadFolder(folder){
        this.setState({loadedFolder: folder});

        if (this.state.folderOpen == "closed"){
        this.setState({folderOpen: "open"});
        } else {
          this.setState({folderOpen: "closed"});
        }
  

      }
      
      createFolderList(){
        const folders = this.state.folders.map((folder) =>
        <li className="folderNavItem" id={folder} style={{fontWeight: this.state.folders.selected}} onClick={this.loadFolder.bind(this, folder)} key={folder.id}>{folder}
         <button onClick={this.deleteFolder.bind(this, folder)} className="remove">⁠–</button></li>);
        return folders;
      }

      createFolder() {
        Absorb.createFolder(this.state.newFolder.trim()).then(folders => {
            this.setState({folders: folders.map(folder => folder.name)});
        });
        this.getFolders();
        document.getElementById("newFolder").value = null;
        this.setState({newFolder: null});
      }

      cancel() {
        this.setState({verify: "none"});
      }

      fetchPencil(){
        if (this.state.newFolder) {
          return pencil1;
        } else {
          return pencil;
        }
      }

    
    render(){
        return(
            <div className="folderNav">
              <h3 id="appTitle">Absorb</h3>
                <ul id="topNav">
                  <li className="folderNavItem" style={{fontWeight: this.state.currentPage.manage}}>Manage</li>
                  <li className="folderNavItem">Test</li>
                </ul>
                <h4 id="folderTitle">Folders</h4>
                <ul id="folderList">
                  {this.createFolderList()}
                  <li><input maxlength="20" onChange={(e) => this.nameNewFolder(e)} onKeyDown={this.handleKeyDown} id="newFolder" placeholder="new folder"></input><img id="pencil" src={this.fetchPencil()} width={"10px"}/></li>
                </ul>
                <div className="verify" style={{display: this.state.verify}}>
                  <h3 className="verifyQuestion">Are you sure you want to <span className="red">permanently delete</span> this folder: {this.state.deleteFolder}?</h3>
                  <button onClick={this.removeFolder.bind(this)} className="answer">Delete</button><button onClick={this.cancel.bind(this)} className="answer">Cancel</button>
                </div>
                <Manage refreshFolderItems={this.state.refreshFolderItems} loadedFolder={this.state.loadedFolder} folderOpen={this.state.folderOpen}/>    
            </div>
        )
    }
}

export default FolderNav;