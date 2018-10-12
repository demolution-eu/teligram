import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

class TablePost extends Component {

  render() {

    let posts = this.props.posts;
    posts = posts.map((post) =>
      <Table.Row key={post._id}>
        <Table.Cell>{post.text}</Table.Cell>
        <Table.Cell>
          <ModalConfirmDelete
            headerTitle='Delete Post'
            buttonTriggerTitle='Delete'
            buttonColor='black'
            post={post}
            onPostDeleted={this.props.onPostDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new post appear on top of the list
    posts =  [...posts].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Text</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {posts}
        </Table.Body>
      </Table>
    );
  }
}

export default TablePost;
