import React from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import participantStatus from '../util/participantStatus';
import cryptoBrowserify from 'crypto-browserify';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  nameField: {
    marginBottom: '20px',
  },

  form: {
    position: 'relative',
    maxWidth: '400px',
    display: 'block',
    textAlign: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 auto'
  },

  btn: {
    height: '42px',
    marginTop: '20px',
    borderRadius: '7px',
    lineHeight: '42px',
  },

  card: {
    paddingTop: '40px',
    boxShadow: 'none',
  },

  hint: {
    display: 'block',
    marginTop: '5px',
    marginBottom: '15px',
    color: '#1FD91B',
    fontSize: '12px'
  },

  checkbox: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#7D7D7D'
  },

  btnIcon: {
    width: '27px',
    height: '27px',
    margin: '0 0 0 auto'
  }
}


class RegistrationForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      address:null,
      name:null,
      accounts:[],
      attendees:[],
      participants:[],
      detail:{},
      isRegisterInfo: false
    };

    this.showRegisterInfo = this.showRegisterInfo.bind(this);
  }

  componentDidMount() {
    this.props.eventEmitter.on('accounts_received', accounts => {
      this.setState({
        address:accounts[0],
        accounts:accounts
      })
    });

    this.props.eventEmitter.on('participants_updated', participants => {
      this.setState({
        participants:participants
      })
    });

    this.props.eventEmitter.on('detail', detail => {
      this.setState({detail:detail});
    })

    this.props.eventEmitter.on('attendees', attendees => {
      this.setState({
        attendees:attendees
      })
    });
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
    if(actionName == 'register' || actionName == 'registerWithEncryption'){
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

  handleSelect(event,index,value){
    this.setState({
      address: value,
    });
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

  isOwner(){
    return this.state.address == this.state.detail.owner;
  }

  isAdmin(){
    return this.state.detail.admins && this.state.detail.admins.includes(this.state.address) || (this.state.detail.owner == this.state.address);
  }

  showRegister(){
    return this.state.detail.canRegister && this.participantStatus() == 'Not registered';
  }

  showAttend(){
    return this.state.detail.canAttend
  }


  handleName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handleEncryptedField(e) {
    this.setState({
      full_name: e.target.value
    });
  }

  showRegisterInfo() {
    this.setState({ isRegisterInfo: !this.state.isRegisterInfo })
  }

  render() {
    let adminButtons, registerButton, warningText;

    var availableSpots = this.state.detail.limitOfParticipants - this.state.detail.registered;
    if(this.props.read_only) {
      registerButton = <span>Connect via Mist/Metamask to be able to register.</span>
    }else if(this.state.accounts.length > 0) {
      if(this.state.detail.ended){
        registerButton = <span>This event is over </span>
      }else if (availableSpots <= 0) {
        registerButton = <span>No more spots left</span>
      }else{
        if (this.state.detail.encryption && this.showRegister()) {
          var encryptionField =  <TextField
                      floatingLabelText="Full name * (to be encrypted)"
                      floatingLabelFixed={true}
                      value={this.state.full_name}
                      hintText="Full name (required)"
                      onChange={this.handleEncryptedField.bind(this)}
                      style={{margin:'0 5px'}}
          />
          var action = 'registerWithEncryption';
        }else{
          var action = 'register';
        }
        registerButton = <RaisedButton primary={ this.showRegister() } disabled={!this.showRegister()}
          label="register and deposit"
          className="btn"
          style={{ backgroundColor: '#32A1E4' }}
          onClick={this.handleAction.bind(this, action)}
        />
        warningText = <div style={{textAlign:'center', color:'red'}}>Please be aware that you <strong>cannot</strong> cancel once regiesterd. Please read FAQ section at ABOUT page on top right corner for more detail about this service.</div>
      }
    }else{
      registerButton = <span>No account is set</span>
    }


    {/*if (this.showRegister()) {
      var nameField = <TextField
        placeholder="@twitter_handle (required)"
        floatingLabelFixed={false}
        value={this.state.name}
        onChange={ this.handleName.bind(this) }
        className="field field-name"
        style={ styles.name }
      />
    }*/}

    var nameField = <TextField
      placeholder="@twitter_handle (required)"
      floatingLabelFixed={false}
      value={ this.state.name }
      onChange={ this.handleName.bind(this) }
      className="field field-name"
      style={ styles.nameField }
    />

    var address = <TextField 
            placeholder="@twitter_handle (required)"
            value={ this.state.address }
            floatingLabelFixed={false}
            onChange={ this.handleSelect.bind(this) }
            className="field field-address"
            id="address"
          />

    return (
      <Card style = { styles.card } id="registration">
        <form style={ styles.form }>

          { this.state.isRegisterInfo ?
            <div className="info-card">
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '400', margin: '0px 0px 15px' }} className="flex align-center">
                  <span>Connecting Accounts</span>
                  <IconButton onClick={ this.showRegisterInfo } size = { 15 } style={ styles.btnIcon }>
                    <Avatar
                      src={require("../images/close.svg")}
                      className="icon"
                      size = { 26 }
                      styles={{ background: 'transparent' }}
                    />
                  </IconButton>
                </h4>
                <div style={{ color: '#7D7D7D', fontSize:'12px'}}>
                  You need to connect your Twitter and Metamask account address and confirm below to participate. Currently, Metamask on android only works with Firefox.
                  <a href="" style={{ color: '#32A1E4'}}>Download and install the Metamask Add-on here.</a>
                </div>
                <div className="flex align-center" style={{ justifyContent: 'space-around', marginTop: '30px' }}>
                  <img src={require("../images/firefox.png")} style={{ marginRight :'20px', display: 'block', maxWidth: '76px'}}/>
                  <img src={require("../images/metamask.png")} style={{ display: 'block', maxWidth: '76px' }}/>
                </div>
              </div>
            </div> : null
          }

          <Typography
            variant="title">
              <span>Registration</span>
              <IconButton onClick={ this.showRegisterInfo }>
                <Avatar
                  src={ require("../images/info.svg") }
                  className="icon"
                  size={ 15 }
                  styles={{ background: 'transparent' }}
                />
              </IconButton>
          </Typography>
          <div>{ nameField }</div>
          <div>{ address }</div>
          <span
            style={ styles.hint }
          >
            Metamask account connected
          </span>

          <div>
             <Checkbox
                label="Don’t list my Twitter name in the public participants list. (The admins will still see it)"
                className="checkbox"
                checked={ true }
              />

              <Checkbox
                label="* By submitting my details I agree to deposit 0.002 ETH and in case I will not show up to the event my deposit will be distributed among all attendees. To be qualifed for the payout, I will be PHYSICALLY present at the venue by 6:30pm at the latest!"
                className="checkbox"
              />
          </div>

          <div>{ registerButton }</div>
        </form>
      </Card>
    );
  }
}

export default RegistrationForm;
