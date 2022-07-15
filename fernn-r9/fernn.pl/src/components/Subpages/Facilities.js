import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
import { Redirect } from "react-router";

import '../../css/zapl.css'

import Nav from '../Modal/nav'
import Add from '../Modal/add'
import AddSelectModel from '../Modal/addSelectModel'
import AddUploadAttachment from '../Modal/addUploadAttachment'
import AddDelivery from '../Modal/addDelivery'
import AddConfirm from '../Modal/addConfirm'

import ComplaintList from '../Modal/complaintList'
import ComplaintDetails from '../Modal/complaintDetails'
import ComplaintAddModel from '../Modal/complaintAddModel'
import ComplaintAttachments from '../Modal/complaintAttachments'

import NewMessage from '../Modal/newMessage'
// import Message from './components/Modal/message'

// import Statistic from './components/Modal/statistic'
// import Listings from './components/Modal/listings'
// import Raports from './components/Modal/raports'

import SettingAccount from '../Modal/settingAccount'
import SettingThumbnail from '../Modal/settingThumbnail'
// import SettingDevice from './components/Modal/settingDevice'
import SettingAddAcount from '../Modal/settingAddAcount'
import SettingAccounts from '../Modal/settingAccounts'
import SettingCompanyData from '../Modal/settingCompanyData'
import SettingLogo from '../Modal/settingLogo'
import SettingCompanySection from '../Modal/settingCompanySection'
import SettingCompanyChangePlan from '../Modal/settingCompanyChangePlan'
import SettingLicense from '../Modal/settingLicense'
import SettingCompanyAddComplaint from '../Modal/settingCompanyAddComplaint'
import SettingSupscryption from '../Modal/settingSupscryption'

import SettingWorkerInSection from '../Modal/settingWorkerInSection'


