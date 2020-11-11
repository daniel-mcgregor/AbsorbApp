import React from 'react';
import './folderNav.css';


class FolderNav extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            folders: []
        }

        this.renderFolderList = this.renderFolderList.bind(this);
    }

    renderFolderList(){
        const numbers = [ "FOLDERS", "Folder1", 2, 3, 4, 5];
        const listItems = numbers.map((number) =>
            <li>{number}</li>);
        return listItems;
    }

    render(){
        return(
            <div className="folderNav">
                <ul>{this.renderFolderList()}</ul>    
            </div>
        )
    }
}

export default FolderNav;