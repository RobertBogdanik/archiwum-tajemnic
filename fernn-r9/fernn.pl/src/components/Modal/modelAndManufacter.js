import React from 'react'
import axios from 'axios'

class ModelAndManufacter extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            Result: [],
            old: null,
            inWaitModel: true
        };
    }

    async componentDidUpdate() {
        if(this.state.old!==this.props.query){
            this.setState({old: this.props.query})
            let userData = await axios.get('http://localhost:8082/v1/1/searchmodels', {
                params: {
                    API: "ABC",
                    query: this.props.query,
                    session: '1'
                }
            });
            this.setState({Result: userData.data})
        }
        return true
    }

    render(){
        return (
            <div>
                {
                Array.isArray(this.state.Result)===true ? 
                    this.state.Result.map(item => (
                        <div onClick={this.props.change} value={item.Model+" => "+(item.SKU==null ? "undefinedSKU" : item.SKU)+" ("+item.Manufacturer+")"} className="ModelItem" key={item._ID}>
                            <h6 value={item.Model+" => "+item.SKU+" ("+item.Manufacturer+")"}>{item.Model}</h6>
                            <p value={item.Model+" => "+item.SKU+" ("+item.Manufacturer+")"}>{item.Manufacturer}</p>
                        </div>
                    ))
                 :  console.log("sddsfds")
                }
            </div>
        )
    }
}

export default ModelAndManufacter