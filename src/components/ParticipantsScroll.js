import React from 'react';
import ReactDOM from 'react-dom';

import Card from '@material-ui/core/Card';
import Avatar from 'material-ui/Avatar';

import participantStatus from '../util/participantStatus';

import math from 'mathjs';
import $ from 'jquery';

const getTwitterIcon = (name) =>(
  <Avatar style={{verticalAlign:'middle'}} src={`https://avatars.io/twitter/${name}`} size={ 43 } className="mr-2"/>
)

const styles = {
  card: {
    padding: '20px 0',
    marginRight: '24px',
    boxShadow: 'none',
    overflow: 'auto',
  },
};

class ParticipantsScroll extends React.Component {

  constructor( props ) {
    super( props );

    this.state = {
      accounts:[],
      keyword: null,
      address: null,
      participants:[],
      detail:{},
      isDetails: false
    };
  }

  componentDidMount() {
    // Initialize
    this.props.getParticipants( participants => {
      this.setState({ participants });
    });

    this.props.eventEmitter.on( 'change', _ => {
      console.log('CHANGE', _);
      this.props.getParticipants(participants =>{
        this.setState({ participants });
      });
    });

    this.props.eventEmitter.on('participants_updated', participants => {
      this.setState({ participants })
    });

    this.props.eventEmitter.on('accounts_received', accounts => {
      this.setState({
        address:accounts[0],
        accounts:accounts
      })
    });

    this.props.eventEmitter.on('detail', detail => {
      this.setState({ detail:detail });
    });

  }

  isUser( participant ) {
    return this.state.accounts.includes( participant.address );
  }

  displayParticipants() {

    if ( !this.state.detail.name ) 
      return(
      <div width={ 100 }>
        <p>
          <h5>No info available.</h5>
          The reason are more likely to be one of the followings.
          <ul>
            <li>
              You are not connected to the correct Ethereum network with correct options.
            </li>
            <li>
              Your local node is out of sync (may take a few hours if this is your first time using Ethereum).
            </li>
          </ul>
          Please follow the instructions at 'About' page to solve.
        </p>
      </div>
    )

    if( this.state.participants.length > 0 ) {
      var state = this.state;

      return this.state.participants.map( (participant, id) => {
        return (
          <a href={ `https://twitter.com/${participant.name.replace("@", "")}` } target="_blank">
          <Avatar
            style={{verticalAlign:'middle'}}
            src={`https://avatars.io/twitter/${participant.name.replace("@", "")}`}
            size={ 43 }
            className="mr-2"
          />
          </a>
        )
      })
    } else {
      return(<div style={{textAlign:'center'}} width={ 100 } >No one has registered yet. Be the first to register by typing your twitter handle and press 'Register'</div>)
    }
  }

  render() {
    return (
      <div className="flex align-center slider">
        { this.displayParticipants() }
      </div>
    );
  }
}
export default ParticipantsScroll;
