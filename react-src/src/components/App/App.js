import React, { Component } from 'react';
import { Dropdown, Menu, Sticky, Grid, Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';

import TablePost from '../TablePost/TablePost';
import FormPost from '../FormPost/FormPost';

import logo from '../../logo.svg';
import './App.css';

// import '../../pixi.js';
// import '../../noiseShader.js';
// import '../../Noise.js';

class App extends Component {

  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);
    this.buttonColor = "blue";

    this.state = {
      posts: [],
      twogramstopwords: [],
      online: 0,
    }

    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchTwogramstopwords = this.fetchTwogramstopwords.bind(this);
    this.readNewPost = this.readNewPost.bind(this);
    this.handlePostAdded = this.handlePostAdded.bind(this);
    this.handlePostUpdated = this.handlePostUpdated.bind(this);
    this.handlePostDeleted = this.handlePostDeleted.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this.fetchPosts();
    this.fetchTwogramstopwords();
    this.socket.on('visitor enters', data => this.setState({ online: data }));
    this.socket.on('visitor exits', data => this.setState({ online: data }));
    this.socket.on('add', data => this.handlePostAdded(data));
    this.socket.on('update', data => this.handlePostUpdated(data));
    this.socket.on('delete', data => this.handlePostDeleted(data));
  }

  // Fetch data from the back-end
  fetchPosts() {
    axios.get(`${this.server}/api/posts/`)
    .then((response) => {
      this.setState({ posts: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // Fetch data from the back-end
  fetchTwogramstopwords() {
    axios.get(`${this.server}/api/twogramstopwords/`)
    .then((response) => {
      this.setState({ twogramstopwords: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handlePostAdded(post) {
    let posts = this.state.posts.slice();
    console.log("newest post: ");
    console.log(post);
    this.readNewPost(post.text);
    posts.push(post);
    this.setState({ posts: posts });
  }

  readNewPost(text) {
    var msg = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    msg.lang = 'de-DE'
    msg.rate = 0.7;
    msg.pitch = Math.random();
    window.speechSynthesis.speak(msg);
  }

  handlePostUpdated(post) {
    let posts = this.state.posts.slice();
    for (let i = 0, n = posts.length; i < n; i++) {
      if (posts[i]._id === post._id) {
        posts[i].name = post.name;
        posts[i].email = post.email;
        posts[i].age = post.age;
        posts[i].gender = post.gender;
        break; // Stop this loop, we found it!
      }
    }
    this.setState({ posts: posts });
  }

  handlePostDeleted(post) {
    let posts = this.state.posts.slice();
    posts = posts.filter(u => { return u._id !== post._id; });
    this.setState({ posts: posts });
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    const { contextRef } = this.state
    let online = this.state.online;
    let verb = (online <= 1) ? 'is' : 'are'; // linking verb, if you'd prefer
    let noun = (online <= 1) ? 'person' : 'people';
    return (
      <div ref={this.handleContextRef}>
        <div className='App'>
        <Menu fixed='top' stackable>
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
        <Container>
          <Grid stackable columns={2} divided>
            <Grid.Row>
              <Grid.Column>
                <Sticky context={contextRef}>
                  <FormPost
                    buttonSubmitTitle='Gram'
                    buttonColor='red'
                    postID={this.props.postID}
                    onPostAdded={this.handlePostAdded}
                    onPostUpdated={this.props.onPostUpdated}
                    server={this.server}
                    socket={this.socket}
                  />
                </Sticky>
              </Grid.Column>

              <Grid.Column>
                <TablePost
                  onPostUpdated={this.handlePostUpdated}
                  onPostDeleted={this.handlePostDeleted}
                  posts={this.state.posts}
                  server={this.server}
                  socket={this.socket}
                />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        <br/>
      </div>
    );
  }
}

export default App;
