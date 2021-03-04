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
import * as  yup from 'yup';


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
          loggedIn: false,
          regMessage: "Account created successfully!"
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
          console.log(response);
          if (response.loggedIn === true) {
            console.log("Welcome back!");
            this.setState({loggedIn: true});
        }
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
        const userSchema = yup.object().shape({
          username: yup.string().required().typeError("Invalid"),
          email: yup.string().email().required().typeError("Invalid"),
          password: yup.string().min(8).max(16).matches('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$').required().typeError("Invalid")
        });

        const user = {
          username: this.state.user.username,
          email: this.state.user.email,
          password: this.state.user.password
        }

        userSchema.validate(user).then(() => {
          console.log("Registration validated");
          Absorb.checkEmail(this.state.user.email).then(data => {
            if (data.users.length === 0) {
              console.log(data.users.length);
              console.log("registering...");
              Absorb.register(this.state.user).then(user => {
                if (user){
                  this.setState({regMessage: "Account created successfully!"});
                  this.setState({success: "block"});
                  // setTimeout(() => {
                  //   window.location.reload();
                  // }, 3000);
                }
              });
            } else {
              this.setState({regMessage: "That email is already in use"});
              this.setState({success: "block"});
              return false;
            }
          });
        })
        .catch(error => {
          console.log(error.errors); // array of validation error messages
          this.setState({regMessage: "Invalid registration. Please try again."});
          this.setState({success: "block"});
          return false;
        });
      }


      login() {
        Absorb.login(this.state.user).then(data => {
          if (data["auth"] === true){
            console.log("Login Success! Token: ");
            console.log(JSON.parse(JSON.stringify(data["token"])));
            localStorage.setItem("token", data["token"]);
            this.setState({loggedIn: true});
          }
        });
      }

    
    render(){
        return(
          <BrowserRouter basename="/" >
            <div className="authenticate" style={{'display': this.state.loggedIn === true ? 'none' : 'flex'}}>
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
                  <p style={{display: this.state.success}}>{this.state.regMessage}</p>
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