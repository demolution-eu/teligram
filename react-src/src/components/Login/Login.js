import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react'

import ModalSignin from '../ModalSignin/ModalSignin';
import ModalSignup from '../ModalSignup/ModalSignup';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
			username: '',
			password: '',
			redirectTo: null,
      open: false
		}

    this.handleUserAdded = this.handleUserAdded.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	handleSubmit(event) {
    console.log('login handlesubmit');
  }

  handleUserAdded(user) {
    console.log('Login.js: handleUserAdded');
    // user.push(user);
    this.setState({ user: user });
    console.log(this);
  }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return(
      <Container>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <ModalSignin
              headerTitle='Einloggen'
              buttonTriggerTitle='Einloggen'
              buttonSubmitTitle='Einloggen'
              buttonColor='grey'
              handleSubmit={this.props.handleSubmit}
              handleLogin={this.props.handleLogin}
              onSubmit={this.handleSubmit}
              onUserAdded={this.handleUserAdded}
              server={this.props.server}
              socket={this.props.socket}
              user={this.props.user}
            />
            <ModalSignup
              headerTitle='Registrieren'
              buttonTriggerTitle='Registrieren'
              buttonSubmitTitle='Registrieren'
              buttonColor='red'
              handleSubmit={this.props.handleSubmit}
              onSubmit={this.handleSubmit}
              onUserAdded={this.handleUserAdded}
              server={this.props.server}
              socket={this.props.socket}
              user={this.props.user}
            />
          </Grid.Column>
        </Grid>
      </Container>
      );
  }
}

export default Login;
