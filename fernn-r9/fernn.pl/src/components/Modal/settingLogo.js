import axios from 'axios'
import React from 'react'
import { ProgressBar } from "react-bootstrap"

class SettingLogo extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: false,
            error: false,
            succes: false,
            selectedFiles: [],
            progress: undefined,
            userData: {PID: undefined, CID: undefined},
            Logo: ''
        }
        this.sendForm = this.sendForm.bind(this)
    }

    async componentDidMount(){
        this.setState({userData: await this.props.state.userData})

        const result = await axios.get("http://localhost:8082/v1/1/getcompanylogo", {
            params: {
                API: "ABC",
                CID: this.state.userData.CID,
                PID: this.state.userData.PID
            }
        })
        
        if(result.data!=="e"){ this.setState({Logo: result.data })}
        else{ this.setState({ error: true })}
    }

    async sendForm(e){
        this.setState({loading: true})
        this.setState({succes: false})
        this.setState({error: false})
        e.preventDefault()
        let formData = new FormData()
        for(var x = 0; x<this.state.selectedFiles.length; x++) {
            formData.append('file', this.state.selectedFiles[x])
        }
        const Result = await axios.post("http://localhost:8082/v1/1/uploadlogo", formData, {
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
        else{ this.setState({error: true})}

        this.componentDidMount()
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Logo firmy</h6>
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
                            </div>
                            <div className="col-md-4 col-12 mt-2">
                                <h5>Aktualne logo firmy</h5>
                                <img src={this.state.Logo} alt="" style={{maxWidth: "150px"}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingLogo