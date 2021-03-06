import React,{Component} from 'react';
import {
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap';
class Home extends Component {
  state = {
    tutorial: false
  }

  render(){
    if(this.state.tutorial){
      return(
        <div className="header bg-gradient-info py-7 py-lg-8">
          <Container fluid={false}>
            <div className="header-body text-center mb-7">
               <Row className="justify-content-center">
                 <Col lg="5" md="6">
                   <h1 className="text-white">How to use this dapp?</h1>
                   <ol className="text-lead text-light text-left">
                       <li>Install <a href='https://metamask.io/' target='_blank'>Metamask</a>,<a href="https://brave.com/" target='_blank' title='Brave Browser'>Brave Browser</a>,<a href="https://status.im/" target="_blank">Status</a> or <a href="https://alphawallet.com/" target="_blank">AlphaWallet</a></li>
                       <li>
                         Create your ethereum wallet (or import existing one) <br/>
                         <img src={require('../imgs/brave_Crypto0.png')} style={{maxWidth:' 100%'}}/> <br/>
                         <img src={require('../imgs/brave_Crypto1.png')} style={{maxWidth:' 100%'}}/> <br/>
                         <img src={require('../imgs/brave_Crypto2.png')} style={{maxWidth:' 100%'}}/>
                       </li>
                       <li>
                         Accept wallet connection, 3box login/sign up and open DecentralizedPortfolio space <br/>
                         <img src={require('../imgs/brave_3box.png')} style={{maxWidth:' 100%'}}/> <br/>
                       </li>

                   </ol>
                   <Button variant='primary' onClick={()=>{
                       window.scrollTo(0, 0);
                       this.setState({
                         tutorial: false
                       });
                     }}>HomePage</Button>
                 </Col>
               </Row>
            </div>

          </Container>
        </div>
      );
    }
    return(
      <>

      <div className="header bg-gradient-info py-7 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
               <Row className="justify-content-center">
                 <Col lg="5" md="6">
                   <h1 className="text-white">Welcome!</h1>
                   <p className="text-lead text-light">
                     Start mounting your decentralized career or artist portfolio now
                   </p>
                 </Col>
               </Row>
            </div>
            <div className="header-body text-center mb-7">
               <Row className="justify-content-center">
                 <Col lg="5" md="6">
                   <h1 className="text-white">Import data</h1>
                   <p className="text-lead text-light">
                     Import data from others websites and keep data with yourself to use it in the way you want
                   </p>
                 </Col>
               </Row>
            </div>
            <div className="header-body text-center mb-7">
               <Row className="justify-content-center">
                 <Col lg={4}>
                   <h1 className="text-white">Decentralized storage</h1>
                   <p className="text-lead text-light">
                     Everything is stored in <a href='https://ipfs.io' target='_blank' title='Interplanetary File System'>IPFS</a> using <a href='https://orbitdb.org/' target='_blank' title='OrbitDB'>OrbitDB</a> and linked to your decentralized identity thanks to <a href="https://3box.com" target='_blank' title='3Box'>3Box</a>
                   </p>
                 </Col>
                 <Col lg={4}>
                   <h1 className="text-white">Share same data in multiple dapps</h1>
                   <p className="text-lead text-light">
                     Every dapp that uses 3box can request same data that you input here!
                   </p>
                 </Col>
                 <Col lg={4}>
                   <h1 className="text-white">Receive jobs offers</h1>
                   <p className="text-lead text-light">
                     Talk directly with employers with no middleman! No fees to use it for both parties!
                   </p>
                 </Col>
               </Row>
             </div>
             <div className="header-body text-center mb-7">
               <Row className="justify-content-center">
                 <Col lg={6}>
                   <h1 className="text-white">How to use it?</h1>
                   <p className="text-lead text-light">
                    Step by step on how to use DecentralizedPortfolio
                   </p>
                   <Button variant="primary" onClick={()=>{
                     window.scrollTo(0, 0);
                     this.setState({
                       tutorial: true
                     });
                   }}>Tutorial</Button>

                 </Col>
               </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
             xmlns="http://www.w3.org/2000/svg"
             preserveAspectRatio="none"
             version="1.1"
             viewBox="0 0 2560 100"
             x="0"
             y="0"
            >
             <polygon
               className="fill-default"
               points="2560 0 2560 100 0 100"
             />
            </svg>
          </div>
      </div>
      </>
    )
  }
}
export default Home;
