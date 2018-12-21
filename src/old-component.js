import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      src: '',
      value: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.inputFileChanged = this.inputFileChanged.bind(this);
  }
  handleClick() {
    let input = this.refs.input_reader;
    input.click();
  }
  inputFileChanged(e) {
    if (window.FileReader) {
      let arrayFile = e.target.files;
      for (let i = 0; i < arrayFile.length; i++) {
        let file = arrayFile[i],
          reader = new FileReader(),
          self = this;
        reader.onload = function(r) {
          self.setState({
            src: self.state.src + r.target.result
          });
        };
        reader.readAsText(file);
        self.setState({ value: reader });
      }
    } else {
      alert('Sorry, our app does not support your browser');
    }
  }
  render() {
    const { accept, capture, multiple } = this.props,
      { src } = this.state;
    return (
      <div>
        <div>{src}</div>
        <button onClick={this.handleClick}>Upload</button>
        <div>Please choose your text files (you can choose multiple files)</div>
        <input
          type="file"
          ref="input_reader"
          accept={Array.isArray(accept) ? accept.join(',') : accept}
          multiple={true}
          capture={capture}
          style={{ display: 'none' }}
          onChange={this.inputFileChanged}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
