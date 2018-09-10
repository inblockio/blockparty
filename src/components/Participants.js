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
    margin: '0 0 0 auto',
    paddingRight: '0px'
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

  payoutBtn: {
    height: '42px',
    width: '165px',
    marginBottom: '15px',
    padding: '0 10px',
    color: '#fff',
    borderRadius: '7px',
    backgroundColor: '#32A1E4',
    textTransform: 'uppercase',
    lineHeight: '42px'
  },

  withdrawButton: {
    height: '42px',
    width: '165px',
    marginBottom: '15px',
    padding: '0 10px',
    color: '#fff',
    borderRadius: '7px',
    backgroundColor: '#32A1E4',
    textTransform: 'uppercase',
    lineHeight: '42px'
  },

  canselEvent: {
    backgroundColor:'transparent',
    height: '42px',
    width: '165px',
    borderRadius: '7px',
    padding: '0 10px',
    color: '#FF3A3A',
    border: '1px solid #FF3A3A',
    textTransform: 'uppercase',
    lineHeight: '42px'
  },

  name: {
    flex: '100 1 100%',
    color: '#1D9C1B',
    fontSize: '18px',
  },

  row: {
    marginBottom: '15px',
    paddingRight:'10px',
    paddingLeft: '10px'
  },

  hint: {
    marginTop: '10px',
    marginBottom: '25px',
    color: '#1FD91B',
    fontSize: '12px'
  },

  hintBold: {
    marginTop: '2px',
    marginBottom: '25px',
    color: '#1FD91B',
    fontSize: '12px',
    fontWeight: 'bold'
  },

  hintRed: {
    marginBottom: '10px',
    color: 'red'
  },

  showAll: {
    height: '58px',
    fontSize: '12px',
    marginBottom: '25px',
    padding: '0',
    border: 'none',
    color: '#55ACEE'
  },

  btnClose: {
    position: 'relative',
    top: '3px',
    width: '27px',
    height: '27px',
    margin: '0 0 0 auto',
    paddingRight: '0px'
  }
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
      showDetails: -1,
      isPayoutInfo: false
    };

     this.showDetails = this.showDetails.bind(this);
     this.closeDetails = this.closeDetails.bind(this);
     this.showPayoutInfo = this.showPayoutInfo.bind(this);
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

  showPayoutInfo() {
    this.setState({ isPayoutInfo: !this.state.isPayoutInfo })
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

  handleSelection(ids) {
    let attendees = [];
    if (ids == "all") {
      this.state.attendees = this.state.participants;
    } else if(ids == "none") {
      this.state.attendees = [];
    } else {
      this.state.attendees = ids.map(id => {
        return this.state.participants[id];
      });
    }
    
    // this.props.eventEmitter.emit('attendees', this.state.attendees);
  }

  yesNo( participant ) {
    return participant.attended ? <img  src={ require("../images/сheck.svg") } /> : <img  src={ require("../images/cross.svg") } />;
  }

  displayBalance( participant ) {
    var message = participantStatus( participant, this.state.detail );
    console.log('status', message);
    let color, amount;
    switch(message) {
    case 'Won':
    case 'Withdrawn':
      color = 'green';
      amount = web3.fromWei( this.state.detail.payoutAmount.toNumber() );
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
        {/*<p>
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
        </p>*/}
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
          <TableRow  style={ rowStyle } key={ participant.address }>
            <TableRowColumn style={{ width: '58%', paddingLeft: '15px'}} >
              <Avatar
                  style={{ verticalAlign:'middle' }}
                  src={`https://avatars.io/twitter/${participant.name.replace("@", "")}`}
                  onError={() => this.addDefaultSrc()}
                  size={26}
                />
              <span>
                <a 
                  target='_blank'
                  href={ `https://twitter.com/${participant.name.replace("@", "")}` }
                  className={ participant.role ? 'user user--active' : 'user' }
                >{ participant.name }</a>
              </span>
                {/*({participantAddress})*/}
              </TableRowColumn>
            <TableRowColumn style={{ width: '20%'}} >{this.yesNo(participant)}</TableRowColumn>
            <TableRowColumn style={{ width: '22%', textAlign: 'right', minWidth: '80px'}} >
              {/*<span>
                { this.displayBalance(participant) }
              </span> It's important part*/}
              <FlatButton secondary={true} onClick={ () => this.showDetails(id) } style={ styles.btn } children={ <span>details</span> }/>
            </TableRowColumn>
            { this.state.showDetails == id ?
              <div className="participant_info">
                <h4 className="flex align-center">
                  <span style={ styles.name } className={ participant.role ? 'active' : '' }>
                    { participant.name }
                  </span>

                  <IconButton onClick={ this.showRegisterInfo } size = { 15 } style={ styles.btnIcon } onClick={ () => this.closeDetails() }>
                    <Avatar
                      src={require("../images/close.svg")}
                      className="icon"
                      size = { 26 }
                      styles={{ background: 'transparent' }}
                    />
                  </IconButton>
                </h4>
                <div style={ styles.row } className="flex align-center justify-between">
                  <span style={{ fontSize: '12px', fontWeight: 'bold', paddingRight: '5px' }}>Attended:</span>
                  <span>{ this.yesNo(participant) }</span>
                </div>
                <div style={ styles.row } className="flex align-center justify-between">
                  <span style={{ fontSize: '12px', fontWeight: 'bold', paddingRight: '5px' }}>Payout Status: </span>
                  <span>{ this.displayBalance(participant) }</span>
                </div>
                <div style={ styles.row } className="flex align-center justify-between">
                  <span  style={{ fontSize: '12px', fontWeight: 'bold', paddingRight: '5px' }}>Account:</span>
                  <span style={{ color: '#32A1E4' }}>{ participant.address }</span>
                </div>
              </div> : ''
            }
          </TableRow>
        )
      })
    }else{
      return(<TableRowColumn style={{ textAlign:'center' }} width={ 100 } >No one has registered yet. Be the first to register by typing your twitter handle and press 'Register'</TableRowColumn>)
    }
  }

  showDetails(id) {
    this.setState({ showDetails: id });
  }

  closeDetails() {
    this.setState({ showDetails: -1 });
  }

  addDefaultSrc(ev) {
    ev.target.src = 'some default image url'
  }

  handleAction(actionName) {
    var args = [];
    switch (actionName) {
      case 'grant':
        args.push(this.state.attendees.map ( attendee => {
          return attendee.address;
        }));
        break;
      case 'attend':
        args.push(this.state.attendees.map ( attendee => {
          return attendee.address;
        }));
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

  participantStatus(){
    var p = this.selectParticipant(this.state.participants, this.state.address);
    if (p) {
      return participantStatus(p, this.state.detail)
    }else{
      return 'Not registered';
    }
  }

  selectParticipant(participants, address){
    return participants.filter(function(p){
       return p.address == address
    })[0]
  }



  showWithdraw() {
    return this.state.detail.canWithdraw && (this.participantStatus() == 'Won' || this.participantStatus() == 'Cancelled');
  }

  showAttend(){
    return this.state.detail.canAttend
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

  isOwner(){
    return this.state.address == this.state.detail.owner;
  }

  isAdmin(){
    if (!this.state.detail.admins) {
      return false
    }
    return this.state.detail.admins.includes(this.state.address) || (this.state.detail.owner == this.state.address);
  }

  enableAttendentsAdminButton() {
    return this.state.attendees.length == 0;
  }

  render() {

    const numSelected = this.state.numSelected;

    let makeAdmin =  <FlatButton
        secondary={ true }
        style={ styles.btnAdmin }
        onClick={ this.handleAction.bind(this, 'grant') }
        children={ <span>Make admin</span> }
      />

    let markAttended =  <FlatButton
      secondary={ true }
      style={ styles.btnAdmin }
      onClick={ this.handleAction.bind(this, 'attend') }
      children={ <span>Mark attended</span> }
    />

    let payoutBtn =  <FlatButton
        secondary={ this.showPayback()} 
        disabled={!this.showPayback()}
        children={ <span>Open Payouts</span> }
        style={ styles.payoutBtn }
        onClick={ this.handleAction.bind(this, 'payback') }
      />

    let canselEvent = <FlatButton
        secondary={this.showCancel()}
        disabled={!this.showCancel()}
        children={ <span> Cancel event </span> }
        style={ styles.canselEvent }
        onClick={this.handleAction.bind(this, 'cancel')}
      />

    let showAll = <FlatButton
        secondary={ this.showCancel() }
        disabled={ this.state.participants.length < 7 }
        children={ <div><div>Show All</div><img src={require("../images/arrow_down.svg")} /></div> }
        style={ styles.showAll }
      />

    let clearButton =
      <RaisedButton secondary={this.showClear()} disabled={!this.showClear()}
        label="Clear" style={styles}
        onClick={this.handleAction.bind(this, 'clear')}
      />

    let withdrawButton = <FlatButton
      id="withdraw"
      secondary={ this.showWithdraw() }
      disabled={ !this.showWithdraw() }
      children={ <span>Withdraw</span> }
      style={ styles.withdrawButton }
      onClick={ this.handleAction.bind(this, 'withdraw') }
    />

    return (
      <Card style={ styles.card } >
        {this.state.participants.length && this.isAdmin() ? 
          <div>
            <Typography variant="title" style={{ fontWeight: '400' }}>Admin</Typography>
            <div style={ styles.hint }>Metamask account recognised as admin</div>
            <div style={{ marginBottom: '10px', textAlign: 'left' }}>{ this.state.participants.length } Registrations</div>
            {/*<NameSearch  eventEmitter={this.props.eventEmitter} />
            <QRCode  eventEmitter={this.props.eventEmitter} />*/}
            <div style={{ position: 'relative' }}>
              <Table multiSelectable={ true } onRowSelection={ this.handleSelection.bind(this) }>
                <TableHeader displaySelectAll={ true } enableSelectAll={ true } adjustForCheckbox={ true } style={{ border: 'none' }}>
                  <TableRow style={{ border: 'none' }}>
                    <TableHeaderColumn style={{ width: '58%'}} >{ makeAdmin } { markAttended }</TableHeaderColumn>
                    <TableHeaderColumn style={{ width: '20%'}} ></TableHeaderColumn>
                    <TableHeaderColumn style={{ width: '22%', textAlign: 'right'}} ></TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={ true } deselectOnClickaway={ false }>
                  { this.displayParticipants() }
                </TableBody>
              </Table>


              <p style={{color:'grey', fontSize:'12px', textAlign: 'center'}}>( Note: Admins are highlighted in <span className="user--active">green</span> )</p>
                { showAll }
            </div>
            <div>{ payoutBtn }</div>
            <div>{ canselEvent }</div>
          </div> : null }
          { this.showWithdraw() && (
          <div style={{ marginTop: '20px', position: 'relative' }}>
            { this.state.isPayoutInfo ?
              <div className="info-card" style={{ top: '28px' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '400', margin: '0px 0px 5px', color: '#000', textAlign: 'center' }} className="flex align-center">
                    <span style={{ textAlign: 'center', display: 'block', flex: '1 1 0%', paddingLeft: '12px' }}>Withdrawal period ends in</span>
                    <IconButton onClick={ this.showPayoutInfo } size = { 15 } style={ styles.btnClose }>
                      <Avatar
                        src={require("../images/close.svg")}
                        className="icon"
                        size = { 26 }
                        styles={{ background: 'transparent' }}
                      />
                    </IconButton>
                  </h4>
                  <div style={ styles.hintRed }>7 days, 5 hours and 23 minutes</div>
                  <div style={{ color: '#000000', fontSize:'12px', textAlign: 'left'}}>
                    Please withdraw your payout. If you forget to withdraw, everything will be automatically distributed among all participants.
                  </div>
                </div>
              </div> : null
            }
            <Typography variant="title" style={{ fontWeight: '400' }} className="mb-3"><span>Payout</span>
              <IconButton onClick={ this.showPayoutInfo }>
                <Avatar
                  src={ require("../images/info.svg") }
                  className="icon"
                  size={ 15 }
                  styles={{ background: 'transparent' }}
                />
              </IconButton>
            </Typography>
            
            <span style={ styles.hint }>Metamask account connected with address:</span>
            <div> {this.state.address} </div>
            <div style={ styles.hintBold }>You are entitled to withdraw ETH {/*{web3.fromWei(this.state.detail.payoutAmount.toNumber())}*/}</div>
            { withdrawButton }
          </div>) }
      </Card>
    );
  }
}
export default Participants;
