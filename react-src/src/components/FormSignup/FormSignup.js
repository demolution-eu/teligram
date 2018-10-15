import React, { Component } from 'react';
import { Message, Button, Form } from 'semantic-ui-react';

class FormSignup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
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

    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.props.handleSubmit}>
        <Form.Input
          label='Name'
          type='text'
          placeholder='Moritz Drittie'
          name='name'
          maxLength='40'
          required
          value={this.state.name}
          onChange={this.handleInputChange}
        />
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
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FormSignup;
