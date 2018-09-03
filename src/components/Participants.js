import React from 'react';
import ReactDOM from 'react-dom';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import Paper from '@material-ui/core//Paper';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import FlatButton from 'material-ui/FlatButton';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import math from 'mathjs';
import participantStatus from '../util/participantStatus';
import NameSearch from './NameSearch';
import QRCode from './QRCode';

import PeopleIcon from 'material-ui/svg-icons/social/people';

import $ from 'jquery';

const getTwitterIcon = (name) =>(
  <Avatar style={{verticalAlign:'middle'}} src={`https://avatars.io/twitter/${name}`} size={26} />
)

const getEtherIcon = () =>(
  <Avatar src={require('../images/ethereum.ico')} size={ 26 } backgroundColor="white" />
)

const getDepositIcon = (name) =>(
  <Avatar style={{verticalAlign:'middle', backgroundColor: 'transparent'}} src={require("../images/deposit.svg")} size={26} />
)

const getTotalPot = (name) =>(
  <Avatar style={{verticalAlign:'middle', backgroundColor: 'transparent'}} src={require("../images/total_pot.svg")} size={26} />
)

const getTotalPerPerson = (name) =>(
  <Avatar style={{verticalAlign:'middle', backgroundColor: 'transparent'}} src={require("../images/total_per_person.svg")} size={26} />
)

const getPersons = (name) =>(
  <Avatar style={{verticalAlign:'middle', backgroundColor: 'transparent'}} src={require("../images/persons.svg")} size={26} />
)


const styles = {
  paperRight:{
    flex: 3,
    textAlign: 'center',
  },

  item: {
    display: 'flex',
    flexDirection: 'column',
    padding: '22px 10px 10px 50px',
  },

  card: {
    paddingTop: '40px',
    boxShadow: 'none',
  },

  btn: {
    borderRadius: '10px',
    backgroundColor: 'transparent',
    textTransform: 'uppercase'
  },

  row: {
    border: 'none'
  }
};

