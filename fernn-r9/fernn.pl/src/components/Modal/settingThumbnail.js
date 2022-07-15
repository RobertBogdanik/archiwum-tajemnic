import axios from 'axios'
import React from 'react'
import { ProgressBar } from "react-bootstrap"

class SettingAddAcount extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            selectedFiles: [],
            progress: undefined,
            userData: {PID: undefined, CID: undefined}
        }
        this.sendForm = this.sendForm.bind(this)
        this.setDefault = this.setDefault.bind(this)
    }

    async componentDidMount(){
        this.setState({userData: await this.props.state.userData})
    }

    async sendForm(e){
        this.setState({succes: false})
        this.setState({error: false})
        this.setState({loading: true})

        e.preventDefault()
        let formData = new FormData()
        for(var x = 0; x<this.state.selectedFiles.length; x++) {
            formData.append('file', this.state.selectedFiles[x])
        }
        const Result = await axios.post("http://localhost:8082/v1/1/uploadthumbnail", formData, {
            params: {
                API: "ABC",
                PID: this.state.userData.PID,
                CID: this.state.userData.CID
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
        await this.props.refreshUserData()
        this.componentDidMount()
    }

    async setDefault(){
        this.setState({succes: false})
        this.setState({error: false})
        this.setState({loading: true})

        var result = await axios.get("http://localhost:8082/v1/1/setdefaultthumbnail", {
            params: {
                API: "ABC",
                PID: this.state.userData.PID,
                CID: this.state.userData.CID
            }
        })

        this.setState({loading: false})
        if(result.data==="ok"){ this.setState({succes: true}) }
        else{ this.setState({error: true}) }

        await this.props.refreshUserData()
        this.componentDidMount()
    }
    
    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Miniaturka</h6>
                        </div>
                        {this.state.loading ? <div className="dot-flashing me-5  align-items-stretch"></div> : ""}
                        {this.state.error ? <img src="https://img.icons8.com/fluency/30/000000/error.png" alt="" /> : ""}
                        {this.state.succes ? <img src="https://img.icons8.com/fluency/30/000000/ok.png" alt="" /> : ""}
                    </div>
                </div>
                <div className="card-body overflow-auto text-center">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="input-group">
                                    <input style={{marginTop: "0px"}} className="form-control" type="file" name="thumbnail" accept="image/*" onChange={e => { this.setState({selectedFiles: (e.target.files)}) }} />
                                    <button className="btn btn-outline-primary" type="submit" onClick={this.sendForm}>Aktualizuj</button>
                                </div>
                                {this.state.progress && <ProgressBar now={this.state.progress} label={`${this.state.progress}%`} />} 
                                <button className="btn btn-outline-primary mt-2" onClick={this.setDefault}>Ustaw domyślną</button>
                            </div>
                            <div id="userDropdown" className="col-md-4 col-12 mt-2">
                                <h5>Aktualna miniaturka</h5>
                                <img src={this.state.userData.Thumbnail} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingAddAcount