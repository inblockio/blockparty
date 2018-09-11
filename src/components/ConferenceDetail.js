import React from 'react';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import PeopleOutlineIcon from 'material-ui/svg-icons/social/people-outline';
import PeopleIcon from 'material-ui/svg-icons/social/people';
import EventIcon from 'material-ui/svg-icons/action/event';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import DirectionIcon from 'material-ui/svg-icons/maps/directions';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

import math from 'mathjs';
import $ from 'jquery';


const styles = {
  paperLeft:{
    flex: 2,
    height: '100%',
    textAlign: 'left',
    padding: 10
  },

  link: {
    color: '#32A1E4',
    fontSize: '13px',
    display: 'block',
    marginTop: '5px',
    textDecoration: 'none'
  },

  list:{
    color: '#5F5F5F',
    merginHight:1,

  },

  ttl: {
    margin: '0 0 0 0',
    color: '#000',
    fontSize: '14px',
    fontWeight: '500'
  },

  info: {
     color: '#5F5F5F',
     lineHeight: '1.5',
     margin: '0 0 0 0',
     fontSize: '13px'
   },

  icon: {
    top: '12px',
    margin: '0',
    width: '29px',
    height: '29px',
    verticalAlign:'middle',
    backgroundColor: 'transparent'
  },

  item: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 10px 10px 50px',
  },

  innerDiv:{
    paddingTop:1,
    paddingBottom:1,
    paddingRight:1
  },

  card: {
    paddingTop: '40px',
    boxShadow: 'none',
  },

  overflow: {
    whiteSpace: 'normal'
  }
};

const getEtherIcon = () => (
  <Avatar
    src={ require('../images/ethereum.ico') }
    backgroundColor= "white"
    style = { styles.icon }
  />
)

const getCalendarIcon = (name) =>(
  <Avatar src={require("../images/calendar.svg")} style = { styles.icon } />
)

const getDescriptionIcon = (name) =>(
  <Avatar src={require("../images/description.svg")} style = { styles.icon } />
)

const getLocationIcon = (name) =>(
  <Avatar src={require("../images/location.svg")} style = { styles.icon } />
)


class ConferenceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      etherscan_url:null
    };
  }

  componentDidMount() {
    // Initialize
    this.props.eventEmitter.on('detail', detail => {
      this.setState(detail);
    })

    this.props.eventEmitter.on('network', network => {
      this.setState({
        etherscan_url: network.etherscan_url
      });
    })

    // If the app failed to get detail from contract (meaning either connecting
    // to wrong network or the contract id does not match to the one deployed),
    // it will show instruction page.
    setTimeout(function(){
      if(typeof(this.state.name) == 'undefined'){
        this.props.eventEmitter.emit('instruction');
      }
    }.bind(this), 5000)
    // Listen to watcher event.
    this.serverRequest = $.get('https://coinmarketcap-nexuist.rhcloud.com/api/eth', function (result) {
      this.setState({
        rate: math.round((result.price.gbp / 20), 2).toString()
      });
    }.bind(this));
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

  getNameContent(name, contractAddress) {
    if(name){
      if (this.state.etherscan_url) {
        return (
          <span style={styles.list}>
            {name} (<a target='_blank' href={ `${this.state.etherscan_url}/address/${contractAddress}` }>{contractAddress.slice(0,5)}...</a>)
          </span>
        )
      }else{
        return (
          <span style={styles.list}>
            {name} ({contractAddress.slice(0,5)}...)
          </span>
        )
      }
    }else{
      return (
        <span style={styles.list}>
          The contract {contractAddress.slice(0,10)}... not available
        </span>
      )
    }
  }

  getDateContent( name ) {
    if( name ) {
      var d = new Date();
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var date = `${curr_date}-${curr_month}-${curr_year}`

      return (
        <span style={ styles.list }>{ name }</span>
      )
    }else{
      return (
        <span style={ styles.list }>No info available</span>
      )
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
    let attendancyStatus;

    if (this.state.ended) {
      attendancyStatus = <p>Attended<span style={styles.list}>{this.toNumber(this.state.attended)}</span></p>
    }else{
      attendancyStatus = <p>Going (spots left)<span style={styles.list}>{this.toNumber(this.state.registered)}({this.toNumber(this.state.limitOfParticipants) - this.toNumber(this.state.registered)})</span></p>
    }

    return (
      <Card style={ styles.card }>
        <Typography variant="display1" align="center" className="mb-3">
          Event Details
        </Typography>
        <List>

          {/*<ListItem
            insetChildren={true}
            disabled={true}
            primaryText={
              <p>Name{this.getNameContent(this.state.name, this.props.contractAddress)}</p>
            }
          />*/}
          <div className="list">
            <ListItem
              className="mb-2"
              leftIcon={ getCalendarIcon() }
              disabled={ true }
              style={ styles.item }
              children={
                <div>
                  <h5 style={ styles.ttl }>TIME AND DATE</h5>
                   <p style={ styles.info }>{ this.getDateContent(this.state.date) }</p>
                </div>
              }
            />
          </div>
          <div className="list">
            <ListItem
              className="mb-2"
              leftIcon={ getDescriptionIcon() }
              disabled={ true }
              style={ styles.item }
              children={
                <div>
                  <h5 style={ styles.ttl }>DESCRIPTION</h5>
                  <a href={ this.state.description_link } style={ styles.link }>{ this.state.description_link }</a>
                  <p style={ styles.info } dangerouslySetInnerHTML={ {__html: this.state.description_text} } />
                </div>
              }

              secondaryTextLines={ 2 }
            />
          </div>
          <div>
            <ListItem
              className="mb-2 map-container"
              leftIcon={ getLocationIcon() }
              disabled={true}
              style={ styles.item }
              children={
                <div>
                  <h5 className="map__ttl" style={ styles.ttl }> LOCATION </h5>
                  <p style={ styles.info } className="map__ttl"> 
                    <div>{ this.state.location_text }</div>
                    <div>{ this.state.location_sub_text }</div>
                  </p>
                  <div style={{ marginTop: '15px', order: '3' }}>
                    <a target='_blank' style={{ color: '#5F5F5F'}} href={this.state.map_url}>
                      <img src={require('../images/map.png')} style={{ objectFit: 'contain', display: 'block', maxWidth: '100%' }}/>
                    </a>
                  </div>
                </div>
              }
            />
          </div>

          {/*<ListItem 
            leftIcon={getEtherIcon()} disabled={true}
            primaryText={
              <p>Deposit{this.getDepositContent(this.state.deposit, this.state.rate)}</p>
            }
          />

          <ListItem 
            leftIcon={getEtherIcon()}
            disabled={true}
          primaryText={
            <p>Pot<span style={styles.list}>{this.toEther(this.state.totalBalance)}</span></p>
          }
          />
          <ListItem innerDivStyle={styles.innerDiv} leftIcon={<PeopleIcon />} disabled={true}
          primaryText={attendancyStatus}
          />*/}
        </List>
      </Card>
    );
  }
}

export default ConferenceDetail;
