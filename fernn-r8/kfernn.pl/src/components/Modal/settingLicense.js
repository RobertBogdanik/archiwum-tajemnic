import axios from 'axios'
import React from 'react'

class SettingCompanyLicense extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            userData: {PID: undefined, CID: undefined},
            Plan: {Actual: '', Other: [], First: ''},
            ExtensionTime: '',
            AccountsQuality: '',
            AttachmentsQuality: '',
            Notyfication: false,
            Statistic: false,
            Other: ''
        }
        this.changeValue = this.changeValue.bind(this)
        this.save = this.save.bind(this)
    }

    changeValue(e){
        if(e.target.name==="Plan"){
            var plan = this.state.Plan
            plan.Other.push(plan.Actual)
            plan.Actual = e.target.value
            
            if(plan.Other.includes(e.target.value)){
                plan.Other.splice(plan.Other.indexOf(e.target.value), 1)
            }
            this.setState({Plan: plan})
            if(this.state.Plan.Actual==="Custom"){ this.setState({DisplayCustom: true}) }
            else{ this.setState({DisplayCustom: false}) }
        }else{
            if(e.target.name==="Notyfication" || e.target.name==="Statistic"){
                if( e.target.value==="false"){ this.setState({[e.target.name]: true}) }
                else{ this.setState({[e.target.name]: false}) }
            }else{
                this.setState({[e.target.name]: e.target.value})
            }
        }
    }

    async componentDidMount(){
        this.setState({loading: true})
        this.setState({userData: await this.props.state.userData})

        const result = await axios.get('http://localhost:8082/v1/1/getactualplan', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID
            }
        })
        this.setState({Plan: result.data})
        this.setState({loading: false})
    }

    async save(){
        this.setState({loading: true})
        this.setState({succes: false})
        this.setState({error: false})

        const result = await axios.get('http://localhost:8082/v1/1/extensionsubscription', {
            params: {
                API: "ABC",
                PID: this.state.userData.PID,
                CID: this.state.userData.CID,
                Plan: this.state.Plan.Actual,
                ExtensionTime: this.state.ExtensionTime,
                AccountsQuality: this.state.AccountsQuality,
                AttachmentsQuality:this.state.AttachmentsQuality,
                Notyfication: this.state.Notyfication,
                Statistic: this.state.Statistic,
                Other: this.state.Other
            }
        })
        
        this.setState({loading: false})
        if(result.data==="ok"){ this.setState({succes: true}) }
        else{ this.setState({error: true}) }
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Przedłuż licencję</h6>
                        </div>
                        {this.state.loading ? <div className="dot-flashing me-5  align-items-stretch"></div> : ""}
                        {this.state.error ? <img src="https://img.icons8.com/fluency/30/000000/error.png" alt="" /> : ""}
                        {this.state.succes ? <img src="https://img.icons8.com/fluency/30/000000/ok.png" alt="" /> : ""}
                    </div>
                </div>
                <div className="card-body overflow-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Plan</th>
                                <th>Okres przedłużenia</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select name="Plan" onChange={this.changeValue} className="form-select form-select-sm select select col-12" value={this.state.Plan.Actual}>
                                        <option selected={true}>{this.state.Plan.Actual}</option>
                                        {this.state.Plan.Other.map((e, index) => (
                                            <option key={index}>{e}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select className="form-select form-select-sm select select" name="ExtensionTime" onChange={this.changeValue}>
                                        <option selected>1 rok</option>
                                        <option>2 lata</option>
                                        <option>3 lata</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="btn btn-primary button col-12" onClick={this.save}>Wyślij zgłoszenie</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {this.state.DisplayCustom===true ? (
                        <div className="mt-3 m-auto">
                            <table className="m-auto">
                                <tbody>
                                    <tr>
                                        <th>Ilośc kont</th>
                                        <td className="ps-3"><input type="number" value={this.state.AccountsQuality} onChange={this.changeValue} className="form-control input" name="AccountsQuality" /></td>
                                    </tr>
                                    <tr>
                                        <th>Ilośc załączników na reklamację</th>
                                        <td className="ps-3"><input type="number" value={this.state.AttachmentsQuality} onChange={this.changeValue} className="form-control input" name="AttachmentsQuality" /></td>
                                    </tr>
                                    <tr>
                                        <th>Opcje dodatkowe</th>
                                        <td className="ps-3">
                                            <div className="switch">
                                                <div className="form-check form-switch">
                                                    <label className="form-check-label">
                                                        <input className="form-check-input" value={this.state.Notyfication} onChange={this.changeValue} type="checkbox" name="Notyfication" />
                                                        Powiadomienia dla klienta
                                                    </label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <label className="form-check-label">
                                                        <input className="form-check-input" value={this.state.Statistic} onChange={this.changeValue} type="checkbox" name="Statistic" />                                                              
                                                        Dostęp do raportów
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Inne dostosowania</th>
                                        <td className="ps-3"><textarea className="form-control" value={this.state.Other} onChange={this.changeValue}  name="Other"></textarea></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (<div></div>)}
                </div>
            </div>
        )
    }
}

export default SettingCompanyLicense