import React from 'react'
import axios from 'axios'

class NewMessage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            wszystkie:  [],
            wybrane: [],
            input: "",
            komunikat: "",
            tytul: "",
            tresc: "",
            type: "1",
            email: false,
            sms: false,
            system: true
        };
        this.changeCheck = this.changeCheck.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.add = this.add.bind(this)
        this.all = this.all.bind(this)
        this.remove = this.remove.bind(this)
        this.send = this.send.bind(this)
    }
    async componentDidMount(){
        this.setState({wszystkie: this.props.state.listafirm})
    }
    changeCheck(e){
        switch(e.target.name){
            case "sms":
                this.setState({sms: !this.state.sms})
                break;
            case "email":
                this.setState({email: !this.state.email})
                break;
            case "system":
                this.setState({system: !this.state.system})
                break;
            default:
                break;
        }
    }
    changeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }
    add(){
        let stan = false

        for (const iterator of this.state.wybrane) {
            if(iterator.Name===this.state.input){
                stan = true
                break;
            }
        }

        if(!stan){
            for (const iterator of this.state.wszystkie) {
                if(iterator.Name===this.state.input){
                    stan = true
                    let state = this.state.wybrane
                    state.push(iterator)
                    this.setState({wybrane: state})
                    break;
                }
            }
            if(stan){ this.setState({komunikat: "ok"}) }
            else{ this.setState({komunikat: "err"}) }
        } else{ this.setState({komunikat: "juz dodana"}) }
    }
    all(){
        this.setState({wybrane: this.state.wszystkie})
    }
    remove(e){
        for (const iterator of this.state.wybrane) {
            if(iterator._ID===parseInt(e.target.attributes[0].nodeValue)){
                let state = this.state.wybrane
                state.splice(state.indexOf(iterator), 1)
                this.setState({wybrane: state})
                break;
            }
        }
    }
    async send(){
        console.log(this.state)
        const res = await axios.get('http://localhost:8081/v1/1/send', {
            params: {
                to: this.state.wybrane,
                title: this.state.tytul,
                content: this.state.tresc,
                type: [this.state.system, this.state.email, this.state.sms],
                priority: this.state.type
            }
        })
        console.log(res);
    }
    render(){
        return (
            <div className="modal fade model-xl" id="nowawiadomosc" aria-hidden="true" aria-labelledby="nowawiadomosc">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content bg-secondary">
                        <div className="modal-header">
                            <h5 className="modal-title" id="nowawiadomosc">Nowa wiadomość</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body col-12 row">
                            <div className="d-flex justify-content-between">
                                <div className="row d-inline">
                                    <span>
                                        <input type="checkbox" onChange={this.changeCheck} checked={this.state.email} name="email"/>Email
                                    </span>
                                    <span>
                                        <input type="checkbox" onChange={this.changeCheck} checked={this.state.sms} name="sms" />SMS
                                    </span>
                                    <span>
                                        <input type="checkbox" onChange={this.changeCheck} checked={this.state.system} name="system" />System
                                    </span>
                                </div>
                                <div className="row d-inline" onChange={this.changeValue}>
                                    <span>
                                        <input type="radio" name="type" value="1" defaultChecked={true} />Aktualizacja
                                    </span> 
                                    <span> 
                                        <input type="radio" name="type" value="2" />Serwisowa
                                    </span> 
                                    <span> 
                                        <input type="radio" name="type" value="3" />Wazna
                                    </span> 
                                    <span> 
                                        <input type="radio" name="type" value="4" />Pilna
                                    </span>
                                </div>
                                <span className="bg-primary mb-3">
                                    {this.state.komunikat}
                                </span>
                            </div>
                            <div>
                                <input name="input" type="text" className="col-12 col-md-6" list="firmy" value={this.state.input} onChange={this.changeValue} />
                                <datalist id="firmy">
                                    {this.state.wszystkie.map((el, i) => (
                                        <option key={i}>{el.Name}</option>
                                    ))}
                                </datalist>
                                <button className="col-12 col-md-3" onClick={this.add}>Dodaj</button>
                                <button className="col-12 col-md-3" onClick={this.all}>Wszszcy</button>
                            </div>
                            <div id="to" style={{maxHeight: "200px", overflow: "auto"}}> 
                                {this.state.wybrane.map((el, i) => (
                                    <button className="m-2 bg-primary mt-1 d-inline" disabled key={i}>
                                        <span className="mr-3">{el.Name}</span>
                                        <button id={el._ID} onClick={this.remove}>
                                            <img id={el._ID} alt="" className="align-middle" src="https://img.icons8.com/offices/25/000000/xbox-x.png"/>
                                        </button>
                                    </button>
                                ))}
                            </div>
                            <input name="tytul" value={this.state.tytul} onChange={this.changeValue} type="text" className="col-12" placeholder="Tytuł" />
                            <textarea name="tresc" value={this.state.tresc} onChange={this.changeValue} className="col-12" rows="7" placeholder="Treć"></textarea>
                            <button onClick={this.send}>Wyślij</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewMessage