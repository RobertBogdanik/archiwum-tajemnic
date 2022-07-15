import React from 'react'
import axios from 'axios'

class Zgloszone extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            zgloszone: undefined,
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
        if(act<this.state.zgloszone.length)
            this.setState({page: act})
    }
    previous(){
        const act = this.state.page - 1
        if(act>=0){ this.setState({page: act}) }
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
        axios.get('http://localhost:8081/v1/1/operacje/1', {
            params: {
                API: "ABC"
            }
        }).then((resu) => {
            if(opt){ this.setState({zgloszone: resu.data}) }
            else{
                let dodane = this.state.zgloszone
                for (const el of resu.data) {
                    let find = false
                    for (const ele of this.state.zgloszone) {
                        if(el._ID === ele._ID){ find=true }
                    }
                    if(!find){ dodane.push(el)  }
                }
                this.setState({zgloszone: dodane})
            }
        })
    }
    async add(e){
        const result = await axios.get('http://localhost:8081/v1/1/zatwierdzenia/1', {
            params: {
                API: "ABC",
                Info: this.state.zgloszone[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.zgloszone.length<=1){ this.setState({zgloszone: undefined}); return true; }
            if(this.state.page>=this.state.zgloszone.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.zgloszone
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({zgloszone: arch})
        }else{ alert("Błąd operacji") }
    }
    async sendmessage(e){
        const result = await axios.get('http://localhost:8081/v1/1/send/1', {
            params: {
                API: "ABC",
                Info: this.state.zgloszone[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.zgloszone.length<=1){ this.setState({zgloszone: undefined}); return true; }
            if(this.state.page>=this.state.zgloszone.length-1){ this.setState({page: this.state.page-1}) }
        }else{ alert("Błąd operacji") }
    }
    async cancel(e){
        const result = await axios.get('http://localhost:8081/v1/1/odmowa/1', {
            params: {
                API: "ABC",
                Info: this.state.zgloszone[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.zgloszone.length<=1){ this.setState({zgloszone: undefined}); return true; }
            if(this.state.page>=this.state.zgloszone.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.zgloszone
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({zgloszone: arch})
        }else{ alert("Błąd operacji") }
    }
    changeValue(e){
        const arch = this.state.zgloszone
        arch[e.target.attributes[1].nodeValue][e.target.attributes[2].nodeValue] = e.target.value
        this.setState({zgloszone: arch})
    }
    render(){
        return (
            <div>
                <div className="modal fade model-xl" id="zgloszenia" aria-hidden="true" aria-labelledby="zgloszenia">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content bg-secondary">
                            <div className="modal-header">
                                <h5 className="modal-title" id="zgloszenia">Zgłoszenia</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            {Array.isArray(this.state.zgloszone)===true && this.state.zgloszone.length>0 ? <div>
                                <div className="modal-body col-12 row">
                                    <div className="col-12 col-md-8 m-0">
                                        Plan
                                        <input type="text" id={this.state.page} name="Data1" value={this.state.zgloszone[this.state.page].Data1} onChange={this.changeValue} placeholder="Plan" className="form-control mb-2" />
                                        Ile reklamacji
                                        <input type="text" id={this.state.page} name="Data2" value={this.state.zgloszone[this.state.page].Data2} onChange={this.changeValue} placeholder="Ile reklamacji" className="form-control mb-2" />
                                        Ile kont
                                        <input type="text" id={this.state.page} name="Data3" value={this.state.zgloszone[this.state.page].Data3} onChange={this.changeValue} placeholder="Ile kont" className="form-control mb-2" />
                                        Ile załączników
                                        <input type="text" id={this.state.page} name="Data4" value={this.state.zgloszone[this.state.page].Data4} onChange={this.changeValue} placeholder="Ile załączników" className="form-control mb-2" />
                                        Powiadomienia
                                        <input type="text" id={this.state.page} name="Data5" value={this.state.zgloszone[this.state.page].Data5} onChange={this.changeValue} placeholder="Powiadomienia" className="form-control mb-2" />
                                        Raporty
                                        <input type="text" id={this.state.page} name="Data6" value={this.state.zgloszone[this.state.page].Data6} onChange={this.changeValue} placeholder="Raporty" className="form-control mb-2" />
                                        Inne dostosowania
                                        <input type="text" id={this.state.page} name="Data7" value={this.state.zgloszone[this.state.page].Data7} onChange={this.changeValue} placeholder="Inne dostosowania" className="form-control mb-2" />
                                        Nazwa
                                        <input type="text" id={this.state.page} name="Data8" value={this.state.zgloszone[this.state.page].Data8} onChange={this.changeValue} placeholder="Nazwa" className="form-control mb-2" />
                                        Administrator - imię
                                        <input type="text" id={this.state.page} name="Data9" value={this.state.zgloszone[this.state.page].Data9} onChange={this.changeValue} placeholder="Administrator - imię" className="form-control mb-2" />
                                        Administrator - nazwisko
                                        <input type="text" id={this.state.page} name="Data10" value={this.state.zgloszone[this.state.page].Data10} onChange={this.changeValue} placeholder="Administrator - nazwisko" className="form-control mb-2" />
                                        Email
                                        <input type="text" id={this.state.page} name="Data11" value={this.state.zgloszone[this.state.page].Data11} onChange={this.changeValue} placeholder="Email" className="form-control mb-2" />
                                        NIP
                                        <input type="text" id={this.state.page} name="Data12" value={this.state.zgloszone[this.state.page].Data12} onChange={this.changeValue} placeholder="NIP" className="form-control mt-2" />
                                        Telefon
                                        <input type="text" id={this.state.page} name="Data13" value={this.state.zgloszone[this.state.page].Data13} onChange={this.changeValue} placeholder="Telefon" className="form-control mt-2" />
                                        Adress
                                        <input type="text" id={this.state.page} name="Data14" value={this.state.zgloszone[this.state.page].Data14} onChange={this.changeValue} placeholder="Adress" className="form-control mt-2" />
                                    </div>
                                    <div className="col-12 col-md-4 m-0">
                                        <textarea className="col-12 mt-3 form-control" id={this.state.page} name="Message" onChange={this.changeValue} value={this.state.zgloszone[this.state.page].Message} placeholder="wiadomość"></textarea>
                                        <button className="btn btn-primary col-12  mt-3" id={this.state.page} onClick={this.add}>Zatwierdź</button>
                                        <button className="btn btn-warning col-12  mt-3" id={this.state.page} onClick={this.sendmessage}>Wyślij wiadomość</button>
                                        <button className="btn btn-danger col-12  mt-3" id={this.state.page} onClick={this.cancel}>Odrzuć</button>
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

export default Zgloszone