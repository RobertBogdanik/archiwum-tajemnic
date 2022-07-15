import React from 'react'
import axios from 'axios'
// import cookie from 'react-cookies'
import { ProgressBar } from "react-bootstrap"
// import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class AddSelectModel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            RID: 0,
            Code: '',
            progress: undefined,
            selectedFiles: [],
            userData: {Attachments: undefined, CID: undefined, PID: undefined},
            addSteps: [],
            error: false
        }
        this.skip = this.skip.bind(this)
    }

    async componentDidMount(){
        this.setState({"userData": this.props.state.userData})
        this.setState({"addSteps": this.props.state.AddSteps})
        this.setState({"RID": this.props.state.RID})
        this.setState({"Code": this.props.state.Code})
    }

    submitHandler = async e => {
        e.preventDefault()
        let formData = new FormData()
        for(var x = 0; x<this.state.selectedFiles.length; x++) {
            formData.append('file', this.state.selectedFiles[x])
        }
        const Result = await axios.post("http://localhost:8082/v1/1/upload/attachment", formData, {
            params: {
                API: "ABC",
                PID: this.state.userData.PID,
                CID: this.state.userData.CID,
                RID: this.state.RID,
                Code: this.state.Code,
                nextSteps: this.state.addSteps
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: data => {
                this.setState({progress: Math.round((100 * data.loaded) / data.total)})
            },
        })

        if(Result.data.succes){   
            Result.data.nextSteps.shift()
            this.props.setParameters("AddSteps", Result.data.nextStep)
            this.props.setParameters("RID", Result.data.RID)
            this.props.setParameters("Code", Result.data.Code)
            this.props.setParameters("UploadAll", Result.data.uploadAll)
            this.props.setParameters("UploadError", "false")


            this.props.navChangePosition(5)
            this.props.navChangePosition(parseInt(Result.data.nextSteps[0]))
        }else{ this.setState({error: true}) }
    }

    skip(){
        // cookie.save("AddSteps", this.state.addSteps, {maxAge: 30})
        // cookie.save("RID", this.state.RID, {maxAge: 30})
        // cookie.save("Code", this.state.Code, {maxAge: 30})
        // cookie.save("UploadError", "true", {maxAge: 30})
        this.props.setParameters("AddSteps", this.state.addSteps)
        this.props.setParameters("RID", this.state.RID)
        this.props.setParameters("Code", this.state.Code)
        this.props.setParameters("UploadError", "true")

        this.props.navChangePosition(parseInt(this.state.addSteps[0]))
        // this.props.navChangePosition(parseInt(this.state.addSteps[(this.state.addSteps.length === 1 ? 0 : 1)]))
    }

    render(){
        return(
            <div>
                <div className="card shadow col-11 mt-3 m-auto mb-5">
                    <div className="card-header py-3">
                        <div className="d-flex justify-content-between align-items-stretch flex-fill">
                            <h6 className="m-0 font-weight-bold text-primary">Dodawanie reklamacji</h6>
                            <h6 className="m-0 font-weight-bold text-primary">3 z 5</h6>
                        </div>
                    </div>
                    <div className="card-body m-0 overflow-auto">
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
                        ) : (<div>
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
                            ) : (<div>
                                    <h3>Możesz dodać 1 załącznik</h3>
                                    <div className="col-11 m-auto">
                                        <div className="input-group">
                                            <input className="form-control" type="file" style={{marginTop: "0px"}} accept="image/x-png,image/jpg,image/jpeg,image,png" onChange={e => { this.setState({selectedFiles: (e.target.files)}) }}/>
                                            <button className="btn btn-outline-primary" onClick={this.submitHandler}>Wyślij</button>
                                        </div>
                                        {this.state.progress && <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} />}
                                    </div>
                                </div>)}
                        </div>)}
                    </div>
                </div>
            </div>
        )
    }
}

export default AddSelectModel