import React from 'react';
import ReactDOM from 'react-dom';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import NameSearch from './NameSearch';
import QRCode from './QRCode';

import math from 'mathjs';
import $ from 'jquery';


const styles = {

  item: {
    display: 'flex',
    flexDirection: 'column',
    padding: '22px 10px 10px 50px',
  },

  card: {
    paddingTop: '40px',
    boxShadow: 'none',
  },

  icon: {
    top: '12px',
    margin: '0',
    width: '29px',
    height: '29px',
    verticalAlign:'middle',
    backgroundColor: 'transparent'
  },
};

const getDepositIcon = ( name ) => (
  <Avatar
    style = { styles.icon }
    src = { require("../images/deposit.svg") }
    size = { 26 }
  />
)

const getTotalPot = ( name ) => (
  <Avatar
    style = { styles.icon }
    src = { require("../images/total_pot.svg") }
    size = { 26 }
  />
)

const getTotalPerPerson = ( name ) => (
  <Avatar
    style = { styles.icon }
    src = { require("../images/total_per_person.svg") }
    size = { 26 }
  />
)

const getPersons = ( name ) => (
  <Avatar
    style = { styles.icon }
    src = { require("../images/persons.svg") }
    size = { 26 }
  />
)

class ParticipantsInfo extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {
      accounts:[],
      address: null,
      participants:[],
      attendees:[],
      detail:{},
      etherscan_url:null,
      isDetails: false
    };
  }

  componentDidMount() {

    this.props.eventEmitter.on('accounts_received', accounts => {
      this.setState({
        address:accounts[0],
        accounts:accounts
      })
    });

    this.props.eventEmitter.on('detail', detail => {
      this.setState({ detail: detail });
      console.log(this.state.detail)
    });

    this.props.eventEmitter.on('network', network => {
      this.setState({
        etherscan_url: network.etherscan_url
      });
    });

    this.props.eventEmitter.on('attendees', attendees => {
      // Resets after clicking 'attend' button.
      if(attendees.length != this.state.attendees.length){
        this.setState({
          attendees:[]
        })
      }
    });
  }

  isAdmin() {
    return
      this.state.detail.admins.includes(this.state.address) || (this.state.detail.owner == this.state.address);
  }

  isUser( participant ) {
    return
      this.state.accounts.includes( participant.address );
  }

  render() {
    return (
      <Card style={ styles.card }>
          <Typography
            variant="display1"
            align="center"
            className="mb-3"
          >
            Participants
          </Typography>

          {/*<NameSearch  eventEmitter={this.props.eventEmitter} />
          <QRCode  eventEmitter={this.props.eventEmitter} />*/}

          <List>
            <ListItem 
            leftIcon = { getDepositIcon() }
            disabled = { true }
            style = { styles.item }
            primaryText = {
              <span>DEPOSIT </span>
            }

            secondaryText = {
              <span
                style = {{ color: '#5F5F5F'}}> ETH 0.02</span>
            }
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getTotalPot() }
            disabled = { true }
            primaryText = {
              <span>TOTAL POT</span>
            }

            secondaryText = {
              <span
                style = {{ color: '#5F5F5F' }}>0.046153846153846164</span>
            }
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getTotalPerPerson() }
            disabled = {true}
            primaryText = {
              <span>TOTAL PAYOUT PER PERSON </span>
            }

            secondaryText = {
              <span
                style = {{ color: '#5F5F5F' }}>ETH 0.0023</span>
            }
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getPersons() }
            disabled = {true}
            primaryText = {
              <span>MAXIMUM AMOUNT OF REGISTRATIONs</span>
            }
            secondaryText = {
              <span style = {{ color: '#5F5F5F' }}>45</span>
            }
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getPersons() }
            disabled = {true}
            primaryText = {
              <span>AMOUNT OF ATTENDEES</span>
            }
            secondaryText = {
              <span style = {{ color: '#5F5F5F' }}>36</span>
            }
          />

          </List>
      </Card>
    );
  }
}
export default ParticipantsInfo;
