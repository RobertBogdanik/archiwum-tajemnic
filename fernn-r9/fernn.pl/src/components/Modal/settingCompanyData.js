import axios from 'axios'
import React from 'react'

class SettingCompanyData extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            userData: {PID: undefined, CID: undefined},
            Name: '',
            NIP: '',
            Email: '',
            Phone: '',
            Adress: ''
        }
        this.changeValue = this.changeValue.bind(this)
        this.save = this.save.bind(this)
    }

    async componentDidMount(){
        this.setState({userData: await this.props.state.userData})
        this.setState({loading: true})
        const result = await axios.get('http://localhost:8082/v1/1/copmanydata', {
            params: {
                API: 'ABC',
                PID: this.state.userData.PID,
                CID: this.state.userData.CID
            }
        })

        this.setState({loading: false})
        if(result.data!=="e"){
            this.setState({Name: result.data.Name})
            this.setState({NIP: result.data.NIP})
            this.setState({Email: result.data.Email})
            this.setState({Phone: result.data.Phone})
            this.setState({Adress: result.data.Adress})
        }else{
            this.setState({error: true})
        }
    }

    changeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }

    async save(){
        const result = await axios.get('http://localhost:8082/v1/1/editcompany', {
            params: {
                API: 'ABC',
                PID: this.state.userData.PID,
                CID: this.state.userData.CID,
                Name: this.state.Name,
                NIP: this.state.NIP,
                Email: this.state.Email,
                Phone: this.state.Phone,
                Adress: this.state.Adress,
                Section: 1
            }
        })

        if(result.data!=="e"){ this.setState({succes: true}) }
        else{ this.setState({error: true}) }
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Dane firmy</h6>
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
                                <th>Nazwa firmy</th>
                                <th>NIP</th>
                                <th>Email</th>
                                <th>Telefon</th>
                                <th>Adres</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" value={this.state.Name}   onChange={this.changeValue} className="form-control input" name="Name" /></td>
                                <td><input type="text" value={this.state.NIP}    onChange={this.changeValue} className="form-control input" name="NIP" /></td>
                                <td><input type="email" value={this.state.Email} onChange={this.changeValue} className="form-control input" name="Email" /></td>
                                <td><input type="tel" value={this.state.Phone}   onChange={this.changeValue} className="form-control input" name="Phone" /></td>
                                <td><input type="text" value={this.state.Adress} onChange={this.changeValue} className="form-control input" name="Adress" /></td>
                                <td>
                                    <button className="btn btn-primary button form-control" onClick={this.save}>Aktualizuj</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default SettingCompanyData