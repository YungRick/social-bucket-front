import React, { Component } from 'react';
import {
  setInStorage,
} from '../../utils/storage';
import { API_ROOT } from '../../api';
import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles } from '@material-ui/core';
import { styles } from "../../static/styles";

/*
const styles = theme => ({
  root: {
    marginTop: theme.spacing(3),
    width: '100%'
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
})*/

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
    };
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
    const {
      signInEmail,
      signInPassword,
    } = this.state;
    this.props.setLoading(false);
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
          setInStorage('user_id', json.user_id);
          this.setState({
            signInError: false,
            signInPassword: '',
            signInEmail: '',
          });
          this.props.setAuthenticated(json.token, true)
          this.props.setLoading(false);
        } else {
          this.setState({
            signInError: json.message,
          });
          this.props.setLoading(false);
        }
      });
  };

  render(){
    console.log(this.props)
    const {classes} = this.props;
    const {
      signInError,
    } = this.state;
    if (this.props.loading) {
      return (<div><p>Loading...</p></div>);
    }
    if(!this.props.token){
      return(
        <div>
          <Container component="main" maxWidth="xs">
            {signInError && (
              <span>Virheellinen käyttäjätunnus tai salasana</span>
            )}
            <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon back />
            </Avatar>
            <Typography component={'h1'} variant={'h5'}>Sign In</Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={this.state.signInEmail}
                  onChange={this.handleSignInEmailChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={this.state.signInPassword}
                  onChange={this.handleSignInPasswordChange}
                />
              </form>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.onSignIn}
            >
              Sign In
            </Button>
            </div>
          </Container>
        </div>
      )
    }
    return (
      <Redirect to={'/account'}></Redirect>
    );
  }
};

export default withStyles(styles)(SignIn);
