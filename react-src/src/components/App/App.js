import React, { Component } from 'react';
import { Grid, Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';

import Header from '../Header/Header'
import Login from '../Login/Login'
import TablePost from '../TablePost/TablePost';
import FormPost from '../FormPost/FormPost';

import './App.css';

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
      menuFixed: false,
      overlayFixed: false,
      user: []
    }

    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchTwogramstopwords = this.fetchTwogramstopwords.bind(this);
    this.readNewPost = this.readNewPost.bind(this);
    this.handlePostAdded = this.handlePostAdded.bind(this);
    this.handlePostUpdated = this.handlePostUpdated.bind(this);
    this.handlePostDeleted = this.handlePostDeleted.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleLogout = this.handleLogout.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    this.readNewPost(post);
    posts.push(post);
    this.setState({ posts: posts });
  }

  handleUserAdded(user) {
    console.log('App.js: handleUserAdded');
    // user.push(user);
    this.setState({ user: user });
    console.log(this.state);
  }

  readNewPost(post) {
    console.log(post);
    let sentence = post.text+'. Sagt '+post.username;
    var msg = new SpeechSynthesisUtterance(sentence);
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

  handleSubmit(e) {
    console.log('handlesubmit');
    // Prevent browser refresh
    e.preventDefault();
    const user = {
      name: this.state.user.name,
      email: this.state.user.email,
      password: this.state.user.password
    }
    // Acknowledge that if the user id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = 'post';
    const params = '';

    console.log(user);

    axios({
      method: method,
      responseType: 'json',
      url: `${this.server}/api/users/${params}`,
      data: user
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg,
        loggedIn: true,
				user: response.data.user
      });
      if (!this.props.userID) {
        this.setState({
          user: response.data.user
        });
        console.log(this.state);
        this.props.onUserAdded(response.data.user);
      }
      else {
        this.props.onUserUpdated(response.data.user);
        this.props.socket.emit('update', response.data.user);
      }

    })
    .catch((err) => {
      if (err.response) {
        if (err.response.data) {
          this.setState({
            formClassName: 'warning',
            formErrorMessage: err.response.data.msg
          });
        }
      }
      else {
        this.setState({
          formClassName: 'warning',
          formErrorMessage: 'Something went wrong. ' + err
        });
      }
    });
  }

  handleLogin(e) {
    console.log('handlelogin');
    // Prevent browser refresh
    e.preventDefault();
    const user = {
      name: this.state.user.name,
      email: this.state.user.email,
      password: this.state.user.password
    }
    // this.state.user.email = "";
    // Acknowledge that if the user id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = 'post';
    const params = this.state.user.email;
    delete this.state.user.email;
    delete this.state.user.name;
    delete this.state.user.password;
    axios({
      method: method,
      responseType: 'json',
      url: `${this.server}/api/users/${params}`,
      data: user
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg,
        loggedIn: true,
				user: response.data.user
      });
      if (!this.props.userID) {
        this.setState({
          user: response.data.user
        });
        this.props.onUserAdded(response.data.user);
      }
      else {
        this.props.onUserUpdated(response.data.user);
        this.props.socket.emit('update', response.data.user);
      }

    })
    .catch((err) => {
      if (err.response) {
        if (err.response.data) {
          console.log(err.response.data);
          this.setState({
            formClassName: 'warning',
            formErrorMessage: err.response.data.msg
          });
        }
      }
      else {
        this.setState({
          formClassName: 'warning',
          formErrorMessage: 'Something went wrong. ' + err
        });
      }
    });
  }


  render() {
    if(!this.state.user.email){
      return (
        <div>
          <div className='App'>
            <Header user={this.state.user} />
            <Login
              server={this.server}
              handleSubmit={this.handleSubmit}
              socket={this.socket}
              user={this.state.user}
              handleLogin={this.handleLogin}/>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className='App'>
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
                      user={this.state.user}
                    />
                  </Grid.Column>
                  <Grid.Column>
                      <TablePost
                        onPostUpdated={this.handlePostUpdated}
                        onPostDeleted={this.handlePostDeleted}
                        posts={this.state.posts}
                        server={this.server}
                        socket={this.socket}
                        user={this.state.user}
                      />
                  </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </div>
          <br/>
        </div>
      );
    }
  }
}

export default App;
