import React from 'react'
import '../../css/main.css'
import AOS from 'aos'
import axios from 'axios';
import "aos/dist/aos.css";
AOS.init();

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            wordsToPrint: ["szybko.", "bezpiecznie.", "prosto.", "profesjonalnie."],
            code: '',
            pin: '',
            plan: 'Basic (Bezpłatne 14 dni)',
            complaints: 100,
            accounts: 2,
            attachments: 0,
            notification: false,
            statistics: false,
            customization: '',
            name: '',
            firstname: '',
            lastname: '',
            email: '',
            nip: '',
            phone: '',
            adress: '',
            rules: "false",
            rodo: "false",
            Form: "d-block",
            Confirm: "d-none",
            Text: '',
            complaintInfo: {},
            history: []
        }
        this.print = this.print.bind(this)
        this.ChangeValue = this.ChangeValue.bind(this)
        this.getComlaintInfo = this.getComlaintInfo.bind(this)
        this.send = this.send.bind(this)
        this.setPlan = this.setPlan.bind(this)
    }
    
    async send(){
        let a = {
            plan: this.state.plan,
            complaints: this.state.complaints,
            accounts: this.state.accounts,
            attachments: this.state.attachments,
            notification: this.state.notification,
            statistics: this.state.statistics,
            customization: this.state.customization,
            name: this.state.name,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            nip: this.state.nip,
            phone: this.state.phone,
            adress: this.state.adress,
            rules: this.state.rules,
            rodo: this.state.rodo,
        }
        if(this.state.rules==="true" && this.state.rodo==="true"){
            const result = await axios.get('http://localhost:8082/v1/1/startsubscription', {
                params: a
            })

            this.setState({Form: "d-none"})
            this.setState({Confirm: "d-block"})
            this.setState({Text: result.data})
        }else{
            if(this.state.rules!=="true"){ this.setState({ruleserror: true}) }
            else{ this.setState({ruleserror: false}) }
            if(this.state.rodo!=="true"){ this.setState({rodoerror: true}) }
            else{ this.setState({rodoerror: false}) }
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    setPlan(e){
        this.setState({plan: e.target.name})
        console.log(e.target.name)
    }

    async ChangeValue(e){
        this.setState({[e.target.name]: await e.target.value})

        if(e.target.name==="statistics"){
            if(await e.target.value==="false"){ this.setState({statistics: true}) }
            else{ this.setState({statistics: false}) }
        }
        if(e.target.name==="notification"){
            if(await e.target.value==="false"){ this.setState({notification: true}) }
            else{ this.setState({notification: false}) }
        }
        if(e.target.name==="rules"){
            if(await e.target.value==="false"){ this.setState({rules: "true"}) }
            else{ this.setState({rules: "false"}) }
        }
        if(e.target.name==="rodo"){
            if(await e.target.value==="false"){ this.setState({rodo: "true"}) }
            else{ this.setState({rodo: "false"}) }
        }

        if(e.target.name==="plan"){
            switch (e.target.value){
                case "Basic (Bezpłatne 14 dni)":
                    this.setState({attachments: 0})
                    this.setState({accounts: 2})
                    this.setState({complaints: 100})
                    this.setState({notification: false})
                    this.setState({customization: ''})
                    break;
                case "Basic":
                    this.setState({attachments: 0})
                    this.setState({accounts: 2})
                    this.setState({complaints: 100})
                    this.setState({notification: false})
                    this.setState({statistics: false})
                    this.setState({customization: ''})
                    break;
                case "Standard":
                    this.setState({attachments: 2})
                    this.setState({accounts: 20})
                    this.setState({complaints: 500})
                    this.setState({notification: true})
                    this.setState({statistics: false})
                    this.setState({customization: ''})
                    break;
                case "Pro":
                    this.setState({attachments: 5})
                    this.setState({accounts: 500})
                    this.setState({complaints: 5000})
                    this.setState({notification: true})
                    this.setState({statistics: true})
                    this.setState({customization: ''})
                    break;
                default:
                    break;
            }
        }
    }

    async print() {
        for (var c = 0; c < this.state.wordsToPrint.length; c++) {
            var dl = this.state.wordsToPrint[c].length;

            for (let b = 1; b < dl; b++) {
                this.setState({ content: this.state.wordsToPrint[c].substring(0, b) })
                await this.sleep(200);
            }

            this.setState({ content: this.state.wordsToPrint[c] })
            await this.sleep(1000);

            for (let b = dl; b >= 0; b--) {
                this.setState({ content: this.state.wordsToPrint[c].substr(0, b) })
                await this.sleep(100);
            }
        }
        await this.sleep(200);
        this.print();
    }

    componentDidMount() {
        this.print()
    }

    async getComlaintInfo(){
        const result = await axios.get('http://localhost:8082/v1/1/customercomplaintinfo', {
            params: {
                API: "ABC",
                Code: this.state.code,
                Pin: this.state.pin
            }
        })
        this.setState({complaintInfo: result.data})

        const result2 = await axios.get('http://localhost:8082/v1/1/complaintshistory', {
            params: {
                API: "ABC",
                COID: result.data._ID
            }
        })
        this.setState({history: result2.data})
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light" style={{ maxWidth: "1200px", backgroundColor: "#00000000", margin: "auto", position: "relative!important" }} data-aos="fade-down" data-aos-duration="1250" data-aos-once="true">
                    <div className="container-fluid" style={{ marginTop: "0px" }}>
                        <div className="navbar-brand" style={{ color: "#0d6efd", fontSize: "25px" }}>Fernn</div>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <div className="nav-link active" aria-current="page">Home</div>
                                </li>
                                <li className="nav-item">
                                    <div className="nav-link" data-bs-toggle="modal" data-bs-target="#checkStatus">Sprawdź status</div>
                                </li>
                                <li className="nav-item">
                                    <div className="nav-link" href="#oferta">Oferta</div>
                                </li>
                                <li className="nav-item">
                                    <div className="nav-link" href="#kontakt">Kontakt</div>
                                </li>
                            </ul>
                            <a className="btn btn-primary" href="/login">Zaloguj się</a>
                        </div>
                    </div>
                </nav>
                <div style={{ maxWidth: "1200px", margin: "auto", textAlign: "center", clear: "both", padding: "20px" }}>
                    <div className="TopMargins"  >
                        <div className="row">
                            <div className="col-12 col-lg-6 Top" data-aos="fade-right" data-aos-delay="200" data-aos-duration="1250" data-aos-once="true">
                                <h1 className="d-inline ">Obsługuj reklamacje <br /></h1>
                                <h1 id="inserttext" className="d-inline WrittenText" style={{ textDecoration: "underline" }}>{this.state.content}</h1>
                                <h1 className="typed-cursor d-inline WrittenText">|</h1>
                                <p className="mt-3">Program do obsługi reklamacji pozwala na kompletną realizację procesu reklamacyjnego i wspiera komunikację z klientem.</p>
                                <div className="btn btn-primary btn-lg btn-block mt-2" data-bs-toggle="modal" data-bs-target="#startSubscription">Załóż darmowe konto</div>
                            </div>
                            <div className="col-12 col-lg-6 Top" data-aos="fade-left" data-aos-delay="200" data-aos-duration="1250" data-aos-once="true">
                                <div className="mt-5 d-md-none"></div>
                                <h1>Jeżeli masz już reklamację możesz sprawdzić jej status</h1>
                                <input type="text" className="form-control" placeholder="Nr reklamacji" name="code" onChange={this.ChangeValue} value={this.state.code} />
                                <input type="text" className="form-control" placeholder="Pin" name="pin" onChange={this.ChangeValue} value={this.state.pin} />
                                <button className="btn btn-primary btn-lg btn-block mt-2" onClick={this.getComlaintInfo} data-bs-toggle="modal" data-bs-target="#checkStatus">Sprawdź status reklamacji</button>
                            </div>
                        </div>
                    </div>
                    <div className="m-5">
                        <div className="row">
                            <h3 data-aos="fade-up" data-aos-once="true" data-aos-duration="550">Profesjonalny program do obsługi reklamacji</h3>
                            <p data-aos="fade-up" data-aos-once="true" data-aos-duration="550">Poznaj podstawowe funkcje programu do obsługi serwisu online</p>
                            <div className="col-md-6 col-12 SystemOptions " data-aos="fade-up-right" data-aos-easing="ease-in" data-aos-duration="550" data-aos-once="true">
                                <img alt="" src="https://img.icons8.com/color/48/000000/available-updates.png" />
                                <h6>Dostępność</h6>
                                <p>System reklamacji online dostępny 24h ndiv dobę, 7 dni w tygodniu.</p>
                            </div>
                            <div className="col-md-6 col-12 SystemOptions" data-aos="fade-up-left" data-aos-easing="ease-in" data-aos-duration="550" data-aos-once="true">
                                <img alt="" src="https://img.icons8.com/color/48/000000/business-report.png" />
                                <h6>Raporty</h6>
                                <p>Podsumowanie wszystkich danych w czytelnych tabelach i wykresach.</p>
                            </div>
                            <div className="col-md-6 col-12 SystemOptions" data-aos="fade-up-right" data-aos-easing="ease-in" data-aos-duration="550" data-aos-once="true">
                                <img alt="" src="https://img.icons8.com/color/48/000000/circled-envelope.png" />
                                <h6>Powiadomienia</h6>
                                <p>Automatyczne i ręczne powiadomienidiv wysyłane do Klientdiv informujące o statusie reklamacji.</p>
                            </div>
                            <div className="col-md-6 col-12 SystemOptions" data-aos="fade-up-left" data-aos-easing="ease-in" data-aos-duration="550" data-aos-once="true">
                                <img alt="" src="https://img.icons8.com/color/48/000000/web-design.png" />
                                <h6>Obsługdiv zleceń online</h6>
                                <p>Proste zarządzanie reklamacjami i zwrotami odbywające się bez konieczności instalacji programu. </p>
                            </div>
                            <div className="col-md-6 col-12 SystemOptions" data-aos="fade-up-right" data-aos-easing="ease-in" data-aos-duration="550" data-aos-once="true">
                                <img alt="" src="https://img.icons8.com/color/48/000000/cloud-link.png" />
                                <h6>Załączniki</h6>
                                <p>Możliwość dodawanidiv załączników do reklamacji w celu dokumentacji stanu reklamowanego pruduktu.</p>
                            </div>
                            <div className="col-md-6 col-12 SystemOptions " data-aos="fade-up-left" data-aos-easing="ease-in" data-aos-duration="550" data-aos-once="true">
                                <img alt="" src="https://img.icons8.com/color/48/000000/refresh-shield.png" />
                                <h6>Bezpieczeństwo</h6>
                                <p>Szyfrowanie wszystkich danych wrażliwych. Dostęp do systemu tylko dldiv zalogowanych Użytkowników.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row" data-aos="flip-left" data-aos-duration="1250" data-aos-once="true">
                        <h6 data-aos="fade-up" data-aos-once="true" className="">DOSTĘPNE PANELE</h6>
                        <h2 data-aos="fade-up" data-aos-once="true" className="">Jeden system - trzy panele</h2>
                        <div className="col-11 m-auto col-md-4 mt-2 " data-aos="fade-up" data-aos-once="true">
                            <div className="panel">
                                <img alt="" src="https://img.icons8.com/color/48/000000/human-head.png" />
                                <br /><br />
                                <h4>Panel klienta</h4>
                                <p>Umożliwij klientowi samodzielne sprawdzanie statusu. Zaoszczędzi to czas nietylko klientowi ale i firmie.</p>
                            </div>
                        </div>
                        <div className="col-11 m-auto col-md-4 mt-2 " data-aos="fade-up" data-aos-once="true">
                            <div className="panel">
                                <img alt="" src="https://img.icons8.com/color/48/000000/worker-male.png" />
                                <br /><br />
                                <h4>Panel pracownika</h4>
                                <p>Ogranicz dostęp dldiv pracowników. Pracownik będzie mógł dodawać i edytować reklamacje, które niesą zamknięte.</p>
                            </div>
                        </div>
                        <div className="col-11 m-auto col-md-4 mt-2 " data-aos="fade-up" data-aos-once="true">
                            <div className="panel">
                                <img alt="" src="https://img.icons8.com/color/48/000000/admin-settings-male.png" />
                                <br /><br />
                                <h4>Panel administratora</h4>
                                <p>Przejmij całą kontrolę nad firmą. Dodawaj pracowników i reklamacje, edytuj statusy nawet zamkniętych reklamacji i zobacz statystyki firmy.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-12 col-lg-7 mb-3">
                            <img alt="" src="/img/logo.png" data-aos="fade-up" data-aos-once="true" width="200px" className="" />
                        </div>
                        <div className="col-12 col-lg-5">
                            <h3 data-aos="zoom-in-up" data-aos-once="true" className="">Nie trać czasu i sprawdź nasze rozwiązanie już teraz</h3>
                            <p data-aos="zoom-in-up" data-aos-once="true" className="">Aktywuj system za darmo i otrzymaj bezpłatny 14-dniowy dostęp do systemu.</p>
                            <p data-aos="zoom-in-up" data-aos-once="true" className="">Sprawdź i przetestuj nasze rozwiązanie. System po aktywacji jest skonfigurowany i gotowy do pracy. Masz jednak możliwość dostosowanidiv ustawień do swoich potrzeb, by móc jeszcze wygodniej korzystać z systemu.</p>
                            <p data-aos="zoom-in-up" data-aos-once="true" className="">Po okresie próbnym możesz korzystać z systemu zamawiając abonament ndiv kolejny okres.</p>
                            <div data-aos="zoom-in-up" className="btn btn-primary " data-aos-once="true" data-bs-toggle="modal" data-bs-target="#startSubscription">Testuj za darmo</div>
                        </div>
                    </div>
                    <div className="row mt-5 overflow-auto flex-fill" id="oferta" data-aos="flip-left" data-aos-duration="1250" data-aos-once="true">
                        <div className="col-12">
                            <div className="col-12">
                                <h3 data-aos="zoom-in-up" data-aos-once="true" className="">Podstawowdiv oferta</h3>
                                <table className="table " data-aos="flip-up" data-aos-once="true">
                                    <thead>
                                        <tr><th></th>
                                            <th>Plan basic</th>
                                            <th>Plan standard</th>
                                            <th>Plan pro</th>
                                            <th>Plan Custom</th>
                                        </tr></thead>
                                    <tbody>
                                        <tr>
                                            <td>Kompleksowdiv obsługdiv reklamacji</td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/checked--v4.png" /></td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/checked--v4.png" /></td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/checked--v4.png" /></td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/checked--v4.png" /></td>
                                        </tr>
                                        <tr>
                                            <td>Ilość kont użytkowników</td>
                                            <td className="GreenColor">2</td>
                                            <td className="GreenColor">20</td>
                                            <td className="GreenColor">500</td>
                                            <td className="GreenColor">Sam określasz</td>
                                        </tr>
                                        <tr>
                                            <td>Ilość reklamacji/rok</td>
                                            <td className="GreenColor">100</td>
                                            <td className="GreenColor">500</td>
                                            <td className="GreenColor">5000</td>
                                            <td className="GreenColor">Sam określasz</td>
                                        </tr>
                                        <tr>
                                            <td>Raporty</td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/delete-sign--v1.png" /></td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/delete-sign--v1.png" /></td>
                                            <td className="GreenColor">Od 01-08-2021</td>
                                            <td className="GreenColor">Od 01-08-2021</td>
                                        </tr>
                                        <tr>
                                            <td>Załączniki</td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/delete-sign--v1.png" /></td>
                                            <td className="GreenColor">2 pliki/reklamacja</td>
                                            <td className="GreenColor">5 plików/reklamacja</td>
                                            <td className="GreenColor">Sam określasz</td>
                                        </tr>
                                        <tr>
                                            <td>Powiadomienidiv dldiv klienta</td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/delete-sign--v1.png" /></td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/checked--v4.png" /></td>
                                            <td><img alt="" src="https://img.icons8.com/color/48/000000/checked--v4.png" /></td>
                                            <td className="GreenColor">Sam określasz</td>
                                        </tr>
                                        <tr>
                                            <td>Limit reklamacji</td>
                                            <td className="GreenColor">100/rok</td>
                                            <td className="GreenColor">1000/rok</td>
                                            <td className="GreenColor">10000/rok</td>
                                            <td className="GreenColor">Sam określasz</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td><button className="btn btn-primary" onClick={this.setPlan} name="Basic" data-bs-toggle="modal" data-bs-target="#startSubscription">Wybierz pakiet</button></td>
                                            <td><button className="btn btn-primary"onClick={this.setPlan} name="Standard" data-bs-toggle="modal" data-bs-target="#startSubscription">Wybierz pakiet</button></td>
                                            <td><button className="btn btn-primary" onClick={this.setPlan} name="Pro" data-bs-toggle="modal" data-bs-target="#startSubscription">Wybierz pakiet</button></td>
                                            <td><button className="btn btn-primary" onClick={this.setPlan} name="Custom" data-bs-toggle="modal" data-bs-target="#startSubscription">Wybierz pakiet</button></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row overflow-auto" id="kontakt" data-aos="flip-left" data-aos-duration="1250" data-aos-once="true">
                        <div className="col-12">
                            <h3>Kontakt</h3>
                            <table className="table table-striped">
                                <tbody><tr>
                                    <th>E-mail</th>
                                    <td>kontakt@fernn.pl</td>
                                </tr>
                                </tbody></table>
                        </div>
                    </div>
                </div>
                <footer className="bg-primary">
                    ©Fernn
                </footer>
                <div className="modal fade" id="checkStatus" tabIndex="-1" aria-labelledby="exampleModalLgLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title h4" id="exampleModalLgLabel">Status reklamacji</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <svg width="100%" version="1.1" viewBox="0 0 515.67 123.55" className={Object.entries(this.state.complaintInfo).length === 0 ? "d-none" : "d-block"} xmlns="http://www.w3.org/2000/svg">
                                    <g transform="translate(90.978 -93.119)">
                                        <g fill="none" stroke="#3d90e3" strokeWidth="4.7811">
                                            <path d="m305.58 109.78c-3.2973-3.9216-2.134-7.3838 1.7452-7.7462 9.8415-0.91934 106.06-5.9599 106.06-5.9599 10.323-0.82697 10.814-1.4823 5.8827 5.8261l-48.683 65.786c-2.8548 3.4529-5.3254 5.8726-9.1905 1.1576l-16.63-20.541c-1.5173-1.7822-4.5575-4.9381-7.5955-4.188-1.8241 0.45039-4.0105 3.547-5.0431 5.3874l-8.2905 13.583c-3.9884 4.5205-3.8373 3.2054-3.2121-1.6712l3.5668-20.304c0.18829-1.6285 0.87946-5.2208 0.8058-6.3844-0.24075-3.8028-2.8371-5.4778-4.8121-8.1037z" />
                                            <path d="m320.76 166.03 26.604-15.756" />
                                            <path d="m336.63 144.38 86.422-48.171-98.508 37.035" />
                                        </g>
                                        <g fill="#3d90e3" stroke="#3d90e3">
                                            <path d="m292.6 182.85c-0.40503 1.4599-0.93373 4.4663 2.4862 4.4748 1.5057-0.0907 5.0347-1.9455 6.7104-4.2903 1.2037-2.2021-0.80739-4.1817-2.8104-3.784-1.3634 0.24945-5.6432 1.7138-6.3863 3.5996z" />
                                            <path d="m306.81 173.33c-0.40503 1.4599-0.93373 4.4663 2.4862 4.4748 1.5057-0.0907 5.0347-1.9455 6.7104-4.2903 1.2037-2.2021-0.80739-4.1817-2.8104-3.784-1.3634 0.24945-5.6432 1.7138-6.3863 3.5996z" />
                                        </g>
                                        <g fill={(this.state.complaintInfo.Stage >= 2 ? "#3d90e3" : "#cbdef1")} stroke={(this.state.complaintInfo.Stage >= 2 ? "#3d90e3" : "#cbdef1")}>
                                            <path d="m262.95 187.7c2.9437 0.66665 2.1924-3.8064 1.1412-4.5845-1.8849-1.2482-3.9022-1.9681-5.6752-2.5793-1.6726-0.57656-3.0392-0.67255-4.8815-0.61329-2.1846 0.13496-3.5267 3.2346-0.83071 4.4569 3.6287 1.8204 6.8991 2.7809 10.246 3.3202z" />
                                            <path d="m235.25 166.26c-1.2589 0.69398-3.6369 2.4721-1.2398 6.3849 1.1183 1.6478 4.8355 4.209 7.5777 4.2652 2.3154-0.36986 2.2237-4.2352 0.55113-6.2079-1.1243-1.3595-5.1084-5.0876-6.8889-4.4422z" strokeWidth="1.1484px" />
                                            <path d="m210.27 126.6c-1.2741 0.66567-3.6912 2.3902-1.3822 6.3556 1.0812 1.6724 4.7402 4.316 7.4804 4.4335 2.323-0.31802 2.3178-4.1844 0.68974-6.194-1.0936-1.3843-4.9934-5.2005-6.7879-4.595z" strokeWidth="1.1484px" />
                                            <path d="m198.69 124.14c1.3022-0.77427 3.7633-2.5802 1.299-4.9515-1.1502-0.9758-4.982-2.0768-7.814-1.5421-2.3924 0.75805-2.3089 3.5788-0.58712 4.6768 1.1573 0.76275 5.2613 2.665 7.1021 1.8168z" strokeWidth="1px" />
                                            <path d="m225.85 146.78c-2.5205-2.6949-4.589 0.53453-4.3556 1.8738 0.52956 2.3113 1.5618 4.4074 2.4853 6.2365 0.87123 1.7255 1.8664 2.9053 3.3506 4.3804 1.8088 1.7093 4.8926 1.1645 4.0165-2.0503-0.69321-2.963-2.1429-6.3244-5.4969-10.44z" strokeWidth="1.0482px" />
                                        </g>
                                        <g fill={(this.state.complaintInfo.Stage >= 3 ? "#3d90e3" : "#cbdef1")} stroke={(this.state.complaintInfo.Stage >= 3 ? "#3d90e3" : "#cbdef1")}>
                                            <path d="m79.295 184.31c2.8307-1.0474-0.23937-4.3861-1.5449-4.4647-2.2607-0.0177-4.344 0.47961-6.1634 0.93479-1.7163 0.42937-2.9139 1.0945-4.4256 2.1494-1.7571 1.305-1.1908 4.6348 1.7355 4.1883 4.0342-0.45423 7.299-1.4335 10.398-2.8078z" />
                                            <path d="m165.32 121.23c2.8544-0.98103-0.13692-4.3905-1.4403-4.4995-2.2596-0.0705-4.354 0.37808-6.1835 0.79066-1.7259 0.3892-2.9387 1.0262-4.4745 2.0455-1.7871 1.2636-1.2986 4.6058 1.6372 4.2276 4.0437-0.35994 7.3305-1.2628 10.461-2.5643z" />
                                            <path d="m91.782 172.76c-0.0122 1.4352 0.29846 4.3351 4.0598 3.718 1.628-0.35975 4.9566-2.7342 6.1028-5.2268 0.66983-2.2733-2.1277-3.7516-4.2112-3.0146-1.4245 0.48178-5.6941 2.6294-5.9514 4.5235z" />
                                            <path d="m138.61 128.88c0.16432 1.4258 0.82913 4.2656 4.4861 3.1906 1.5714-0.55716 4.5828-3.3228 5.414-5.9374 0.38529-2.3384-2.5728-3.4615-4.5499-2.4741-1.3545 0.65325-5.3277 3.3095-5.3502 5.2208z" />
                                            <path d="m123.65 141.2c0.16432 1.4258 0.82913 4.2656 4.4861 3.1906 1.5714-0.55716 4.5828-3.3228 5.414-5.9374 0.38529-2.3384-2.5728-3.4615-4.5499-2.4741-1.3545 0.65325-5.3277 3.3095-5.3502 5.2208z" />
                                            <path d="m108.67 158.76c-1.6739 3.2884 2.0672 4.1317 3.2467 3.4556 1.9922-1.286 3.6108-2.971 5.0153-4.4629 1.325-1.4074 2.0948-2.7452 2.9753-4.6434 0.99011-2.2833-0.57356-4.9964-3.297-3.0767-2.549 1.662-5.2146 4.171-7.9403 8.7274z" strokeWidth="1.0482px" />
                                        </g>
                                        <g fill={(this.state.complaintInfo.Stage >=4 ? "#3d90e3" : "#cbdef1")} stroke={(this.state.complaintInfo.Stage >= 4? "#3d90e3" : "#cbdef1")}>
                                            <path d="m-6.533 115.51c2.8495 0.995 2.6085-3.5343 1.6519-4.4262-1.7318-1.4532-3.6548-2.3965-5.3474-3.204-1.5968-0.76188-2.9437-1.0117-4.781-1.1609-2.1858-0.11275-3.8696 2.8154-1.329 4.3345 3.3998 2.2187 6.5406 3.5426 9.8054 4.4567z" />
                                            <path d="m21.513 160.29c-1.7595-2.4524-4.1662 1.392-3.8964 2.6718 0.58146 2.1847 1.6126 4.062 2.5332 5.6959 0.86846 1.5414 1.8269 2.5202 3.2443 3.6986 1.7236 1.3489 4.7847-0.0788 3.5794-2.7824-1.3204-3.0895-3.3554-5.9348-5.4606-9.2839z" />
                                            <path d="m13.853 151.99c1.6978 2.4955 4.1996-1.2878 3.9617-2.5738-0.52682-2.1985-1.5108-4.101-2.3904-5.7573-0.82977-1.5626-1.7635-2.5649-3.1512-3.7783-1.6895-1.3915-4.7852-0.0405-3.6476 2.6923 1.4116 3.8063 3.1478 6.7396 5.2275 9.4171z" strokeWidth="1px" />
                                            <path d="m33.36 179.56c-1.2427 0.71808-3.5835 2.4578-1.1424 5.3852 1.1364 1.22 4.8719 2.8825 7.6013 2.6048 2.2986-0.57693 2.1522-3.7376 0.45959-5.1586-1.1382-0.98275-5.1559-3.5711-6.9185-2.8313z" strokeWidth="1.0388px" />
                                            <path d="m3.0594 120.84c-1.4352 0.0201-4.3273 0.39586-3.6257 4.1424 0.39627 1.6195 2.845 4.8939 5.3627 5.9838 2.2878 0.61844 3.7028-2.2115 2.9192-4.278-0.51369-1.4133-2.7568-5.6336-4.6562-5.8482z" strokeWidth="1.0388px" />
                                            <path d="m-64.834 125.23c1.8575-2.379-2.5091-3.6055-3.6611-2.9861-1.9325 1.1732-3.4434 2.6914-4.7518 4.0349-1.2344 1.2674-1.9036 2.4628-2.6351 4.1547-0.80886 2.0338 1.4233 4.5688 3.6779 2.6508 3.1932-2.507 5.4558-5.0562 7.3701-7.8544z" />
                                            <path d="m-90.473 147.09c0.25641 1.4932 1.0607 4.4379 4.1575 2.9866 1.3231-0.7243 3.7238-3.9073 4.2391-6.7429 0.14934-2.5052-2.5141-3.4378-4.156-2.2236-1.1267 0.80721-4.373 3.9574-4.2406 5.9798z" strokeWidth="1px" />
                                            <path d="m-55.281 112.71c-0.22744 1.4172-0.35555 4.3308 3.4558 4.2852 1.6635-0.11133 5.3108-1.9594 6.8182-4.2516 1.0034-2.147-1.5406-4.0284-3.7111-3.6126-1.4807 0.26253-6.0242 1.745-6.5629 3.579z" strokeWidth="1.0388px" />
                                        </g>
                                        <g>
                                            <ellipse cx="-30.293" cy="108.11" rx="3.3836" ry="3.3836" fill="#3d90e3" stroke="#3d90e3" strokeWidth="8.3509" />
                                            <image href="https://img.icons8.com/color/100/000000/4-c.png" x="-42.5" y="114" width="25" height="25" />

                                            <ellipse cx="53.356" cy="187.61" rx="3.3836" ry="3.3836" fill="#3d90e3" stroke="#3d90e3" strokeWidth="8.3509" />
                                            <image href="https://img.icons8.com/color/100/000000/3-c.png" x="41.5" y="156.5" width="25" height="25" />

                                            <ellipse cx="176.24" cy="118.75" rx="3.3836" ry="3.3836" fill="#3d90e3" stroke="#3d90e3" strokeWidth="8.3509" />
                                            <image href="https://img.icons8.com/color/100/000000/2-c.png" x="163.5" y="125" width="25" height="25" />

                                            <ellipse cx="277.75" cy="187.61" rx="3.3836" ry="3.3836" fill="#3d90e3" stroke="#3d90e3" strokeWidth="8.3509" />
                                            <image href="https://img.icons8.com/color/100/000000/1-c.png" x="265" y="155" width="25" height="25" />
                                        </g>
                                        <g fill="#000000" fontFamily="Arial" fontSize="17.333px" >
                                            <text x="233.41844" y="153.08664" style={{ lineHeight: "1.25" }}><tspan x="233.41844" y="153.08664" fontFamily="Arial" fontSize="17.333px" xmlSpace="preserve" display={(this.state.complaintInfo.Stage >= 1 ? "block" : "none")}>Zgłoszono</tspan></text>
                                            <text x="124.27199" y="165.36914" style={{ lineHeight: "1.25" }}><tspan x="142" y="165.36914" fontFamily="Arial" fontSize="17.333px" xmlSpace="preserve" display={(this.state.complaintInfo.Stage >= 2 ? "block" : "none")}>Wysłano</tspan></text>
                                            <text x="28.021992" y="150.36914" style={{ lineHeight: "1.25" }}><tspan x="28.021992" y="150.36914" fontFamily="Arial" fontSize="17.333px" xmlSpace="preserve" display={(this.state.complaintInfo.Stage >= 3 ? "block" : "none")}>Do odbioru</tspan></text>
                                            <text x="-78.478012" y="158.6191" style={{ lineHeight: "1.25" }}><tspan x="-78.478012" y="158.6194" fontFamily="Arial" fontSize="17.333px" xmlSpace="preserve" display={(this.state.complaintInfo.Stage >= 4 ? "block" : "none")}>Odebrana</tspan></text>
                                        </g>
                                    </g>
                                </svg>
                                <div className={Object.entries(this.state.complaintInfo).length === 0 ? "d-none" : "d-block"}>
                                    <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                    <h1 className="text-center text-primary">Inforamacje o reklamacji</h1>
                                    <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                </div>
                                <div className="row">
                                    <div className={Object.entries(this.state.complaintInfo).length === 0 ? "d-none" : "d-block col-12 col-lg-6"}>
                                        <div className={this.state.complaintInfo.Locking === 0 && this.state.complaintInfo.ToPickUp === 0 ? "d-block" : "d-none"}>
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>{this.state.complaintInfo.Status}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Model</th>
                                                        <td>{this.state.complaintInfo.Model}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Producent</th>
                                                        <td>{this.state.complaintInfo.Manufacturer}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Adres zgłoszenia</th>
                                                        <td>{this.state.complaintInfo.Adress}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Data zgłoszenia</th>
                                                        <td>{Object.entries(this.state.complaintInfo).length !== 0 ? this.state.complaintInfo.Reported.slice(0, 10) : ""} {Object.entries(this.state.complaintInfo).length !== 0 ? this.state.complaintInfo.Reported.slice(11, 16) : ""}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div>
                                            <div className="d-flex mb-3">
                                                <img className={this.state.complaintInfo.Locking === 1 || this.state.complaintInfo.ToPickUp === 1 ? "d-block" : "d-none"} src="/Img/left_confetti.svg" alt="" />
                                                <h2 className={this.state.complaintInfo.Locking === 1 && this.state.complaintInfo.ToPickUp === 0 ? "d-block" : "d-none"}>Reklamacje została odebrana</h2>
                                                <h2 className={this.state.complaintInfo.Locking === 0 && this.state.complaintInfo.ToPickUp === 1 ? "d-block" : "d-none"}>Reklamacje czeka na odbiór</h2>
                                                <img className={this.state.complaintInfo.Locking === 1 || this.state.complaintInfo.ToPickUp === 1 ? "d-block" : "d-none"} src="/Img/right_confetti.svg" alt="" />
                                            </div>
                                            <h5 className={this.state.complaintInfo.Locking === 0 && this.state.complaintInfo.ToPickUp === 1 ? "d-block" : "d-none"}>Udaj się pod adres: <strong className="text-primary">{this.state.complaintInfo.Adress}</strong> w celu odebranie produktu.</h5>
                                            <h5 className={this.state.complaintInfo.Locking === 1 && this.state.complaintInfo.ToPickUp === 0 ? "d-block" : "d-none"}>Reklamacja została odebrana dnia {Object.entries(this.state.complaintInfo).length !== 0 ? this.state.complaintInfo.Received.slice(0, 10) : ""} o godzinie {Object.entries(this.state.complaintInfo).length !== 0 ? this.state.complaintInfo.Received.slice(11, 16) : ""} pod adresem: <strong className="text-primary">{this.state.complaintInfo.Adress}</strong> .</h5>
                                        </div>
                                    </div>
                                    <div className={Object.entries(this.state.complaintInfo).length === 0 ? "col-12 text-center m-auto" : "col-12 col-lg-6 text-center m-auto"}>
                                        <div className="d-flex m-auto">
                                            <h2>Wyszukiwanie reklamacji</h2>
                                            <img src="https://img.icons8.com/color/48/000000/search--v1.png" alt="" width="auto"/>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Nr reklamacji" name="code" onChange={this.ChangeValue} value={this.state.code} />
                                        <input type="text" className="form-control" placeholder="Pin" name="pin" onChange={this.ChangeValue} value={this.state.pin} />
                                        <button className="btn btn-primary btn-lg btn-block mt-3" onClick={this.getComlaintInfo}>Sprawdź status reklamacji</button>
                                    </div>
                                </div>
                                <div className={Object.entries(this.state.complaintInfo).length === 0 ? "d-none" : "d-block"}>
                                    <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                    <h1 className="text-center text-primary">Historia reklamacji</h1>
                                    <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                    <ul className="list-group list-group-flush">
                                        {this.state.history.map((e, index) => (
                                            <li className="list-group-item">{e.Date.slice(0, 10)} {e.Date.slice(11, 16)} -&#62; {e.PL}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="startSubscription" tabIndex="-1" aria-labelledby="startSubscription" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title h4" id="startSubscription">Aktywacja systemu</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className={this.state.Form}>
                                    <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                    <h1 className="text-center text-primary">Aktywacja systemu</h1>
                                    <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                    <div className="col-12">
                                        <table className="col-11 d-none d-md-block m-auto table">
                                            <tbody className="col-12 m-0" style={{width: "100% !important"}}>
                                                <tr>
                                                    <td className="col-3">Plan</td>
                                                    <td className="col-9">
                                                        <select className="form-select form-select-sm" name="plan" value={this.state.plan} onChange={this.ChangeValue}>
                                                            <option value="Basic (Bezpłatne 14 dni)">Basic (Bezpłatne 14 dni)</option>
                                                            <option value="Basic">Basic</option>
                                                            <option value="Standard">Standard</option>
                                                            <option value="Pro">Pro</option>
                                                            <option value="Custom">Custom</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Ilośc reklamacji</td>
                                                    <td><input type="number" className="form-control input" disabled={this.state.plan==="Custom" ? false : true} name="complaints" value={this.state.complaints} onChange={this.ChangeValue} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Ilośc kont</td>
                                                    <td><input type="number" className="form-control input" disabled={this.state.plan==="Custom" ? false : true} name="accounts" value={this.state.accounts} onChange={this.ChangeValue} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Ilośc załączników na reklamację</td>
                                                    <td><input type="number" className="form-control input" disabled={this.state.plan==="Custom" ? false : true} name="attachments" value={this.state.attachments} onChange={this.ChangeValue} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Opcje dodatkowe</td>
                                                    <td>
                                                        <div className="switch">
                                                            <div className="form-check form-switch">
                                                                <label className="form-check-label">
                                                                    <input className="form-check-input" disabled={this.state.plan==="Custom" ? false : true} type="checkbox" name="notification" checked={this.state.notification} value={this.state.notification} onChange={this.ChangeValue} />
                                                                    Powiadomienia dla klienta
                                                                </label>
                                                            </div>
                                                            <div className="form-check form-switch">
                                                                <label className="form-check-label">
                                                                    <input className="form-check-input" disabled={this.state.plan==="Custom" ? false : true} type="checkbox" name="statistics" checked={this.state.statistics} value={this.state.statistics} onChange={this.ChangeValue} />
                                                                    Dostęp do raportów
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Inne dostosowania</td>
                                                    <td><textarea className="form-control" disabled={this.state.plan==="Custom" ? false : true} name="customization" value={this.state.customization} onChange={this.ChangeValue}></textarea></td>
                                                </tr>
                                                <tr className="col-12">
                                                    <td>Nazwa firmy</td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="Nazwa firmy" name="name" value={this.state.name} onChange={this.ChangeValue} />
                                                    </td>
                                                </tr>
                                                <tr className="col-12">
                                                    <td>Imię administratora</td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="Imię" name="firstname" value={this.state.firstname} onChange={this.ChangeValue} />
                                                    </td>
                                                </tr>
                                                <tr className="col-12">
                                                    <td>Nazwisko administratora</td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="Nazwisko" name="lastname" value={this.state.lastname} onChange={this.ChangeValue} />
                                                    </td>
                                                </tr>
                                                <tr className="col-12">
                                                    <td>Email</td>
                                                    <td>
                                                        <input type="email" className="form-control" placeholder="Email" name="email" value={this.state.email} onChange={this.ChangeValue} />
                                                    </td>
                                                </tr>
                                                <tr className="col-12">
                                                    <td>NIP</td>
                                                    <td>
                                                        <input type="tel" className="form-control" placeholder="NIP" name="nip" value={this.state.nip} onChange={this.ChangeValue} />
                                                    </td>
                                                </tr>
                                                <tr className="col-12">
                                                    <td>Telefon</td>
                                                    <td>
                                                        <input type="tel" className="form-control" placeholder="Telefon" name="phone" value={this.state.phone} onChange={this.ChangeValue} />
                                                    </td>
                                                </tr>
                                                <tr className="col-12">
                                                    <td>Adres</td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="Adres" name="adress" value={this.state.adress} onChange={this.ChangeValue} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="d-block d-md-none">
                                            gfbgffnh
                                        </div>
                                        <div id="czd">
                                            <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                            <h1 className="text-center text-primary">Regulamin</h1>
                                            <hr style={{backgroundColor: "#3d90e3", height: "5px"}} />
                                            <div class="form-check">
                                                <label className={this.state.rules!=="true" ? "form-check-label text-danger" : "form-check-label"}>
                                                    <input className={this.state.rules!=="true" ? "form-check-input is-invalid" : "form-check-input"} type="checkbox" name="rules" value={this.state.rules} onChange={this.ChangeValue}/>
                                                    Akceptuję <a href="/doc/rules.pdf" className={this.state.rules!=="true" ? "link-danger" : "link-primary"}>regulamin</a> i zobowiązuję się go przestrzegać
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <label className={this.state.rodo!=="true" ? "form-check-label text-danger" : "form-check-label"}>
                                                    <input className={this.state.rodo!=="true" ? "form-check-input is-invalid" : "form-check-input"} type="checkbox" name="rodo" value={this.state.rodo} onChange={this.ChangeValue}/>
                                                    Akceptuję <a href="/doc/rules.pdf" className={this.state.rodo!=="true" ? "link-danger" : "link-primary"}>RODO</a>
                                                </label>
                                            </div>
                                            <div className="text-center">
                                            <button className="btn btn-outline-primary mt-3 m-auto text-center" onClick={this.send}>Dołącz</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={this.state.Confirm}>
                                    <div className="m-aut text-center">
                                        <img src="/IMG/logo.png" alt="" width="30%" />
                                        <h1 className="mt-4">Dziękujemy za dołączenie do systemu fernn.</h1>
                                        <h6>{this.state.Text}</h6>
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

export default Index;