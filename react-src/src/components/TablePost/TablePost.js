import React, { Component } from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';

class TablePost extends Component {

  readNewPost(post) {
    console.log(post);
    let sentence = post.text+'. Sagt '+post.username;
    var msg = new SpeechSynthesisUtterance(sentence);
    msg.lang = 'de-DE'
    msg.rate = 0.7;
    msg.pitch = Math.random();
    window.speechSynthesis.speak(msg);
  }

  render() {

    let posts = this.props.posts;
    console.log(posts);
    let readPost = this;
    posts = posts.map((post) =>
      <Card fluid key={post._id}>
        <Card.Content>
          <Card.Header>{post.username}</Card.Header>
          <Card.Description>{post.text}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button color={this.props.buttonColor} onClick={() => this.readNewPost(post)}>
            <Icon name='assistive listening systems' />
            Vorlesen
          </Button>
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
