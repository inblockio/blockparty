import React from 'react';

import Divider from 'material-ui/Divider';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';


const styles = {

  banner: {
    marginTop: '0',
    padding: '20px'
  },


  title: {
    fontSize: '18px',
    marginBottom: '20px',
    marginTop: '0',
    textAlign: 'center',
    fontWeight: '400'
  },

  btn: {
    display: 'block',
    height: '42px',
    width: '165px',
    padding: '0 10px',
    color: '#fff',
    borderRadius: '7px',
    backgroundColor: '#32A1E4',
    textTransform: 'uppercase',
    lineHeight: '42px',
    margin: '15px auto',
    textAlign: 'center',
    textDecoration: 'none'
  }
};


class TopBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWithdhraw: false
    }
  }

  render() {
    return (
      <div style={ styles.banner }>
        <Typography variant="title" style={ styles.title }>
        { this.state.isWithdhraw ? 'The Event has ended and payouts will continue until the 04.09.2018' : 'Register and get a chance to win ETH if someone misses the event!' }</Typography>
        { this.state.isWithdhraw ? 
            <div>
              <a href="#withdraw" style={ styles.btn }>Withdraw now</a>
              <span style={{ fontSize: '12px', textAlign: 'center', color: '#5F5F5F', display: 'block' }}>7 days, 5 hours and 23 minutes left</span>
            </div> :
           <a href="#registration" style={ styles.btn }>Register now</a>
        }
      </div>
    );
  }
}

export default TopBanner;
