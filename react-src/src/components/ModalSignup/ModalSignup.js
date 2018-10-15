import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import FormSignup from '../FormSignup/FormSignup';

class ModalSignup extends Component {

  render() {
    return(
      <Modal
        trigger={<Button color={this.props.buttonColor}>{this.props.buttonTriggerTitle}</Button>}
        dimmer='inverted'
        size='tiny'
        closeIcon='close'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <FormSignup
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            userID={this.props.userID}
            onSubmit={this.props.onSubmit}
            onUserAdded={this.props.onUserAdded}
            handleSubmit={this.props.handleSubmit}
            user={this.props.user}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalSignup;