class Facilities extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      language: [],
      allLanguage: {
        EN: ["", "", "", "", "", "", "", ""],
        PL: ["Home", "Dodaj reklamację", "Spis reklamacji", "Wszystkie", "Zgłoszone", "W realizacji", "Do odbioru", "Odebrane", "Statystyki i raporty", "Ustawienia", "Ustawienia konta", "Kontakt", "Wyloguj się", "Na pewno chcesz wyjść?", 'Kliknij "Wyloguj" jeśli chcesz wylogować się.', "Anuluj", "Wyloguj"]
      },
      actualLanguage: "PL",
      actualPage: 0,
      complaintListType: 0,
      pages: [
        {
          // 0
          Name: "Home",
          Nav: true,
          NewMessage: true,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 1
          Name: "Message",
          Nav: false,
          NewMessage: false,
          Message: true,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 2
          Name: "Add",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: true,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 3
          Name: "AddSelectModel",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: true,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 4
          Name: "AddUploadAttachment",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: true,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 5
          Name: "AddConfirm",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: true,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 6
          Name: "ComplaintList",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: true,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 7
          Name: "ComplaintDetails",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: true,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 8
          Name: "ComplaintAttachment",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: true,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 9
          Name: "Statistic",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: true,
          Raports: true,
          Listings: true,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 10
          Name: "Setting",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: true,
          SettingThumbnail: true,
          SettingDevice: true,
          SettingAddAcount: true,
          SettingAccounts: true,
          SettingCompanyData: true,
          SettingCompanyLogo: true,
          SettingCompanySection: true,
          SettingCompanyChangePlan: true,
          SettingCompanyLicense: true,
          SettingCompanyAddComplaint: true,
          SettingSupscryption: true
        }, {
          // 11
          Name: "AddDelivery",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddDelivery: true,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 12
          Name: "ComplaintAddModel",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAddModel: true,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false
        }, {
          // 13
          Name: "WorkerInSection",
          Nav: false,
          NewMessage: false,
          Message: false,
          Add: false,
          AddSelectModel: false,
          AddUploadAttachment: false,
          AddConfirm: false,
          ComplaintList: false,
          ComplaintDetails: false,
          ComplaintAddModel: false,
          ComplaintAttachment: false,
          Statistic: false,
          Raports: false,
          Listings: false,
          SettingAccount: false,
          SettingThumbnail: false,
          SettingDevice: false,
          SettingAddAcount: false,
          SettingAccounts: false,
          SettingCompanyData: false,
          SettingCompanyLogo: false,
          SettingCompanySection: false,
          SettingCompanyChangePlan: false,
          SettingCompanyLicense: false,
          SettingCompanyAddComplaint: false,
          SettingSupscryption: false,
          SettingWorkerInSection: true
        }
      ],
      userData: {}
    }
    this.logout = this.logout.bind(this)
    this.VerifyLogin = this.VerifyLogin.bind(this)
    this.setParameters = this.setParameters.bind(this)
    this.refreshUserData = this.refreshUserData.bind(this)
  }
  logout(){
    this.setState({userData: {}})
    cookie.remove("userData")
  }
  GeneratePage(){
    let c = (
    <div>
      {this.state.pages[this.state.actualPage].Nav ? <Nav state={this.state} navChangePosition={this.navChangePosition.bind(this)} navChangeComplaintListType={this.navChangeComplaintListType.bind(this)} /> : ''}
      {this.state.pages[this.state.actualPage].NewMessage ? <NewMessage state={this.state}/> : ''}
      {/* {this.state.pages[this.state.actualPage].Message ? <Message state={this.state}/> : ''} */}

      {this.state.pages[this.state.actualPage].Add ? <Add state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].AddSelectModel ? <AddSelectModel state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].AddUploadAttachment ? <AddUploadAttachment state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].AddDelivery ? <AddDelivery state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].AddConfirm ? <AddConfirm state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].ComplaintList ? <ComplaintList state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].ComplaintDetails ? <ComplaintDetails state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].ComplaintAddModel ? <ComplaintAddModel state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      {this.state.pages[this.state.actualPage].ComplaintAttachment ? <ComplaintAttachments state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} /> : ''}
      
      {/* {this.state.pages[this.state.actualPage].Statistic ? <Nav state={this.state}/> : ''} */}
      {/* {this.state.pages[this.state.actualPage].Raports ? <Nav state={this.state}/> : ''} */}
      {/* {this.state.pages[this.state.actualPage].Listings ? <Nav state={this.state}/> : ''} */}

      {this.state.pages[this.state.actualPage].SettingAccount ? <SettingAccount state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
      {this.state.pages[this.state.actualPage].SettingThumbnail ? <SettingThumbnail state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData}  /> : ''}
      {/* {this.state.pages[this.state.actualPage].SettingDevice ? <Nav state={this.state}/> : ''} */}
      {this.state.pages[this.state.actualPage].SettingAddAcount ? <SettingAddAcount state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
      {this.state.pages[this.state.actualPage].SettingAccounts ? <SettingAccounts state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
      {this.state.pages[this.state.actualPage].SettingCompanyData ? <SettingCompanyData state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
      {this.state.pages[this.state.actualPage].SettingCompanyLogo ? <SettingLogo state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
      {this.state.pages[this.state.actualPage].SettingCompanySection ? <SettingCompanySection state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
      {this.state.pages[this.state.actualPage].SettingCompanyChangePlan ? <SettingCompanyChangePlan state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
      {this.state.pages[this.state.actualPage].SettingCompanyLicense ? <SettingLicense state={this.state}/> : ''}
      {this.state.pages[this.state.actualPage].SettingCompanyAddComplaint ? <SettingCompanyAddComplaint state={this.state}/> : ''}
      {this.state.pages[this.state.actualPage].SettingSupscryption ? <SettingSupscryption state={this.state}/> : ''}
      {this.state.pages[this.state.actualPage].SettingWorkerInSection ? <SettingWorkerInSection state={this.state} navChangePosition={this.navChangePosition.bind(this)} setParameters={this.setParameters} refreshUserData={this.refreshUserData} /> : ''}
    </div>)
    return c
  }

  async VerifyLogin(PID, CID, Firstname){
    const res = await axios.get('http://localhost:8082/v1/1/varifylogin', {
        params: {
            API: "ABC",
            PID: PID,
            CID: CID,
            FirstName: Firstname
        }
    })
    
    if(res.data.Aut){ return true }
    else{ return true }
  }

  setParameters(name, value){
    this.setState({[name]: value})
  }

  getLanguage(code){
    this.setState({"actualLanguage": code})
    switch (code){
      case "PL":
        this.setState({"language": this.state.allLanguage.PL})
        break;
      default:
        this.setState({"language": this.state.allLanguage.EN})
        break;
    }
  }

  navChangeComplaintListType(a){
    this.setState({complaintListType: a})
  }

  navChangePosition = (position) => {
    this.setState({actualPage: position})
  }

  async componentDidMount(){
    let user = await cookie.load("userData")
    this.setState({userData: user})

    const cc = await cookie.load("CountryCode")
    if(cc===undefined){
      this.setState({"language": this.state.allLanguage.EN})
      axios.get('https://ipapi.co/json/')
           .then((response) => { this.getLanguage(response.data.country_code) })
           .catch((error) => { console.log(error) })
    }else{
      this.getLanguage(cc)
    }
  }

  async refreshUserData(){
    let result = await axios.get('http://localhost:8082/v1/1/relogin', {
      params: {
        API: "ABC",
        PID: this.state.userData.PID,
        CID: this.state.userData.CID
      }
    })
    
    this.setState({userData: await result.data})
  }

  render(){
    if(cookie.load("userData")!==undefined && cookie.load("userData").Authorization && this.VerifyLogin(cookie.load("userData").PID, cookie.load("userData").CID, cookie.load("userData").Firstname)){
      return this.htmlStructure()
    }else{
      window.location.href = '/login'; 
      return null;
    }
  }

  htmlStructure(){
    return (
      <div>
        <div className="LeftNav">
            <br/>
            <div className="LeftNavItem" onClick={() => this.navChangePosition(0)}>
                <div className="NavItem">
                    <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/home.png" alt=""/><br/>
                    {this.state.language[0]}
                </div>
            </div>
            <hr/>
            <div className="LeftNavActive" onClick={() => this.navChangePosition(2)}>
                <div className="NavItem">
                    <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/add-property.png" alt=""/><br/>
                    {this.state.language[1]}
                </div>
            </div>
            <hr/>
            <div className="LeftNavItem" onClick={() => {
                  this.setState({complaintListType: 0}); 
                  this.navChangePosition(6);
                }}>
                <div className="NavItem">
                    <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/data-sheet.png" alt=""/><br/>
                    {this.state.language[2]}
                </div>
            </div>
            <div className="PseudoLeftNavDropZone">
                <div className="LeftNavDropInvisible">
                    <div  onClick={() => {
                          this.setState({complaintListType: 0}); 
                          this.navChangePosition(6);
                        }}> 
                        <span className="LeftNavDropInvisible"></span>
                    </div>
                </div>
                <div className="LeftNavDrop">
                    <div className="LeftNavDropZone">    
                        <div onClick={() => {
                              this.setState({complaintListType: 0}); 
                              this.navChangePosition(6);
                            }}>
                            <span className="LeftNavDropItem">
                              {this.state.language[3]}
                            </span>
                        </div>
                        <div onClick={() => {
                              this.setState({complaintListType: 1}); 
                              this.navChangePosition(6);
                            }}>
                            <span className="LeftNavDropItem">
                              {this.state.language[4]}
                            </span>
                        </div>
                        <div onClick={() => {
                              this.setState({complaintListType: 2}); 
                              this.navChangePosition(6);
                            }}>
                            <span className="LeftNavDropItem">
                              {this.state.language[5]}
                            </span>
                        </div>
                        <div onClick={() => {
                              this.setState({complaintListType: 3}); 
                              this.navChangePosition(6);
                            }}>
                            <span className="LeftNavDropItem">
                              {this.state.language[6]}
                            </span>
                        </div>
                        <div onClick={() => {
                              this.setState({complaintListType: 4}); 
                              this.navChangePosition(6);
                            }}>
                            <span className="LeftNavDropItem">
                              {this.state.language[7]}
                            </span>
                        </div>                       
                    </div>
                </div>
            </div>
            <hr/>
            <div className="LeftNavItem" onClick={() => this.navChangePosition(9)}>
                <div className="NavItem">
                    <img src="https://img.icons8.com/material-rounded/24/ffffff/combo-chart.png" alt=""/><br/>
                    {this.state.language[8]}
                </div>
            </div>
            <hr/>
            <div className="LeftNavItem" onClick={() => this.navChangePosition(10)}>
                <div className="NavItem">
                    <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/settings.png" alt=""/><br/>
                    {this.state.language[9]}
                </div>
            </div>
        </div>
        <div> 
          <nav className="navbar navbars navbar-dark">
              <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="navbar-brand Logo  d-lg-block d-none">
                  <div onClick={() => this.navChangePosition(0)} className="Logo">
                      <h3>Fernn</h3>
                  </div>
              </div>

              <div className="TopNav">
                  <div className="TopNavItem" onClick={() => this.navChangePosition(0)}>
                      <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/home.png" alt="" className="TopNavIcon"/><br/>
                      <div className="NavItem">
                        {this.state.language[0]}
                      </div>
                  </div>
                  <div className="TopNavActive TopNavItem" onClick={() => this.navChangePosition(2)}>
                      <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/add-property.png" alt="" className="TopNavIcon"/><br/>
                      <div className="NavItem">
                        {this.state.language[1]}
                      </div>
                  </div>
                  <div className="TopNavItem" id="TopNavListButton"  onClick={() => {
                        this.setState({complaintListType: 0}); 
                        this.navChangePosition(6);
                      }}>
                      <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/data-sheet.png" alt="" className="TopNavIcon"/><br/>
                      <div className="NavItem">
                        {this.state.language[2]}
                      </div>
                  </div>
                  
                  <div className="PseudoTopNavNavDropZone">
                      <div className="TopNavNavDropInvisible">
                          <div onClick={() => {
                                this.setState({complaintListType: 0}); 
                                this.navChangePosition(6);
                              }}>
                              <span className="TopNavDropInvisible"></span>
                          </div>
                      </div>
                      <div className="TopNavDrop">
                          <div className="TopNavDropZone">    
                              <div onClick={() => {
                                    this.setState({complaintListType: 0}); 
                                    this.navChangePosition(6);
                                  }}>
                                  <span className="TopNavDropItem">
                                  </span>
                              </div>
                              <div onClick={() => {
                                    this.setState({complaintListType: 1}); 
                                    this.navChangePosition(6);
                                  }}>
                                  <span className="TopNavDropItem">
                                    {this.state.language[4]}
                                  </span>
                              </div>
                              <div onClick={() => {
                                    this.setState({complaintListType: 2}); 
                                    this.navChangePosition(6);
                                  }}>
                                  <span className="TopNavDropItem">
                                    {this.state.language[5]}
                                  </span>
                              </div>
                              <div onClick={() => {
                                    this.setState({complaintListType: 3}); 
                                    this.navChangePosition(6);
                                  }}>
                                  <span className="TopNavDropItem">
                                    {this.state.language[6]}
                                  </span>
                              </div>
                              <div onClick={() => {
                                    this.setState({complaintListType: 4}); 
                                    this.navChangePosition(6);
                                  }}>
                                  <span className="TopNavDropItem">
                                    {this.state.language[7]}
                                  </span>
                              </div>                       
                          </div>
                      </div>
                  </div>
                  <div className="TopNavItem" onClick={() => this.navChangePosition(9)}>
                      <img src="https://img.icons8.com/material-rounded/24/ffffff/combo-chart.png" alt="" className="TopNavIcon"/><br/>
                      <div className="NavItem">
                        {this.state.language[8]}
                      </div>
                  </div>
                  <div className="TopNavItem" onClick={() => this.navChangePosition(10)}>
                      <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/settings.png" alt="" className="TopNavIcon"/><br/>
                      <div className="NavItem">
                        {this.state.language[9]}
                      </div>
                  </div>
              </div>
              <div className="navbar-brand  no-arrow show">
                  <div id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    {this.state.userData.Firstname} {this.state.userData.Lastname} <img src={this.state.userData.Thumbnail} alt=""/>
                    
                  </div>
                  <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in MiniNav" aria-labelledby="userDropdown">
                      <div className="dropdown-item" onClick={() => this.navChangePosition(10)}>
                        {this.state.language[10]}
                      </div>
                      <div className="dropdown-item">
                        {this.state.language[11]}
                      </div>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-item"  data-toggle="modal" data-target="#logoutModal">
                        {this.state.language[12]}
                      </div>
                  </div>
              </div>

              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                  <ul className="navbar-nav" id="trescnav">
                      <li className="nav-item active">
                          <div className="nav-link active" onClick={() => this.navChangePosition(0)}>
                              <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/home.png" alt=""/> {this.state.language[0]}
                          </div>
                      </li>
                      <li className="nav-item">
                          <div className="nav-link" onClick={() => this.navChangePosition(2)}>
                              <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/add-property.png" alt=""/> {this.state.language[1]}
                          </div>
                      </li>
                      <li className="nav-item dropdown">
                          <div className="nav-link dropdown-toggle" onClick={() => { this.setState({complaintListType: 0}); this.navChangePosition(6); }} id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/data-sheet.png" alt="" /> {this.state.language[2]}
                          </div>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                              <div className="dropdown-item" onClick={() => { this.setState({complaintListType: 0}); this.navChangePosition(6); }}>{this.state.language[3]}</div>
                              <div className="dropdown-item" onClick={() => { this.setState({complaintListType: 1}); this.navChangePosition(6); }}>{this.state.language[4]}</div>
                              <div className="dropdown-item" onClick={() => { this.setState({complaintListType: 2}); this.navChangePosition(6); }}>{this.state.language[5]}</div>
                              <div className="dropdown-item" onClick={() => { this.setState({complaintListType: 3}); this.navChangePosition(6); }}>{this.state.language[6]}</div>
                              <div className="dropdown-item" onClick={() => { this.setState({complaintListType: 4}); this.navChangePosition(6); }}>{this.state.language[7]}</div>
                          </div>
                      </li>
                      <li className="nav-item ">
                          <div className="nav-link" onClick={() => this.navChangePosition(9)}>
                              <img src="https://img.icons8.com/material-rounded/24/ffffff/combo-chart.png" alt=""/> {this.state.language[8]}
                          </div>
                      </li>
                      <li className="nav-item ">
                          <div className="nav-link" onClick={() => this.navChangePosition(10)}>
                              <img src="https://img.icons8.com/fluent-systems-regular/24/ffffff/settings.png" alt=""/> {this.state.language[9]}
                          </div>
                      </li>
                  </ul>
            </div>
          </nav>
          <div id="TopPoint"></div>
          <div id="content" className="content">
            {this.GeneratePage()}
          </div>
          <div className="modal fade" id="logoutModal"  aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{this.state.language[13]}</h5>
                </div>
                <div className="modal-body">{this.state.language[14]}</div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" type="button" data-dismiss="modal">{this.state.language[15]}</button>
                    <div className="btn btn-danger" onClick={this.logout}>{this.state.language[16]}</div>
                    {/* <a className="btn btn-danger" href="/logout">{this.state.language[16]}</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Facilities;
