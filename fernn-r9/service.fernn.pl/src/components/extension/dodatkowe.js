import React from 'react'
import axios from 'axios'

class Dodatkowe extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dodatkowe: undefined,
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
        if(act<this.state.dodatkowe.length)
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
        axios.get('http://localhost:8081/v1/1/operacje/3', {
            params: {
                API: "ABC"
            }
        }).then((resu) => {
            if(opt){ this.setState({dodatkowe: resu.data}) }
            else{
                let dodane = this.state.dodatkowe
                for (const el of resu.data) {
                    let find = false
                    for (const ele of this.state.dodatkowe) {
                        if(el._ID === ele._ID){ find=true }
                    }
                    if(!find){ dodane.push(el)  }
                }
                this.setState({dodatkowe: dodane})
            }
        })
    }
    async add(e){
        const result = await axios.get('http://localhost:8081/v1/1/zatwierdzenia/3', {
            params: {
                API: "ABC",
                Info: this.state.dodatkowe[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.dodatkowe.length<=1){ this.setState({dodatkowe: undefined}); return true; }
            if(this.state.page>=this.state.dodatkowe.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.dodatkowe
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({dodatkowe: arch})
        }else{ alert("Błąd operacji") }
    }
    async sendmessage(e){
        const result = await axios.get('http://localhost:8081/v1/1/send/3', {
            params: {
                API: "ABC",
                Info: this.state.dodatkowe[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.dodatkowe.length<=1){ this.setState({dodatkowe: undefined}); return true; }
            if(this.state.page>=this.state.dodatkowe.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.dodatkowe
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({dodatkowe: arch})
        }else{ alert("Błąd operacji") }
    }
    async cancel(e){
        const result = await axios.get('http://localhost:8081/v1/1/odmowa/3', {
            params: {
                API: "ABC",
                Info: this.state.dodatkowe[this.state.page]
            }
        })

        if(result.data==="ok"){
            if(this.state.dodatkowe.length<=1){ this.setState({dodatkowe: undefined}); return true; }
            if(this.state.page>=this.state.dodatkowe.length-1){ this.setState({page: this.state.page-1}) }
            
            const arch = this.state.dodatkowe
            arch.splice(e.target.attributes[1].nodeValue, 1)
            this.setState({dodatkowe: arch})
        }else{ alert("Błąd operacji") }
    }
    changeValue(e){
        const arch = this.state.dodatkowe
        arch[e.target.attributes[1].nodeValue][e.target.attributes[2].nodeValue] = e.target.value
        this.setState({dodatkowe: arch})
    }
    render(){
        return (
            <div>
                <div className="modal fade model-xl" id="dodatkowereklamacje" aria-hidden="true" aria-labelledby="dodatkowereklamacje">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content bg-secondary">
                            <div className="modal-header">
                                <h5 className="modal-title" id="dodatkowereklamacje">Dodatkowe reklamacje</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            {Array.isArray(this.state.dodatkowe)===true && this.state.dodatkowe.length>0 ? <div>
                                <div className="modal-body col-12 row">
                                    <div className="col-12 col-md-8 m-0">
                                        ID
                                        <input type="text" placeholder="ID" value={this.state.dodatkowe[this.state.page].Data1} className="form-control mb-2" />
                                        Ile
                                        <input type="text" placeholder="Plan" value={this.state.dodatkowe[this.state.page].Data2} className="form-control mb-2" />
                                        Okres
                                        <select className="form-control mb-2">
                                            <option>{this.state.dodatkowe[this.state.page].Start} =&#62; {this.state.dodatkowe[this.state.page].End}</option>
                                            <option>sdfsdf1</option>
                                            <option>sdfsdf2</option>
                                        </select>
                                        Okres od
                                        <input type="date" placeholder="Od" className="form-control mb-2" value={this.state.dodatkowe[this.state.page].Start} />
                                        Okres do
                                        <input type="date" placeholder="Do" className="form-control mb-2" value={this.state.dodatkowe[this.state.page].End} />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <textarea className="col-12 mt-3 form-control" id={this.state.page} name="Message" onChange={this.changeValue} value={this.state.dodatkowe[this.state.page].Message} placeholder="wiadomość"></textarea>
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

export default Dodatkowe