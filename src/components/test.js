import React from 'react';
import './test.css';
import FolderNav from '../components/folderNav';
import { Link } from 'react-router-dom';


import Absorb from '../util/absorb';

class Test extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            folder: null,
            folderItems: [],
            folderOpen: "open",
            quiz: null,
            answered: []
        };

        this.setupQuiz = this.setupQuiz.bind(this);

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

        this.fetchFolderItems();

       this.setupQuiz();

    }

    componentDidUpdate(prevProps, prevState) {



        if (this.props.folderOpen === this.state.folderOpen){

            this.fetchFolderItems();
            this.setupQuiz();

        // the following if..else is used to prevent an infinite loop where the request for folder-items would continue indefintely.

            if (this.state.folderOpen === "open") {
                this.setState({folderOpen: "closed"});
            } else {
                this.setState({folderOpen: "open"});
            }
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

        setupQuiz(){
            const quiz = {
                entries: [],
                defs: [],
                keys: [],
            }

            this.state.folderItems.forEach(item => {
                quiz.entries.push(item.entry);
                quiz.defs.push(item.def1);
                if (quiz.keys != ""){
                    let newKeys = item.key1.split("> ");
                    let cleanKeys = [];
                    newKeys.forEach(key => {
                    cleanKeys.push(key.replace('<span class="keyword" contenteditable="false">', "").replace('</span', ""));
                    });
                    let lastKeys = cleanKeys.splice(cleanKeys.length - 1, 1);
                    let newLastKeys = lastKeys[0].split(">&nbsp;")
                    newLastKeys.forEach(key => {
                        cleanKeys.push(key);
                    })
                    quiz.keys.push(cleanKeys);
                }
            });

            this.setState({quiz: quiz});
        
        }

        newQuiz(){
            
            if (this.state.answered.length != this.state.quiz.entries.length){
                let randInt = this.randomIntFromInterval(0, this.state.quiz.entries.length - 1);
                document.getElementById("entryTest").value = this.state.quiz.entries[randInt];
                this.setState({ answered: [...this.state.answered, randInt] });
            } else {
                alert("Test complete");
            }

        }

        randomIntFromInterval(min, max) { // min and max included 

            let int = Math.floor(Math.random() * (max - min + 1) + min);

            if (this.state.answered.length != this.state.quiz.entries.length){
                while (this.state.answered.includes(int)){
                    int = Math.floor(Math.random() * (max - min + 1) + min);
                }
            }

            return int; 
          }


    render(){
        return(
            <div id="testDiv">
                <form id="newEntryform">
                <input id="entryTest" type="text" placeholder="Press the RIGHT arrow key to fetch a random entry."></input>
                <textarea  id="defTest" type="text" placeholder="Press the LEFT arrow key to fetch a random definition."></textarea>
                <button  id="nextButton" type="button" onClick={this.newQuiz.bind(this)}>Random Entry</button>
                <button  id="prevButton" type="button">Random Definition</button>
                </form>
            </div>
        )
    }
}

export default Test;