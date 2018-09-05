import React from 'react';
import ReactDOM from 'react-dom';

import Typography from '@material-ui/core/Typography';
import NetworkLabel from './NetworkLabel';
import AppBar from 'material-ui/AppBar';

import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';

import "../stylesheets/app.css";

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
	},

	heading: {
		maxWidth: '450px',
		margin: 'auto auto 10px 0',
		color: '#fff',
	}
}

class Header extends React.Component {

	render() {
    return (
      <header className="header"> 
        <AppBar
          iconElementLeft = {
          	<span></span>
          }
          iconElementRight={
            <span className="flex align-center">
    					<span
    						style={ styles.headerRight }
    						className="flex align-center mr-1"
    					>
    						<span style={ styles.bull }></span>
    						<span>Ethereum Main Net</span>
    					</span>
              <FlatButton style={ styles.btn } children={ <span>About</span> }/>
            </span>
          }
        />
       <Typography
       		variant="display2"
       		style={ styles.heading }
       	>
          RChain Cooperative
          Developer Conference
        </Typography>
      </header>
		)
	}
}

export default Header;