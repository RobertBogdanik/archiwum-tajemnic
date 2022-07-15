import React from 'react'
import axios from 'axios'
// import cookie from 'react-cookies'

class AddDelivery extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userData: {Attachments: undefined, CID: undefined, PID: undefined},
            addSteps: [], 
            RID: undefined, 
            Code: undefined,
            BoolManufacterInfo: true,
            Curier: {Curier: null}
        }
        this.skip = this.skip.bind(this)
    }

    async componentDidMount(){
        this.setState({userData: await this.props.state.userData})
        this.setState({addSteps: await this.props.state.AddSteps})
        this.setState({RID: await this.props.state.RID})
        this.setState({Code: await this.props.state.Code})

        let manufacterinfo = await axios.get('http://localhost:8082/v1/1/manufacterinfo', {
            params: { 
                API: "ABC",
                RID: this.state.RID,
                CID: this.state.userData.CID
            }
        });

        this.setState({BoolManufacterInfo: (manufacterinfo.data.length === 1 ? true : false)})
        this.setState({Curier: manufacterinfo.data[0]})
    }

    skip(){
        console.log("this.state.addSteps")
        console.log(this.state)
        // cookie.save("AddSteps", this.state.addSteps, {maxAge: 30})
        // cookie.save("RID", this.state.RID, {maxAge: 30})
        // cookie.save("Code", this.state.Code, {maxAge: 30})
        this.props.setParameters("AddSteps", this.state.addSteps)
        this.props.setParameters("RID", this.state.RID)
        this.props.setParameters("Code", this.state.Code)
        this.props.navChangePosition(5)
    }

    render(){
        return(
            <div>
                <div className="card shadow col-11 mt-3 m-auto mb-5">
                    <div className="card-header py-3">
                        <div className="d-flex justify-content-between align-items-stretch flex-fill">
                            <h6 className="m-0 font-weight-bold text-primary">Dodawanie reklamacji</h6>
                            <h6 className="m-0 font-weight-bold text-primary">4 z 5</h6>
                        </div>
                    </div>
                    <div className="card-body m-0 overflow-auto">
                        {(this.state.BoolManufacterInfo) && (this.state.Curier.Curier!==null) ? (
                            <strong>
                                <a href={this.state.Curier.Curier} target="_blank" rel="noreferrer" className="link-primary">
                                    Strona kuriera
                                </a><br /><br />
                            </strong>
                        ) : (
                            <div className="alert alert-warning" role="alert">
                                Dla wybranej firmy niezdefiniowano sposób dostawy.
                            </div>
                        )}
                        <button className="btn btn-outline-primary" onClick={this.skip}>Dalej</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddDelivery