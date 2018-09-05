import React from 'react';
import ReactDOM from 'react-dom';

import { List, ListItem } from 'material-ui/List';
import Card from '@material-ui/core/Card';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Typography from '@material-ui/core/Typography';
import IconButton from 'material-ui/IconButton';

import participantStatus from '../util/participantStatus';
import NameSearch from './NameSearch';
import QRCode from './QRCode';



import math from 'mathjs';
import $ from 'jquery';

const getTwitterIcon = (name) =>(
  <Avatar
    style={{ verticalAlign:'middle' }}
    src={`https://avatars.io/twitter/${name}`}
    size={ 26 }
  />
)

const styles = {
  card: {
    paddingTop: '40px',
    boxShadow: 'none',
  },

  btn: {
    borderRadius: '7px',
    backgroundColor: 'transparent',
    textTransform: 'uppercase',
    color: '#32A1E4',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#32A1E4',
    fontSize: '11px',
    padding: '0 5px',
    minWidth: '40px',
    height: '24px',
    lineHeight: '24px'
  },

  btnIcon: {
    margin: '0 0 0 auto'
  },

  btnAdmin: {
    height: '23px',
    borderRadius: '7px',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '11px',
    backgroundColor: '#D0D0D0',
    lineHeight: '20px'
  },

  name: {
    flex: '100 1 100%',
    color: '#1D9C1B',
    fontSize: '18px',
  },

  row: {
    marginBottom: '15px'
  },

  hint: {
    marginTop: '10px',
    marginBottom: '25px',
    color: '#1FD91B',
    fontSize: '12px'
  },
};

class Participants extends React.Component {

  constructor( props ) {
    super( props );

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

     this.showDetails = this.showDetails.bind(this);
  }

