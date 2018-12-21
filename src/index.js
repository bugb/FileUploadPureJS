import React from 'react';
import ReactDOM from 'react-dom';

import xlsx from 'xlsx';

import './styles.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      src: '',
      value: '',
      numberOfSheet: 0,
      sheetsName: [],
      obj: {},
      data: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.inputFileChanged = this.inputFileChanged.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  downloadFile(text, name, type){
    const file = new Blob(['chaugiang'], {type: 'txt'});
    const href = URL.createObjectURL(file);
    const download = 'test';
    console.info("objectURL: ", href);
  }

  handleClick() {
    let input = this.refs.input_reader;
    input.click();
  }
  inputFileChanged(e) {
    if (window.FileReader) {
      let arrayFile = e.target.files;
      let file = arrayFile[0];
      let reader = new FileReader();
      let self = this;

      reader.onload = function(r) {
        let dataFromFile;
        let binary = '';
        var bytes = new Uint8Array(r.target.result);
        var length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        dataFromFile = xlsx.read(binary, {type: 'binary', cellDates:true, cellStyles:true});
        dataFromFile['Sheets']['Format Abbr.']['!ref'] = 'A1:D4'
        const numberOfSheetFromFile = dataFromFile.SheetNames.length;
        const sheetsName = dataFromFile.SheetNames;
        const data = dataFromFile['Sheets']['Format Abbr.'];
        self.setState({ numberOfSheet: numberOfSheetFromFile });
        self.setState({ sheetsName: sheetsName });
        self.setState({ data: 'example' });
        [...Array(22).keys()].forEach(v => {
          if (v<11) return;
          const key = 'B' + v;
          dataFromFile['Sheets']['Format Abbr.'][key]['v'] = v;
          dataFromFile['Sheets']['Format Abbr.'][key]['c'] = [];
          // dataFromFile['Sheets']['Format Abbr.'][key]['c'].push({a:"SheetJS", t:"I'm a little comment, short and stout!"});
          dataFromFile['Sheets']['Format Abbr.']['D4'] = {};
          dataFromFile['Sheets']['Format Abbr.']['D4']['v'] = 'nguyen';

        })
        console.log(dataFromFile['Sheets']['Format Abbr.']);
        // console.log(dataFromFile);
        self.setState({
          src: 'success',
        });
        // console.log(dataFromFile);
        xlsx.writeFile(dataFromFile, 'test.xlsx');// this for download
      };
      // reader.readAsText(file);
      reader.readAsArrayBuffer(file);
      self.setState({ value: reader });
    } else {
      alert('Sorry, our app does not support your browser');
    }
  }
  render() {
    const { accept, capture, multiple } = this.props,
      { src } = this.state;
    const {
      numberOfSheet,
      sheetsName
     } = this.state;
    const listItems = sheetsName.map((name) =>
      <li key={name}>
        {name}
      </li>
    );
    this.url = URL.createObjectURL(new Blob([JSON.stringify(this.state.data, null, 2)], { type: 'json' }));
    const name = 1;
    return (
      <div>
        <div>{src}</div>
        <div>{listItems}</div>
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
        <button onClick={this.downloadFile}>Download</button>
        <a href={this.url} download={name}>xxx</a>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
