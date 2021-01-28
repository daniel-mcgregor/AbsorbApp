import React from 'react';
import './folderNav.css';
import Manage from '../components/manage';
import Test from '../components/test';
import Absorb from '../util/absorb';
import pencil from '../images/pencil.png';
import pencil1 from '../images/pencil1.png';
import { Link, HashRouter as Router, Route, BrowserRouter } from 'react-router-dom';
import e from 'cors';


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
            manage: "400",
            test: "400"
          },
          refreshFolderItems: false,
          category: "All",
          fontWeight: "400",
          keySet: -1
        };

        this.createFolderList = this.createFolderList.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.loadFolder = this.loadFolder.bind(this);
      }
    
      componentDidMount() {
        this.getFolders();

        let location = "";
        location += window.location;

        if (location.includes("manage")){
         this.setState({currentPage: {
           manage: "700",
           test: "400"
         }})   
        }

        if (location.includes("test")){
          this.setState({currentPage: {
            manage: "400",
            test: "700"
          }})   
         }

      }

      componentDidUpdate(prevState) {

        if (this.state.newFolder != prevState.newFolder) {
          this.fetchPencil();
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

      currentPage(page) {
        if (page == "manage") {
          this.setState({currentPage : {
            manage: "700",
            test: "400"
          }}) 
        } else if (page =="test"){
          this.setState({currentPage : {
            manage: "400",
            test: "700"
          }}) 
        } else{
          this.setState({currentPage : {
            manage: "400",
            test: "400"
          }}) 
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

      changeCat(e) {
        this.setState({category: e.target.value});
      }

      boldify(){
        return 700;
      }
      
      createFolderList(){
        const folders = this.state.folders.map((folder) =>
        <li className="folderNavItem" id={folder} style={{'fontWeight': this.state.loadedFolder === folder ? 'bold' : 'normal'}} onClick={this.loadFolder.bind(this, folder)} key={folder.id}>{folder}
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
        window.location.reload();
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

      keySet(e) {
        this.setState({keySet: parseInt(e.target.value)})
      }

    
    render(){
        return(
          <BrowserRouter basename="/" >
            <div className="folderNav">
                <Link style={{ textDecoration: 'none', color: "black" }} to="/"><h3 id="appTitle" onClick={this.currentPage.bind(this, "home")}>Absorb</h3></Link>
                <ul id="topNav">
                <Link style={{ textDecoration: 'none', color: "black" }} to="/manage"><li className="pageNavItem" onClick={this.currentPage.bind(this, "manage")} style={{fontWeight: this.state.currentPage.manage}}>Manage</li></Link>
                <Link style={{ textDecoration: 'none', color: "black" }} to="/test"><li className="pageNavItem" onClick={this.currentPage.bind(this, "test")} style={{fontWeight: this.state.currentPage.test}}>Test</li></Link>
                </ul>
                <h4 id="folderTitle">Folders</h4>
                <ul id="folderList">
                  {this.createFolderList()}
                  <li><input maxlength="20" onChange={(e) => this.nameNewFolder(e)} onKeyDown={this.handleKeyDown} id="newFolder" placeholder="new folder"></input><img id="pencil" src={this.fetchPencil()} width={"10px"}/></li>
                </ul>
                <h4 id="catTitle">Category</h4>
                <div id="categoryDiv">
                    <select id="categories" onChange={(e) => this.changeCat(e)}>
                      <option value="All">All</option>
                      <option value="Clueless">Clueless</option>
                      <option value="Learning">Learning</option>
                      <option value="Mastered">Mastered</option>
                    </select>
                </div>
                <div id="keywordSetting">
                  Keyword triggers: <input onChange={(e) => this.keySet(e)} id="newKeySet" placeholder="All"></input>
                </div>
                <div className="verify" style={{display: this.state.verify}}>
                  <h3 className="verifyQuestion">Are you sure you want to <span className="red">permanently delete</span> this folder: {this.state.deleteFolder}?</h3>
                  <button onClick={this.removeFolder.bind(this)} className="answer">Delete</button><button onClick={this.cancel.bind(this)} className="answer">Cancel</button>
                </div>
                <Route path="/test" render={props => <Test keySet={this.state.keySet} category={this.state.category} refreshFolderItems={this.state.refreshFolderItems} loadedFolder={this.state.loadedFolder} folderOpen={this.state.folderOpen}/> } />
                <Route path="/manage" render={props => <Manage keySet={this.state.keySet} category={this.state.category} refreshFolderItems={this.state.refreshFolderItems} loadedFolder={this.state.loadedFolder} folderOpen={this.state.folderOpen}/> } />
            </div>
            </BrowserRouter>
        )
    }
}

export default FolderNav;