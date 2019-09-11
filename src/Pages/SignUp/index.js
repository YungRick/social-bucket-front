import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API_ROOT } from "../../api";

export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      signUpEmail: '',
      signUpPassword: '',
      signUpError: false,
      redirectToLogin: false,
    }
  }

  componentDidMount() {
  }


  onSignUp = () => {
    // Grab state
    const {
      signUpEmail,
      signUpPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    // Post request to backend
    fetch(`${API_ROOT}/api/account/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: false,
            signUpFinished: true,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
          });
        } else {
          this.setState({
            signUpError: true,
            signUpFinished: true,
            isLoading: false,
          });
        }
      });
  };


  handleEmailChange = (e) => {
    this.setState({
      signUpEmail: e.target.value,
    })
  };

  handlePasswordChange = (e) => {
    this.setState({
      signUpPassword: e.target.value,
    })
  }


  render(){
    return(
      <div>
        <span>Rekisteröi uusi käyttäjä</span>
        <div>
          <span>Email</span>
          <input name={'email'} value={this.state.signUpEmail} onChange={this.handleEmailChange}/>
          <span>Salasana</span>
          <input name={'password'} value={this.state.signUpPassword} onChange={this.handlePasswordChange}/>
          <button onClick={this.onSignUp}>Rekisteröidy</button>
        </div>
        {this.state.signUpError && (
          <span>Tapahtui virhe. Yritä myöhemmin uudestaan.</span>
        )}
        {this.state.signUpFinished && !this.state.signUpError && (
          <div>
            <span>Käyttäjän luominen onnistui</span>
            <Link to={'/signIn'}><span>Kirjaudu sisään</span></Link>
          </div>
        )}
      </div>
    )
  }
};
