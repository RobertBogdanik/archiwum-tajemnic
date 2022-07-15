import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import { Link } from 'react-router-dom'

import Zgloszone from './extension/zgloszone'
import Przedlurzenia from './extension/przedlurzenia'
import Dodatkowe from './extension/dodatkowe'
import ZmianaPlanu from './extension/zminaplanu'
import FirmyAuto from './extension/autofirmy'

import NewMessage from './extension/newmessage'

import Company from './extension/Copmpany'

class Facilities extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            login: "",
            password: "",
            language: [],
            allLanguage: {
                EN: ["", "", "", "", "", "", "", ""],
                PL: [""]
            },
            userData: {_ID: undefined, Firstname: '', Lastname: ''},
            listafirm: [],
            search: "234",
            selectedCompant: {},
            todo: {},
            actual: 0,
            start: 0
        }
        this.getLanguage = this.getLanguage.bind(this)
        this.getData = this.getData.bind(this)
        this.changeSearch = this.changeSearch.bind(this)
        this.selectSearch = this.selectSearch.bind(this)
    }
    getLanguage(code){
      switch (code){
        case "PL":
          this.setState({"language": this.state.allLanguage.PL})
          break;
        default:
          this.setState({"language": this.state.allLanguage.EN})
          break;
      }
    }
    async componentDidMount(){
        const cc = await cookie.load("CountryCode")
        if(cc===undefined){
            this.setState({"language": this.state.allLanguage.EN})
            axios.get('https://ipapi.co/json/').then((response) => { 
                this.getLanguage(response.data.country_code) 
            })
        }else{
            this.getLanguage(cc)
        }

        this.getData()
        this.setState({ start: Date.now() })
        setInterval(() => this.setState({ actual: Date.now() }), 1000);
    }
    async componentDidUpdate() {
        if((this.state.actual - this.state.start) > 10000){
            this.setState({start: this.state.actual})
            this.getData()
        }
    }
    async getData(){
        console.log("sync");
        axios.get('http://localhost:8081/v1/1/listafirm').then((res) => {
            this.setState({listafirm: res.data})
        })
        axios.get('http://localhost:8081/v1/1/todo').then((res) => {
            this.setState({todo: res.data})
        })
    }
    render(){
        if(cookie.load("userData")!==undefined && cookie.load("userData")._ID!==undefined && cookie.load("userData").Firstname!==undefined && cookie.load("userData").Lastname!==undefined){
            return this.htmlStructure()
        }else{
            window.location.href = '/'; 
            return null;
        }
    }
    changeSearch(el){
        this.setState({search: el.target.value})
    }
    async selectSearch(){
        for (const it of this.state.listafirm) {
            if(it.Name === await this.state.search){
                this.setState({selectedCompant: await it})
            }
        }
    }
    htmlStructure(){
        return  (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to={"/"}>Navbar</Link>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item" key={0}>
                                    <Link  className="nav-link active" aria-current="page" to={"/"}>Home</Link >
                                </li>
                            </ul>
                            <form className="d-flex">
                                <input className="form-control me-2" type="text" list="listafirm" placeholder="Nazwa firmy" aria-label="Search" onChange={this.changeSearch} value={this.state.search} />
                                <datalist id="listafirm">
                                    {this.state.listafirm.map((el, i) => (
                                        <option key={i}>{el.Name}</option>
                                    ))}
                                </datalist>
                                <button onClick={this.selectSearch} data-bs-toggle="modal" style={{width: "100px"}} className="position-relative btn btn-primary" href="#edycja" type="button">Szukaj</button>
                            </form>
                        </div>
                    </div>
                </nav>
                <div className="row col-12">
                    <div className="col-12 col-md-6 mt-5">
                        <div className="m-auto col-11 blok">
                            <h1>Licencje</h1>
                            <div data-bs-toggle="modal" style={{width: "100px"}} className="position-relative" href="#zgloszenia"  role="button">
                                Zgłoszenia
                                <span className="position-absolute translate-middle badge rounded-pill" style={{left: "90px", top: "7px"}}>
                                    <span className="badge rounded-pill bg-primary">{this.state.todo["1"]}</span>
                                </span>
                            </div>
                            <div data-bs-toggle="modal" style={{width: "100px"}} className="position-relative" href="#przedlurzenia" role="button">
                                Przedłurzanie
                                <span className="position-absolute translate-middle badge rounded-pill" style={{left: "110px", top: "7px"}}>
                                    <span className="badge rounded-pill bg-primary">{this.state.todo["2"]}</span>
                                </span>
                            </div>
                            <div data-bs-toggle="modal" style={{width: "190px"}} className="position-relative" href={"#dodatkowereklamacje"} role="button">
                                Dodatkowe reklamacje
                                <span className="position-absolute translate-middle badge rounded-pill" style={{left: "170px", top: "7px"}}>
                                    <span className="badge rounded-pill bg-primary">{this.state.todo["3"]}</span>
                                </span>
                            </div>
                            <div data-bs-toggle="modal" style={{width: "190px"}} className="position-relative" href={"#zmianaplanu"} role="button">
                                Zmaiana planu
                                <span className="position-absolute translate-middle badge rounded-pill" style={{left: "120px", top: "7px"}}>
                                    <span className="badge rounded-pill bg-primary">{this.state.todo["4"]}</span>
                                </span>
                            </div>
                            <div data-bs-toggle="modal" style={{width: "190px"}} className="position-relative" href={"#firmyauto"} role="button">
                                Firmy auto
                                <span className="position-absolute translate-middle badge rounded-pill" style={{left: "90px", top: "7px"}}>
                                    <span className="badge rounded-pill bg-primary">{this.state.todo["5"]}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mt-5">
                        <div className="m-auto col-11 blok">
                            <h1>Wiadomości</h1>
                            <div data-bs-toggle="modal" style={{width: "190px"}} className="position-relative" href={"#nowawiadomosc"} role="button">
                                Nowa
                            </div>
                        </div>
                    </div>
                </div>


                <Zgloszone state={this.state} refresh={this.getData} />
                <Przedlurzenia state={this.state} refresh={this.getData} />
                <Dodatkowe state={this.state} refresh={this.getData} />
                <ZmianaPlanu state={this.state} refresh={this.getData} />
                <FirmyAuto state={this.state} refresh={this.getData.bind(this)} />
                
                <NewMessage state={this.state} refresh={this.getData} />

                <Company state={this.state} refresh={this.getData} />
            </div>
        )
    }
}

export default Facilities