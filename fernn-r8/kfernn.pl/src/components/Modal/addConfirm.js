import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'

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
            UploadAll: true
        }

        this.changeQueryValue = this.changeQueryValue.bind(this)
        this.changeManufacter = this.changeManufacter.bind(this)
        this.setManufacter = this.setManufacter.bind(this)
        this.selectModel = this.selectModel.bind(this)
        this.manufacterRespsnsive = this.manufacterRespsnsive.bind(this)
    }
    // async componentDidUpdate() {
    //     if(this.state.old!==this.state.query){
    //         this.setState({old: this.state.query})
    //         let userData = await axios.get('http://localhost:8082/v1/1/models', {
    //             params: {
    //                 API: "ABC",
    //                 query: this.state.query,
    //                 session: '1'
    //             }
    //         });
    //         this.setState({Result: userData.data})
    //     }

    //     if(this.state.manufacterold!==this.state.manufacter){
    //         this.setState({manufacterold: this.state.manufacter})
    //         let userData = await axios.get('http://localhost:8082/v1/1/manufacters', {
    //             params: {
    //                 API: "ABC",
    //                 query: this.state.manufacter
    //             }
    //         });
    //         this.setState({ManufacterArr: userData.data})
    //     }
    //     return true
    // }

    async componentDidMount(){
        this.setState({"query": this.props.state.Query})
        this.setState({"RID": this.props.state.RID})
        this.setState({"Code": this.props.state.Code})
        this.setState({"AddSteps": this.props.state.AddSteps})
        this.setState({"UploadAll": this.props.state.UploadAll})
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
        event.preventDefault();
        console.log("event")
        let userData = await axios.get('http://localhost:8082/v1/1/add/2', {
            params: {
                API: "ABC",
                ID: event.target.value,
                RID: this.state.RID,
                Code: this.state.Code,
                nextSteps: this.state.AddSteps
            }
        });
        console.log("userData.data")
        console.log(userData.data)
        console.log(userData.data.nextStep[0])
        
        cookie.save("AddSteps", userData.data.nextStep, {maxAge: 30})
        cookie.save("RID", userData.data.RID, {maxAge: 30})
        cookie.save("Code", userData.data.Code, {maxAge: 30})
        this.props.navChangePosition(userData.data.nextStep[1])
    }

    render(){
        this.manufacterRespsnsive()
        return(
            <div>
                <div className="card shadow col-11 mt-3 m-auto mb-5">
                    <div className="card-header py-3">
                        <div className="d-flex justify-content-between align-items-stretch flex-fill">
                            <h6 className="m-0 font-weight-bold text-primary">Dodawanie reklamacji</h6>
                            <h6 className="m-0 font-weight-bold text-primary">5 z 5</h6>
                        </div>
                    </div>
                    <div className="card-body m-0 overflow-auto">
                        {this.state.UploadAll==="false" ? (
                            <div className="alert alert-warning" role="alert">
                                <h3>Przekroczono dozwolon?? liczb?? za????cznik??w!</h3>
                                <p>Z powodu przekroczenia dozwolonej liczby za????cznik??w wgrane zosta??y tylko wybrane. Aby muc wgrywa?? wi??cej za????cznik??w przejd?? na wy??szy plan.</p>
                            </div>
                        ) : ''}
                        <h3>Reklamacja zosta??a dodana. Wybierz nast??pne dzia??anie.</h3><br />
                        {/* <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Drukuj mini potwierdzenie</a>
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Drukuj max potwierdzenie</a>
                        </div><br /><br />
                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Karta zg??oszenia reklamacji</a>
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Drukuj mini potwierdzenie z kart?? zg??oszenia reklamacji</a>
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Drukuj max potwierdzenie z kart?? zg??oszenia reklamacji</a>
                        </div><br /><br />
                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Strona serwisu</a>
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Edytuj reklamcj??</a>
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Dodaj kolejn?? reklamacj??</a>
                            <a type="button" className="btn btn-outline-primary" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Powr??t do home</a>
                        </div> */}
                        <div className="row col-12">
                            <div className="col-12 col-md-6">
                                <h3 className="text-center">Akcje</h3>
                                <div className="text-center">
                                    <a type="button" className="btn btn-outline-primary mt-2" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Otw??rz stron?? serwisu</a><br />
                                    <a type="button" className="btn btn-outline-primary mt-2" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Edytuj reklamcj??</a><br />
                                    <a type="button" className="btn btn-outline-primary mt-2" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Dodaj kolejn?? reklamacj??</a><br />
                                    <a type="button" className="btn btn-outline-primary mt-2" href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min">Powr??t do home</a>
                                </div>
                            </div><div className="col-12 col-md-6">
                                <h3 className="text-center">Drukowanie</h3>
                                <form className="row col-12">
                                    <div className="col-6">
                                        <h6>Potwierdzenie zg??oszenia reklamcaji</h6>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input className="form-check-input" type="radio" name="confirmContent"/>
                                                Brak
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input className="form-check-input" type="radio" name="confirmContent"/>
                                                Ma??e
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input className="form-check-input" type="radio" name="confirmContent"/>
                                                Du??e, strona dla klienta
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input className="form-check-input" type="radio" name="confirmContent"/>
                                                Du??e, strona sklepu
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <label className="form-xcheck-label">
                                                <input className="form-check-input" type="radio" name="confirmContent"/>
                                                Du??e, strona dla klienta i sklepu
                                            </label>
                                        </div>
                                    </div><div className="col-6">
                                        <br /><h6>Karta zg??oszenia reklamacji</h6>
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
                                                Tak, uzupe??niona
                                            </label>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary">Drukuj</button>
                                </form>
                            </div>
                        </div>
                        {/* <a href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=min" className="btn btn-primary" target="_blank">Strona serwisu</a>
                        <a href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=max" className="btn btn-primary" target="_blank">Edytuj reklamcj??</a>
                        <a href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=complaintcard&card={{ Card }}" className="btn btn-primary" target="_blank">Dodaj kolejn?? reklamacj??</a>
                        <a href="http://pdf.fernn.pl/?code={{ Code }}&RID={{ RID }}&CID={{ CID }}&type=fullmini&card={{ Card }}" className="btn btn-primary" target="_blank">Powr??t do home</a>
                        <a href="{{ Servis }}" className="btn btn-primary" target="_blank">Strona serwisu</a>
                        <a href="/a/add" className="btn btn-primary">Dodaj kolejn?? reklamacj??</a>
                        <a href="/a/home" className="btn btn-primary">Powr??t do home</a> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default AddSelectModel