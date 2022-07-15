import React from 'react'
import styled from 'styled-components';
import moment from 'moment'

class FilterComponent extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            tomorrow:  new Date(),
            From: moment(this.tomorrow).subtract(3, 'month').format('YYYY-MM-DD'),
            To: moment(this.tomorrow).format('YYYY-MM-DD'),
            CID: "",
            data: [],
            filterText: "", 
            resetPaginationToggle: false 
        }
    }

    render() {
        return (
            <div className="d-flex justify-content-between align-items-stretch flex-fill row">
                <div className="col-lg-8 col-11 align-middle d-inline">
                    {/* sm */}
                    <div className="col-12 text-start d-block d-sm-none" style={{maxWidth: "1000px", marginLeft: "0px"}}>
                        <label>Pokarz od:</label>
                        <input type="date" id="fromSM" className="col-12 m-auto form-control d-inline" value={this.props.From} onChange={this.props.changeFrom} /><br />
                        <div>
                            <img src="https://img.icons8.com/fluency/48/000000/thick-arrow-pointing-down.png" className="mt-2 mb-2" style={{marginLeft: "10px"}} alt="" />
                        </div>
                        <label>Pokarz do:</label>
                        <input type="date" id="toSM" className="col-12 m-auto mb-2 form-control d-inline" value={this.props.To} onChange={this.props.changeTo} /><br />
                        <button className="col-12 btn btn-primary" onClick={this.props.changeDate}>Pokarz</button><br /><br />
                    </div>
                        
                    {/* md */}
                    <div className="col-12 text-start d-none d-sm-block d-xl-none" style={{maxWidth: "1000px", marginLeft: "0px"}}>
                        <div className="row col-12" style={{marginLeft: "-10px", marginBottom: "-15px"}}>
                            <div style={{width: "44%"}}>
                                <label>Pokarz od:</label>
                            </div>
                            <div style={{width: "12%"}}>
                                <label></label>
                            </div>
                            <div style={{width: "44%"}}>
                                <label className="form-label">Pokarz do:</label>
                            </div>
                        </div>
                        <div style={{width: "100%"}} className="col-12">
                            <input type="date" className="form-control d-inline" id="fromMD" style={{width: "44%", boxSizing: "border-box", marginRight: "2%"}} value={this.props.From} onChange={this.props.changeFrom} />
                            <img src="https://img.icons8.com/fluency/100/000000/arrow.png" style={{width: "8%", boxSizing: "border-box"}} alt="" />
                            <input type="date" className="form-control d-inline" id="toMD" style={{width: "44%", boxSizing: "border-box", marginLeft: "2%"}} value={this.props.To} onChange={this.props.changeTo} />
                        </div>
                        <button className="col-12 btn btn-primary" onClick={this.props.changeDate}>Pokarz</button><br /><br />
                    </div>

                    {/* xl */}
                    <div className="col-12 text-start d-none d-xl-block" style={{maxWidth: "800px", marginLeft: "0px"}}>
                    <div className="row col-12" style={{marginLeft: "-10px", marginBottom: "-15px"}}>
                            <div style={{width: "35.5%"}}>
                                <label>Pokarz od:</label>
                            </div>
                            <div style={{width: "10%"}}>
                                <label></label>
                            </div>
                            <div style={{width: "35.5%"}}>
                                <label className="form-label">Pokarz do:</label>
                            </div>
                        </div>
                        <input type="date" id="from" className="form-control d-inline" style={{width: "35.5%"}} value={this.props.From} onChange={this.props.changeFrom} />
                        <img src="https://img.icons8.com/fluency/100/000000/arrow.png" className="ms-2" style={{width: "7.5%", boxSizing: "border-box"}} alt="" />
                        <input type="date" id="to" className="form-control d-inline" style={{width: "35.5%", boxSizing: "border-box"}} value={this.props.To} onChange={this.props.changeTo} />
                        <button style={{width: "17.25%", boxSizing: "border-box"}} className="ms-1 btn btn-primary" onClick={this.props.changeDate}>Pokarz</button>
                    </div>
               </div><div className="col-lg-4 col-12 align-middle d-inline" style={{height: "100%"}}>
                   <div className="input-group align-middle">
                       <TextField
                           id="search"
                           type="text"
                           placeholder="Podaj szukany tekst..."
                           autoComplete="off"
                           value={this.props.filterText}
                           onChange={this.props.onFilter}
                           className="form-control align-middle"
                       />
                       <button
                           onClick={this.props.onClear}
                           className="btn col-1"
                           style={{minWidth: "50px", padding: "0px", border: "2px solid #ced4da"}}
                       ><img src="https://img.icons8.com/fluency/32/000000/delete-sign.png" alt=""  /></button>
                   </div>
               </div>
           </div>
        )
    }
}

const TextField = styled.input`
	height: 32px;
	width: 200px;
	padding: 0 32px 0 16px;
    // border: 2px solid #0d6efd;
    // border-right: 1px solid #0d6efd;
	&:hover {
		cursor: pointer;
	}
    padding: 20px;
    margin: 0px
`;

export default FilterComponent;