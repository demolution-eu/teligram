import React, { Component } from 'react';
import { Card, Icon } from 'semantic-ui-react';

import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

class TablePost extends Component {

  render() {

    let posts = this.props.posts;
    posts = posts.map((post) =>
      <Card fluid key={post._id}>
        <Card.Content>
          <Card.Header>{post._id}</Card.Header>
          <Card.Meta>
            <span className='date'>Joined in 2015</span>
          </Card.Meta>
          <Card.Description>{post.text}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='user' />
            22 Friends
          </a>
        </Card.Content>
      </Card>
    );

    // Make every new post appear on top of the list
    posts =  [...posts].reverse();

    return (
      <Card.Group>
        {posts}
      </Card.Group>
    );
  }
}

export default TablePost;
