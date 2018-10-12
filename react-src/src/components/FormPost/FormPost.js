twogramimport React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';
import horsey from 'horsey';

import './FormPost.css';

const genderOptions = [
  { key: 'm', text: 'Male', value: 'm' },
  { key: 'f', text: 'Female', value: 'f' },
  { key: 'o', text: 'Do Not Disclose', value: 'o' }
]

class FormPost extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: '',
      twogramstopwords: []
    }
    this.horst = this.horst.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log(this);
    this.horst(this);
  }

  componentWillMount() {
    // Fill in the form with the appropriate data if post id is provided
    if (this.props.postID) {
      axios.get(`${this.props.server}/api/posts/${this.props.postID}`)
      .then((response) => {
        this.setState({
          text: response.data.text
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  horst(self) {
    horsey(document.querySelector('#ed'), {
      source: function (data, done) {
        if(data.input.length >= 2) {
          if (data.input !== null &&
            data.input !== 'null') {
            // reduce to last word
            var regexLastWord = /\s(\w+)$/;
            data.input = data.input.match(regexLastWord);
            if (data.input !== null &&
              data.input !== 'null' &&
              data.input[1] !== null &&
              data.input[1] !== 'null') {
              axios.get(`${self.props.server}/api/twogramstopwords/${data.input[1]}`)
              .then((response) => {
                for (var twogram in response.data){
                  if (typeof(response.data[twogram].word) == "number") {
                      response.data.splice(twogram, 1);
                  }
                  response.data[twogram].value = " " + response.data[twogram].word;
                }
                done(null,
                  [{ list: response.data }]
                );
              })
              .catch((err) => {
                console.log(err);
              });
            }
          }
        }
      },
      anchor: "\\s(\\w+)",
      getText: 'word',
      getValue: 'value',
      limit: 15
    });
  }

  handleTextAreaChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const post = {
      text: this.state.post
    }

    // Acknowledge that if the post id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.postID ? 'put' : 'post';
    const params = this.props.postID ? this.props.postID : '';

    axios({
      method: method,
      responseType: 'json',
      url: `${this.props.server}/api/posts/${params}`,
      data: post
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg
      });

      if (!this.props.postID) {
        this.setState({
          text: ''
        });
        this.props.onPostAdded(response.data.result);
        this.props.socket.emit('add', response.data.result);
      }
      else {
        this.props.onPostUpdated(response.data.result);
        this.props.socket.emit('update', response.data.result);
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

  render() {

    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.TextArea
          id='ed'
          label='Post'
          type='text'
          placeholder='Tell us more about you...'
          name='post'
          maxLength='140'
          required
          value={this.state.post}
          onChange={this.handleTextAreaChange}
          ref={ref => this.ed = ref}
        />
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FormPost;
