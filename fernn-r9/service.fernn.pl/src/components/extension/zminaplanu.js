import React from 'react'
import axios from 'axios'

class ZmianaPlanu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            zmianaplanu: [],
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
        if(act<this.state.zmianaplanu.length)
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
        axios.get('http://localhost:8081/v1/1/operacje/4', {
            params: {
                API: "ABC"
            }
        }).then((resu) => {
            if(opt){ this.setState({zmianaplanu: resu.data}) }
            else{
                let dodane = this.state.zmianaplanu
                for (const el of resu.data) {
                    let find = false
                    for (const ele of this.state.zmianaplanu) {
                        if(el._ID === ele._ID){ find=true }
                    }
                    if(!find){ dodane.push(el)  }
                }
                this.setState({zmianaplanu: dodane})
            }
        })
    }
    async add(e){
        const result = await axios.get('http://localhost:8081/v1/1/zatwierdzenia/4', {
            params: {
                API: "ABC",
                Info: this.state.zmianaplanu[this.state.page]
            }
        })
        
        if(result.data==="ok"){
            if(this.state.zmianaplanu.length<=1){ this.setState({zmianaplanu: undefined}); return true; }
            if(this.state.page>=this.state.zmianaplanu.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.zmianaplanu
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({zmianaplanu: arch})
        }else{ alert("Błąd operacji") }
    }
    async sendmessage(e){
        const result = await axios.get('http://localhost:8081/v1/1/send/4', {
            params: {
                API: "ABC",
                Info: this.state.zmianaplanu[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.zmianaplanu.length<=1){ this.setState({zmianaplanu: undefined}); return true; }
            if(this.state.page>=this.state.zmianaplanu.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.zmianaplanu
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({zmianaplanu: arch})
        }else{ alert("Błąd operacji") }
    }
    async cancel(e){
        const result = await axios.get('http://localhost:8081/v1/1/odmowa/4', {
            params: {
                API: "ABC",
                Info: this.state.zmianaplanu[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.zmianaplanu.length<=1){ this.setState({zmianaplanu: undefined}); return true; }
            if(this.state.page>=this.state.zmianaplanu.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.zmianaplanu
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({zmianaplanu: arch})
        }else{ alert("Błąd operacji") }
    }
    changeValue(e){
        const arch = this.state.zmianaplanu
        arch[e.target.attributes[1].nodeValue][e.target.attributes[2].nodeValue] = e.target.value
        this.setState({zmianaplanu: arch})
    }
    render(){
        return (
            <div>
                <div className="modal fade model-xl" id="zmianaplanu" aria-hidden="true" aria-labelledby="zmianaplanu">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content bg-secondary">
                            <div className="modal-header">
                                <h5 className="modal-title" id="zmianaplanu">Zmiana planu</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            {Array.isArray(this.state.zmianaplanu)===true && this.state.zmianaplanu.length>0 ? <div>
                                <div className="modal-body col-12 row">
                                    <div className="row col-12 col-md-8">
                                        ID
                                        <input type="text" value={this.state.zmianaplanu[this.state.page]._ID} placeholder="ID" className="form-control mb-2" />
                                        Plan
                                        <input type="text" value={this.state.zmianaplanu[this.state.page].Data1} placeholder="Plan" className="form-control mb-2" />
                                        Ile kont
                                        <input type="text" value={this.state.zmianaplanu[this.state.page].Data2} placeholder="Ile kont" className="form-control mb-2" />
                                        Ile reklamacji
                                        <input type="text" value={this.state.zmianaplanu[this.state.page].Data3} placeholder="Ile reklamacji" className="form-control mb-2" />
                                        {/* Ile załączników
                                        <input type="text" value={this.state.zmianaplanu[this.state.page].Data4} placeholder="Ile załączników" /> */}
                                        Powiadomienia
                                        <input type="text" value={this.state.zmianaplanu[this.state.page].Data4} placeholder="Powiadomienia" className="form-control mb-2" />
                                        Raporty
                                        <input type="text" value={this.state.zmianaplanu[this.state.page].Data5} placeholder="Raporty" className="form-control mt-2" />
                                        Dostosowania
                                        <input type="text" value={this.state.zmianaplanu[this.state.page].Data6} placeholder="Dostosowania" className="form-control mt-2" />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <textarea className="col-12 mt-3 form-control" id={this.state.page} name="Message" onChange={this.changeValue} value={this.state.zmianaplanu[this.state.page].Message} placeholder="wiadomość"></textarea>
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

export default ZmianaPlanu