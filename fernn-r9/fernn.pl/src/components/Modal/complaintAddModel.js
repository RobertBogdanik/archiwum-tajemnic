import React from 'react'
import axios from 'axios'
// import cookie from 'react-cookies'
// import { response } from "express";

class ComplaintAddModel extends React.Component{
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
            sku: ''
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
        // this.setState({"query": await cookie.load("query")})
        // this.setState({"RID": await cookie.load("RID")})
        this.setState({"query": this.props.state.query})
        this.setState({"RID": this.props.state.RID})
        this.setState({"CID": this.props.state.CID})
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
    changeSKU(e){
        this.setState({sku: e.target.value})
    }
    changeModel(e){
        this.setState({model: e.target.value})
    }
    async addmodel(){
        const result = await axios.get('http://localhost:8082/v1/1/editcreatemodel', {
            params: {
                API: "ABC",
                CID: this.props.state.userData.CID,
                RID: this.state.RID,
                Model: this.state.model,
                Manufacter: this.state.manufacter,
                SKU: this.state.sku
            }
        })
        
        if(result.data==="ok"){
            this.props.setParameters("RID", this.state.RID)
            this.props.navChangePosition(7)
        }
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
        let userData = await axios.get('http://localhost:8082/v1/1/complaintaddmodel', {
            params: {
                API: "ABC",
                MID: event.target.value,
                RID: this.state.RID,
                CID: await this.props.state.userData.CID
            }
        });

        if(userData.data==="ok"){
            this.props.setParameters("RID", this.state.RID)
            this.props.navChangePosition(7)
        }
    }

    render(){
        this.manufacterRespsnsive()
        return(
            <div>
                <div className="card shadow col-11 mt-3 m-auto mb-5">
                    <div className="card-header py-3">
                        <div className="d-flex justify-content-between align-items-stretch flex-fill">
                            <h6 className="m-0 font-weight-bold text-primary">Szczegóły reklamacji</h6>
                            <h6 className="m-0 font-weight-bold text-primary">Wybieranie modelu</h6>
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
                                            <input type="text" autoComplete="off" className="form-control" id="manufacterinp" value={this.state.manufacter} onChange={this.changeManufacter} />
                                            <div id="manufacter">
                                                {this.state.ManufacterArr.map(item => (
                                                    <div onClick={this.setManufacter} value={item.Manufacturer} className="ModelItem" key={item._ID}>
                                                        <h6 value={item.Manufacter}>{item.Manufacturer}</h6>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td><input type="text" autoComplete="off" className="form-control" onChange={this.changeSKU} value={this.state.sku} /></td>
                                        <td><button className="btn btn-primary" style={{width: "100%"}} onClick={this.addmodel}>Dodaj</button></td>
                                    </tr>
                                    {Array.isArray(this.state.Result)===true ? 
                                        this.state.Result.map(item => (
                                            <tr key={item._ID}>
                                                <td>{item._ID}</td>
                                                <td>{item.Model}</td>
                                                <td>{item.Manufacturer}</td>
                                                <td>{(item.SKU? item.SKU : "undefinedSKU")}</td>
                                                <td><button className="btn btn-primary" style={{width: "100%"}} onClick={this.selectModel} value={item._ID}>Wybierz</button></td>
                                            </tr>
                                        ))
                                    : console.log("sddsfds")}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ComplaintAddModel