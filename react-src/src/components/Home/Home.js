import _ from 'lodash'
import React, { Component } from 'react';
import { Dropdown, Menu, Grid, Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';

import Header from '../Header/Header'
import Login from '../Login/Login'
import TablePost from '../TablePost/TablePost';
import FormPost from '../FormPost/FormPost';

import logo from '../../logo.svg';
import './Home.css';

class Home extends Component {

  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);
    this.buttonColor = "blue";

    this.state = {
      posts: [],
      twogramstopwords: [],
      online: 0,
      menuFixed: false,
      overlayFixed: false
    }

    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchTwogramstopwords = this.fetchTwogramstopwords.bind(this);
    this.readNewPost = this.readNewPost.bind(this);
    this.handlePostAdded = this.handlePostAdded.bind(this);
    this.handlePostUpdated = this.handlePostUpdated.bind(this);
    this.handlePostDeleted = this.handlePostDeleted.bind(this);
    this.handleLogout = this.handleLogout.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
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
    console.log(text);
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

  handleLogout(event) {
		event.preventDefault()
		console.log('logging out')
		axios.post('/auth/logout').then(response => {
			console.log(response.data)
			if (response.status === 200) {
				this.setState({
					loggedIn: false,
					user: null
				})
			}
		})
	}

	handleLogin(username, password) {
		axios
			.post('/auth/login', {
				username,
				password
			})
			.then(response => {
				console.log(response)
				if (response.status === 200) {
					// update the state
					this.setState({
						loggedIn: true,
						user: response.data.user
					})
				}
			})
      .catch((err) => {
        console.log(err);
      });
    }



  render() {
    let online = this.state.online;
    if(!this.props.user){
      return (
        <div>
          <Header user={this.state.user} />
          <Login handleLogin={this.handleLogin}/>
        </div>
      );
    } else {
      return (
        <div>
          <Header user={this.state.user} />
          <Container>
            <Grid stackable columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <FormPost
                    buttonSubmitTitle='Gram'
                    buttonColor='red'
                    postID={this.props.postID}
                    onPostAdded={this.handlePostAdded}
                    onPostUpdated={this.props.onPostUpdated}
                    server={this.server}
                    socket={this.socket}
                  />
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
}

export default Home;
