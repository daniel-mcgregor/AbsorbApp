import React from 'react';
import './test.css';
import FolderNav from '../components/folderNav';
import { Link } from 'react-router-dom';


import Absorb from '../util/absorb';

class Test extends React.Component {

    constructor(props) {
        super(props);

      }

    render(){
        return(
            <div id="testDiv">
                <form id="newEntryform">
                <input id="entryTest" type="text" placeholder="Press the RIGHT arrow key to fetch a random entry."></input>
                <textarea  id="defTest" type="text" placeholder="Press the LEFT arrow key to fetch a random definition."></textarea>
                <button  id="nextButton" type="button">Random Entry</button>
                <button  id="prevButton" type="button">Random Definition</button>
                </form>
            </div>
        )
    }
}

export default Test;