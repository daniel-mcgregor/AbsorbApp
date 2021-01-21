import React from 'react';
import './manage.css';
import FolderNav from '../components/folderNav';
import { Link } from 'react-router-dom';


import Absorb from '../util/absorb';

class Manage extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            folder: null,
            folderItems: [],
            newEntryItems: {
                folder: this.props.loadedFolder,
                entry: null, 
                score: "0",
                def1: null,
                key1: null,
                id: null
            },
            folderOpen: "open",
            selected: null,
            editing: false,
            focus: false,
            defFocus: false,
            entFocus: false
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
      }

    componentDidMount() {

        Absorb.getFolders().then(folder => {
          if (folder.length){
            this.setState({
                folder: folder,
                savedFolder: JSON.parse(JSON.stringify(folder))
            });
          }
        });

    }

    componentDidUpdate(prevProps, prevState){

        if (this.props.category !== prevProps.category) {
            this.fetchFolderItems();
        }

        if (this.state.newEntryItems.id !== prevState.newEntryItems.id){
            
            if (this.state.newEntryItems.id) {
                document.getElementById("deleteButton").style.opacity = "1";
                document.getElementById("deleteButton").style.pointerEvents = "all";
            } else {
                
                document.getElementById("deleteButton").style.opacity = "0.6";
                document.getElementById("deleteButton").style.pointerEvents = "none";
            }

        }

        if (this.state.newEntryItems.entry !== prevState.newEntryItems.entry) {

            if (this.state.newEntryItems.entry) {
                document.getElementById("saveButton").style.opacity = "1";
                document.getElementById("saveButton").style.pointerEvents = "all";
            } else {
                document.getElementById("saveButton").style.opacity = "0.6";
                document.getElementById("saveButton").style.pointerEvents = "none";
            }
        }

        if (this.state.editing !== prevState.editing) {
            if (this.state.editing) {
                document.getElementById("cancelButton").style.opacity = "1";
                document.getElementById("cancelButton").style.pointerEvents = "all";
            } else {
                document.getElementById("cancelButton").style.opacity = "0.6";
                document.getElementById("cancelButton").style.pointerEvents = "none";
            }
        }
  

        if (this.props.folderOpen === this.state.folderOpen){

            this.fetchFolderItems();

        // the following if..else is used to prevent an infinite loop where the request for folder-items would continue indefintely.

            if (this.state.folderOpen === "open") {
                this.setState({folderOpen: "closed"});
            } else {
                this.setState({folderOpen: "open"});
            }
        }

    }

    newEntryEntry(event) {
    const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
    newEntryItems.entry = event.target.value;
    this.setState({newEntryItems: newEntryItems});
    }

    newEntryDefinition(event) {
    const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
    newEntryItems.def1 = event.target.value;
    this.setState({newEntryItems: newEntryItems});
    }

    newEntryKeyword(keywords) {
    const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
    newEntryItems.key1 = keywords;
    this.setState({newEntryItems: newEntryItems});
    }

    handleKeyDown(event) {
        
        let keywords = document.querySelector("#key1").innerHTML;
        this.newEntryKeyword(keywords);

        if(event.keyCode === 13) { 
            event.preventDefault();
        }

        if(event.keyCode === 32) { 
            this.seperate();
            event.preventDefault();

            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(event.target);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            event.target.focus();
            range.detach(); // optimization
      }
    }

    fetchFolderItems(){

        let low;
        let high;
        
        if (this.props.category === "All") {
            Absorb.getFolderItemsByFolderName(this.props.loadedFolder).then(folderItems => {
                const newEntryItems = {...this.state.newEntryItems};
                newEntryItems.folder = this.props.loadedFolder;
                this.setState({
                    folderItems: folderItems,
                    newEntryItems: newEntryItems,
                    savedFolderItems: JSON.parse(JSON.stringify(folderItems))
                });
            });

            return;

        } else if (this.props.category === "Clueless") {
            low = 0;
            high = 4;
        } else if (this.props.category === "Learning") {
            low = 5
            high = 9
        } else {
            low = 10
            high = 99999;
        }

        Absorb.getFolderItemsByCategory(this.props.loadedFolder, low, high).then(folderItems => {
            const newEntryItems = {...this.state.newEntryItems};
            newEntryItems.folder = this.props.loadedFolder;
            this.setState({
                folderItems: folderItems,
                newEntryItems: newEntryItems,
                savedFolderItems: JSON.parse(JSON.stringify(folderItems))
            });
        });
        
    }

    // send state items to database. TODO: create methods which update state to hold the new entry items.


    cancelEdit() {

        document.getElementById("entry1").value = null;
        document.getElementById("def1").value = null;
        document.getElementById("key1").innerHTML = null;

        const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
        newEntryItems.id = null;
        this.setState({newEntryItems: newEntryItems});
        this.setState({editing: false});
        this.setState({newEntryItems: {
            folder: this.props.loadedFolder,
                entry: null, 
                score: "0",
                def1: null,
                key1: null,
                id: null
        }});

        this.fetchFolderItems();

    }

    deleteEntry() {

        Absorb.deleteEntry(this.props.loadedFolder, this.state.newEntryItems.id).then(folderItems => {
            if (folderItems){
            const newEntryItems = {...this.state.newEntryItems};
            newEntryItems.folder = this.props.loadedFolder;
            this.setState({
                folderItems: folderItems,
                newEntryItems: newEntryItems,
                savedFolderItems: JSON.parse(JSON.stringify(folderItems))
                });
            }
        });

        this.cancelEdit();
    }

    saveNewEntry() {

        let exists = false;

        this.state.folderItems.forEach(objectElement => { 
            if (objectElement.entry === this.state.newEntryItems.entry){
                exists = true;
            } 
        });

        if (exists === false && this.state.editing === false) {
                Absorb.saveEntry(this.props.loadedFolder, this.state.newEntryItems).then(folderItems => {
                    if (folderItems){
                    const newEntryItems = {...this.state.newEntryItems};
                    newEntryItems.folder = this.props.loadedFolder;
                    this.setState({
                        folderItems: folderItems,
                        newEntryItems: newEntryItems,
                        savedFolderItems: JSON.parse(JSON.stringify(folderItems))
                    });
            }})} else {
                Absorb.updateEntry(this.props.loadedFolder, this.state.newEntryItems).then(folderItems => {
                    if (folderItems){
                    const newEntryItems = {...this.state.newEntryItems};
                    newEntryItems.folder = this.props.loadedFolder;
                    this.setState({
                        folderItems: folderItems,
                        newEntryItems: newEntryItems,
                        savedFolderItems: JSON.parse(JSON.stringify(folderItems))
                    });
                }
            });
        }
    
        document.getElementById("entry1").value = null;
        document.getElementById("def1").value = null;
        document.getElementById("key1").innerHTML = null;

        const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
        newEntryItems.id = null;
        newEntryItems.entry = null;
        newEntryItems.key1 = null;
        this.setState({newEntryItems: newEntryItems});
        this.setState({editing: false});
        this.setState({focus: false})
    
    };

    // select item from item-list and save it's value as state.

    
    select(selected) {

        Absorb.getFolderItemsContent(this.props.loadedFolder, selected).then(folderItemContents => {
            if (folderItemContents){
                const newEntryItems = JSON.parse(JSON.stringify(folderItemContents));
                
                this.setState({newEntryItems:
                     {
                         entry: newEntryItems.folderItemContents.entry,
                         def1: newEntryItems.folderItemContents.def1,
                         key1: newEntryItems.folderItemContents.key1,
                         folder: newEntryItems.folderItemContents.folder,
                         score: newEntryItems.folderItemContents.score.toString(),
                         id: newEntryItems.folderItemContents.id.toString()

                    }
                    });
          }

          document.getElementById("entry1").value = this.state.newEntryItems.entry;
          document.getElementById("def1").value = this.state.newEntryItems.def1;
          document.getElementById("key1").innerHTML = this.state.newEntryItems.key1;

          this.seperate();

          this.setState({editing: true});
          
          this.state.folderItems.forEach(item => {
              if (item.entry === this.state.newEntryItems.entry) {
                  item.selected = "600";
              } else {
                  item.selected = "400";
              }
          })
        });
    }
    

    renderFolderItems(){
    
    const folderItems = this.state.folderItems.map((folderItem) =>
    <li key={folderItem.id}>
        <table className="manageTable">
            <thead>
            <tr>
            <th className="entryItem" style={{fontWeight: folderItem.selected}} onClick={(e) => this.select(folderItem.entry)}>{folderItem.entry}</th>
            <th className="score" style={{fontWeight: folderItem.selected}}>{folderItem.score}</th>
            </tr>
            </thead>
        </table>
    </li>);

    return folderItems;

    }

    getItemsLength(){
        if (this.state.folderItems.length > 0) {
            return "(" + this.state.folderItems.length + ")"
        } else {
            return null;
        }
    }

    seperate() {
            const keywords = document.getElementById("key1").innerHTML;

            if (keywords){
            const splitKeys = keywords.split("&nbsp;");
            const keyArray = [];
            splitKeys.forEach(keyword => { 
                if (!keyword.includes('contenteditable')){
                keyArray.push("<span class='keyword' contenteditable='false'>" + keyword + "</span>&nbsp")
                } else {
                    keyArray.push(keyword);
                }
            });
            document.getElementById("key1").innerHTML = keyArray.join(" ");
        }
    }

    keyPlaceholder(){
        if (!this.state.focus && !this.state.newEntryItems.key1) {
            return <span className="greyedOut">Keywords</span>;
        } else {
            return null;
        }
    }

    focus(){
        this.setState({focus: true});
    }

    blur(){
        this.setState({focus: false});
    }

    defFocus(){
        this.setState({defFocus: true});
    }

    defBlur(){
        this.setState({defFocus: false});
    }

    defPlaceholder(){
        if (!this.state.defFocus){
            return "Definitions / Answers";
        } else {
            return "";
        }
    }

    entFocus(){
        this.setState({entFocus: true});
    }

    entBlur(){
        this.setState({entFocus: false});
    }

    entPlaceholder(){
        if (!this.state.entFocus){
            return "New Entry";
        } else {
            return "";
        }
    }

    render(){
        return(
            <div id="manageDiv">
                <form id="newEntryform">
                <input onChange={(e) => this.newEntryEntry(e)} id="entry1" type="text" onBlur={this.entBlur.bind(this)} onFocus={this.entFocus.bind(this)} placeholder={this.entPlaceholder()}></input>
                <textarea onChange={(e) => this.newEntryDefinition(e)} id="def1" type="text" onBlur={this.defBlur.bind(this)} onFocus={this.defFocus.bind(this)} placeholder={this.defPlaceholder()}></textarea>
                <div contenteditable="true" onBlur={this.blur.bind(this)} onFocus={this.focus.bind(this)} onKeyDown={this.handleKeyDown}  id="key1" type="text">{this.keyPlaceholder()}</div>
                <button onClick={this.saveNewEntry.bind(this)} id="saveButton" type="button">Save Entry</button>
                <button onClick={this.deleteEntry.bind(this)} id="deleteButton" type="button">Delete Entry</button>
                <button onClick={this.cancelEdit.bind(this)} id="cancelButton" type="button">Cancel Edit</button>
                </form>
                <div id="currentFolder">
                    <h4>{this.props.loadedFolder} <span id="blue">{this.getItemsLength()}</span></h4>
                </div>
                <div id="entriesTableDiv">
                    <table className="manageTable">
                        <thead>
                        <tr>
                        <th  className="entry">Entry</th>
                        <th  className="score">Score</th>
                        </tr>
                        </thead>
                    </table>
                    <ul>{this.renderFolderItems()}</ul>
                </div>
            </div>
        )
    }
}

export default Manage;