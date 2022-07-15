import axios from 'axios'
import React from 'react'

class SettingCompanyAddComplaint extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            userData: {PID: undefined, CID: undefined},
            subscribtion: [],
            actualSubscription: '',
            addComplaint: ''
        }
        this.changeValue = this.changeValue.bind(this)
        this.save = this.save.bind(this)
    }

    async save(){
        this.setState({succes: false})
        this.setState({error: false})
        this.setState({loading: true})
        let SID
        for (const iterator of this.state.subscribtion) {
            if(iterator.From===this.state.actualSubscription.split(" - ")[0] && iterator.To===this.state.actualSubscription.split(" - ")[1]){ SID = iterator._ID }
        }

        const result = await axios.get('http://localhost:8082/v1/1/addcomplaint', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID,
                SID: SID,
                addComplaint: this.state.addComplaint
            }
        })

        this.setState({loading: false})
        if(result.data==="ok"){this.setState({ succes: true })}
        else{ this.setState({ error: true })}
    }   
    changeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }

    async componentDidMount(){
        this.setState({loading: true})
        this.setState({userData: await this.props.state.userData})

        const result = await axios.get('http://localhost:8082/v1/1/getfuturesubscription', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID
            }
        })

        this.setState({actualSubscription: result.data[0].From+" - "+result.data[0].To})
        this.setState({subscribtion: result.data})
        this.setState({loading: false})
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Dodaj paczkę reklamacji</h6>
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
                                <th>Okres rozliczeniowy do którego zostanie dodana paczka</th>
                                <th>Ilośc dodatkowych reklamacji</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select name="actualSubscription" onChange={this.changeValue} className="form-select align-middle mt-2 select select col-12">
                                        {this.state.subscribtion.map((e, index) => (
                                            <option key={index}>{e.From} - {e.To}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input type="number" value={this.state.addComplaint} onChange={this.changeValue} class="form-control input" name="addComplaint" />
                                </td>
                                <td>
                                    <button className="btn btn-primary button col-12" onClick={this.save}>Wyślij zgłoszenie</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default SettingCompanyAddComplaint