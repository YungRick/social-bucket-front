import React, { Component } from 'react';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
import { API_ROOT } from '../../api';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
    };
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
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  handleSignInEmailChange = (e) => {
    this.setState({
      signInEmail: e.target.value,
    })
  }

  handleSignInPasswordChange = (e) => {
    this.setState({
      signInPassword: e.target.value,
    })
  }

  onSignIn = () => {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    // Post request to backend
    fetch(`${API_ROOT}/api/account/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: false,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout = () => {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch(`${API_ROOT}/api/account/logout?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }



  render(){
    const {
      isLoading,
      token,
      signInError,
    } = this.state;
    console.log(signInError)
    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }
    if(!token){
      return(
        <div>
          {signInError && (
            <span>Virheellinen käyttäjätunnus tai salasana</span>
          )}
          <div>Kirjaudu</div>
          <span>Email</span>
          <input name={'emailSignIn'} value={this.state.signInEmail} onChange={this.handleSignInEmailChange}/>
          <span>Salasana</span>
          <input name={'passwordSignIn'} value={this.state.signInPassword} onChange={this.handleSignInPasswordChange}/>
          <button onClick={this.onSignIn}>Sign In</button>
        </div>
      )
    }
    return (
      <Account logOut={this.logout()}> </Account>
    );
  }
};
