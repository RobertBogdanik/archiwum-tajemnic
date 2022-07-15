import axios from 'axios'
import React from 'react'

class NewMessage extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            userData: {PID: undefined, CID: undefined},
            subscribtion: []
        }
    }

    async componentDidMount(){
        this.setState({loading: true})
        this.setState({userData: await this.props.state.userData})

        const result = await axios.get('http://localhost:8082/v1/1/getsubscription', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID
            }
        })
        this.setState({loading: false})
        if(result.data!=="e"){
            this.setState({subscribtion: result.data})
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
                                <th>Od</th>
                                <th>Do</th>
                                <th>Plan</th>
                                <th>Ilość kont</th>
                                <th>Raporty</th>
                                <th>Ilość załączników</th>
                                <th>Powiadomienia dla klienta</th>
                                <th>Ilość reklamacji</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.subscribtion.map((e, index) => ( 
                                <tr key={index} style={e.Actual ? {backgroundColor: "rgba(221, 221, 221, 0.507)"} : {}}>
                                    <td><input className="form-control" value={e.From} disabled={true} /></td>
                                    <td><input className="form-control" value={e.To} disabled={true} /></td>
                                    <td><input className="form-control" value={e.Plan} disabled={true} /></td>
                                    <td><input className="form-control" value={e.AccountsQuality} disabled={true} /></td>
                                    <td><input className="form-control" value={e.Statistic===true ? "Tak" : "Nie"} disabled={true} /></td>
                                    <td><input className="form-control" value={e.AttachmentsQuality} disabled={true} /></td>
                                    <td><input className="form-control" value={e.Notyfication===true ? "Tak" : "Nie"} disabled={true} /></td>
                                    <td><input className="form-control" value={e.ComplaintsQuality} disabled={true} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default NewMessage