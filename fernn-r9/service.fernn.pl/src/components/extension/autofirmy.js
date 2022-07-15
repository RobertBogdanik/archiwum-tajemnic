import React from 'react'
import axios from 'axios'

class FirmyAuto extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            firmyauto: [],
            page: 0
        }
        this.next = this.next.bind(this)
        this.previous = this.previous.bind(this)
        this.getData = this.getData.bind(this)
        this.add = this.add.bind(this)
        this.sendmessage = this.sendmessage.bind(this)
        this.cancel = this.cancel.bind(this)
        this.changeValue = this.changeValue.bind(this)
    }
    next(){
        const act = this.state.page + 1
        if(act<this.state.firmyauto.length)
            this.setState({page: act})
    }
    previous(){
        const act = this.state.page- 1
        if(act>=0)
            this.setState({page: act})
    }
    async componentDidMount(){
        this.getData(true)
        this.setState({ start: Date.now() })
        setInterval(() => this.setState({ actual: Date.now() }), 1000);
    }
    async componentDidUpdate() {
        if((this.state.actual - this.state.start) > 10000){
            this.setState({start: this.state.actual})
            this.getData(false)
        }
    }
    async getData(opt){
        axios.get('http://localhost:8081/v1/1/operacje/5', {
            params: {
                API: "ABC"
            }
        }).then((resu) => {
            if(opt){ this.setState({firmyauto: resu.data}) }
            else{
                let dodane = this.state.firmyauto
                for (const el of resu.data) {
                    let find = false
                    for (const ele of this.state.firmyauto) {
                        if(el._ID === ele._ID){ find=true }
                    }
                    if(!find){ dodane.push(el)  }
                }
                this.setState({firmyauto: dodane})
            }
        })
    }
    async add(e){
        const result = await axios.get('http://localhost:8081/v1/1/zatwierdzenia/5', {
            params: {
                API: "ABC",
                Info: this.state.firmyauto[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.firmyauto.length<=1){ this.setState({firmyauto: undefined}); return true; }
            if(this.state.page>=this.state.firmyauto.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.firmyauto
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({firmyauto: arch})
        }else{ alert("Błąd operacji") }
    }
    async sendmessage(e){
        const result = await axios.get('http://localhost:8081/v1/1/send/5', {
            params: {
                API: "ABC",
                Info: this.state.firmyauto[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.firmyauto.length<=1){ this.setState({firmyauto: undefined}); return true; }
            if(this.state.page>=this.state.firmyauto.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.firmyauto
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({firmyauto: arch})
        }else{ alert("Błąd operacji") }
    }
    async cancel(e){
        const result = await axios.get('http://localhost:8081/v1/1/odmowa/5', {
            params: {
                API: "ABC",
                Info: this.state.firmyauto[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.firmyauto.length<=1){ this.setState({firmyauto: undefined}); return true; }
            if(this.state.page>=this.state.firmyauto.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.firmyauto
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({firmyauto: arch})
        }else{ alert("Błąd operacji") }
    }
    changeValue(e){
        const arch = this.state.firmyauto
        arch[e.target.attributes[1].nodeValue][e.target.attributes[2].nodeValue] = e.target.value
        this.setState({firmyauto: arch})
    }
    render(){
        return (
            <div>
                <div className="modal fade model-xl" id="firmyauto" aria-hidden="true" aria-labelledby="firmyauto">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content bg-secondary">
                            <div className="modal-header">
                                <h5 className="modal-title" id="firmyauto">Firmy auto</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            {Array.isArray(this.state.firmyauto)===true && this.state.firmyauto.length>0 ? <div>
                                <div className="modal-body col-12 row">
                                    <div className="row col-12 col-md-8">
                                        Plan
                                        <input type="text" value={this.state.firmyauto[this.state.page].Plan}  placeholder="Plan" className="form-control mb-2" />
                                        Ile reklamacji
                                        <input type="text" value={this.state.firmyauto[this.state.page].Complaints}  placeholder="Ile reklamacji" className="form-control mb-2" />
                                        Ile kont
                                        <input type="text" value={this.state.firmyauto[this.state.page].Account}  placeholder="Ile kont" className="form-control mb-2" />
                                        Ile załączników
                                        <input type="text" value={this.state.firmyauto[this.state.page].Attachment}  placeholder="Ile załączników" className="form-control mb-2" />
                                        Powiadomienia
                                        <input type="text" value={this.state.firmyauto[this.state.page].Notifications}  placeholder="Powiadomienia" className="form-control mb-2" />
                                        Raporty
                                        <input type="text" value={this.state.firmyauto[this.state.page].Report}  placeholder="Raporty" className="form-control mb-2" />
                                        Nazwa
                                        <input type="text" value={this.state.firmyauto[this.state.page].Name}  placeholder="Nazwa" className="form-control mb-2" />
                                        Administrator - imię
                                        <input type="text" value={this.state.firmyauto[this.state.page].Firstname}  placeholder="Administrator - imię" className="form-control mb-2" />
                                        Administrator - nazwisko
                                        <input type="text" value={this.state.firmyauto[this.state.page].Lastname}  placeholder="Administrator - nazwisko" className="form-control mb-2" />
                                        Email
                                        <input type="text" value={this.state.firmyauto[this.state.page].Email}  placeholder="Email" className="form-control mb-2" />
                                        NIP
                                        <input type="text" value={this.state.firmyauto[this.state.page].NIP}  placeholder="NIP" className="form-control mt-2" />
                                        Telefon
                                        <input type="text" value={this.state.firmyauto[this.state.page].Phone}  placeholder="Telefon" className="form-control mt-2" />
                                        Adress
                                        <input type="text" value={this.state.firmyauto[this.state.page].Adress}  placeholder="Adress" className="form-control mt-2" />
                                    </div>
                                    <div className="col-12 col-md-4">
                                    <textarea className="col-12 mt-3 form-control" id={this.state.page} name="Message" onChange={this.changeValue} value={this.state.firmyauto[this.state.page].Message} placeholder="wiadomość"></textarea>
                                        <button className="btn btn-primary col-12  mt-3" id={this.state.page} onClick={this.add}>Zatwierdź</button>
                                        <button className="btn btn-warning col-12  mt-3" id={this.state.page} onClick={this.sendmessage}>Wyślij wiadomość</button>
                                        <button className="btn btn-danger col-12  mt-3" id={this.state.page} onClick={this.cancel}>Zablokuj</button>
                                        <button className="btn btn-primary col-12  mt-5" onClick={this.next}>Dalej</button>
                                        <button className="btn btn-primary col-12  mt-3" onClick={this.previous}>Poprzedni</button>
                                    </div>
                                </div>
                            </div> : ''}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FirmyAuto