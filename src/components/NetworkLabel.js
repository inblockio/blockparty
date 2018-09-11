import React from 'react';
import FlatButton from 'material-ui/FlatButton';


const styles = {

  bull: {
    display: 'block',
    marginRight: '5px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#1FD91B',
  },

  headerRight: {
    color: '#fff',
    fontSize: '10px',
  },

  btn: {
    minWidth: '30px',
    height: '16px',
    lineHeight: '15px',
    padding: '0 7px',
    border: '1px solid #32A1E4',
    borderRadius: '5px',
    fontSize: '10px',
    color: '#fff',
    marginLeft: '10px'
  },

  heading: {
    maxWidth: '450px',
    margin: 'auto auto 10px 0',
    color: '#fff',
  }
}

export default class Instruction extends React.Component {

  constructor(props) {
    super(props);
    if(props.read_only) {
      this.state = {
        color: 'transparent',
        text: 'READONLY'
      };
    }else{
      this.state = {
        color: null,
        text: null
      };
    }

    if(!props.read_only) {
      this.props.eventEmitter.on('network', obj => {
        var color ='transparent';

        if (obj.name == 'MAINNET') color = 'transparent';
        this.setState({
          color: color,
          text: obj.name
        });
      })
    }
  }

  render(){
    return (
      <FlatButton
        style={{backgroundColor:this.state.color, disabled:true, color:'white', fontSize: '10px'}}
        children={ <span className="flex align-center mr-1"><span style={ styles.bull }></span><span>{ this.state.text } </span> </span> }
      />
    );
  }
}
