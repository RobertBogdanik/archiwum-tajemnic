import axios from 'axios'
import React from 'react'
class ComplaintList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: true,
            error: false,
            succes: false,
            userData: {PID: undefined, CID: undefined},
            result: {
                Login: '',
                Email: '',
                Password: '',
                Firstname: '',
                Lastname: ''
            }
        }
        this.changeValue = this.changeValue.bind(this)
        this.sendForm = this.sendForm.bind(this)
    }

    async componentDidMount(){
        this.setState({userData: await this.props.state.userData})
        let result = await axios.get('http://localhost:8082/v1/1/accountinfo', {
            params: { 
                API: "ABC",
                CID: this.state.userData.CID,
                PID: this.state.userData.PID,
            } 
        })

        this.setState({loading: false})
        var res = result.data
        res.Password=''
        if(result.data!=="e"){ this.setState({result: res}) }
        else{ this.setState({error: true}) }
    }

    changeValue(e){
        var res = this.state.result
        switch(e.target.name){
            case "Login":
                res.Login=e.target.value
                break;
            case "Email":
                res.Email=e.target.value
                break;
            case "Password":
                res.Password=e.target.value
                break;
            case "Firstname":
                res.Firstname=e.target.value
                break;
            case "Lastname":
                res.Lastname=e.target.value
                break;
            default:
        }
        this.setState({result: res})
    }

    async sendForm(){
        this.setState({error: false})
        this.setState({succes: false})
        this.setState({loading: true})

        let resp = await axios.get('http://localhost:8082/v1/1/updateaccount', {
            params: { 
                API: "ABC",
                CID: this.state.userData.CID,
                PID: this.state.userData.PID,
                Login: this.state.result.Login,
                Email: this.state.result.Email,
                Password: this.state.result.Password,
                Firstname: this.state.result.Firstname,
                Lastname: this.state.result.Lastname
            } 
        })
        if(resp.data!=="e"){
            this.setState({userData: await this.props.state.userData})
            let result = await axios.get('http://localhost:8082/v1/1/accountinfo', {
                params: { 
                    API: "ABC",
                    CID: this.state.userData.CID,
                    PID: this.state.userData.PID,
                } 
            })

            this.setState({loading: false})
            var res = result.data
            res.Password=''
            if(result.data!=="e"){ this.setState({result: res}); this.setState({succes: true}) }
            else{ this.setState({error: true}) }
        }else{ this.setState({error: true}); this.setState({loading: false}); }

        this.props.refreshUserData()
    }
    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Aktualne konto</h6>
                        </div>
                        {this.state.loading ? <div className="dot-flashing me-5  align-items-stretch"></div> : ""}
                        {this.state.error ? <img src="https://img.icons8.com/fluency/30/000000/error.png" alt="" /> : ""}
                        {this.state.succes ? <img src="https://img.icons8.com/fluency/30/000000/ok.png" alt="" /> : ""}
                    </div>
                </div>
                <div className="card-body overflow-auto text-center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Login</th>
                                <th>Email</th>
                                <th>Hasło</th>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input value={this.state.result.Login} onChange={this.changeValue} name="Login" className="form-control input" /></td>
                                <td><input value={this.state.result.Email} onChange={this.changeValue} name="Email" className="form-control input" /></td>
                                <td><input value={this.state.result.Password} onChange={this.changeValue} name="Password" placeholder="***************************************" className="form-control input" /></td>
                                <td><input value={this.state.result.Firstname} onChange={this.changeValue} name="Firstname" className="form-control input" /></td>
                                <td><input value={this.state.result.Lastname} onChange={this.changeValue} name="Lastname" className="form-control input" /></td>
                                <td><button className="btn btn-primary button" onClick={this.sendForm}>Aktualizuj</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ComplaintList