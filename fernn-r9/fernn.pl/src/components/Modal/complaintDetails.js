import React from 'react'
import axios from 'axios'
import ModelAndManufacter from '../Modal/modelAndManufacter'

class ComplaintList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            StatusList: [],
            AllSection: [],
            Status: '',
            Damage_date: null,
            Purchase_date: null,
            Notification: false,
            RID: 0,
            CID: 0,
            PID: 0,
            Save: false,
            Succes: false,
            Firstname: '',
            Lastname: '',
            Phone: '',
            Purchase_number: '',
            Email: '',
            Description: '',
            Serial_no: '',
            Comments: '',
            Section: '',
            Type: '',
            Complaint_number: '',
            Model: ''
        }
        this.getStatus = this.getStatus.bind(this)
        this.status = this.status.bind(this)
        this.getData = this.getData.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.save = this.save.bind(this)
        this.sendNotification = this.sendNotification.bind(this)
        this.cancel = this.cancel.bind(this)
        this.changeModel = this.changeModel.bind(this)
        this.SelectModel = this.SelectModel.bind(this)
        this.attachments = this.attachments.bind(this)
    }

    async getData(){
        let statusList = await axios.get('http://localhost:8082/v1/1/complaintinfo', {
            params: { 
                API: "ABC",
                RID: this.state.RID,
                CID: this.state.CID,
                PID: this.state.PID,
            } 
        })
        this.setState({Firstname: statusList.data.Firstname})
        this.setState({Lastname: statusList.data.Lastname})
        this.setState({Phone: statusList.data.Phone})
        this.setState({Email: statusList.data.Email})
        this.setState({Description: statusList.data.Description})
        this.setState({Serial_no: statusList.data.Serial_no})
        this.setState({Purchase_number: statusList.data.Purchase_number})
        this.setState({Type: statusList.data.Type})
        this.setState({Comments: statusList.data.Comments})
        this.setState({Complaint_number: statusList.data.Complaint_number})
        this.setState({Model: statusList.data.Model})
        this.setState({SKU: statusList.data.SKU})
        this.setState({Manufacturer: statusList.data.Manufacturer})
        this.setState({Status: statusList.data.Status})
        if(statusList.data.Damage_date!=null){ this.setState({Damage_date: statusList.data.Damage_date.slice(0, 10)}) }
        else{ this.setState({Damage_date: null}) }
        if(statusList.data.Purchase_date!=null){ this.setState({Purchase_date: statusList.data.Purchase_date.slice(0, 16)}) }
        else{ this.setState({Purchase_date: null}) }
        this.setState({Notification: statusList.data.Notification})
        this.setState({Section: statusList.data.Section})

        if(statusList.data.Model!==null){
            this.setState({StartModel: true})
        }else{
            this.setState({StartModel: false})
        }
    }

    async getStatus(){
        let statusList = await axios.get('http://localhost:8082/v1/1/status', {params: { API: "ABC" } })
        this.setState({StatusList: statusList.data})
    }

    async componentDidMount(){
        this.setState({"RID": await this.props.state.RID})
        this.setState({"PID": await this.props.state.userData.PID})
        this.setState({"CID": await this.props.state.userData.CID})
        this.setState({"AllSection": await this.props.state.userData.AllWorkerSections})
        this.getData()
        this.getStatus()
    }

    async changeValue(e){
        if(e.target.name==="Notification"){ this.setState({Notification: !this.state.Notification}) }
        else{ this.setState({[e.target.name]: e.target.value}) }
    }

    print(){
        console.log("+++++++")
    }

    async sendNotification(){
        let resp = await axios.get('http://localhost:8082/v1/1/sendnotification', {
            params: { 
                API: "ABC",
                RID: this.state.RID,
                CID: this.state.CID
            }
        })
        if(resp.data==="ok"){ this.status(); this.setState({Succes: true}) }
        else{ this.status(); this.setState({Succes: false}) }
    }

    status(){
        this.setState({Save: true}); 
        setTimeout(function() {
            this.setState({Save: false}) 
        }.bind(this), 2500)
    }

    cancel(){
        this.getData()
        this.props.navChangePosition(6)
    }
    
    async save(){
        var firstName=false, lastName=false, phone=false, purchaseNumber =false, next = true

        if((""+this.state.Type).includes("Pogwarancyjna")){ firstName=true; lastName=true; phone=true; purchaseNumber=false; }
        else{
            switch(this.state.Type){
                case "Gwarancyjna":
                    firstName=true; lastName=true; phone=true; purchaseNumber=true;
                    break;
                case "Wewnętrzna":
                    break;
                case "Rękojmia":
                    firstName=true; lastName=true; phone=true;
                    break;
                default:
                    next=false
                    break;
            }
        }

        if(firstName){ if(this.state.Firstname===""){ next=false } }
        if(lastName){ if(this.state.Lastname===""){ next=false } }
        if(phone){ if(this.state.Phone===""){ next=false } }
        if(purchaseNumber){ if(this.state.Purchase_number===""){ next=false } }

        if(next){
            var model = null
            if(this.state.StartModel!==true){ model=this.state.Model }

            let updateComplaint = await axios.get('http://localhost:8082/v1/1/complaintupdate', {
                params: { 
                    API: "ABC",
                    RID: this.state.RID,
                    CID: this.state.CID,
                    PID: this.state.PID,
                    Firstname: ""+this.state.Firstname,
                    Lastname: ""+this.state.Lastname,
                    Phone: ""+this.state.Phone,
                    Email: ""+this.state.Email,
                    Description: ""+this.state.Description,
                    Serial_no: ""+this.state.Serial_no,
                    Purchase_number: ""+this.state.Purchase_number,
                    Purchase_date: ""+this.state.Purchase_date,
                    Damage_date: ""+this.state.Damage_date,
                    Comments: ""+this.state.Comments,
                    Notification: ""+this.state.Notification,
                    Status: ""+this.state.Status,
                    Section: ""+this.state.Section,
                    Model: model,
                    CC: "234242323423324"
                }
            })

            if(updateComplaint.data==="e"){ this.status(); this.setState({Succes: false}) }
            else{ 
                if(updateComplaint.data==="ok"){this.status(); this.setState({Succes: true}) }
                else{
                    this.props.setParameters("RID", this.state.RID)
                    this.props.setParameters("query", updateComplaint.data.query)
                    this.props.navChangePosition(updateComplaint.data.navChangePosition)
                }
            }
        }else{ this.status(); this.setState({Succes: false}) }

        this.getData()
    }

    changeModel(event){
        this.setState({Model: event.target.value})
    }

    SelectModel(a){
        try {
            this.setState({Model: a.target.parentNode.attributes[0].nodeValue})
        }
        catch(e){
            this.setState({Model: a.target.attributes[0].nodeValue})
        }
    }

    modelRespsnsive(){
        try{
            var inputWidth = document.getElementById("model").offsetWidth
            document.getElementById("modelandmanufacter").style.width = inputWidth+"px"
        }catch(e){ }
        setTimeout(() => {this.modelRespsnsive()}, 100)
    }

    attachments(){
        this.props.navChangePosition(8)
    }

    render(){
        this.modelRespsnsive()
        return(
            <div className="card shadow col-11 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary"><h6>Szczegóły reklamacji</h6></div>
                        <div>
                            {this.state.Save===true ? (
                                <div>{this.state.Succes===true ? (
                                    <img src="https://img.icons8.com/fluency/30/000000/ok.png" alt="" /> 
                                ) : (
                                    <img src="https://img.icons8.com/ios-filled/30/fa314a/xbox-x.png" alt="" />
                                ) }</div>  
                            ) : '' }
                        </div>
                    </div>
                </div>
                <div className="card-body overflow-auto">
                        <div className="row col-12">
                            <div className="col-12 col-lg-4">
                                <section>
                                    <h4 className="text-center">Status</h4>
                                    <select className="col-12 form-control" name="Status" onChange={this.changeValue} defaultValue={'DEFAULT'}>
                                        <option value="DEFAULT" selected disabled>Choose a salutation ...</option>
                                        {this.state.StatusList.map(item => {
                                            if(this.state.Status === item.Name){ return <option selected key={item._ID}>{item.Name}</option> }
                                            else{ return <option key={item._ID}>{item.Name}</option> }
                                        })}
                                    </select>
                                </section>
                                <section>
                                    <h4 className="text-center mt-2">Model i producent</h4>
                                    {this.state.StartModel===true ? (
                                        <input type="text" className="col-12 form-control" 
                                            disabled 
                                            value={ this.state.Model==null ? undefined : this.state.Model+" => "+(this.state.SKU!==null ? this.state.SKU : 'undefinedSKU')+" ("+this.state.Manufacturer+")" } 
                                        />
                                    ) : (
                                        <div>
                                            <input required={true} id="model" autoComplete="off" type="text" className="col-12 form-control" 
                                                value={ this.state.Model } 
                                                onChange={this.changeModel} name="Model" />
                                            <div id="modelandmanufacter" className="col-12 col-md-4">
                                                <ModelAndManufacter query={this.state.Model} change={this.SelectModel} />
                                            </div>  
                                        </div>
                                    )}
                                </section>
                                <section>
                                    <h4 className="text-center mt-2">Dział</h4>
                                    <select className="col-12 form-control" onChange={this.changeValue} name="Section" defaultValue={'DEFAULT'}>
                                        <option value="DEFAULT" selected disabled>Choose a salutation ...</option>
                                        {this.state.AllSection.map(item => {
                                            if(this.state.Section === item.Name){ return <option selected key={item._ID}>{item.Name}</option> }
                                            else{ return <option key={item._ID}>{item.Name}</option> }
                                        })}
                                    </select>
                                </section>
                                <section>
                                    <h4 className="text-center mt-2">Dane</h4>
                                    <label className="col-12" style={{marginTop: "-30px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Imie</strong></span>
                                        <input type="text" className="form-control mt-0" value={this.state.Firstname} name="Firstname" onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Nazwisko</strong></span>
                                        <input type="text" className="form-control mt-0" value={this.state.Lastname} name="Lastname" onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Telefon</strong></span>
                                        <input type="text" className="form-control mt-0" value={this.state.Phone} name="Phone" onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Email</strong></span>
                                        <input type="text" className="form-control mt-0" value={this.state.Email} name="Email" onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Nr. seryjny</strong></span>
                                        <input type="text" className="form-control mt-0" value={this.state.Serial_no} name="Serial_no" onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                </section>
                            </div>
                            <div className="col-12 col-lg-4">
                                <section>
                                    <label className="col-12" style={{marginTop: "-5px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Nr. dowodu zakupu</strong></span>
                                        <input type="text" className="form-control mt-0" value={this.state.Purchase_number} name="Purchase_number" onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Rodzaj reklamacji</strong></span>
                                        <input type="text" disabled className="form-control mt-0" value={this.state.Type} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Data powstania wady</strong></span>
                                        <input type="date" className="form-control mt-0" name="Damage_date" value={this.state.Damage_date!=null ? this.state.Damage_date : ''} onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Data zakupu</strong></span>
                                        <input type="datetime-local" className="form-control mt-0" name="Purchase_date" value={this.state.Purchase_date!=null ? this.state.Purchase_date : ''} onChange={this.changeValue} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                    <label className="col-12" style={{marginTop: "-10px"}}>
                                        <span style={{top: "20px", left: "10px", fontSize: "13px", position: "relative", color: "#0d6efd"}}><strong>Nr. reklamacji</strong></span>
                                        <input type="text" disabled className="form-control mt-0" value={this.state.Complaint_number} style={{padding: "0px", paddingTop: "15px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} />
                                    </label>
                                </section>
                                <section>
                                    <h4 className="text-center mt-2">Opis usterki</h4>
                                    <textarea rows="3" className="form-control col-12" name="Description" value={this.state.Description} onChange={this.changeValue} ></textarea>
                                </section>
                                <section>
                                    <h4 className="text-center mt-2">Uwagi</h4>
                                    <textarea rows="3" className="form-control col-12" name="Comments" value={this.state.Comments} onChange={this.changeValue} ></textarea>
                                </section>
                            </div>
                            <div className="col-12 col-lg-4">
                                <section>
                                    <h4 className="text-center">Opcja dodatkowe</h4>
                                    <div className="form-check form-switch mb-3">
                                        <label className="form-check-label">
                                            <input className="form-check-input" type="checkbox" checked={this.state.Notification} name="Notification" onChange={this.changeValue} />
                                            Powiadamiaj o zmianie statusu
                                        </label>
                                    </div>
                                </section>
                                <section>
                                    <button className="btn btn-outline-primary mt-2 col-12" onClick={this.attachments}>Załączniki</button><br />
                                    <button className="btn btn-success mt-1 col-12" onClick={this.sendNotification}>Powiadom ręcznie o zmianie statusu</button><br />
                                    <button className="btn btn-primary mt-3 col-12" onClick={this.save}>Zapis</button><br />
                                    <button className="btn btn-danger mt-1 col-12" onClick={this.cancel}>Anuluj</button>
                                </section>
                                <section>
                                    <h4 className="text-center mt-3">Wydruki</h4>
                                    <form className="row col-12" onSubmit={this.print}>
                                        <div className="col-12 col-lg-6">
                                            <h6>Potwierdzenie zgłoszenia reklamcaji</h6>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="radio" name="confirmContent"/>
                                                    Brak
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="radio" name="confirmContent"/>
                                                    Małe
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="radio" name="confirmContent"/>
                                                    Duże, strona dla klienta
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="radio" name="confirmContent"/>
                                                    Duże, strona sklepu
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-xcheck-label">
                                                    <input className="form-check-input" type="radio" name="confirmContent"/>
                                                    Duże, strona dla klienta i sklepu
                                                </label>
                                            </div>
                                        </div><div className="col-12 col-lg-6">
                                            <br /><h6>Karta dla serwisu</h6>
                                            <div>
                                                <div className="form-check">
                                                    <label className="form-check-label">
                                                        <input className="form-check-input" type="radio" name="addCard"/>
                                                        Brak
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <label className="form-check-label">
                                                        <input className="form-check-input" type="radio" name="addCard"/>
                                                        Tak, pusta
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <label className="form-check-label">
                                                        <input className="form-check-input" type="radio" name="addCard"/>
                                                        Tak, uzupełniona
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary">Drukuj</button>
                                    </form>
                                </section>
                            </div>
                        </div>
                    {/* </form> */}
                </div>
            </div>
        )
    }
}

export default ComplaintList