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

  toEther(value){
    if(value){
      // return math.round(this.props.web3.fromWei(value, "ether").toNumber(), 3).toString();
      return this.props.web3.fromWei(value, "ether").toString();
    }
  }

  toNumber(value){
    if(value) return value.toNumber();
  }

  getDepositContent( detail ) {
    if(detail.deposit){
      return (
        <span style = {{ color: '#5F5F5F'}}> ETH { this.toEther( detail.deposit ) }</span>
      )
    }else{
      return (
        <span style={ { color: '#5F5F5F'} }>No info available</span>
      )
    }
  }

  getPotContent( detail ) {
    if(detail.totalBalance){
      return (
        <span style = {{ color: '#5F5F5F'}}> ETH { this.toEther( detail.totalBalance ) }</span>
      )
    }else{
      return (
        <span style={ { color: '#5F5F5F'} }>No info available</span>
      )
    }
  }

  getPayoutPerPersonContent(detail) {
    if (detail.ended) {
      let payoutPerPerson = this.toEther(detail.deposit / this.state.attended);
      return (
        <span style = {{ color: '#5F5F5F'}}> ETH { payoutPerPerson }</span>
      )
    } else {
      return (
        <span style={ { color: '#5F5F5F'} }>No info available until event is finished</span>
      )
    }
  }

  getMaxAttendeesContent(detail) {
    if (detail.limitOfParticipants) {
      return (
        <span style = {{ color: '#5F5F5F'}}> { this.toNumber( detail.limitOfParticipants ) }</span>
      )
    } else {
      return (
        <span style={ { color: '#5F5F5F'} }>No info available</span>
      )
    }
  }

  getAmountOfAttendessTitle(detail) {
    if (detail.ended) {
      return (<span>AMOUNT OF ATTENDEES</span>)
    } else {
      return (<span>CURRENT AMOUNT OF REGISTRATIONs </span>)
    }
  }

  getAmountOfAttendessContent(detail) {
    let text = "No info available"
    if (detail.attended && detail.ended) {
      text = this.toNumber( detail.attended )
    } else if (!detail.ended && detail.registered) {
      text = this.toNumber( detail.registered )
    }

    return (
      <span style={ { color: '#5F5F5F'} }>{ text }</span>
    )
  }

  render() {

    let payoutPerPerson;

    return (
      <Card style={ styles.card }>
          <Typography
            variant="display1"
            align="center"
            className="mb-3"
          >
            Participation
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
            secondaryText = {this.getDepositContent(this.state.detail)}
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getTotalPot() }
            disabled = { true }
            primaryText = {
              <span>TOTAL POT</span>
            }

            secondaryText = { this.getPotContent(this.state.detail) }
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getTotalPerPerson() }
            disabled = {true}
            primaryText = {
              <span>TOTAL PAYOUT PER PERSON </span>
            }

            secondaryText = { this.getPayoutPerPersonContent(this.state.detail) }
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getPersons() }
            disabled = {true}
            primaryText = {
              <span>MAXIMUM AMOUNT OF REGISTRATIONs</span>
            }
            secondaryText = { this.getMaxAttendeesContent(this.state.detail) }
          />

          <ListItem
            style = { styles.item }
            leftIcon = { getPersons() }
            disabled = {true}
            primaryText = { this.getAmountOfAttendessTitle(this.state.detail) }
            secondaryText = { this.getAmountOfAttendessContent(this.state.detail) }
          />

          </List>
      </Card>
    );
  }
}
export default ParticipantsInfo;
