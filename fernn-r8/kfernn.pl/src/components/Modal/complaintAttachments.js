import React from 'react'
import { ProgressBar } from "react-bootstrap"
import axios from 'axios'

class ComplaintAttachments extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Save: false,
            loading: false,
            succes: false,
            error: false,
            userData: {Attachments: undefined, CID: undefined, PID: undefined},
            progress: undefined,
            RID: undefined,
            attachments: []
        }
        this.status = this.status.bind(this)
        this.cancel = this.cancel.bind(this)
    }

    async componentDidMount(){
        this.setState({loading: true})
        this.setState({"RID": await this.props.state.RID})
        this.setState({"userData": await this.props.state.userData})

        const result = await axios.get("http://localhost:8082/v1/1/getattachments", {
            params: {
                API: "ABC",
                CID: this.state.userData.CID,
                RID: this.state.RID
            }
        })
        this.setState({loading: false})
        if(result.data!=="e"){ this.setState({attachments: result.data}) } 
        else{ this.setState({error: true}) }
    }

    status(){
        this.setState({Save: true}); 
        setTimeout(function() {
            this.setState({Save: false}) 
        }.bind(this), 2500)
    }

    cancel(){
        this.props.setParameters("RID", this.state.RID)
        this.props.navChangePosition(7)
    }

    submitHandler = async e => {
        this.setState({succes: false})
        this.setState({error: false})
        this.setState({loading: true})
        e.preventDefault()
        let formData = new FormData()
        for(var x = 0; x<this.state.selectedFiles.length; x++) {
            formData.append('file', this.state.selectedFiles[x])
        }
        const Result = await axios.post("http://localhost:8082/v1/1/upload/addattachment", formData, {
            params: {
                API: "ABC",
                PID: this.state.userData.PID,
                CID: this.state.userData.CID,
                RID: this.state.RID
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: data => {
                this.setState({progress: Math.round((100 * data.loaded) / data.total)})
            },
        })

        this.setState({loading: false})
        if(Result.data==="ok"){ this.setState({succes: true}) }
        else{ this.setState({error: true}) }

        this.componentDidMount()
    }

    render(){
        return(
            <div className="card shadow col-11 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <button className="btn btn-outline-primary" onClick={this.cancel}>
                            <strong>Cofnij do edycji</strong>
                        </button>
                        <div className="m-0 font-weight-bold text-primary d-inline">
                            <h6>Szczegóły reklamacji - Załączniki</h6>
                        </div>
                        <div>
                            {this.state.loading ? <div className="dot-flashing me-5 align-items-stretch"></div> : ""}
                            {this.state.error ? <img src="https://img.icons8.com/fluency/30/000000/error.png" alt="" /> : ""}
                            {this.state.succes ? <img src="https://img.icons8.com/fluency/30/000000/ok.png" alt="" /> : ""}
                        </div>
                    </div>
                </div>
                <div className="card-body overflow-auto">
                    {this.state.error ? (
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Błąd wysyłania załączników</h4>
                            <hr />
                            <p>Załączniki nieprawidłowo wgrały się na serwer.</p>
                            <div className="mb-0"><strong>Spróbuj ponownie</strong> lub <div onClick={this.skip} className="d-inline" style={{cursor: "pointer"}}><strong>pomiń ten krok</strong></div></div>
                        </div>
                    ) : ''}
                    {this.state.userData.Attachments===0 ? ( 
                        <div>
                            <div className="alert alert-warning" role="alert">
                                <div className="d-flex align-items-center">
                                    <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                    </svg>
                                    <h4 className="alert-heading">Brak możliwości dodania załączników</h4>
                                </div>
                                <p>Obecny plan nie pozwala dodawać załączników do reklamacji. Aby odblokować tę opcję, przejdź do ustawień firmy (zakładka ustawienia) lub skontaktuj się z admistratorem firmy.</p>
                            </div>
                            <div className="text-end">
                                <button className="btn btn-primary col-12 col-md-5 mt-4" onClick={this.skip}>Dalej</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {this.state.userData.Attachments!==1 ? ( 
                                <div>
                                    {this.state.userData.Attachments===9999 ? <h3>Możesz dodać dowolną ilość załączników</h3> : <h3>Możesz dodać maksymalnie {this.state.userData.Attachments} załączników</h3>} 
                                    <div className="col-11 m-auto">
                                        <div className="input-group">
                                            <input className="form-control" style={{marginTop: "0px"}} multiple  accept="image/x-png,image/jpg,image/jpeg,image,png" type="file" onChange={e => { this.setState({selectedFiles: (e.target.files)}) }}/>
                                            <button className="btn btn-outline-primary" onClick={this.submitHandler}>Wyślij</button>
                                        </div>
                                        {this.state.progress && <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} />}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3>Możesz dodać 1 załącznik</h3>
                                    <div className="col-11 m-auto">
                                        <div className="input-group">
                                            <input className="form-control" type="file" style={{marginTop: "0px"}} accept="image/x-png,image/jpg,image/jpeg,image,png" onChange={e => { this.setState({selectedFiles: (e.target.files)}) }}/>
                                            <button className="btn btn-outline-primary" onClick={this.submitHandler}>Wyślij</button>
                                        </div>
                                        {this.state.progress && <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} />}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div>
                        <hr className="mt-5" />
                        <h1 className="text-center mt-3">Dodane załączniki</h1>
                        {this.state.attachments.map((e, index) => (
                            <img src={"http://localhost:8082/"+e.Path} className="w-50" alt="" />
                        ))}

                        <h5 className={this.state.attachments.length===0 ? "text-center mt-3" : "d-none"}>Brak dodanych załączników</h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default ComplaintAttachments