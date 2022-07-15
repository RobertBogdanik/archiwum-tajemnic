import React from 'react'
import axios from 'axios'
// import cookie from 'react-cookies'
// import { response } from "express";

class AddSelectModel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            RID: 0,
            Code: '',
            query: "",
            old: "",
            manufacter: "",
            manufacterold: "",
            Result: [],
            ManufacterArr: [],
            AddSteps: [],
            model: '',
            sku: '',
            error: true
        }

        this.addmodel = this.addmodel.bind(this)
        this.changeSKU = this.changeSKU.bind(this)
        this.changeModel = this.changeModel.bind(this)
        this.changeQueryValue = this.changeQueryValue.bind(this)
        this.changeManufacter = this.changeManufacter.bind(this)
        this.setManufacter = this.setManufacter.bind(this)
        this.selectModel = this.selectModel.bind(this)
        this.manufacterRespsnsive = this.manufacterRespsnsive.bind(this)
    }
    async addmodel(){
        const result = await axios.get('http://localhost:8082/v1/1/addcreatemodel', {
            params: {
                API: "ABC",
                CID: this.props.state.userData.CID,
                PID: this.props.state.userData.PID,
                RID: this.state.RID,
                Code: this.state.Code,
                nextSteps: this.state.AddSteps,
                Model: this.state.model,
                Manufacter: this.state.manufacter,
                SKU: this.state.sku
            }
        })

        this.props.setParameters("AddSteps", result.data.nextStep)
        this.props.setParameters("RID", result.data.RID)
        this.props.setParameters("Code", result.data.Code)

        result.data.nextStep.shift()
        this.props.navChangePosition(result.data.nextStep[0])
    }
    changeSKU(e){
        this.setState({sku: e.target.value})
    }
    changeModel(e){
        this.setState({model: e.target.value})
    }
    async componentDidUpdate() {
        if(this.state.old!==this.state.query){
            this.setState({old: this.state.query})
            let userData = await axios.get('http://localhost:8082/v1/1/searchmodels', {
                params: {
                    API: "ABC",
                    query: this.state.query,
                    session: '1'
                }
            });
            this.setState({Result: userData.data})
        }

        if(this.state.manufacterold!==this.state.manufacter){
            this.setState({manufacterold: this.state.manufacter})
            let userData = await axios.get('http://localhost:8082/v1/1/searchmanufacters', {
                params: {
                    API: "ABC",
                    query: this.state.manufacter
                }
            });
            this.setState({ManufacterArr: userData.data})
        }
        return true
    }

    async componentDidMount(){
        this.setState({"query": this.props.state.Query})
        this.setState({"RID": this.props.state.RID})
        this.setState({"Code": this.props.state.Code})
        this.setState({"AddSteps": this.props.state.AddSteps})
    }

    setManufacter(event){
        try {
            this.setState({"manufacter": event.target.parentNode.attributes[0].nodeValue})
        }
        catch(e){
            this.setState({"manufacter": event.target.attributes[0].nodeValue})
        }
    }

    changeManufacter(event){
        this.setState({"manufacter": event.target.value})
        return true
    }

    changeQueryValue(event){
        this.setState({"query": event.target.value})
    }

    manufacterRespsnsive(){
        try{
            var inputWidth = document.getElementById("manufacterinp").offsetWidth
            document.getElementById("manufacter").style.width = inputWidth+"px"
        }catch(e){ }
        setTimeout(() => {this.manufacterRespsnsive()}, 100)
    }

    async selectModel(event){
        let userData = await axios.get('http://localhost:8082/v1/1/add/2', {
            params: {
                API: "ABC",
                ID: event.target.value,
                RID: this.state.RID,
                Code: this.state.Code,
                nextSteps: this.state.AddSteps
            }
        });
        
        this.props.setParameters("AddSteps", userData.data.nextStep)
        this.props.setParameters("RID", userData.data.RID)
        this.props.setParameters("Code", userData.data.Code)

        userData.data.nextStep.shift()
        this.props.navChangePosition(userData.data.nextStep[0])
    }

    render(){
        this.manufacterRespsnsive()
        return(
            <div>
                <div className="card shadow col-11 mt-3 m-auto mb-5">
                    <div className="card-header py-3">
                        <div className="d-flex justify-content-between align-items-stretch flex-fill">
                            <h6 className="m-0 font-weight-bold text-primary">Dodawanie reklamacji</h6>
                            <div>
                                <h6 className="m-0 font-weight-bold text-primary">2 z 5</h6>
                                {this.state.error ? <img src="https://img.icons8.com/fluency/30/000000/error.png" alt="" /> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="card-body m-0 overflow-auto">
                        <div className="tableHeder">
                            <div className="d-flex flex-fill justify-content-end">
                                <div className="col-12 col-md-5">
                                    <input type="search" className="font-weight-bold text-primary form-control" placeholder="Podaj szukaną frazę" value={this.state.query} onChange={this.changeQueryValue} />
                                </div>
                            </div>
                        </div>
                        <div className="tableBody">
                            <table style={{width: "100%"}} className="table-hover table">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{minWidth: "25px"}}>MID</th>
                                        <th scope="col" style={{minWidth: "100px"}}>Model</th>
                                        <th scope="col" style={{minWidth: "100px"}}>Producent</th>
                                        <th scope="col" style={{minWidth: "50px"}}>SKU</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="align-middle">
                                        <td>NULL</td>
                                        <td><input type="text" className="form-control" onChange={this.changeModel} value={this.state.model} /></td>
                                        <td>
                                            <input type="text" className="form-control" id="manufacterinp" value={this.state.manufacter} onChange={this.changeManufacter} />
                                            <div id="manufacter">
                                                {this.state.ManufacterArr.map(item => (
                                                    <div onClick={this.setManufacter} value={item.Manufacturer} className="ModelItem" key={item._ID}>
                                                        <h6 value={item.Manufacter}>{item.Manufacturer}</h6>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td><input type="text" className="form-control" onChange={this.changeSKU} value={this.state.sku} /></td>
                                        <td><button className="btn btn-primary" style={{width: "100%"}} onClick={this.addmodel}>Dodaj</button></td>
                                    </tr>
                                    {this.state.Result.map(item => (
                                        <tr key={item._ID}>
                                            <td>{item._ID}</td>
                                            <td>{item.Model}</td>
                                            <td>{item.Manufacturer}</td>
                                            <td>{(item.SKU? item.SKU : "undefinedSKU")}</td>
                                            <td><button className="btn btn-primary" style={{width: "100%"}} onClick={this.selectModel} value={item._ID}>Wybierz</button></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddSelectModel