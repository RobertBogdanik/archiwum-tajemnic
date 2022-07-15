import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'

import '../System/Login.css'

class NotFound extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      loginError: <p></p>,
      passwordError: <p></p>,
      language: [],
      allLanguage: {
        EN: ["", "", "", "", "", "", "", ""],
        PL: ["Strona niezostała znaleziona", "Wygląda na to, że znalazłeś usterkę w systemie lub podałeś nieprawidłowy adres strony", "Powrót na stronę główną"]
      }
    }
    this.GetLoginInfo = this.GetLoginInfo.bind(this);
  }
  async GetLoginInfo(){
    let userData = await axios.get('http://localhost:8082/v1/1/login', {
      params: {
          API: "ABC",
          login: this.state.login,
          password: this.state.password
      }
    });
    cookie.save('userData', userData.data, { path: '/', maxAge: 21600, secure: true })


    if(userData.data.Authorization){
      window.location.href = '/a'; 
      return null;
    }else{
      this.setState({"loginError": <p style={{color: "red", textAlign: "left", fontSize: "12px"}}>{this.state.language[2]}</p>})
      this.setState({"passwordError": <p style={{color: "red", textAlign: "left", fontSize: "12px"}}>{this.state.language[4]}</p>})
    }
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
      axios.get('https://ipapi.co/json/')
           .then((response) => { this.getLanguage(response.data.country_code) })
           .catch((error) => { console.log(error) })
    }else{
      this.getLanguage(cc)
    }
  }
  render(){
    return (
        <div class="container-fluid">
            <img src="/Img/logo.png" className="mb-5" alt="" style={{maxWidth: "300px"}} width="30%" />
            <div class="text-center">
                <div class="error mx-auto" data-text="404">404</div>
                <p class="lead text-gray-800 mb-5">{this.state.language[0]}</p>
                <p class="mb-3 m-auto" style={{maxWidth: "250px"}}>{this.state.language[1]}</p>
                <a href="/" className="link-primary">← {this.state.language[2]}</a>
            </div>

        </div>
    )
  }
}

export default NotFound;
