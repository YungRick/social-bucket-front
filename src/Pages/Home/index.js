import React, {Component} from 'react';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles } from '@material-ui/core';
import { styles } from "../../static/styles";
import {API_ROOT} from "../../api";
import { getFromStorage } from "../../utils/storage";


class App extends Component {
  constructor(){
    super()
    this.state = {
    }
  }


  componentDidMount() {
    const userId = getFromStorage('user_id');
    /*if (userId) {
      fetch(`${API_ROOT}/api/account/tasks?id=${userId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            console.log(json);
          } else {
            console.log('error')
          }
        });
    } else {
      //this.setLoading(false);
    }*/
  }

  addTask = () => {
    const userId = getFromStorage('user_id');
    const data = {task: {name: 'testtask', title: 'test title'}}
    fetch(`${API_ROOT}/api/account/add-task?id=${userId}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        data,
      }),
    })

  }


  render(){
    const { classes } = this.props;
    console.log('render account component home')
    return (
      <div className="App">
        <Typography component="h1" variant="h2">
          Achiever
        </Typography>
        <div classname="tasks">
          <Typography component="h1" variant="h4">
            Your tasks
          </Typography>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
          </Grid>
          <Button onClick={this.addTask}>Add Goal</Button>
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.props.logout}
        >
            Kirjaudu ulos
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(App);
