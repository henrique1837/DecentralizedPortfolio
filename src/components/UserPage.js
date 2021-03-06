import React,{Component} from 'react';
import {
  Button,
  Form,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Row,
  Col,
  Spinner,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import classnames from "classnames";
import ProfileHover from 'profile-hover';

import PrivateChat from './PrivateChat.js'
import CommentBox from './CommentBox.js';

const Box = require('3box');

const Config = require('../config.js');
const AppName = Config.AppName
const usersRegistered = Config.usersRegistered
const admin = Config.admin



class UserPage extends Component {
  state = {
    confidentialThreadName: null,
    threadAdmin: null,
    items: null,
    space: null,
    coinbase: null,
    erc721: [],
    tabs:"Portfolio"
  }
  constructor(props){
    super(props);
    this.addContact = this.addContact.bind(this);
    this.setItems = this.setItems.bind(this);
    this.setChannel = this.setChannel.bind(this);

    this.getErc721 = this.getErc721.bind(this);
  }
  componentDidMount = async function(){

    try{
      await this.setState({
        user_address: this.props.match.params.addr
      })
      await this.setItems();
      await this.getErc721();
      if(this.props.space){
        await this.setState({
          box: this.props.box,
          space: this.props.space,
          coinbase: this.props.coinbase
        });
        await this.setChannel();
      }
    } catch(err){
      console.log(err)
    }

  }
  setChannel = async function(){

    await this.state.space.syncDone;
    const space = this.state.space;
    console.log("contacts_"+this.state.user_address)
    console.log(this.state.coinbase)
    const isContact = await space.private.get("contact_"+this.state.user_address);
    console.log(isContact);
    if(!isContact){
      const thread = await space.joinThread("contacts_"+this.state.user_address,{firstModerator:this.state.user_address});
      const postId = await thread.post(this.state.coinbase);
      await space.private.set("contact_"+this.state.user_address,postId);
    }
    const userProfile = await Box.getSpace(this.state.user_address,AppName);
    const threadAddressByUser = userProfile['contactThread_'+this.state.coinbase];
    if(threadAddressByUser){
      const confidentialThreadNameByUser = "contact_"+this.state.user_address+"_"+this.state.coinbase;
      await space.public.set('contactThread_'+this.state.user_address,threadAddressByUser);
      const thread = await space.joinThreadByAddress(threadAddressByUser)
      console.log(thread);
      await space.syncDone;
      await this.setState({
        confidentialThreadName: confidentialThreadNameByUser,
        threadAdmin: this.state.user_address,
        threadAddress: thread.address
      });
    } else {
      const confidentialThreadName = "contact_"+this.state.coinbase+"_"+this.state.user_address;
      let threadAddress = await space.public.get('contactThread_'+this.state.user_address);
      if(!threadAddress){
        const thread = await space.createConfidentialThread(confidentialThreadName);
        const postId = await thread.post("Channel set");
        await thread.deletePost(postId);
        //const thread = await space.joinThread(confidentialThreadName,{firstModerator:this.state.coinbase,members: true});
        const members = await thread.listMembers();

        if(members.length == 0){
          await thread.addMember(this.state.user_address);
          console.log("member added");
        }
        threadAddress = thread.address

        await space.public.set('contactThread_'+this.state.user_address,threadAddress);
      }
      await this.setState({
        confidentialThreadName: confidentialThreadName,
        threadAdmin: this.state.coinbase,
        threadAddress: threadAddress
      });

    }

    return
  }
  setItems = async function(){
    let profile = this.state.profile;
    const boxProfile = await Box.getProfile(this.state.user_address);
    if(!profile){
      profile = await Box.getSpace(this.state.user_address,AppName);
    }
    await this.setState({
      profile: profile,
      boxProfile: boxProfile
    });
    const posts = await Box.getThread(AppName,"items_"+this.state.user_address,this.state.user_address,true);
    await this.setState({
      items: posts
    });
    return
  }
  addContact = async function(){
    const space = await this.state.space;
    await space.syncDone;
    console.log("contacts_"+this.state.user_address)

    const isContactAdded = await space.private.get("contactAdded_"+this.state.user_address);
    console.log(isContactAdded)
    console.log("contactsAdded_"+this.state.coinbase);
    if(!isContactAdded){
      const thread = await space.joinThread("contactsAdded_"+this.state.coinbase,{firstModerator:this.state.coinbase});
      const postId = await thread.post(this.state.user_address);
      await space.private.set("contactAdded_"+this.state.user_address,postId);
      alert('saved')
    } else {
      alert('contact already saved')
    }
    await space.syncDone;
    return
  }


  getErc721 = async function(){
    const collectiblesRes = await fetch(`https://rinkeby-api.opensea.io/api/v1/assets?owner=${this.state.user_address}&order_by=current_price&order_direction=asc&limit=30`);
    const collectiblesData = await collectiblesRes.json();
    await this.setState({
      erc721: collectiblesData.assets
    });
  }

  toggleNavs = (e,tab) => {
    e.preventDefault();
    this.setState({
      tabs: tab
    });
  };
  render(){
    if(this.state.profile && this.state.items){
      const profile = this.state.profile
      return(
          <div style={{paddingTop:'40px'}}>
              {
                (
                  this.state.confidentialThreadName &&
                  (
                    <div className="nav-wrapper">
                      <Nav
                        className="nav-fill flex-column flex-md-row"
                        id="tabs-icons-text"
                        pills
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            aria-selected={this.state.tabs === 'Portfolio'}
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: this.state.tabs === 'Portfolio'
                            })}
                            onClick={e => this.toggleNavs(e, 'Portfolio')}
                            href="#Portfolio"
                            role="tab"
                          >
                            <i className="ni ni-cloud-upload-96 mr-2" />
                            Portfolio
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={this.state.tabs === 'privMessage'}
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: this.state.tabs === 'privMessage'
                            })}
                            onClick={e => this.toggleNavs(e,'privMessage')}
                            href="#privMessage"
                            role="tab"
                          >
                            <i className="ni ni-bell-55 mr-2" />
                            Private message
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={this.state.tabs === 'Comments'}
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: this.state.tabs === 'Comments'
                            })}
                            onClick={e => this.toggleNavs(e,'Comments')}
                            href="#Comments"
                            role="tab"
                          >
                            <i className="ni ni-calendar-grid-58 mr-2" />
                            Comments
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  )
                )
              }
              <Card className="shadow">
                <CardBody>
                  <TabContent activeTab={this.state.tabs}>
                    <TabPane tabId="Portfolio">
                      <div>
                        <Row style={{paddingTop:'20px'}}>
                          <Col lg={6}>
                            <ProfileHover
                              address={profile.address}
                              orientation="bottom"
                              noCoverImg
                            />
                          </Col>
                          <Col lg={6}>
                          {
                            (
                              this.state.space &&
                              (this.state.coinbase.toLowerCase() != this.state.profile.address.toLowerCase()) &&
                              (
                                <center>
                                  <Button variant="primary" onClick={this.addContact}>Add contact</Button>
                                </center>
                              )
                            )
                          }
                          </Col>
                        </Row>
                        <div style={{paddingTop:'40px',wordBreak: 'break-all'}}>
                          <h5>3box profile</h5>
                          <h6>About</h6>
                          <p>Website: <a href={this.state.boxProfile.website} target="_blank">{this.state.boxProfile.website}</a></p>
                          <p>Member since: {this.state.boxProfile.memberSince}</p>
                          <h6>Work</h6>
                          <p>Employer: {this.state.boxProfile.employer}</p>
                          <p>Job Title: {this.state.boxProfile.job}</p>
                          <h6>Education</h6>
                          <p>School: {this.state.boxProfile.school}</p>
                          <p>Degree: {this.state.boxProfile.degree}</p>
                          <p>Major: {this.state.boxProfile.major}</p>
                          <p>Year: {this.state.boxProfile.year}</p>
                        </div>
                        <div style={{paddingTop:'40px',wordBreak: 'break-all'}}>
                          <h5>Decentralized portfolio profile</h5>
                          <p>Techs: {profile.techs}</p>
                          {
                            (
                              this.state.profile.status &&
                              (
                                <p>Status: <a href={`https://join.status.im/u/${this.state.profile.status}`} target="_blank">{this.state.profile.status}</a></p>
                              )
                            )
                          }
                          {
                            (
                              this.state.profile.gitcoin &&
                              (
                                <p>Gitcoin: {profile.gitcoin}</p>
                              )
                            )
                          }
                          {
                            (
                              this.state.profile.youtube &&
                              (
                                <p>Youtube: {profile.youtube}</p>
                              )
                            )
                          }
                          {
                            (
                              this.state.profile.pinterest &&
                              (
                                <p>Pinterest: {profile.pinterest}</p>
                              )
                            )
                          }
                          {
                            (
                              this.state.profile.spotify &&
                              (
                                <p>Spotify: {profile.spotify}</p>
                              )
                            )
                          }
                          <p>Description: {profile.description}</p>
                        </div>
                        <div style={{paddingTop:'40px'}}>
                          <h5>Portfolio</h5>
                        </div>
                        <div style={{paddingTop:'20px'}}>


                        <h5>Education</h5>

                        <h5>Certifcations</h5>
                        <ListGroup>
                        {

                          this.state.items.map(function(post){
                            const item = post.message;
                            const postId = post.postId;
                            if(item.type === 6){
                              return(
                                <ListGroupItem>
                                  <Row>
                                    <Col lg={12}>
                                      <h5><a href={item.uri} target="_blank">{item.name}</a></h5>
                                      <h6>{item.authority}</h6>
                                    </Col>
                                  </Row>

                                </ListGroupItem>
                              )
                            }

                          })
                        }
                        </ListGroup>
                        <h5>Projects</h5>
                        <ListGroup>
                        {
                          this.state.items.map(function(post){
                            const item = post.message;
                            const postId = post.postId;
                            if(item.type === 1){
                              return(
                                <ListGroupItem>
                                  <Row>
                                    <Col lg={4}>
                                      <h5>{item.title}</h5>
                                      <p><small>From {item.start_date} to {item.end_date}</small></p>
                                      <p><a href={item.uri} target="_blank">{item.uri}</a></p>
                                    </Col>
                                    <Col lg={8}>
                                      <p>{item.description}</p>
                                    </Col>
                                  </Row>
                                </ListGroupItem>
                              )
                            }

                          })
                        }
                        </ListGroup>
                        <h5>Experience</h5>
                        <ListGroup>
                        {
                          this.state.items.map(function(post){
                            const item = post.message;
                            const postId = post.postId;
                            if(item.type === 2){
                              return(
                                <ListGroupItem>
                                  <Row>
                                    <Col lg={4}>
                                      <h5>{item.company}</h5>
                                      <h6>{item.title}</h6>
                                      <p><small>From {item.start_date} to {item.end_date}</small></p>
                                      <p><small>{item.location}</small></p>
                                    </Col>
                                    <Col lg={8}>
                                      <p>{item.description}</p>
                                    </Col>
                                  </Row>
                                </ListGroupItem>
                              )
                            }

                          })
                        }
                        </ListGroup>
                        <h5>Publications</h5>
                        <ListGroup>
                        {
                          this.state.items.map(function(post){
                            const item = post.message;
                            const postId = post.postId;
                            if(item.type === 3){
                              return(
                                <ListGroupItem>
                                  <Row>
                                    <Col lg={4}>
                                      <h5>{item.name}</h5>
                                      <p><small>Published on {item.date}</small></p>
                                      <p><small><a href={item.uri} target='_blank'>{item.uri}</a></small></p>
                                    </Col>
                                    <Col lg={8}>
                                      <p>{item.description}</p>
                                    </Col>
                                  </Row>
                                </ListGroupItem>
                              )
                            }

                          })
                        }
                        </ListGroup>
                        <h5>Images</h5>
                        <Row>
                        {
                          this.state.items.map(function(post){
                            const item = post.message;
                            const postId = post.postId;
                            if(item.type === 4){
                              return(
                                <Col
                                  lg={4}
                                  style={{
                                    display:'flex',
                                    flexDirection:'column',
                                    justifyContent:'space-between',
                                    paddingBottom: '100px'
                                  }}>
                                  <Card>
                                    <Card.Body>
                                      <center>
                                        <img src={`https://ipfs.io/ipfs/${item.uri}`} caption={item.description} style={{width:'100%'}}/>
                                      </center>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              )
                            }

                          })
                        }
                        </Row>
                        <h5>Videos</h5>
                        <Row>
                        {
                          this.state.items.map(function(post){
                            const item = post.message;
                            const postId = post.postId;

                            if(item.type === 5){
                              if(item.source === 'youtube'){
                                const uri = `https://www.youtube.com/embed/${item.uri}`
                                return(
                                  <Col
                                    lg={4}
                                    style={{
                                      display:'flex',
                                      flexDirection:'column',
                                      justifyContent:'space-between',
                                      paddingBottom: '100px'
                                    }}>
                                    <Card>
                                      <CardBody>
                                        <center>
                                          <iframe src={uri} style={{width:'100%'}}
                                              frameborder="0"
                                              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                              allowfullscreen>
                                          </iframe>
                                        </center>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                )
                              }
                              return(
                                <Col
                                  lg={4}
                                  style={{
                                    display:'flex',
                                    flexDirection:'column',
                                    justifyContent:'space-between',
                                    paddingBottom: '100px'
                                  }}>
                                  <Card>
                                    <CardBody>
                                      <center>
                                        <video src={`https://ipfs.io/ipfs/${item.uri}`} style={{width:'100%'}} controls/>
                                      </center>
                                    </CardBody>

                                  </Card>
                                </Col>
                              )
                            }

                          })
                        }
                        </Row>
                        <h5>Rinkeby Testnet Collectibles</h5>
                        <Row>
                        {
                          this.state.erc721.map(function(item){

                            return(
                              <Col
                                lg={4}
                                style={{
                                  display:'flex',
                                  flexDirection:'column',
                                  justifyContent:'space-between',
                                  paddingBottom: '100px'
                                }}>
                                <Card>
                                  <CardImg
                                    alt={item.name}
                                    src={item.image_url}
                                    top
                                  />
                                  <CardBody>
                                    <CardTitle as="h4"><a href={item.external_link} target='_blank'>{item.name}</a></CardTitle>
                                    <CardText>
                                      <p>{item.description}</p>
                                    </CardText>
                                  </CardBody>
                                </Card>
                              </Col>
                            )

                          })
                        }
                        <Col lg={12}>
                          <p><small>Rinkeby Collectibles list by <a href='https://rinkeby.opensea.io/assets' target='_blank'>OpenSea</a></small></p>
                        </Col>
                        </Row>
                        </div>

                       </div>
                    </TabPane>
                    {
                      (
                        this.state.confidentialThreadName &&
                        this.state.profile &&
                        this.state.items &&
                        (
                          <>
                          <TabPane tabId="privMessage">
                            <h5>Private message</h5>
                            <PrivateChat threadAddress={this.state.threadAddress} space={this.state.space} coinbase={this.state.coinbase} />
                          </TabPane>
                          <TabPane tabId="Comments">
                            <h5>Comments</h5>

                            <CommentBox
                              // required
                              coinbase={this.state.coinbase}
                              space={this.state.space}
                              threadName={"job_offers_"+profile.address}

                          />
                          </TabPane>
                          </>
                        )
                      )
                    }
                  </TabContent>
                </CardBody>
              </Card>
          </div>
        )
    }
    return(
      <center style={{paddingTop:'40px'}}>
        <Spinner color="primary" />
        <p>Loading ...</p>
      </center>
    )
  }
}

export default withRouter(UserPage);
