import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'

// import '../System/Login.css'

class Login extends React.Component{
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
        PL: ["Witamy!", "Wpisz Email lub login", "Błędny login lub hasło", "Hasło", "Błędne hasło lub login", "Login", "Zapomniałeś hasła?", "Powrót"]
      }
    }
    this.ChangeValue = this.ChangeValue.bind(this);
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

  ChangeValue(event){
    var name = event.target.name
    this.setState({[name]: event.target.value});
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
      <div>
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image">
                    <img src="/Img/dog1.jpg" alt="" className="a" />
                    <img src="/Img/dog2.jpg" alt="" className="b" />
                    <img src="/Img/dog3.jpg" alt="" className="c" />
                    <img src="/Img/dog4.jpg" alt="" className="d" />
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">{this.state.language[0]}</h1>
                      </div>
                      <form className="user text-center">
                        <div className="form-group">
                          <input type="text" className="form-control form-control-user" name="login" placeholder={this.state.language[1]} autoComplete="username" value={this.state.login} onChange={this.ChangeValue} />
                          {this.state.loginError}
                        </div>
                        <div className="form-group">
                          <input type="password" className="form-control form-control-user" name="password" placeholder={this.state.language[3]} autoComplete="current-password" value={this.state.password} onChange={this.ChangeValue} />
                          {this.state.passwordError}
                        </div>
                        <button type="button"  onClick={this.GetLoginInfo} className="btn btn-outline-primary">{this.state.language[5]}</button>
                      </form>
                      <hr />
                      <div className="text-center">
                        <a className="small" href="/login/forgotpassword">{this.state.language[6]}</a><br />
                        <a className="small" href="/"> &#x3c;&#x2014; {this.state.language[7]}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <script>
          {
            document.querySelector("body").style.backgroundColor="#4e73df"
          }{
            document.querySelector("body").style.overflow="hidden"
          }
        </script>
      </div>
    )
  }
}

export default Login;