  componentDidMount() {
    // Initialize
    this.props.getParticipants( participants =>{
      this.setState({ participants });
    });

    this.props.eventEmitter.on( 'search', keyword => {
      this.setState({ keyword: keyword });
    });

    this.props.eventEmitter.on( 'change', _ => {
      console.log('CHANGE', _);
      this.props.getParticipants(participants =>{
        this.setState({ participants });
      });
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

  isAdmin(){
    return this.state.detail.admins.includes( this.state.address ) || ( this.state.detail.owner == this.state.address );
  }

  isUser( participant ){
    return this.state.accounts.includes( participant.address );
  }

  // toEther(value) {
  //   if(value){
  //     // return math.round(this.props.web3.fromWei(value, "ether").toNumber(), 3).toString();
  //     return this.props.web3.fromWei(value, "ether").toString();
  //   }
  // }

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
      return ( <Avatar src={ require('../images/сheck.svg') } size={ 26 } backgroundColor="transparent" /> );
    }else{
      if(this.isAdmin() && !this.state.detail.ended){
        return (
          <Checkbox
            onCheck={this.handleAttendees.bind(this, participant.address)}
          />
        )
      }else{
        return ( <Avatar src={ require('../images/cross.svg') } size={ 20 } backgroundColor="transparent" /> );
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

  displayParticipants() {
    if(!this.state.detail.name) return(
      <TableRowColumn width={ 100 }>
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

      return this.state.participants.map( (participant, id) => {

        console.log('this.state.participants ', this.state.participants )

        if(state.keyword && state.keyword.length >=3){
          let keyword = state.keyword.toLowerCase();
          participant.matched = !!(participant.name.match(keyword)) || !!(participant.address.match(keyword))

        } else {
          participant.matched = true
        }

        let isAdmin = state.detail.admins.filter((admin)=>{ return admin == participant.address }).length > 0;

        if ( isAdmin || state.detail.owner == participant.address ) {
          participant.role = true;
        }

        var participantAddress;

        if (this.state.etherscan_url) {
          participantAddress = (
            (<a target='_blank' href={ `${this.state.etherscan_url}/address/${participant.address}` }>{participant.address.slice(0,5)}...</a>)
          )
        } else {
          participantAddress = (
            `${participant.address.slice(0,5)}...`
          )
        }

        let rowStyle = {
          border: 'none'
        };

        if (!participant.matched) {
          rowStyle.display ='none';
        }

        return (
          <TableRow  style={ rowStyle } key={ participant.id }>
            { this.state.isDetails ?
              <div className="participant_info">
                <h4 className="flex align-center">
                  <span style={ styles.name } className={ participant.role ? 'active' : '' }>
                    { participant.name }
                  </span>

                  <IconButton onClick={ this.showRegisterInfo } size = { 15 } style={ styles.btnIcon } onClick={ () => this.showDetails() }>
                    <Avatar
                      src={require("../images/close.svg")}
                      className="icon"
                      size = { 26 }
                      styles={{ background: 'transparent' }}
                    />
                  </IconButton>
                </h4>
                <div style={ styles.row } className="flex align-center justify-between">
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Attended:</span>
                  <span>{ this.yesNo(participant) }</span>
                </div>
                <div style={ styles.row } className="flex align-center justify-between">
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Payout Status: </span>
                  <span>{ this.displayBalance(participant) }</span>
                </div>
                <div style={ styles.row } className="flex align-center justify-between">
                  <span  style={{ fontSize: '12px', fontWeight: 'bold' }}>Account</span>
                  <span style={{ color: '#32A1E4' }}>{ participant.address }</span>
                </div>
              </div> : ''
            }
            <TableRowColumn style={{ width: '60%', paddingLeft: '15px'}} >
              {/* { getTwitterIcon(participant.name) } */}
              <Avatar
                  style={{ verticalAlign:'middle' }}
                  src={`https://avatars.io/twitter/${name}`}
                  onError={() => this.addDefaultSrc()}
                  size={26}
                />
              <span>
                <a 
                  target='_blank'
                  href={ `https://twitter.com/${participant.name}` }
                  className={ participant.role ? 'user user--active' : 'user' }
                >{ participant.name }</a>
              </span>
                {/*({participantAddress})*/}
              </TableRowColumn>
            <TableRowColumn style={{ width: '20%'}} >{this.yesNo(participant)}</TableRowColumn>
            <TableRowColumn style={{ width: '20%', textAlign: 'right'}} >
              {/*<span>
                { this.displayBalance(participant) }
              </span> It's important part*/}
              <FlatButton secondary={true} onClick={ () => this.showDetails() } style={ styles.btn } children={ <span>details</span> }/>
            </TableRowColumn>
          </TableRow>
        )
      })
    }else{
      return(<TableRowColumn style={{textAlign:'center'}} width={ 100 } >No one has registered yet. Be the first to register by typing your twitter handle and press 'Register'</TableRowColumn>)
    }
  }

  showDetails() {
    console.log('Click happened');
    this.setState({ isDetails: !this.state.isDetails });
    console.log(this.state.isDetails)
  }

  addDefaultSrc(ev) {
  ev.target.src = 'some default image url'
}

  handleAction(actionName) {
    var args = [];
    switch (actionName) {
      case 'grant':
        args.push(this.state.attendees);
        break;
      case 'attend':
        args.push(this.state.attendees);
        break;
      case 'register':
        args.push(this.state.name);
        break;
      case 'registerWithEncryption':
        args.push(this.state.name);
        let encryptedData = cryptoBrowserify.publicEncrypt(this.state.detail.encryption, new Buffer(this.state.full_name, 'utf-8'));
        args.push(encryptedData.toString('hex'));
        break;
    }

    if(actionName == 'register' || actionName == 'registerWithEncryption') {
      let obj = {
        action:'register',
        user:this.state.address,
        contract:this.state.detail.contractAddress,
        agent: navigator.userAgent,
        provider:web3.currentProvider.constructor.name,
        hostname: window.location.hostname,
        created_at: new Date()
      }

      this.props.eventEmitter.emit('logger', obj);
    }

    this.props.action(actionName, this.state.address.trim(), args)
    this.setState({
      name: null,
      attendees:[]
    });
    this.props.eventEmitter.emit('attendees', []);
  }

  showWithdraw() {
    return this.state.detail.canWithdraw && (this.participantStatus() == 'Won' || this.participantStatus() == 'Cancelled');
  }

  showPayback() {
    return this.state.detail.canPayback
  }

  showCancel() {
    return this.state.detail.canCancel
  }

  showClear() {
    return this.state.detail.ended
  }

  render() {
    let adminButtons;

    let makeAdmin =  <FlatButton
        secondary={ true }
        style={ styles.btnAdmin }
        onClick={ this.handleAction.bind(this, 'grant') }
        children={ <span>Make admin</span> }
      />

    adminButtons = <div>
      <RaisedButton secondary={true}
        label="Grant admin" style={styles}
        onClick={ this.handleAction.bind(this, 'grant') }
      />

      <RaisedButton secondary={this.showPayback()} disabled={!this.showPayback()}
        label="Payback" style={styles}
        onClick={this.handleAction.bind(this, 'payback')}
      />
      <RaisedButton secondary={this.showCancel()} disabled={!this.showCancel()}
        label="Cancel" style={styles}
        onClick={this.handleAction.bind(this, 'cancel')}
      />
      <RaisedButton secondary={this.showClear()} disabled={!this.showClear()}
        label="Clear" style={styles}
        onClick={this.handleAction.bind(this, 'clear')}
      />
    </div>

    return (
      <Card style={ styles.card } >
          <Typography variant="title">Admin</Typography>
          <div style={ styles.hint }>Metamask account recognised as admin</div>
          <div style={{ marginBottom: '10px', textAlign: 'left' }}>{ this.state.participants.length } Registrations</div>
          {/*<NameSearch  eventEmitter={this.props.eventEmitter} />
          <QRCode  eventEmitter={this.props.eventEmitter} />*/}
          <Table>
            <TableHeader displaySelectAll={ true } adjustForCheckbox={ true } style={{ border: 'none' }}>
              <TableRow style={{ border: 'none' }}>
                <TableHeaderColumn style={{ width: '60%'}} >{ makeAdmin }</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '20%'}} ></TableHeaderColumn>
                <TableHeaderColumn style={{ width: '20%', textAlign: 'right'}} ></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={ true }>
              { this.displayParticipants() }
            </TableBody>
          </Table>
          <p style={{color:'grey', fontSize:'small', textAlign: 'center'}}>( Note: Admins are highlighted in <span className="user--active">green</span> )</p>
      </Card>
    );
  }
}
export default Participants;
