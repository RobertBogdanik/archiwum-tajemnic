import React from 'react'
import cookie from 'react-cookies'

class ModelAndManufacter extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            SectionList: []
        };
    }

    async componentDidMount(){
        const cook = await cookie.load("userData").AllWorkerSections
        this.setState({SectionList: cook})
        return true
    }

    render(){
        return (
            <div>
                <select className="col-12 form-select-sm form-control " name="Section" onChange={this.props.change} value={this.props.value}>
                    {this.state.SectionList.map((option) => (
                        <option value={option.Name} key={option._ID}>{option.Name}</option>
                    ))}
                </select>
            </div>
        )
    }
}

export default ModelAndManufacter