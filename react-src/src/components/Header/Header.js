import React, { Component } from 'react';
import { Dropdown, Menu, Container } from 'semantic-ui-react';

class Header extends Component {

  constructor() {
    super();

    this.state = {
      posts: [],
      twogramstopwords: [],
      online: 0,
      menuFixed: false,
      overlayFixed: false
    }
  }

  render() {
    return (
      <div>
        <Menu fixed='top'>
          <Container>
            <Menu.Item as='a' header>
              Teligram<span style={{color: 'rgb(225, 0, 0)'}}>.</span>
            </Menu.Item>
            <Menu.Item as='a'>Home</Menu.Item>

            <Dropdown item simple text='Account'>
              <Dropdown.Menu>
                <Dropdown.Item>Log in</Dropdown.Item>
                <Dropdown.Item>Sign up</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Menu>

        <div className='App-header'>
          <h1 className='App-intro'>Teligram<span style={{color: 'rgb(225, 0, 0)'}}>.</span></h1>
        </div>
      </div>
    );
  }
}

export default Header;
