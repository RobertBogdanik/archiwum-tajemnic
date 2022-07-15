import React from 'react'
import axios from 'axios'


class Company extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            set: false,
            edited: {},
            hist: {},
            licencja: {},
            wszystkielicencje: [],
            danefirmy: {},
            konta: [],
            reklamacje: [],
            sekcje: []
        }
        this.reDownload = this.reDownload.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.saveLicencja = this.saveLicencja.bind(this)
        this.saveDane = this.saveDane.bind(this)
        this.saveKonta = this.saveKonta.bind(this)
        this.delateKonta = this.delateKonta.bind(this)
        this.saveReklamacja = this.saveReklamacja.bind(this)
        this.delateReklamacja = this.delateReklamacja.bind(this)
        this.saveSectionName = this.saveSectionName.bind(this)
        this.changeSectionAccount = this.changeSectionAccount.bind(this)
        this.delateSection = this.delateSection.bind(this)
    }
    async componentDidUpdate(){
        const e = await this.props.state.selectedCompant
        if(e!==this.state.edited){
            this.setState({edited: e})

            this.reDownload()  
        }
    }
    async reDownload(){
        axios.get('http://localhost:8081/v1/1/companylicencja', {
             params: {
                     _ID: this.state.edited._ID
                 }
             })
             .then((res) => {
                 this.setState({licencja: res.data})
             })

        axios.get('http://localhost:8081/v1/1/companywszystkielicencje', {
             params: {
                     _ID: this.state.edited._ID
                 }
             })
             .then((res) => {
                 this.setState({wszystkielicencje: res.data})
             })

        axios.get('http://localhost:8081/v1/1/danefirmy', {
                params: {
                        _ID: this.state.edited._ID
                    }
                })
                .then((res) => {
                    this.setState({danefirmy: res.data})
                })
        
        axios.get('http://localhost:8081/v1/1/kontafirmy', {
                params: {
                        CID: this.state.edited._ID
                    }
                })
                .then((res) => {
                    this.setState({konta: res.data})
                }) 

        axios.get('http://localhost:8081/v1/1/reklamacjefirmy', {
                params: {
                        CID: this.state.edited._ID,
                        Since: "2023-09-26 16:46:23",
                        To: "2020-09-26 16:46:23"
                    }
                })
                .then((res) => {
                    this.setState({reklamacje: res.data})
                }) 

        axios.get('http://localhost:8081/v1/1/sekcjefirmy', {
                params: {
                        CID: this.state.edited._ID
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    this.setState({sekcje: res.data})
                })  
    }
    changeValue(e){
        if(e.target.name.split("-").length === 2){
            let sekcje = this.state.sekcje
            sekcje[parseInt(e.target.name.split("-")[1])][e.target.name.split("-")[0]] = e.target.value
            this.setState({sekcje: sekcje})
        }
        if(e.target.name.split("-").length === 3){
            const copy = this.state[e.target.name.split("-")[0]]
            copy[e.target.name.split("-")[2]] = e.target.value
            this.setState({[e.target.name.split("-")[0]]: copy})
        }
        if(e.target.name.split("-").length === 4){
            const copy = this.state[e.target.name.split("-")[0]]
            copy[parseInt(e.target.name.split("-")[2])][e.target.name.split("-")[3]] = e.target.value
            this.setState({[e.target.name.split("-")[0]]: copy})
        }
    }
    async saveLicencja(n){
        console.log(n.target.value);
        const res = await axios.get('http://localhost:8081/v1/1/savelicencja', {
            params: {
                licencja: JSON.stringify(n.target.value)
            }
        })

        if(res.data!=="ok"){
            alert("Błąd zapisu")
        }else{ this.reDownload() }
    }
    async saveDane(){
        const res = await axios.get('http://localhost:8081/v1/1/savedane', {
            params: {
                danefirmy: this.state.danefirmy
            }
        })

        if(res.data!=="ok"){
            alert("Błąd zapisu")
        }else{ this.reDownload() }
    }
    async saveKonta(n){
        const res = await axios.get('http://localhost:8081/v1/1/savekonta', {
            params: {
                konto: this.state.konta[n.target.value]
            }
        })

        if(res.data!=="ok"){
            alert("Błąd zapisu")
        }else{ this.reDownload() }
    }
    async delateKonta(n){
        const res = await axios.get('http://localhost:8081/v1/1/delatekonta', {
            params: {
                konto: this.state.konta[n.target.name]
            }
        })

        if(res.data!=="ok"){
            alert("Błąd operacji")
        }else{ this.reDownload() }
    }
    async saveReklamacja(e){
        const res = await axios.get('http://localhost:8081/v1/1/updatereklamacja', {
            params: {
                reklamacja: this.state.reklamacje[e.target.name]
            }
        })

        if(res.data!=="ok"){
            alert("Błąd operacji")
        }else{ this.reDownload() }
    }
    async delateReklamacja(n){
        const res = await axios.get('http://localhost:8081/v1/1/delatereklamacja', {
            params: {
                reklamacja: this.state.reklamacje[n.target.name]
            }
        })

        if(res.data!=="ok"){
            alert("Błąd operacji")
        }else{ this.reDownload() }
    }
    async saveSectionName(n){
        const res = await axios.get('http://localhost:8081/v1/1/savesectionname', {
            params: {
                API: "ABC",
                _ID: parseInt(n.target.name)
            }
        })

        if(res.data!=="ok"){
            alert("Błąd operacji")
        }else{ this.reDownload() }
    }
    async changeSectionAccount(n){
        let val = this.state.sekcje[n.target.name].input
        
        if((val.split(")")[0]).replace("(", "") === "+"){
            const res = await axios.get('http://localhost:8081/v1/1/changesectionaccount', {
                params: {
                    API: "ABC",
                    _ID: this.state.sekcje[n.target.name].include[val.split("=> ")[1].replace(" <=", "")]._ID,
                    type: 0
                }
            })

            if(res.data!=="ok"){
                alert("Błąd operacji")
            }else{ this.reDownload() }
        }else{
            const res = await axios.get('http://localhost:8081/v1/1/changesectionaccount', {
                params: {
                    API: "ABC",
                    _ID: this.state.sekcje[n.target.name].notInclude[val.split("=> ")[1].replace(" <=", "")]._ID,
                    type: 1
                }
            })

            if(res.data!=="ok"){
                alert("Błąd operacji")
            }else{ this.reDownload() }
        }
    }
    async delateSection(n){
        const res = await axios.get('http://localhost:8081/v1/1/delatesection', {
            params: {
                API: "ABC",
                _ID: parseInt(n.target.name)
            }
        })

        if(res.data!=="ok"){
            alert("Błąd operacji")
        }else{ this.reDownload() }
    }

    render(){
        return (
            <div>
                <div className="modal fade" id="edycja" data-keyboard="false" aria-labelledby="edycja" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Edycja firmy {this.state.edited.Name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionLicencja" aria-expanded="false" aria-controls="accordionLicencja">
                                                Licencja
                                            </button>
                                        </h2>
                                        <div id="accordionLicencja" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">
                                                <div className="row col-12 text-center">
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Od<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Start"} value={this.state.licencja.Start} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Do<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-End"} value={this.state.licencja.End} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Plan<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Plan"} value={this.state.licencja.Plan} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Konta<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Account"} value={this.state.licencja.Account} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Raporty<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Report"} value={this.state.licencja.Report} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Załaczniki<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Attachment"} value={this.state.licencja.Attachment} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Powiadomienia<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Notifications"} value={this.state.licencja.Notifications} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Reklamacje<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Complaints"} value={this.state.licencja.Complaints} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Zablokowana<br />
                                                        <input className="col-12 form-control" type="text" name={"licencja-"+this.state.licencja._ID+"-Loock"} value={this.state.licencja.Loock} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12">
                                                        <button className="col-12 btn btn-primary mt-2" onClick={this.saveLicencja} value={JSON.stringify(this.state.licencja)}>Zapisz licencję</button>    
                                                    </div>
                                                    <div className="accordion mt-4" id="pozostalelicencje">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="headingOne">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#pozlicencje" aria-expanded="true" aria-controls="collapseOne">
                                                                    Pozostałe licencje
                                                                </button>
                                                            </h2>
                                                            <div id="pozlicencje" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#pozostalelicencje">
                                                                <div className="accordion-body overflow-auto">
                                                                    <table className="table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th></th>
                                                                                <th>Od</th>
                                                                                <th>Do</th>
                                                                                <th>Plan</th>
                                                                                <th>Konta</th>
                                                                                <th>Raporty</th>
                                                                                <th>Załączniki</th>
                                                                                <th>Powiadonienia</th>
                                                                                <th>Reklamacje</th>
                                                                                <th>Zablokowana</th>
                                                                                <th></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {this.state.wszystkielicencje.map((el,i) => (
                                                                                <tr className={this.state.licencja._ID===el._ID ? "bg-primary" : ""} key={i}>
                                                                                    <td><button className={this.state.licencja._ID===el._ID ? "btn btn-light" : "btn btn-primary"} onClick={this.saveLicencja} value={JSON.stringify(this.state.wszystkielicencje[i])}>Zapisz</button></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Start"}  type="date" style={{minWidth: "130px"}} className="form-control" value={el.Start} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-End"}  type="date" style={{minWidth: "130px"}} className="form-control" value={el.End} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Plan"}  type="text" style={{minWidth: "120px"}} className="form-control" value={el.Plan} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Account"}  type="text" style={{minWidth: "100px"}} className="form-control" value={el.Account} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Report"}  type="text" style={{minWidth: "50px"}} className="form-control" value={el.Report} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Attachment"}  type="text" style={{minWidth: "100px"}} className="form-control" value={el.Attachment} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Notifications"}  type="text" style={{minWidth: "50px"}} className="form-control" value={el.Notifications} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Complaints"}  type="text" style={{minWidth: "100px"}} className="form-control" value={el.Complaints} /></td>
                                                                                    <td><input onChange={this.changeValue} name={"wszystkielicencje-"+el._ID+"-"+i+"-Loock"}  type="text" style={{minWidth: "50px"}} className="form-control" value={el.Loock} /></td>
                                                                                    <td><button className={this.state.licencja._ID===el._ID ? "btn btn-light" : "btn btn-primary"} onClick={this.saveLicencja} value={JSON.stringify(this.state.wszystkielicencje[i])}>Zapisz</button></td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionDane" aria-expanded="false" aria-controls="accordionDane">
                                                Dane firmy
                                            </button>
                                        </h2>
                                        <div id="accordionDane" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">
                                                <div className="row col-12 text-center">
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Nazwa<br />
                                                        <input className="col-12 form-control" type="text" name={"danefirmy-"+this.state.danefirmy._ID+"-Name"} value={this.state.danefirmy.Name} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        NIP<br />
                                                        <input className="col-12 form-control" type="text" name={"danefirmy-"+this.state.danefirmy._ID+"-NIP"} value={this.state.danefirmy.NIP} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Email<br />
                                                        <input className="col-12 form-control" type="text" name={"danefirmy-"+this.state.danefirmy._ID+"-Email"} value={this.state.danefirmy.Email} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Telefon<br />
                                                        <input className="col-12 form-control" type="text" name={"danefirmy-"+this.state.danefirmy._ID+"-Phone"} value={this.state.danefirmy.Phone} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Adres<br />
                                                        <input className="col-12 form-control" type="text" name={"danefirmy-"+this.state.danefirmy._ID+"-Adress"} value={this.state.danefirmy.Adress} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-3">
                                                        Sekcja<br />
                                                        <input className="col-12 form-control" type="text" name={"danefirmy-"+this.state.danefirmy._ID+"-Section"} value={this.state.danefirmy.Section} onChange={this.changeValue} />
                                                    </div>
                                                    <div className="col-12">
                                                        <button className="col-12 btn btn-primary mt-2" onClick={this.saveDane}>Zapisz dane firmy</button>    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionKonta" aria-expanded="false" aria-controls="accordionKonta">
                                                Konta
                                            </button>
                                        </h2>
                                        <div id="accordionKonta" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                        <div className="accordion-body overflow-auto">
                                                <table className="table col-12">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th>Login</th>
                                                            <th>Email</th>
                                                            <th>Hasło</th>
                                                            <th>Uprawnienia</th>
                                                            <th>Sekcja</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.konta.map((el, i) => (
                                                            <tr key={i}>
                                                                <td><input onChange={this.changeValue} name={"konta-"+el._ID+"-"+i+"-Login"} style={{minWidth: "200px"}} className="col-12 form-control" type="text" value={el.Login} /></td>
                                                                <td><input onChange={this.changeValue} name={"konta-"+el._ID+"-"+i+"-Email"} style={{minWidth: "200px"}} className="col-12 form-control" type="text" value={el.Email} /></td>
                                                                <td><input onChange={this.changeValue} name={"konta-"+el._ID+"-"+i+"-Password"} style={{minWidth: "200px"}} className="col-12 form-control" type="text" value={el.Password} /></td>
                                                                <td>
                                                                    <select onChange={this.changeValue} className="form-control" style={{minWidth: "200px"}} defaultValue={el.Permissions} name={"konta-"+el._ID+"-"+i+"-Permissions"}>
                                                                        <option value="0">Pracownik</option>
                                                                        <option value="1">Administrator</option>
                                                                        <option value="2">Zaplecze</option>
                                                                    </select>
                                                                </td>
                                                                <td><input onChange={this.changeValue} name={"konta-"+el._ID+"-"+i+"-Section"} style={{minWidth: "200px"}} className="col-12 form-control" type="text" value={el.Section} /></td>
                                                                <td><button style={{minWidth: "200px"}} className="col-12 btn btn-primary" onClick={this.saveKonta} value={i}>Zapisz</button></td>
                                                                <td><button style={{minWidth: "200px"}} className="col-12 btn btn-danger" onClick={this.delateKonta} name={i}>Usuń</button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionReklamacje" aria-expanded="false" aria-controls="accordionReklamacje">
                                                Reklamacje
                                            </button>
                                        </h2>
                                        <div id="accordionReklamacje" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body overflow-auto">
                                                <div className="row text-center">
                                                    <div className="col-12 col-md-6">
                                                        Od
                                                        <input type="date" className="form-control" />
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        Do
                                                        <input type="date" className="form-control" />
                                                    </div>
                                                </div>
                                                <table className="mt-5 table col-12">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th>Model</th>
                                                            <th>Producent</th>
                                                            <th>Imię</th>
                                                            <th>Nazwisko</th>
                                                            <th>Telefon</th>
                                                            <th>Email</th>
                                                            <th>Opis</th>
                                                            <th>Seryjny</th>
                                                            <th>Zakupu</th>
                                                            <th>Typ</th>
                                                            <th>Do kw.</th>
                                                            <th>Komentarz</th>
                                                            <th>Kod</th>
                                                            <th>Pin</th>
                                                            <th>Nr.reklamacji</th>
                                                            <th>data zak.</th>
                                                            <th>data uszk.</th>
                                                            <th>Powiadomienia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.reklamacje.map((el,i) => (
                                                            <tr key={i}>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-mModel"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.mModel} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-maManufacter"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.maManufacter} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Firstname"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Firstname} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Lastname"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Lastname} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Phone"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Phone} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Email"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Email} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Description"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Description} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Serial_no"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Serial_no} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Purchase_number"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Purchase_number} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Type"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Type} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-ToAmount"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.ToAmount} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Comments"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Comments} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Code"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Code} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Pin"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Pin} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Complaint_number"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Complaint_number} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Purchase_date"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Purchase_date} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Damage_date"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Damage_date} type="" /></td>
                                                                <td><input onChange={this.changeValue} name={"reklamacje-" + el._ID + "-" + i + "-Notification"} style={{ minWidth: "200px" }} className="col-12 form-control" value={el.Notification} type="" /></td>
                                                                <td><button style={{ minWidth: "200px" }} className="col-12 btn btn-primary" onClick={this.saveReklamacja} name={i}>Zapisz</button></td>
                                                                <td><button style={{ minWidth: "200px" }} className="col-12 btn btn-danger" onClick={this.delateReklamacja} name={i}>Usuń</button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionSekcje" aria-expanded="false" aria-controls="accordionSekcje">
                                                Sekcje
                                            </button>
                                        </h2>
                                        <div id="accordionSekcje" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body overflow-auto">
                                                <table className="table col-12">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th>Nazwa</th>
                                                            <th>Referencja</th>
                                                            <th>Dodaj</th>
                                                            <th>Usuń</th>
                                                            <th>Usuń sekcję</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(Array.isArray(this.state.sekcje) ? this.state.sekcje.map((el, i) => (
                                                            <tr key={i}>
                                                                <td><input style={{minWidth: "200px"}} className="col-12 form-control" value={el.Name} name={"Name-"+i} onChange={this.changeValue} /></td>
                                                                <td>
                                                                    <input style={{minWidth: "200px"}} className="col-12 form-control" type="" list={"section-account-"+el._ID} name={"input-"+i} value={el.input} onChange={this.changeValue} /> 
                                                                    <datalist id={"section-account-"+el._ID}>
                                                                        {el.include.map((el2, i2) => (
                                                                            <option key={i2}>
                                                                                (+) {el2.Firstname} {el2.Lastname} {el2.Email} =&#62; {i2} &#60;=
                                                                            </option>
                                                                        ))}
                                                                        {el.notInclude.map((el2, i2) => (
                                                                            <option key={i2}>
                                                                                (-) {el2.Firstname} {el2.Lastname} {el2.Email} =&#62; {i2} &#60;=
                                                                            </option>
                                                                        ))}
                                                                    </datalist>
                                                                </td>
                                                                <td><button style={{minWidth: "200px"}} className="col-12 btn btn-primary" onClick={this.changeSectionAccount} name={i}>Zmień</button></td>
                                                                <td><button style={{minWidth: "200px"}} className="col-12 btn btn-success" onClick={this.saveSectionName} name={i}>Zapisz</button></td>
                                                                <td><button style={{minWidth: "200px"}} className="col-12 btn btn-danger" onClick={this.delateSection} name={i}>Usuń sekcję</button></td>
                                                            </tr>
                                                        )) : '')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Company