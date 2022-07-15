import React from 'react'

class Nav extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        language: [],
        allLanguage: {
          EN: ["", "", "", "", "", "", "", ""],
          PL: ["Szybka nawigacja", "Home", "Dodaj reklamację", "Statystyki", "Ustawienia", "Strona główna", "Wszystkie reklamacje", "Reklamcaje zgłoszone", "Reklamacje w realizacji", "Reklamacje do odbioru", "Reklamcaje odebrane", "Kontakt", "Dokumentacja", "Regulamin", "Przerwa w pracy", "Wyloguj się"]
        }
      }
    }
    componentDidMount(){
        switch (this.props.state.actualLanguage){
            case "PL":
                this.setState({"language": this.state.allLanguage.PL})
                break;
            default:
                this.setState({"language": this.state.allLanguage.EN})
                break;
        }
    }
    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">{this.state.language[0]}</h6>
                </div>
                <div className="card-body">
                    <div className="row m-auto">
                        <div className="col-12 col-md-4">
                            <div className="m-auto text-center">
                                <div className="list-group">
                                    <div onClick={() => this.props.navChangePosition(0)} className="list-group-item list-group-item-action active" aria-current="true">{this.state.language[1]}</div>
                                    <div onClick={() => this.props.navChangePosition(2)} className="list-group-item list-group-item-action"><strong>{this.state.language[2]}</strong></div>
                                    <div onClick={() => this.props.navChangePosition(9)} className="list-group-item list-group-item-action">{this.state.language[3]}</div>
                                    <div onClick={() => this.props.navChangePosition(10)} className="list-group-item list-group-item-action">{this.state.language[4]}</div>
                                    <div onClick={() => { window.location.href = '/' }} className="list-group-item list-group-item-action">{this.state.language[5]}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className=" m-auto text-center">
                                <div className="list-group">
                                <div onClick={() => {this.props.navChangePosition(6); this.props.navChangeComplaintListType(0)}} className="list-group-item list-group-item-action">{this.state.language[6]}</div>
                                    <div onClick={() => {this.props.navChangePosition(6); this.props.navChangeComplaintListType(1)}} className="list-group-item list-group-item-action">{this.state.language[7]}</div>
                                    <div onClick={() => {this.props.navChangePosition(6); this.props.navChangeComplaintListType(2)}} className="list-group-item list-group-item-action">{this.state.language[8]}</div>
                                    <div onClick={() => {this.props.navChangePosition(6); this.props.navChangeComplaintListType(3)}} className="list-group-item list-group-item-action">{this.state.language[9]}</div>
                                    <div onClick={() => {this.props.navChangePosition(6); this.props.navChangeComplaintListType(4)}} className="list-group-item list-group-item-action">{this.state.language[10]}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className=" m-auto text-center">
                                <div className="list-group">
                                    <div href="/?Work=true#kontakt" className="list-group-item list-group-item-action">{this.state.language[11]}</div>
                                    <div href="/doc/Dokumentacja_Fernn.pdf" className="list-group-item list-group-item-action" target="_blank"><strong>{this.state.language[12]}</strong></div>
                                    <div href="/regulations" className="list-group-item list-group-item-action">{this.state.language[13]}</div>
                                    <div href="/g" className="list-group-item list-group-item-action">{this.state.language[14]}</div>
                                    <div data-toggle="modal" data-target="#logoutModal" className="list-group-item list-group-item-action">{this.state.language[15]}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Nav