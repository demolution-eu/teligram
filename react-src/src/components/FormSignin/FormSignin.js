import React, { Component } from 'react';
import { Message, Button, Form } from 'semantic-ui-react';

class FormSignin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
    this.props.user[name] = value;
  }

  render() {

    const formClassName = this.props.formClassName;
    const formSuccessMessage = this.props.formSuccessMessage;
    const formErrorMessage = this.props.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.props.handleLogin}>
        <Form.Input
          label='Email'
          type='email'
          placeholder='teligram@uni-hildesheim.de'
          name='email'
          maxLength='40'
          required
          value={this.state.email}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label='Passwort'
          name='password'
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          required
          value={this.state.password}
          type='password'
          onChange={this.handleInputChange}
        />
        <Message
          success
          color='green'
          header='Nice one!'
          content={formSuccessMessage}
        />
        <Message
          warning
          color='yellow'
          header='Woah!'
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FormSignin;
