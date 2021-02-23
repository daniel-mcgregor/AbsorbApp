import React from 'react';
import './login.css';
import Manage from './manage';
import Test from './test';
import FolderNav from '../components/folderNav';
import Absorb from '../util/absorb';
import pencil from '../images/pencil.png';
import pencil1 from '../images/pencil1.png';
import { Link, HashRouter as Router, Route, BrowserRouter } from 'react-router-dom';
import e from 'cors';


class Login extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {

          user: {
            username: "",
            email: "",
            password: ""
          },

          registerVis: "none",
          loginVis: "flex",
          success: "none",
          loggedIn: "no"
        };

        this.switch = this.switch.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);

      }
    
      componentDidMount() {
        Absorb.return().then((response) => {
          Absorb.login(response[0]).then(user => {
            if (user != ""){
              console.log("Login Success");
              console.log(JSON.parse(JSON.stringify(user)));
              this.setState({loggedIn: "yes"});
            }
          });
        });
      }

      componentDidUpdate(prevState) {

      }

      setUsername(event) {
        const user = JSON.parse(JSON.stringify(this.state.user));
        user.username = event.target.value;
        this.setState({user: user});
      }

      setPassword(event) {
        const user = JSON.parse(JSON.stringify(this.state.user));
        user.password = event.target.value;
        this.setState({user: user});
      }

      setEmail(event) {
        const user = JSON.parse(JSON.stringify(this.state.user));
        user.email = event.target.value;
        this.setState({user: user});
      }

      
      switch() {
        if (this.state.registerVis === "none") {
          this.setState({registerVis: "flex"});
          this.setState({loginVis: "none"});
        } else {
          this.setState({registerVis: "none"});
          this.setState({loginVis: "flex"});
        }
      }

      register() {
        Absorb.register(this.state.user).then(user => {
          if (user){
            this.setState({success: "block"});
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        });
      }

      login() {
        Absorb.login(this.state.user).then(user => {
          if (user != ""){
            console.log("Login Success");
            console.log(JSON.parse(JSON.stringify(user)));
            this.setState({loggedIn: "yes"});
          }
        });
      }

    
    render(){
        return(
          <BrowserRouter basename="/" >
            <div className="authenticate" style={{'display': this.state.loggedIn === "yes" ? 'none' : 'flex'}}>
              <div id="loginBox">
                <div id="loginDiv" style={{display: this.state.loginVis}}>
                  <h3>Absorb</h3>
                  <h4>Login</h4>
                  <input id="username" type="text" onChange={(e) => this.setUsername(e)} placeholder="Username"></input>
                  <input id="password" type="password" onChange={(e) => this.setPassword(e)} placeholder="Password"></input>
                  <div id="buttons">
                    <input style={{width: "30%", marginTop: "35px"}} id="submit" onClick={this.login} type="submit" value="Login"></input>
                    <input style={{width: "30%", marginTop: "35px"}} id="switch" onClick={this.switch} type="button" value="Register"></input>
                  </div>
                </div>
                <div id="registerDiv" style={{display: this.state.registerVis}}>
                  <h3>Absorb</h3>
                  <h4>Register</h4>
                  <input id="username" type="text" onChange={(e) => this.setUsername(e)} placeholder="Username"></input>
                  <input id="email" type="email" onChange={(e) => this.setEmail(e)} placeholder="Email"></input>
                  <input id="password" type="password" onChange={(e) => this.setPassword(e)} placeholder="Password"></input>
                  <p style={{display: this.state.success}}>Account created successfully!</p>
                  <div id="buttons">
                    <input style={{width: "30%", marginTop: "35px"}} id="submit" type="submit" onClick={this.register} value="Register"></input>
                    <input style={{width: "30%", marginTop: "35px"}} id="switch" onClick={this.switch} type="submit" value="Login"></input>
                  </div>
                </div>
              </div>
            </div>
            <Route path="/" render={props => <FolderNav loggedIn={this.state.loggedIn}/> } />
          </BrowserRouter>
        )
    }
}

export default Login;