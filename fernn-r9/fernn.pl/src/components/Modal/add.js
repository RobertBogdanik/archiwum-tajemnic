import React from 'react'
import axios from 'axios'
// import cookie from 'react-cookies'
import StatusList from '../Modal/statusList'
import ModelAndManufacter from '../Modal/modelAndManufacter'
import WorkerSectionList from '../Modal/WorkerSectionList'

class Add extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            Model: '',
            Section: '',
            FirstName: '',
            BoolFirstName: true,
            LastName: '',
            BoolLastName: true,
            Phone: '',
            BoolPhone: true,
            Email: '',
            Attachment: false,
            Delivery: false,
            Notyfication: true,
            Description: '',
            Comments: '',
            Status: '',
            Expectations: 0,
            BoolExpectations: true,
            Serial_no: '',
            Purchase_number: '',
            BoolPurchase_number: true,
            Purchase_date: '',
            Damage_date: '',
            Type: 0,
            ToAmount: '',
            ToAmountBool: false,
            GoToNextStep: true,
            inWaitModel: false
        }
    
        this.ChangeValue = this.ChangeValue.bind(this);
        this.GetFormData = this.GetFormData.bind(this);
        this.SelectModel = this.SelectModel.bind(this);
        this.SelectSection = this.SelectSection.bind(this);
        this.modelRespsnsive = this.modelRespsnsive.bind(this);
        this.SelectStatus = this.SelectStatus.bind(this);
    }

    modelRespsnsive(){
        try{
            var inputWidth = document.getElementById("model").offsetWidth
            document.getElementById("modelandmanufacter").style.width = inputWidth+"px"
        }catch(e){ }
        setTimeout(() => {this.modelRespsnsive()}, 100)
    }

    ChangeValue(event){
        if(event.target.type === 'checkbox'){
            if(event.target.checked){
                console.log(event.target.name)
                this.setState({[event.target.name]: true})
            }else{
                this.setState({[event.target.name]: false})
            }
        }else{
            if(event.target.name==="Expectations"){
                switch(event.target.value){
                    case "Naprawa":
                        this.setState({Expectations: 0});
                        break;
                    case "Wymiana":
                        this.setState({Expectations: 1});
                        break;
                    case "Zwrot (gotówki)":
                        this.setState({Expectations: 2});
                        break;
                    default:
                        break;
                }
            }else{
                if(event.target.name==="Type"){
                    switch(event.target.value){
                        case "Gwarancyjna":
                            this.setState({Type: 0});
                            this.setState({ToAmountBool: false});
                            this.setState({BoolFirstName: true});
                            this.setState({BoolLastName: true});
                            this.setState({BoolPhone: true});
                            this.setState({BoolPurchase_number: true});
                            this.setState({BoolPurchase_number: false});
                            this.setState({BoolExpectations: true});
                            break;
                        case "Pogwarancyjna do kwoty":
                            this.setState({Type: 1});
                            this.setState({ToAmountBool: true});
                            this.setState({BoolFirstName: true});
                            this.setState({BoolLastName: true});
                            this.setState({BoolPhone: true});
                            this.setState({BoolPurchase_number: false});
                            this.setState({BoolExpectations: true});
                            break;
                        case "Wewnętrzna":
                            this.setState({Type: 2});
                            this.setState({ToAmountBool: false});
                            this.setState({BoolFirstName: false});
                            this.setState({BoolLastName: false});
                            this.setState({BoolPhone: false});
                            this.setState({BoolPurchase_number: false});
                            this.setState({BoolExpectations: false});
                            break;
                        case "Rękojmia":
                            this.setState({Type: 3});
                            this.setState({ToAmountBool: false});
                            this.setState({BoolFirstName: true});
                            this.setState({BoolLastName: true});
                            this.setState({BoolPhone: true});
                            this.setState({BoolPurchase_number: true});
                            this.setState({BoolExpectations: true});
                            break;
                        default:
                            break;
                    }
                }else{
                    var name = event.target.name
                    this.setState({[name]: event.target.value});
                    console.log(this.state)
                }
            }
        }
    }
    async GetFormData(event) {
        console.log(this.state)
        event.preventDefault();
        let statusList = await axios.get('http://localhost:8082/v1/1/add/1', {
            params: { 
                API: "ABC",
                data: this.state,
                userData: this.props.state.userData
            }
        });
        this.props.setParameters("AddSteps", statusList.data.nextStep)
        this.props.setParameters("RID", statusList.data.RID)
        this.props.setParameters("Code", statusList.data.Code)
        this.props.setParameters("Query", this.state.Model)
        
        this.props.navChangePosition(statusList.data.nextStep[0])
    }

    SelectModel(a){
        try {
            this.setState({"Model": a.target.parentNode.attributes[0].nodeValue})
        }
        catch(e){
            this.setState({"Model": a.target.attributes[0].nodeValue})
        }
    }

    SelectSection(a){
        this.setState({"Section": a.target.value})
    }

    SelectStatus(a){
        this.setState({"Status": a.target.value})
    }

    async componentDidMount(){
        const cook = this.props.state.userData
        console.log(this.props.state.userData)
        if(cook.SectionName!=null){
            this.setState({"Section": cook.SectionName.Name})
        }else{
            this.setState({"Section": cook.AllWorkerSections[0].Name})
        }

        let statusList = await axios.get('http://localhost:8082/v1/1/status', {
            params: { API: "ABC" }
        });

        this.setState({"Status": statusList.data[0].Name})
    }

    render(){
        this.modelRespsnsive()
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill">
                        <h6 className="m-0 font-weight-bold text-primary">Dodawanie reklamacji</h6>
                        <h6 className="m-0 font-weight-bold text-primary">1 z 5</h6>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={this.GetFormData}>
                        <div className="row">
                            <div className="col-12 col-lg-4">
                                <div className="Columns">
                                    <section>
                                        <h2 className="AreaH2">Model i producent</h2>
                                        <input type="text" name="Model" className="col-12 form-control " required id="model" value={this.state.Model} onChange={this.ChangeValue} autoComplete="off" />
                                        <div id="modelandmanufacter" className="col-12 col-md-4">
                                            <ModelAndManufacter query={this.state.Model} change={this.SelectModel} />
                                        </div>
                                    </section>
                                    <section>
                                        <h2 className="AreaH2">Dział</h2>
                                        <WorkerSectionList change={this.SelectSection} value={this.state.Section} />
                                    </section>
                                    <section>
                                        <h2 className="AreaH2">Dane klienta</h2>
                                        <input type="text" placeholder="Nazwisko" className="col-12 DanaKlienta form-control " id="nazwisko" name="LastName" required={this.state.BoolFirstName?true:false} value={this.state.LastName} onChange={this.ChangeValue}/>
                                        <input type="text" id="imie" className="col-12 DanaKlienta form-control " name="FirstName" required={this.state.BoolLastName?true:false} value={this.state.FirstName} onChange={this.ChangeValue} placeholder="Imię" />
                                        <input type="text" id="telefon" className="col-12 DanaKlienta form-control " placeholder="Telefon" name="Phone" required={this.state.BoolPhone?true:false} value={this.state.Phone} onChange={this.ChangeValue} />
                                        <input type="text" id="email" className="col-12 DanaKlienta form-control " placeholder="Email" name="Email" value={this.state.Email} onChange={this.ChangeValue} />
                                    </section>                      
                                    <section>
                                        <h2 className="AreaH2">Opcje dodatkowe</h2>
                                        <div>
                                            <div className="form-check form-switch">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="checkbox" name="Attachment" id="file" value={this.state.Attachment} onChange={this.ChangeValue} />
                                                    Dodaj załączniki
                                                </label>
                                            </div>
                                            <div className="form-check form-switch">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="checkbox" name="Delivery" id="delivery" value={this.state.Delivery} onChange={this.ChangeValue}/>
                                                    Zawiadom kuriera
                                                </label>
                                            </div>
                                            <div className="form-check form-switch">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="checkbox" name="Notyfication" id="zmianainfo" value={this.state.Notyfication} onChange={this.ChangeValue} checked={this.state.Notyfication ? true : false}/>
                                                    Powiadamiaj o zmianie statusu
                                                </label>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>     
                            <div className="col-12 col-lg-4">
                                <div className="Columns">
                                    <section>
                                        <h2 className="AreaH2">Opis usterki</h2>
                                        <textarea className="col-12 form-control" rows="4" name="Description" value={this.state.Description} onChange={this.ChangeValue}></textarea>
                                    </section>
                                    <section>
                                        <h2 className="AreaH2">Uwagi</h2>
                                        <textarea className="col-12 form-control" rows="3" name="Comments" value={this.state.Comments} onChange={this.ChangeValue}></textarea>
                                    </section>
                                    <section>
                                        <h2 className="AreaH2">Status początkowy</h2>
                                        <StatusList change={this.SelectStatus} value={this.state.Status} />
                                    </section>   
                                    <section>
                                        <h2 className="AreaH2">Oczekiwania</h2>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input type="radio" name="Expectations" className="form-check-input oczekiwania" defaultChecked={true} value="Naprawa" onChange={this.ChangeValue} disabled={this.state.BoolExpectations ? false : true}/>
                                                    Naprawa
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input type="radio" name="Expectations" className="form-check-input oczekiwania" value="Wymiana" onChange={this.ChangeValue} disabled={this.state.BoolExpectations ? false : true} />
                                                    Wymiana
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label" >
                                                    <input type="radio" name="Expectations" className="form-check-input oczekiwania" value="Zwrot (gotówki)" onChange={this.ChangeValue} disabled={this.state.BoolExpectations ? false : true} />
                                                    Zwrot (gotówki)
                                                </label>
                                            </div>
                                    </section>
                                </div>
                            </div>     
                            <div className="col-12 col-lg-4">
                                <div className="Columns">   
                                    <section>
                                        <h2 className="AreaH2">Dane produktu</h2> 
                                        <input type="text" name="Serial_no" className="col-12 form-control " placeholder="Nr. seryjny" value={this.state.Serial_no} onChange={this.ChangeValue} /><br />
                                        <input type="text" name="Purchase_number" className="col-12 form-control " id="dowodu" placeholder="Nr. dowodu zakupu" required={this.state.BoolPurchase_number?true:false} value={this.state.Purchase_number} onChange={this.ChangeValue} />
                                        <span className="d-flex justify-content-between align-items-center flex-fill">
                                            <span className="col-6">Data powstania wady</span>
                                            <span className="col-6">
                                                <input type="date" name="Damage_date" className="form-control  col-6" placeholder="Data powstania wady" value={this.state.Damage_date} onChange={this.ChangeValue} />
                                            </span>
                                        </span>
                                        <span className="d-flex justify-content-between align-items-center flex-fill">
                                            <span className="col-4">Data zakupu</span>
                                            <span className="col-8">
                                                <input type="datetime-local" name="Purchase_date" className="form-control form-control " placeholder="Data zakupu" value={this.state.Purchase_date} onChange={this.ChangeValue} />
                                            </span>
                                        </span>
                                    </section>
                                    <section> 
                                        <h2 className="AreaH2">Rodzaj reklamacji</h2>
                                        <div>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input type="radio" name="Type" className="form-check-input" value="Gwarancyjna" id="gwarancyjna" onChange={this.ChangeValue} checked={this.state.Type===0 ? true : false}/>
                                                    Gwarancyjna
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input type="radio" name="Type" className="form-check-input" value="Pogwarancyjna do kwoty" id="pogwarancyjna" onChange={this.ChangeValue}  checked={this.state.Type===1?true:false} />
                                                    Pogwarancyjna do kwoty
                                                    {this.state.ToAmountBool===true ? <input type="number" name="ToAmount" id="toAmount"  className="form-control form-control " onChange={this.ChangeValue} /> : <input type="number" name="ToAmount" id="toAmount"  className="form-control form-control " disabled onChange={this.ChangeValue} />}
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label" >
                                                    <input type="radio" name="Type" className="form-check-input oczekiwania" value="Wewnętrzna" onChange={this.ChangeValue} />
                                                    Wewnętrzna
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label"> 
                                                    <input type="radio" name="Type" className="form-check-input" value="Rękojmia" id="rekojmia" onChange={this.ChangeValue} checked={this.state.Type===3?true:false} />
                                                    Rękojmia 
                                                </label>
                                            </div>
                                        </div>
                                    </section>
                                    <section className="text-center mt-3">
                                        {this.state.GoToNextStep===true ? <input type="submit" className="btn btn-primary col-12" value="Dalej" /> : <input type="button" className="btn btn-danger col-12" value="Przejdź na wyższy plan aby móc dalej dodawać reklamacje." />}                                
                                    </section>
                                </div>
                            </div>  
                        </div>
                    </form> 
                </div>
            </div>
        )
    }
}

export default Add