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
            folderItems: []
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
    componentDidUpdate(){
            Absorb.getFolderItemsByFolderName(this.props.loadedFolder).then(folderItems => {
                if (folderItems.length){
                this.setState({
                    folderItems: folderItems,
                    savedFolderItems: JSON.parse(JSON.stringify(folderItems))
                });
              }
            });
          }

    renderFolderItems(){

    const folderItems = this.state.folderItems.map((folderItem) =>
    <li key={folderItem.id}>
        <table className="manageTable">
            <thead>
            <tr>
            <th className="entry">{folderItem.entry}</th>
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
                <input id="entry1" type="text" placeholder="New Entry"></input>
                <textarea id="def1" type="text" placeholder="Definitions/Anwsers"></textarea>
                <textarea id="key1" type="text" placeholder="Keywords"></textarea>
                <button id="saveButton" type="submit">Save Entry</button>
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