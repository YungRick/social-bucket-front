import React, {Component} from 'react';
import logo from './logo.svg';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import {
  setInStorage,
  getFromStorage,
} from './utils/storage';
import {API_ROOT} from "./api";
import { Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';


class App extends Component {
  constructor(){
    super()
    this.state = {
      token: '',
      authenticated: false,
      loading: false,
    }
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    console.log('obj: ', obj)
    if (obj && obj.token) {
      const { token } = obj;
      fetch(`${API_ROOT}/api/account/verify?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setAuthenticated(token, true);
            this.setLoading(false);
          } else {
            this.setLoading(false);
          }
        });
    } else {
      this.setLoading(false);
    }
  }



    setAuthenticated = (token, authenticated) => {
    console.log('setAuthenticated: ', authenticated)
    this.setState({
      token,
      authenticated,
    })
  };

  setLoading = (loading) => {
    this.setState({
      loading,
    })
  };



  logout = () => {
    this.setLoading(true);
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const {token} = obj;
      // Verify token
      fetch(`${API_ROOT}/api/account/logout?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setAuthenticated('', false);
            this.setLoading(false);
          } else {
            this.setLoading(false);
          }
        });
    } else {
      this.setLoading(false);
    }
  }

  render(){
    console.log('authentication status: ', this.state.authenticated)
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route
              exact path={'/'}
              render={(props) => <SignIn {...this.state} {...props} setAuthenticated={this.setAuthenticated} setLoading={this.setLoading}/>}
            />
            <Route path={'/signUp'}  component={SignUp}/>
            {this.state.authenticated && (
              <Route path={'/account'} render={(props) => <Home logout={this.logout}/>}
              />
            )}
            {!this.state.authenticated && (
              <Redirect to={'/'}/>
            )}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
