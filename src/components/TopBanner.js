import React from 'react';

import Divider from 'material-ui/Divider';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import participantStatus from '../util/participantStatus';

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
      detail:{},
      participants:[],
    }
  }

  // UTILS / FIXME duplicated code


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


  // 

  componentDidMount() {
    this.props.eventEmitter.on('detail', detail => {
      this.setState({ detail:detail });
    });
    this.props.getParticipants( participants =>{
      this.setState({ participants });
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
  }

  canWithdraw() {
    return this.state.detail.canWithdraw && (this.participantStatus() == 'Won' || this.participantStatus() == 'Cancelled');
  }

  canRegister() {
    return this.state.detail.canRegister && this.participantStatus() == 'Not registered';
  }

  isEnded() {
    return this.state.detail.ended;
  }

  headerText() {

    let withdraw_date = this.state.detail.withdraw_end_date;
    let text = "";
    if (this.isEnded()) {
      text = "The Event has ended";
    }
    
    if (this.canWithdraw()) {
      text = "The Event has ended and payouts will continue until the " + withdraw_date;
    } else if (this.canRegister()) {
      var availableSpots = this.state.detail.limitOfParticipants - this.state.detail.registered;
      if (availableSpots <= 0){
        text = "Unfortunately no spots left";
      } else {
        text = "Register and get a chance to win ETH if someone misses the event!";
      }       
    } else {
      text = "You can not register anymore. Payouts start soon."
    }

    return text;
  }

  headerButton() {
    var availableSpots = this.state.detail.limitOfParticipants - this.state.detail.registered;
    if (this.canWithdraw()) {
      return (<div>
        <a href="#withdraw" style={ styles.btn }>Withdraw now</a>
        {/* <span style={{ fontSize: '12px', textAlign: 'center', color: '#5F5F5F', display: 'block' }}>7 days, 5 hours and 23 minutes left</span> */}
      </div> )
    } else if (this.canRegister() && availableSpots > 0) {
      return  (<div>
        <a href="#registration" style={ styles.btn }>Register now</a>
      </div>)
    } else {
      return (<div></div>)
    }
  }

  render() {
    return (
      <div style={ styles.banner }>
        <Typography variant="title" style={ styles.title }>
          { this.headerText() }
        </Typography>
        { this.headerButton() }
      </div>
    );
  }
}

export default TopBanner;
