import axios from 'axios'
import React from 'react'

class ComplaintList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            ActualList: [],
            userData: {},
            List: [],
            sectionsList: [],
            query: '',
            show: 10
        }
        this.save = this.save.bind(this)
        this.changeTextValue = this.changeTextValue.bind(this)
        this.changeQuery = this.changeQuery.bind(this)
        this.changeSelect = this.changeSelect.bind(this)
        this.changeShow = this.changeShow.bind(this)
        this.clearQuery = this.clearQuery.bind(this)
    }
    
    async componentDidUpdate(){
        if(this.props.state.refracheAccountsList===true){
            this.props.setParameters("refracheAccountsList", false)
            this.componentDidMount()
        }
    }

    changeSelect(e){
        const ID = parseInt(e.target.value.split(",")[1])
        for(let a = 0; a<this.state.List.length; a++){
            if(this.state.List[a]._ID===ID){
                let List = this.state.List
                List[a].toSave = true
                List[a].saved = false
                List[a][e.target.name] = e.target.value.split(",")[0]
                if(e.target.name==="Permissions"){ List[a].Permissions = parseInt(e.target.value.split(",")[0]) }
                else{ List[a].Section = e.target.value.split(",")[0] }
                this.setState({List: List})
                break;
            }
        }

        
        for(let a = 0; a<this.state.ActualList.length; a++){
            if(this.state.ActualList[a]._ID===ID){
                let ActualList = this.state.ActualList
                ActualList[a].toSave = true
                ActualList[a].saved = false
                if(e.target.name==="Permissions"){ ActualList[a].Permissions = parseInt(e.target.value.split(",")[0]) }
                else{ ActualList[a].Section = e.target.value.split(",")[0] }
                
                this.setState({ActualList: ActualList})
                break;
            }
        }
    }
    changeTextValue(e){
        const ID = parseInt(e.target.attributes[2].nodeValue.split("-")[1])
        for(let a = 0; a<this.state.List.length; a++){
            if(this.state.List[a]._ID===ID){
                let List = this.state.List
                List[a].toSave = true
                List[a].saved = false
                if(e.target.name==="Login"){ List[a].Login = e.target.value }
                if(e.target.name==="Email"){ List[a].Email = e.target.value }
                if(e.target.name==="Password"){ List[a].Password = e.target.value }
                if(e.target.name==="Firstname"){ List[a].Firstname = e.target.value }
                if(e.target.name==="Lastname"){ List[a].Lastname = e.target.value }
                this.setState({List: List})
                break;
            }
        }

        for(let a = 0; a<this.state.ActualList.length; a++){
            if(this.state.ActualList[a]._ID===ID){
                let ActualList = this.state.ActualList
                ActualList[a].toSave = true
                ActualList[a].saved = false
                if(e.target.name==="Login"){ ActualList[a].Login = e.target.value }
                if(e.target.name==="Email"){ ActualList[a].Email = e.target.value }
                if(e.target.name==="Password"){ ActualList[a].Password = e.target.value }
                if(e.target.name==="Firstname"){ ActualList[a].Firstname = e.target.value }
                if(e.target.name==="Lastname"){ ActualList[a].Lastname = e.target.value }
                this.setState({ActualList: ActualList})
                break;
            }
        }
    }

    async componentDidMount(){
        this.setState({loading: true})
        this.setState({userData: await this.props.state.userData})
        let result = await axios.get("http://localhost:8082/v1/1/accountslist", {
            params: {
                API: "ABC",
                PID: this.state.userData.PID,
                CID: this.state.userData.CID
            }
        })

        if(result.data!=="e"){ 
            var res = []
            while(result.data[0].Next===true){
                for (const iterator of result.data) {
                    iterator.toSave = false
                    iterator.seved = false
                    iterator.firstSection = iterator.Section
                    res.push(iterator)
                }
                let ls =  result
                result = await axios.get("http://localhost:8082/v1/1/accountslist", {
                    params: {
                        API: "ABC",
                        PID: this.state.userData.PID,
                        CID: this.state.userData.CID,
                        NextFrom: await ls.data[0].NextFrom
                    }
                })
                this.setState({ActualList: await res}); 
            }
            this.setState({List: res}); 
            this.setState({loading: false})
        }
        else{ this.setState({error: true}) }
    }

    async save(e){
        for(let a = 0; a<this.state.List.length; a++){
            if(this.state.List[a]._ID===parseInt(e.target.value)){
                const result = await axios.get('http://localhost:8082/v1/1/editaccount', {
                    params: {
                        API: "ABC",
                        CID: this.state.userData.CID,
                        AID: this.state.List[a]._ID,
                        Login: this.state.List[a].Login,
                        Email: this.state.List[a].Email,
                        Password: this.state.List[a].Password,
                        Firstname: this.state.List[a].Firstname,
                        Lastname: this.state.List[a].Lastname,
                        Permissions: this.state.List[a].Permissions,
                        Section: (this.state.List[a].Section===null ? this.state.List[a].sectionsList[0]._ID : this.state.List[a].Section)
                    }
                })

                if(result.data==="ok"){
                    let List = this.state.List
                    List[a].toSave = false
                    List[a].saved = true
                    this.setState({List: List})
                }else{ this.setState({error: true}) }
                break;
            }
        }
    }

    changeQuery(e){
        this.setState({query: e.target.value})

        var actual = []
        var list = this.state.List
        for (const iterator of list) {
            var punkt =0
            for (const main of e.target.value.split(" ")) {
                if(
                    (iterator.Login).toUpperCase().includes(main.toUpperCase()) ||
                    (iterator.Email).toUpperCase().includes(main.toUpperCase()) ||
                    (iterator.Firstname).toUpperCase().includes(main.toUpperCase()) ||
                    (iterator.Lastname).toUpperCase().includes(main.toUpperCase()) ||
                    ("PRACOWNIK".includes(main.toUpperCase()) && iterator.Permissions===0) ||
                    ("ADMINISTRATOR".includes(main.toUpperCase()) && iterator.Permissions===1)
                ){ punkt++; }
            }
            if(punkt===e.target.value.split(" ").length){ actual.push(iterator); }
        }
        this.setState({ActualList: actual})
    }

    async changeShow(){
        let now = parseInt(this.state.show)+10
        await this.setState({show: now})
    }

    clearQuery(){
        this.setState({query: ''})
        const e = { target: { value: '' } }
        this.changeQuery(e)
    }
    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Pozostałe konta</h6>
                        </div>
                        {this.state.loading ? <div className="dot-flashing me-5  align-items-stretch"></div> : ""}
                        {this.state.error ? <img src="https://img.icons8.com/fluency/30/000000/error.png" alt="" /> : ""}
                    </div>
                </div>
                <div className="card-body overflow-auto text-center">
                    <div className="d-flex">
                        <div className="col-8"></div>
                        <div className="input-group align-middle">
                            <input onChange={this.changeQuery} id="search" type="text" placeholder="Podaj szukany tekst..." autoComplete="off" className="form-control align-middle" style={{marginTop: "0px"}} value={this.state.query} />
                            <button className="btn col-1" style={{minWidth: "50px", padding: "0px", border: "2px solid rgb(206, 212, 218)"}} onClick={this.clearQuery}>
                                <img src="https://img.icons8.com/fluency/32/000000/delete-sign.png" alt="" />
                            </button>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
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
                            {this.state.ActualList.map((e, index) => {
                                if(this.state.show>index){
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex">
                                                    {e.toSave===true ? <img alt="" src="/Img/icontosave.png" className="align-middle mt-2 me-2" width="40" /> : ''}
                                                    {e.saved===true ? <img alt="" src="https://img.icons8.com/fluency/50/000000/save-close.png" className="align-middle mt-2 me-2" width="40" /> : ''}
                                                    <button className="btn btn-primary button form-control" onClick={this.save} value={e._ID}>Zapisz</button>
                                                </div>
                                            </td>
                                            <td><input type="text" className="form-control" id={"el1-"+e._ID} onChange={this.changeTextValue} name="Login" value={e.Login} /></td>
                                            <td><input type="text" className="form-control" id={"el2-"+e._ID} onChange={this.changeTextValue} name="Email" value={e.Email} /></td>
                                            <td><input type="password" className="form-control" id={"el3-"+e._ID} onChange={this.changeTextValue} name="Password" value={e.Password} /></td>
                                            <td><input type="text" className="form-control" id={"el4-"+e._ID} onChange={this.changeTextValue} name="Firstname" value={e.Firstname} /></td>
                                            <td><input type="text" className="form-control" id={"el5-"+e._ID} onChange={this.changeTextValue} name="Lastname" value={e.Lastname} /></td>
                                            <td>
                                                <select name="Permissions" className="form-select form-control select" onChange={this.changeSelect}>
                                                    <option value={[0, e._ID]} selected={e.Permissions===0 ? true : false}>Pracownik</option>
                                                    <option value={[1, e._ID]} selected={e.Permissions===1 ? true : false}>Administrator</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select name="Section" className="form-select form-control select" onChange={this.changeSelect}>
                                                    {e.firstSection!==null ? <option value={[e.firstSection, e._ID]}>{e.firstSection}</option> : ''}
                                                    {e.sectionsList.map(f => (
                                                        <option value={[f.Name, e._ID]} key={f._ID}>{f.Name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                }else{
                                    return false
                                }
                            })} 
                        </tbody>
                    </table>
                    {this.state.ActualList.length>this.state.show ? <button className="btn btn-primary" onClick={ this.changeShow }>Pokarz więcej</button> : ''}
                </div>
            </div>
        )
    }
}

export default ComplaintList