import React from 'react'
import axios from 'axios'

class ModelAndManufacter extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            StatusList: []
        };
    }

    async componentDidMount(){
        let statusList = await axios.get('http://localhost:8082/v1/1/status', {
            params: { API: "ABC" }
        });
        this.setState({"StatusList": statusList.data})
    }

    render(){
        return (
            <div>
                <select className="col-12 form-select-sm form-control" value={this.props.value} onChange={this.props.change} name="Status">
                    {this.state.StatusList.map((option) => (
                        <option value={option.Name} key={option._ID}>{option.Name}</option>
                    ))}
                </select>
            </div>
        )
    }
}

export default ModelAndManufacter