class Participants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts:[],
      keyword: null,
      address: null,
      participants:[],
      attendees:[],
      detail:{},
      etherscan_url:null,
      isDetails: false
    };
  }

  componentDidMount() {
    // Initialize
    this.props.getParticipants(participants =>{
      this.setState({participants});
    });

    this.props.eventEmitter.on('search', keyword => {
      this.setState({ keyword: keyword });
    });

    this.props.eventEmitter.on('change', _ => {
      console.log('CHANGE', _);
      this.props.getParticipants(participants =>{
        this.setState({participants});
      });
    });

    this.props.eventEmitter.on('accounts_received', accounts => {
      this.setState({
        address:accounts[0],
        accounts:accounts
      })
    });

    this.props.eventEmitter.on('detail', detail => {
      this.setState({detail:detail});
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

    // If the app failed to get detail from contract (meaning either connecting
    // to wrong network or the contract id does not match to the one deployed),
    // it will show instruction page.
    setTimeout(function(){
      if(typeof(this.state.name) == 'undefined'){
        this.props.eventEmitter.emit('instruction');
      }
    }.bind(this), 5000)

    this.serverRequest = $.get('https://coinmarketcap-nexuist.rhcloud.com/api/eth', function (result) {
      this.setState({
        rate: math.round((result.price.gbp / 20), 2).toString()
      });
    }.bind(this));
  }

  isAdmin(){
    return this.state.detail.admins.includes(this.state.address) || (this.state.detail.owner == this.state.address);
  }

  isUser(participant){
    return this.state.accounts.includes(participant.address);
  }

  toEther(value) {
    if(value){
      // return math.round(this.props.web3.fromWei(value, "ether").toNumber(), 3).toString();
      return this.props.web3.fromWei(value, "ether").toString();
    }
  }

  toNumber(value){
    if(value) return value.toNumber();
  }

  handleSearchField(event) {
    this.setState({
      keyword: event.target.value
    });  
  }

  handleAttendees(participantAddress, event, isInputChecked) {
    if (isInputChecked) {
      this.state.attendees.push(participantAddress)
    }else{
      this.state.attendees = this.state.attendees.filter(function(a){
        return a != participantAddress;
      })
    }
    this.props.eventEmitter.emit('attendees', this.state.attendees);
    return true;
  }

  yesNo(participant) {
    if(participant.attended) {
      return ( <Avatar src={require('../images/сheck.svg')} size={ 26 } backgroundColor="white" /> );
    }else{
      if(this.isAdmin() && !this.state.detail.ended){
        return (
          <Checkbox
            onCheck={this.handleAttendees.bind(this, participant.address)}
          />
        )
      }else{
        return ( <Avatar src={require('../images/cross.svg')} size={ 26 } backgroundColor="white" /> );
      }
    }
  }

  displayBalance(participant) {
    var message = participantStatus(participant, this.state.detail);
    console.log('status', message);
    let color, amount;
    switch(message) {
    case 'Won':
    case 'Withdrawn':
      color = 'green';
      amount = web3.fromWei(this.state.detail.payoutAmount.toNumber());
      break;
    case 'Cancelled':
      color = 'red';
      amount = 0;
      break;
    case 'Lost':
      color = 'red';
      amount = 0;
      break;
    default :
      color = 'black';
      amount = 0;
    }
    if (amount != 0) {
      var amountToDisplay = math.round(amount, 3).toString()
    }

    return(
      <span style={{color:color}}>
        { amountToDisplay } {message}
      </span>
    )
  }

  showDetails() {
    console.log('show')
  }

  displayParticipants() {
    if(!this.state.detail.name) return(
      <TableRowColumn width={100} >
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
      </TableRowColumn>
    )

    if(this.state.participants.length > 0) {
      var state = this.state;
      return this.state.participants.map((participant) => {
        if(state.keyword && state.keyword.length >=3){
          let keyword = state.keyword.toLowerCase();
          participant.matched = !!(participant.name.match(keyword)) || !!(participant.address.match(keyword))
        }else{
          participant.matched = true
        }
        let isAdmin = state.detail.admins.filter((admin)=>{ return admin == participant.address }).length > 0;
        if ( isAdmin || state.detail.owner == participant.address ){
          participant.role = '*';
        }

        var participantAddress;
        if (this.state.etherscan_url) {
          participantAddress = (
            (<a target='_blank' href={ `${this.state.etherscan_url}/address/${participant.address}` }>{participant.address.slice(0,5)}...</a>)
          )
        }else{
          participantAddress = (
            `${participant.address.slice(0,5)}...`
          )
        }
        let rowStyle = {
          border: 'none'
        };

        if (!participant.matched){
          rowStyle.display ='none';
        }
        return (
          <TableRow  style={rowStyle} >
            <TableRowColumn style={{ width: '60%'}}>
              {getTwitterIcon(participant.name)}
              <span style={{paddingLeft:'1em'}}><a target='_blank' href={ `https://twitter.com/${participant.name}` }>{participant.role}{participant.name}</a> </span>
                ({participantAddress})
              </TableRowColumn>
            <TableRowColumn style={{ width: '20%'}} >{this.yesNo(participant)}</TableRowColumn>
            <TableRowColumn style={{ width: '20%'}} >
              {/*<span>
                { this.displayBalance(participant) }
              </span>*/}
              <FlatButton label="Show" secondary={true} onClick={ this.showDetails } style={ styles.card } />
            </TableRowColumn>
          </TableRow>
        )
      })
    }else{
      return(<TableRowColumn style={{textAlign:'center'}} width={100} >No one has registered yet. Be the first to register by typing your twitter handle and press 'Register'</TableRowColumn>)
    }
  }

  getDepositContent( deposit, rate ) {
    if(deposit){
      return (
        <span style={ styles.list }> ETH { this.toEther( deposit ) }</span>
      )
    }else{
      return (
        <span style={ styles.list }>No info available</span>
      )
    }
  }

  render() {
    return (
      <Card style={ styles.card }>
          <Typography variant="display1" align="center" className="mb-3">Participants</Typography>

          {/*<NameSearch  eventEmitter={this.props.eventEmitter} />
          <QRCode  eventEmitter={this.props.eventEmitter} />*/}

          <List>
            <ListItem 
            leftIcon={ getDepositIcon() }
            disabled={ true }
            style={ styles.item }
            primaryText={
              <span>DEPOSIT </span>
            }
            secondaryText={
              <span styles={{ color: '#5F5F5F'}}> ETH 0.02</span>
            }
          />

          <ListItem
            style={ styles.item }
            leftIcon={ getTotalPot() }
            disabled={ true }
            primaryText={
              <span>TOTAL POT</span>
            }
            secondaryText={
              <span styles={{ color: '#5F5F5F' }}>0.046153846153846164</span>
            }
          />

          <ListItem
            style={ styles.item }
            leftIcon={ getTotalPerPerson() }
            disabled={true}
            primaryText={
              <span>TOTAL PAYOUT PER PERSON </span>
            }
            secondaryText={
              <span styles={{ color: '#5F5F5F'}}>ETH 0.0023</span>
            }
          />

          <ListItem
            style={ styles.item }
            leftIcon={ getPersons() }
            disabled={true}
            primaryText={
              <span>MAXIMUM AMOUNT OF REGISTRATIONs</span>
            }
            secondaryText={
              <span styles={{ color: '#5F5F5F'}}>45</span>
            }
          />

          <ListItem
            style={ styles.item }
            leftIcon={ getPersons() }
            disabled={true}
            primaryText={
              <span>AMOUNT OF ATTENDEES</span>
            }
            secondaryText={
              <span styles={{ color: '#5F5F5F'}}>36</span>
            }
          />

          </List>

          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow style={{ border: 'none' }}>
                <TableHeaderColumn style={{ width: '60%'}} ></TableHeaderColumn>
                <TableHeaderColumn style={{ width: '20%'}} ></TableHeaderColumn>
                <TableHeaderColumn style={{ width: '20%'}} ></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.displayParticipants()}
            </TableBody>
          </Table>
          <p style={{color:'grey', fontSize:'small'}}>Note: admins are marked as *</p>
      </Card>
    );
  }
}
export default Participants;
