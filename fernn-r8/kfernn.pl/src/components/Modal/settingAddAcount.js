import axios from 'axios'
import React from 'react'
// import cookie from 'react-cookies'
// import { ProgressBar } from "react-bootstrap"

class ComplaintList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            sectionsList: [],
            userData: {PID: undefined, CID: undefined},
            Login: '',
            Email: '',
            Password: '',
            Firstname: '',
            Lastname: '',
            permission: 0,
            section: -1,
            BoolSection: false
        }
        this.changeSection = this.changeSection.bind(this)
        this.changePermission = this.changePermission.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.addUser = this.addUser.bind(this)
    }

    async componentDidMount(){
        this.setState({userData: await this.props.state.userData})
        let response = await axios.get('http://localhost:8082/v1/1/sectionslist', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID,
                PID: this.state.userData.PID
            }
        })
        this.setState({section: response.data[0]._ID})
        this.setState({sectionsList: response.data})
    }
    
    changeSection(e){
        this.setState({section: e.target.value})
    }
    
    changePermission(e){
        this.setState({permission: e.target.value})
        if(e.target.value==="1"){ this.setState({BoolSection: true}) }
        else{ this.setState({BoolSection: false}) }
    }

    changeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }

    async addUser(){
        const response = await axios.get('http://localhost:8082/v1/1/addaccounts', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID,
                PID: this.state.userData.PID,
                Login: this.state.Login,
                Email: this.state.Email,
                Password: this.state.Password,
                Firstname: this.state.Firstname,
                Lastname: this.state.Lastname,
                permission: this.state.permission,
                section: this.state.section
            }
        }) 
        if(response.data==="ok"){
            this.setState({succes: true})
            this.props.setParameters("refracheAccountsList", true)
        }else{
            this.setState({error: true})
        }
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Dodaj konto</h6>
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
                                <th>Uprawnienia</th>
                                <th>Domyślny dział</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" value={this.state.Login} onChange={this.changeValue} className="form-control input" name="Login" /></td>
                                <td><input type="text" value={this.state.Email} onChange={this.changeValue} className="form-control input" name="Email" /></td>
                                <td><input type="text" value={this.state.Password} onChange={this.changeValue} className="form-control input" name="Password" /></td>
                                <td><input type="text" value={this.state.Firstname} onChange={this.changeValue} className="form-control input" name="Firstname" /></td>
                                <td><input type="text" value={this.state.Lastname} onChange={this.changeValue} className="form-control input" name="Lastname" /></td>
                                <td>
                                    <select className="form-select form-control select" name="permissions" onChange={this.changePermission}>
                                        <option value={0}>Pracownik</option>
                                        <option value={1}>Administrator</option>
                                    </select>
                                </td>
                                <td>
                                    <select disabled={this.state.BoolSection} className="form-select form-control select" name="section" onChange={this.changeSection}>
                                        {this.state.sectionsList.map(item => (
                                            <option value={item._ID} key={item._ID}>{item.Name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button className="btn btn-primary button form-control" onClick={this.addUser}>Dodaj</button>
                                    {/* <input type="submit" class="btn btn-primary button form-control" value="Dodaj" /> */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ComplaintList