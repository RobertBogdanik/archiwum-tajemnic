import axios from 'axios'
import React from 'react'
class ComplaintList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            userData: {PID: undefined, CID: undefined},
            sections: [],
            main: {},
            Name: ''
        }
        this.changeTextValue = this.changeTextValue.bind(this)
        this.changeAddText = this.changeAddText.bind(this)
        this.addNewSection = this.addNewSection.bind(this)
        this.editWorker = this.editWorker.bind(this)
        this.saveName = this.saveName.bind(this)
        this.delateSection = this.delateSection.bind(this)
    }

    async componentDidMount(){
        this.setState({userData: await this.props.state.userData})
        const result = await axios.get('http://localhost:8082/v1/1/sectionlist', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID
            }
        })
        this.setState({main: result.data[0]})

        var res=[]
        for(let a=1; a<result.data.length; a++){
            res.push(result.data[a])
        }
        this.setState({sections: res})
    }

    changeTextValue(e){
        if(this.state.main._ID === parseInt(e.target.attributes[1].nodeValue.split("-")[1])){
            var main = this.state.main
            main.Name=e.target.value
            main.toSave = true
            main.saved = false
            this.setState({main: main})
        }else{
            for (let a =0 ;a<this.state.sections.length; a++) {
                var iterator = this.state.sections[a]
                if(iterator._ID === parseInt(e.target.attributes[1].nodeValue.split("-")[1])){
                    var el = this.state.sections
                    el[a].Name = e.target.value
                    el[a].toSave = true
                    el[a].saved = false
                    this.setState({sections: el})
                    break;
                }
            }
        }
    }

    changeAddText(e){
        this.setState({Name: e.target.value})
    }

    async addNewSection(){
        const result = await axios.get('http://localhost:8082/v1/1/addnewsecton', {
            params: {
                API: "ABC",
                CID: this.state.userData.CID,
                Name: this.state.Name
            }
        })

        if(result.data!=="e"){
            this.setState({succes: true})
        }
        this.setState({Name: ''})
        this.componentDidMount()
    }

    editWorker(e){
        this.props.setParameters("SID", parseInt(e.target.attributes[1].nodeValue.split("-")[1]))
        this.props.navChangePosition(13)
    }

    async saveName(e){
        if(this.state.main._ID === parseInt(e.target.attributes[1].nodeValue.split("-")[1])){
            const result = await axios.get('http://localhost:8082/v1/1/editsectioname',{
                params: {
                    API: 'ABC',
                    Name: this.state.main.Name,
                    SID: this.state.main._ID,
                    CID: this.state.userData.CID
                }
            })

            if(result.data!=="e"){
                var main = this.state.main
                main.toSave = false
                main.saved = true
                this.setState({main: main})
                this.setState({error: false})
            }else{ this.setState({error: true}) }
        }else{
            for (let a =0 ;a<this.state.sections.length; a++) {
                var iterator = this.state.sections[a]
                if(iterator._ID === parseInt(e.target.attributes[1].nodeValue.split("-")[1])){
                    const result = await axios.get('http://localhost:8082/v1/1/editsectioname',{
                        params: {
                            API: 'ABC',
                            Name: this.state.sections[a].Name,
                            SID: this.state.sections[a]._ID,
                            CID: this.state.userData.CID
                        }
                    })

                    if(result.data!=="e"){
                        var el = this.state.sections
                        el[a].toSave = false
                        el[a].saved = true
                        this.setState({sections: el})
                        this.setState({error: false})
                    }else{ this.setState({error: true}) }
                    break;
                }
            }
        }
    }

    async delateSection(e){
        if(window.confirm("Czy napewno chcesz usunąć sekcje")){
            const result = await axios.get('http://localhost:8082/v1/1/delatesection',{
                params: {
                    API: 'ABC',
                    CID: this.state.userData.CID,
                    SID: e.target.value
                }
            })

            if(result.data!=="e"){
                this.setState({error: false})
                this.setState({succes: true})

                let sections = this.state.sections
                for(let a =0 ; a<sections.length; a++){
                    if(sections[a]._ID===parseInt(e.target.value)){
                        sections.splice(a, 1)
                    }
                }
                
                this.setState({sections: sections})
            }else{
                this.setState({error: true})
                this.setState({succes: false})
            }
        }
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Działy</h6>
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
                                <th>Nazwa działu</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="col-3"><input type="text" onChange={this.changeAddText} value={this.state.Name} className="form-control" style={{minWidth: "100px"}} /></td>
                                <td colSpan="3"><button style={{width: "100%"}} className="btn btn-primary button" onClick={this.addNewSection}>Dodaj</button></td>
                            </tr>
                            <tr>
                                <td className="col-3"><input type="text" value={this.state.main.Name} id={"el-"+this.state.main._ID} onChange={this.changeTextValue} className="form-control" style={{minWidth: "100px"}} /></td>
                                <td><button className="btn btn-primary button col-12" onClick={this.editWorker} id={"el-"+this.state.main._ID}>Edytuj pracowników</button></td>
                                <td className="d-flex">
                                    {this.state.main.toSave===true ? <img alt="" src="/Img/icontosave.png" className="align-middle mt-2 me-2" width="30" /> : ''}
                                    {this.state.main.saved===true ? <img alt="" src="https://img.icons8.com/fluency/50/000000/save-close.png" className="align-middle mt-2 me-2" width="30" /> : ''}
                                    <button className="btn btn-primary button" style={{width: "100%"}} onClick={this.saveName} id={"el-"+this.state.main._ID}>Zapisz nazwę</button>
                                </td>
                                <td><h3>Dział główny</h3></td>
                            </tr>
                            {this.state.sections.map((e, index) => (
                                <tr key={index}>
                                    <td className="col-3"><input type="text" value={e.Name} id={"el-"+e._ID} onChange={this.changeTextValue} className="form-control" style={{minWidth: "100px"}} /></td>
                                    <td><button className="btn btn-primary button col-12" id={"el-"+e._ID} onClick={this.editWorker}>Edytuj pracowników</button></td>
                                    <td className="d-flex">
                                        {e.toSave===true ? <img alt="" src="/Img/icontosave.png" className="align-middle mt-2 me-2" width="30" /> : ''}
                                        {e.saved===true ? <img alt="" src="https://img.icons8.com/fluency/50/000000/save-close.png" className="align-middle mt-2 me-2" width="30" /> : ''}
                                        <button className="btn btn-primary button" style={{width: "100%"}} id={"el-"+e._ID} onClick={this.saveName}>Zapisz nazwę</button>
                                    </td>
                                    <td><button className="btn btn-danger button col-12" value={e._ID} onClick={this.delateSection}>Usuń</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ComplaintList