import React from 'react'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import axios from 'axios'
import FilterComponent from './list'

class ComplaintList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading: 0,
            Type: -1,
            changeType: false,
            
            tomorrow:  new Date(),
            From: moment(this.tomorrow).subtract(3, 'month').format('YYYY-MM-DD'),
            To: moment(this.tomorrow).format('YYYY-MM-DD'),
            CID: 0,
            data: [],
            filterText: "", 
            resetPaginationToggle: false,
            ComplettList: [],
            ActualList: []
        }
        this.columns = [
            {
                name: 'Nr. reklamacji',
                selector: (row) => row.Complaint_number,
                sortable: true,
            },
            {
                name: 'Dział',
                selector: (row) => row.Name,
                sortable: true,
            },
            {
                name: 'Status',
                selector: (row) => row.Status,
                sortable: true,
            },
            {
                name: 'Imie',
                selector: (row) => row.Firstname,
                sortable: true,
            },
            {
                name: 'Nazwisko',
                selector: (row) => row.Lastname,
                sortable: true,
            },
            {
                name: 'Model',
                selector: (row) => row.Model,
                sortable: true,
            },
            {
                name: 'Producent',
                selector: (row) => row.Manufacturer,
                sortable: true,
            },
            {
                selector: (row) => <button onClick={this.clickHandler} value={row._ID} className={
                    (row.Locking===1 ? "btn btn-outline-warning" : (row.ToPickUp===1 ? "btn btn-outline-success" : "btn btn-outline-primary") )
                }>Edytuj</button>,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
        ]
        this.loading = this.loading.bind(this)
        this.changeDate = this.changeDate.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
    }

    loading(a){
       this.setState({loading: a})
    }

    async componentDidUpdate (){
        if(this.state.Type !== await this.props.state.complaintListType){
            this.setState({Type: await this.props.state.complaintListType})
            this.changeDate()
        }
    }

    async componentDidMount(){
        this.loading(1)
        this.setState({Type: await this.props.state.complaintListType})
        this.setState({CID: await this.props.state.userData.CID})
        var tomorrow =  new Date();
        var from = moment(tomorrow).subtract(3, 'month').format('YYYY-MM-DD')
        var to = moment(tomorrow).add(1, 'day').format('YYYY-MM-DD')
        var statusList = {data: { nextQuery: { API: "ABC", CID: this.state.CID, Type: this.state.Type, From: 0, Limit: 25, FromDate: from, ToDate: to }, nextSelect:false }}

        var cd = []
        do{
            statusList = await axios.get('http://localhost:8082/v1/1/EasyComplaintList', { params: statusList.data.nextQuery })
            for (const iterator of statusList.data.Data) { cd.push(iterator)  }
            this.setState({ComplettList: cd})
            this.setState({ActualList: cd})
        }while(statusList.data.nextSelect)
        this.loading(0)
    }

    handleClear = () => {
        const { resetPaginationToggle, filterText } = this.state;
        if (filterText) { this.setState({ resetPaginationToggle: !resetPaginationToggle, filterText: "" }); }
    };

    filter = (filterText) => {
        this.setState({filterText: filterText})
        var kdat = []
        for(var a=0; a<this.state.ComplettList.length; a++){
            var item = this.state.ComplettList[a]
            if(this.include(filterText, item)){ kdat.push(this.state.ComplettList[a]) }
        }

        this.setState({ActualList: kdat})
    }

    include = (filterText, item) => {
        var tr = 0
        for (const iterator of filterText.split(' ')) {
            if(iterator!==null){
                if( 
                    (item.Complaint_number!==null ? item.Complaint_number.toLowerCase().includes(iterator.toLowerCase()) : false) ||
                    (item.Firstname!==null ? item.Firstname.toLowerCase().includes(iterator.toLowerCase()) : false) ||
                    (item.Lastname!==null ? item.Lastname.toLowerCase().includes(iterator.toLowerCase()) : false) ||
                    (item.Manufacturer!==null ? item.Manufacturer.toLowerCase().includes(iterator.toLowerCase()) : false) ||
                    (item.Name!==null ? item.Name.toLowerCase().includes(iterator.toLowerCase()) : false) ||
                    (item.Model!==null ? item.Model.toLowerCase().includes(iterator.toLowerCase()) : false) ||
                    (item.Status!==null ? item.Status.toLowerCase().includes(iterator.toLowerCase()) : false)
                ){ tr ++ }
            }
        }
    
        if(tr===filterText.split(' ').length){ return true }
        else{ return false }
    }

    async changeDate(){
        this.loading(1)
        var statusList = {data: { nextQuery: { API: "ABC", CID: this.state.CID, Type: this.state.Type, From: 0, Limit: 25, FromDate: this.state.From, ToDate: moment(this.state.To).add(1, 'day').format('YYYY-MM-DD') }, nextSelect:false }}
        var cd = []
        do{
            statusList = await axios.get('http://localhost:8082/v1/1/EasyComplaintList', { params: statusList.data.nextQuery })
            for (const iterator of statusList.data.Data) { cd.push(iterator)  }
            this.setState({ComplettList: cd})
            this.setState({ActualList: cd})
        }while(statusList.data.nextSelect)
        this.loading(0)
    }

    getSubHeaderComponent = () => {
        return (
            <FilterComponent 
                onFilter={ e => this.filter(e.target.value)} 
                onClear={this.handleClear} 
                filterText={this.state.filterText}
                From={this.state.From}
                changeFrom={ e => this.setState({From: e.target.value})}
                To={this.state.To}
                changeTo={ e => this.setState({To: e.target.value})}
                changeDate={ this.changeDate }
            />
        );
    };

    clickHandler = (event) => {
        this.props.setParameters("RID", event.target.value)
        this.props.navChangePosition(7)
    }

    render(){
        return(
            <div className="card shadow col-11 mt-3 m-auto mb-3">
                <div className="card-header py-3">
                    <div className="d-flex justify-content-between align-items-stretch flex-fill align-middle">
                        <div className="m-0 font-weight-bold text-primary">
                            <h6>Lisat reklamacji</h6>
                        </div>
                        {this.state.loading ? <div className="dot-flashing me-5  align-items-stretch"></div> : ""}
                    </div>
                </div>
                <div className="card-body overflow-auto">
                    <DataTable
                        columns={this.columns}
                        data={this.state.ActualList}
                        pagination
                        paginationComponentOptions={this.state.resetPaginationToggle}
                        subHeader
                        subHeaderComponent={this.getSubHeaderComponent()}
                        persistTableHead
                    />
                </div>
            </div>
        )
    }
}

export default ComplaintList