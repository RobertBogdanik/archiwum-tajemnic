import axios from 'axios'
import React from 'react'

class SettingWorkerInSection extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            userData: {PID: undefined, CID: undefined},
            Section: '',
            Assigned: [],
            Free: [],
            Changes: []
        }
        this.changePosition = this.changePosition.bind(this)
        this.save = this.save.bind(this)
        this.cancel = this.cancel.bind(this)
    }

    cancel(){
        this.props.navChangePosition(10)
    }

    async save(){
        if(this.state.Changes.length===0){
            this.setState({succes: true})
        }else{
            this.setState({succes: false})
            this.setState({error: false})
    
            const result = await axios.get('http://localhost:8082/v1/1/updateworkerinsection', {
                params: {
                    API: "ABC",
                    SID: parseInt(this.state.Section),
                    CID: this.state.userData.CID,
                    Changes: this.state.Changes
                }
            })
    
            if(result.data==="ok"){
                this.setState({succes: true})
            }else{
                this.setState({error: true})
            }
        }
        this.setState({Changes: []})
        this.props.refreshUserData()
    }

    changePosition(e){
        let exist = false
        let position = 0
        for (let a = 0; a<this.state.Changes.length; a++) {
            if(this.state.Changes[a]===parseInt(e.target.attributes[0].nodeValue.split("-")[1])){
                exist=true
                position = a
            }
        }
        if(exist){
            let val = this.state.Changes
            val.splice(position, 1)
            this.setState({Changes: val})
        }else{
            let val = this.state.Changes
            val.push(parseInt(e.target.attributes[0].nodeValue.split("-")[1]))
            this.setState({Changes: val})
        }

        if(e.target.attributes[0].nodeValue.split("-")[0]==="assigned"){
            var kop = {}
            for(let a = 0; a<this.state.Assigned.length; a++){
                if(this.state.Assigned[a]._ID===parseInt(e.target.attributes[0].nodeValue.split("-")[1])){
                    let val = this.state.Assigned
                    kop=this.state.Assigned[a]
                    kop.instance=this.state.Assigned[a].instance-1
                    val.splice(a, 1)
                    this.setState({Assigned: val})
                    break;
                }
            }

            let val = this.state.Free
            val.push(kop)
            this.setState({Free: val})
        }else{
            let kop = {}
            for(let a = 0; a<this.state.Free.length; a++){
                if(this.state.Free[a]._ID===parseInt(e.target.attributes[0].nodeValue.split("-")[1])){
                    let val = this.state.Free
                    kop=this.state.Free[a]
                    kop.instance=kop.instance+1
                    val.splice(a, 1)
                    this.setState({Free: val})
                    break;
                }
            }

            let val = this.state.Assigned
            val.push(kop)
            this.setState({Assigned: val})
        }
    }
    async componentDidMount(){
        this.setState({loading: true})
        this.setState({userData: await this.props.state.userData})
        this.setState({Section: await this.props.state.SID})

        var result = await axios.get('http://localhost:8082/v1/1/workerinsection', {
            params: {
                API: "ABC",
                SID: parseInt(this.state.Section),
                CID: this.state.userData.CID
            }
        })
        this.setState({Assigned: result.data})
        
        
        result = await axios.get('http://localhost:8082/v1/1/workernotinsection', {
            params: {
                API: "ABC",
                SID: parseInt(this.state.Section),
                CID: this.state.userData.CID
            }
        })

        this.setState({Free: result.data})
        this.setState({loading: false})
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 align-bottom col-4">
                            <div onClick={this.cancel} className="btn btn-danger align-middle me-1" style={{height: "100%"}}><img alt="" src="https://img.icons8.com/material-outlined/25/000000/back--v1.png" /> Cofnij</div>
                            <div onClick={this.save} className="btn btn-primary" style={{height: "100%"}}><img alt="" src="https://img.icons8.com/ios-glyphs/25/000000/save--v1.png" /> Zapisz</div>
                        </div>
                        <div className="m-0 font-weight-bold d-flex align-middle text-primary">
                            <h6>Edytujesz listę pracowników przypisaną do działu {this.state.Section}</h6>
                            {this.state.loading ? <div className="ms-5 dot-flashing me-5  align-items-stretch"></div> : ""}
                            {this.state.error ? <img src="https://img.icons8.com/fluency/30/000000/error.png" alt="" /> : ""}
                            {this.state.succes ? <img src="https://img.icons8.com/fluency/30/000000/ok.png" alt="" /> : ""}
                        </div>
                        
                    </div>
                </div>
                <div className="card-body overflow-auto d-flex">
                    <div className="card col-5 mt-3 me-5 m-auto mb-3">
                        <div class="card-header">
                            <h3 className="m-1 ms-2 text-primary">Dodani</h3>
                        </div>
                        <div className="card-body overflow-auto">
                            {this.state.Assigned.map((e, index) => (
                                (e.instance > 1 ? (
                                    <div onClick={this.changePosition} id={"assigned-"+e._ID} key={index}>
                                        <span id={"assigned-"+e._ID}>{e.Firstname} {e.Lastname} {e._ID}</span>
                                        <img id={"assigned-"+e._ID} alt="" className="float-end" src="https://img.icons8.com/material-outlined/24/000000/trash.png" />
                                    </div>
                                ) : (
                                    <div id={"assigned-"+e._ID} key={index}>
                                        <span id={"assigned-"+e._ID}>{e.Firstname} {e.Lastname} {e._ID}</span>
                                        <span id={"assigned-"+e._ID} className="d-inline-block float-end" data-toggle="tooltip" data-placement="right" title="Pracownik dodany tylko do jednej sekcji. Brak możliwości wypisania go.">
                                            <img id={"assigned-"+e._ID} alt="" className="float-end" src="https://img.icons8.com/material-outlined/24/000000/lock--v1.png" />
                                        </span>
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>

                    <div className="card  col-6 mt-3 m-auto mb-3">
                        <div class="card-header">
                            <h3 className="m-1 ms-2 text-primary">Dostępni</h3>
                        </div>
                        <div className="card-body overflow-auto">
                            {this.state.Free.map((e, index) => (
                                <div onClick={this.changePosition} id={"free-"+e._ID} key={index}>
                                    <span id={"free-"+e._ID}>{e.Firstname} {e.Lastname} {e._ID}</span>
                                    <img id={"free-"+e._ID} alt="" className="float-end" src="https://img.icons8.com/material-outlined/24/000000/add.png" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingWorkerInSection