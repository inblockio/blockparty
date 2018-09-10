import React from 'react';

import Divider from 'material-ui/Divider';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';


const styles = {

  footer: {
    marginTop: '50px'
  },

  holder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  title: {
    fontSize: '18px',
    marginBottom: '20px',
    marginTop: '30px',
    textAlign: 'center',
    fontWeight: '400'
  },

  img: {
    display: 'block',
    maxWidth: '150px',
    margin: '0 15px'
  }
};


class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer style={ styles.footer }>
        <Divider />
        <Typography variant="title" style={ styles.title }>Sponsored by</Typography>
        <div style={ styles.holder }>
        <a href="http://future.inblock.io/">
          <img src={require("../images/inblockio-Logo-birdstyle-full-on-white-768x199.png")} style={ styles.img } />
        </a>
        <a href="https://www.rchain.coop/">
          <img src={require("../images/RChain_Logo.png")} style={ styles.img } />
        </a>
        </div>
      </footer>
    );
  }
}

export default Footer;
