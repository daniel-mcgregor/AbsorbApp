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
                key1: null
            },
            folderOpen: "open",
            selected: null
        };
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

        if (this.props.folderOpen == this.state.folderOpen){

        Absorb.getFolderItemsByFolderName(this.props.loadedFolder).then(folderItems => {
            if (folderItems.length){
            const newEntryItems = {...this.state.newEntryItems};
            newEntryItems.folder = this.props.loadedFolder;
            this.setState({
                folderItems: folderItems,
                newEntryItems: newEntryItems,
                savedFolderItems: JSON.parse(JSON.stringify(folderItems))
            });
          }
        });

        // the following if..else is used to prevent an infinite loop where the request for folder-items would continue indefintely.

        if (this.state.folderOpen == "open") {
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

    newEntryKeyword(event) {
    const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
    newEntryItems.key1 = event.target.value;
    this.setState({newEntryItems: newEntryItems});
    }

    // send state items to database. TODO: create methods which update state to hold the new entry items.

    saveNewEntry() {

        let exists = false;

        this.state.folderItems.forEach(objectElement => { 
            if (objectElement.entry === this.state.newEntryItems.entry){
                exists = true;
            } 
        });

        if (exists === false) {
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
        }};

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
                         score: newEntryItems.folderItemContents.score.toString()

                    }
                    });
          }

          document.getElementById("entry1").value = this.state.newEntryItems.entry;
          document.getElementById("def1").value = this.state.newEntryItems.def1;
          document.getElementById("key1").value = this.state.newEntryItems.key1;
        });
    }
    

    renderFolderItems(){
    
    const folderItems = this.state.folderItems.map((folderItem) =>
    <li key={folderItem.id}>
        <table className="manageTable">
            <thead>
            <tr>
            <th className="entryItem" onClick={(e) => this.select(folderItem.entry)}>{folderItem.entry}</th>
            <th className="score">{folderItem.score}</th>
            </tr>
            </thead>
        </table>
    </li>);

    return folderItems;

    }


    render(){
        return(
            <div id="manageDiv">
                <form id="newEntryform">
                <input onChange={(e) => this.newEntryEntry(e)} id="entry1" type="text" placeholder="New Entry"></input>
                <textarea onChange={(e) => this.newEntryDefinition(e)} id="def1" type="text" placeholder="Definitions/Anwsers"></textarea>
                <textarea onChange={(e) => this.newEntryKeyword(e)} id="key1" type="text" placeholder="Keywords"></textarea>
                <button onClick={this.saveNewEntry.bind(this)} id="saveButton" type="button">Save Entry</button>
                </form>
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