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

        Absorb.getAllFolderItems().then(folderItems => {

            if (folderItems.length){
            this.setState({
                folderItems: folderItems,
                savedFolderItems: JSON.parse(JSON.stringify(folderItems))
            });
          }
        });
      }

    renderFolderItems(){
        const folderItems = this.state.folderItems.map((folderItem, folderItemIndex) => {
        <article className="row" key={folderItemIndex}>
            <div className="item"><p>{folderItem.entry}</p></div>
            <div className="item"><p>{folderItem.score}</p></div>
        </article>
         })

        return (
            <div className="folderItemsContainer">
                <div className="rowHeader">
                    <div className="item">Entry</div>
                    <div className="item">Score</div>
                </div>
                {folderItems}
            </div>
        );
    }


    render(){
        return(
            <div id="entriesTableDiv">
                {this.renderFolderItems()}
            </div>
        )
    }
}

export default Manage;