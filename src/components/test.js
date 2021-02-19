import React from 'react';
import './test.css';

import Absorb from '../util/absorb';

class Test extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            folder: null,
            folderItems: [],
            folderOpen: "open",
            quiz: null,
            answered: [],
            correctDefColor: "3px solid rgba(157, 228, 140, 0)",
            correctEntColor: "3px solid rgba(157, 228, 140, 0)",
            answerColor: "3px solid rgba(157, 228, 140, 0)",
            status: "",
            statusColor: "white",
            correct: 0,
            incorrect: 0,
            testScore: 0,
            newEntryItems: {
                score: null
            },
            showWindow: "none",
            checkOpacity: 0.6, 
            checkCursor: "none",
            compareOpacity: 0.6,
            compareCursor: "none",
            checked: "no"

        }

        this.setupQuiz = this.setupQuiz.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.newQuizDef = this.newQuizDef.bind(this);
        this.newQuizEntry = this.newQuizEntry.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.randomIntFromInterval = this.randomIntFromInterval.bind(this);
        this.retrieve = this.retrieve.bind(this);
        this.setupQuiz = this.setupQuiz.bind(this);
        this.fetchFolderItems = this.fetchFolderItems.bind(this);

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

    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.category !== prevProps.category) {
            this.fetchFolderItems();
        }



        if (this.props.folderOpen === this.state.folderOpen){

            this.fetchFolderItems();
            this.setState({checkOpacity: 1});
            this.setState({checkCursor: "all"});
            this.setupQuiz();

        // the following if..else is used to prevent an infinite loop where the request for folder-items would continue indefintely.

            if (this.state.folderOpen === "open") {
                this.setState({folderOpen: "closed"});
            } else {
                this.setState({folderOpen: "open"});
            }

                }

        if (this.props.loadedFolder !== prevProps.loadedFolder) {
            this.closeWindow();
            this.fetchFolderItems();
            this.setState({checkOpacity: 1});
            this.setState({checkCursor: "all"});
            this.setupQuiz();

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
                    },
                    this.setupQuiz
                    );
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
                },
                this.setupQuiz
                );
            });
            
        }

        handleKeyDown(event) {

            if (window.location.pathname === "/test"){

            if(event.keyCode === 13) {
                if (this.state.showWindow === "block") {
                    event.preventDefault();
                    this.closeWindow();
                } else {
                event.preventDefault();
                if (this.state.checked !== "yes") {
                this.checkAnswer();
                }

                this.setState({checked: "yes"});
                }
            }

            if (event.keyCode === 39){
                event.preventDefault();
                this.newQuizEntry();
            }

            if (event.keyCode === 37){
                event.preventDefault();
                this.newQuizDef();
            }
        }
    }

        handleClick(event) {
            
            if (event.target.innerText === 'Random Entry') {
                this.newQuizEntry();
            }

            if (event.target.innerText === 'Random Definition') {
                this.newQuizDef();
            }

            if (event.target.innerText === 'Check Answer') {
                this.checkAnswer();
            }
        }


        handleClick(event) {
            
            if (event.target.innerText === 'Random Entry') {
                this.newQuizEntry();
            }

            if (event.target.innerText === 'Random Definition') {
                this.newQuizDef();
            }

            if (event.target.innerText === 'Check Answer') {
                this.checkAnswer();
            }
        }


        checkAnswer(){

            if (this.state.folderItems.length && this.state.answered.length){
                let correct = 0;

                if (this.state.computerInput === "entry"){


                     
                        this.state.quiz.keys[this.state.answered[this.state.answered.length - 1]].forEach(key => {
                            if (document.getElementById("defTest").value.toLowerCase().includes(key.toLowerCase())) {
                                if (key !== ""){
                                correct += 1;
                                }
                            }
                        })

                        // TODO: fix key trigger setting function. Currently ignores value. 

                        if (correct === this.state.quiz.keys[this.state.answered[this.state.answered.length - 1]].length && correct !== 0) {
                            this.setState({correctDefColor: "3px solid rgb(0, 204, 0)"});
                            this.setState({status: "Correct!"});
                            this.plus();
                            this.increaseScore();
                            this.setState({statusColor: "rgb(0, 204, 0)"});
                            this.setState(prevState => {
                                return {correct: prevState.correct + 1}
                            });
                        } else if (correct >= this.props.keySet && this.props.keySet !== -1){
                           
                            this.setState({correctDefColor: "3px solid rgb(0, 204, 0)"});
                            this.setState({status: "Correct!"});
                            this.plus();
                            this.increaseScore();
                            this.setState({statusColor: "rgb(0, 204, 0)"});
                            this.setState(prevState => {
                                return {correct: prevState.correct + 1}
                            });
                        } else if (document.getElementById("defTest").value.toLowerCase() === this.state.quiz.defs[this.state.answered[this.state.answered.length - 1]].toLowerCase() ) {
                            this.setState({correctDefColor: "3px solid rgb(0, 204, 0)"});
                            this.setState({status: "Correct!"});
                         
                            this.plus();
                            this.increaseScore();
                            this.setState({statusColor: "rgb(0, 204, 0)"});
                            this.setState(prevState => {
                                return {correct: prevState.correct + 1}
                            });
                        } else {
                            this.setState({correctDefColor: "3px solid red"});
                            this.setState({status: "Incorrect"});
                
                            this.setState({statusColor: "red"});
                            this.minus();
                            this.increaseScore();
                            this.setState(prevState => {
                                return {incorrect: prevState.incorrect + 1}
                            });
                        }


                    this.setState({answerColor: "3px solid rgb(0, 204, 0)"});
                    document.getElementById("answerBox").value = this.state.quiz.defs[this.state.answered[this.state.answered.length - 1]];

                } else {

                        if (document.getElementById("entryTest").value.toLowerCase() === this.state.quiz.entries[this.state.answered[this.state.answered.length - 1]].toLowerCase()){
                            this.setState({correctEntColor: "3px solid rgb(0, 204, 0)"});
                            this.setState({status: "Correct"});
                            this.plus();
                            this.increaseScore();
                            this.setState({statusColor: "rgb(0, 204, 0)"});
                            this.setState(prevState => {
                                return {correct: prevState.correct + 1}
                            });
                        } else {
                            this.setState({correctEntColor: "3px solid red"});
                            this.setState({status: "Incorrect"});
                            this.setState({statusColor: "red"});
                            this.minus();
                            this.increaseScore();
                            this.setState(prevState => {
                                return {incorrect: prevState.incorrect + 1}
                            });
                        }


                    this.setState({answerColor: "3px solid rgb(0, 204, 0)"});
                    document.getElementById("answerBox").value = this.state.quiz.entries[this.state.answered[this.state.answered.length - 1]];
                }

                this.getTestScore();
                this.checkEnd();
            }
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
                let newArray = [];
                if (item.key1) {
                item.key1.split(",").forEach(key => {
                    newArray.push(key.trim());
                });
            }
                quiz.keys.push(newArray);
            });

            this.setState({quiz: quiz});
        
        }

        newQuizEntry(){

            if ((document.getElementById('entryTest').value === "" && document.getElementById('defTest').value === "") || (document.getElementById('answerBox').value !== "")){
            
                if (this.state.answered.length != this.state.quiz.entries.length){
                    let randInt = this.randomIntFromInterval(0, this.state.quiz.entries.length - 1);
                    document.getElementById("entryTest").value = this.state.quiz.entries[randInt];
                    document.getElementById("defTest").value = "";
                    document.getElementById("answerBox").value = "";
                    this.setState({status: ""});
                    this.setState({ answered: [...this.state.answered, randInt] });

                    // delay needed to set the answered state.

                    setTimeout(() => {
                        this.setState({computerInput: "entry"});
                        this.setState({correctDefColor: "3px solid rgba(157, 228, 140, 0)"});
                        this.setState({correctEntColor: "3px solid rgba(157, 228, 140, 0)"});
                        this.setState({answerColor: "3px solid rgba(157, 228, 140, 0)"});
                        this.setState({statusColor: "white"});
                        document.getElementById("defTest").focus();
                        this.retrieve(this.state.quiz.entries[this.state.answered[this.state.answered.length - 1]]);
                        this.setState({compareOpacity: 1});
                        this.setState({compareCursor: "all"});
                        this.setState({checked: "no"});
                    }, 100);
                } 

            } else {
                document.getElementById("defTest").focus();
            }
        }


        newQuizDef(){
            if ((document.getElementById('entryTest').value === "" && document.getElementById('defTest').value === "") || (document.getElementById('answerBox').value !== "")){
                if (this.state.answered.length != this.state.quiz.entries.length){
                    let randInt = this.randomIntFromInterval(0, this.state.quiz.entries.length - 1);
                    document.getElementById("defTest").value = this.state.quiz.defs[randInt];
                    document.getElementById("entryTest").value = "";
                    document.getElementById("answerBox").value = "";
                    this.setState({status: ""});
                    this.setState({ answered: [...this.state.answered, randInt] });

                    // delay needed to set the answered state.

                    setTimeout(() => {
                        this.setState({computerInput: "def"});
                        this.setState({correctDefColor: "3px solid rgba(157, 228, 140, 0)"});
                        this.setState({correctEntColor: "3px solid rgba(157, 228, 140, 0)"});
                        this.setState({answerColor: "3px solid rgba(157, 228, 140, 0)"});
                        this.setState({statusColor: "white"});
                        document.getElementById("entryTest").focus();
                        this.retrieve(this.state.quiz.entries[this.state.answered[this.state.answered.length - 1]]);
                        this.setState({compareOpacity: 1});
                        this.setState({compareCursor: "all"});
                        this.setState({checked: "no"});
                    }, 100);
                } 
            } else {
                document.getElementById("entryTest").focus();
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

          increaseScore(){
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

        plus() {
            const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
            newEntryItems.score = (parseInt(newEntryItems.score) + 1).toString();
            this.setState({newEntryItems: newEntryItems});
            }

        minus(){
            const newEntryItems = JSON.parse(JSON.stringify(this.state.newEntryItems));
            newEntryItems.score = (parseInt(newEntryItems.score) - 1).toString();
            if (parseInt(newEntryItems.score) < 0){
                newEntryItems.score = "0";
            }
            this.setState({newEntryItems: newEntryItems});
            }
        

        retrieve(selected) {

            this.setState({selected: selected});
    
            Absorb.getFolderItemsContent(this.props.loadedFolder, selected).then(folderItemContents => {
                if (folderItemContents){
                    const newEntryItems = JSON.parse(JSON.stringify(folderItemContents));                    
                    this.setState({newEntryItems:
                         {
                             
                             entry: newEntryItems.folderItemContents[0].entry,
                             def1: newEntryItems.folderItemContents[0].def1,
                             key1: newEntryItems.folderItemContents[0].key1,
                             folder: newEntryItems.folderItemContents[0].folder,
                             score: newEntryItems.folderItemContents[0].score.toString(),
                             id: newEntryItems.folderItemContents[0].id.toString()
    
                        }
                        });
              }
            });
        }

        getTestScore(){
                const score = (this.state.correct / (this.state.correct + this.state.incorrect)) * 100;
                this.setState({testScore: score});
        }

        checkEnd(){
            if (this.state.incorrect + this.state.correct === this.state.quiz.entries.length) {
                this.setState({showWindow: "block"});
            }
        }

        closeWindow(){
            this.setState({showWindow: "none"});
            document.getElementById("defTest").value = "";
            document.getElementById("entryTest").value = "";
            document.getElementById("answerBox").value = "";
            this.setState({status: ""});
            this.setState({ answered: [] });
            this.setState({computerInput: ""});
            this.setState({correctDefColor: "3px solid rgba(157, 228, 140, 0)"});
            this.setState({correctEntColor: "3px solid rgba(157, 228, 140, 0)"});
            this.setState({answerColor: "3px solid rgba(157, 228, 140, 0)"});
            this.setState({statusColor: "white"});
            this.setState({correct: 0});
            this.setState({incorrect: 0});
            this.setState({testScore: 0});
            this.setState({newEntryItems: {score: ""}});
            this.setState({compareOpacity: 0.6});
            this.setState({compareCursor: "none"});
            
        }        


    render(){
        return(
            <div id="testDiv">
                <div id="status" style={{borderColor: this.state.statusColor}}><h3 style={{color: this.state.statusColor}}>{this.state.status}</h3></div>
                <form id="newEntryform">
                <input id="entryTest" style={{border: this.state.correctEntColor}} type="text" placeholder="Press the RIGHT arrow key to fetch a random entry. Press ENTER to check your answer."></input>
                <textarea  id="defTest" style={{border: this.state.correctDefColor}}type="text" placeholder="Press the LEFT arrow key to fetch a random definition. Press ENTER to check your answer."></textarea>
                <textarea  id="answerBox" style={{border: this.state.answerColor}} type="text" placeholder="Answers will display here."></textarea>
                <button  id="nextButton" style ={{opacity: this.state.checkOpacity, pointerEvents: this.state.checkCursor}} type="button" onClick={this.handleClick}>Random Entry</button>
                <button  id="prevButton" style ={{opacity: this.state.checkOpacity, pointerEvents: this.state.checkCursor}} type="button" onClick={this.handleClick}>Random Definition</button>
                <button  id="checkButton" style ={{opacity: this.state.compareOpacity, pointerEvents: this.state.compareCursor}}type="button" onClick={this.handleClick}>Check Answer</button>
                <div id="entScore"><p>Entry Score: {this.state.newEntryItems.score}</p></div>
                <div id="testScore"><p>Test Score: <span style={{color: this.state.testScore >= 75 ? "rgb(0, 204, 0)" : "red" }}>{Math.ceil(this.state.testScore)}%</span></p></div>
                </form>
                <div className="verify" style={{display: this.state.showWindow}}>
                  <h3 className="complete">Test Complete</h3>
                  <h3 className="endScore">Score: <span style={{color: this.state.testScore >= 75 ? "rgb(0, 204, 0)" : "red" }}>{Math.ceil(this.state.testScore)}%</span></h3>
                  <button onClick={this.closeWindow.bind(this)} className="answer">OK</button>
                </div>
                {document.onkeydown = this.handleKeyDown}
            </div>
        )
    }
}

export default Test;