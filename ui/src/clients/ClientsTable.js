import React, {Component} from 'react';
import {SortableFlexTable, withRenderTdChildren, withRowDrawer} from 'pivotal-ui/react/table';
import PropTypes from 'prop-types';
import {Icon} from "pivotal-ui/react/iconography";
import clientService from './ClientService';
import groupService from '../groups/GroupService';
import Loader from "../utils/Loader";
import ClientDeleteModal from "./ClientDeleteModal";
import ClientCreateModal from "./ClientCreateModal";
import ClientEditModal from "./ClientEditModal";
import _ from "lodash";

class ClientsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            groups: [],
        };
    }

    componentDidMount() {
        Loader.withReloading(this.loadClients.bind(this))(this);
    }

    render() {
        const Table = withRowDrawer(withRenderTdChildren(SortableFlexTable));

        return (<div>
            <ClientCreateModal
                groups={this.state.groups}
                createClient={client =>
                    Loader.withReloading(() =>
                        clientService.createClient(client)
                            .then(this.loadClients.bind(this)))(this)}/>
            <br/>
            {this.state.showLoading > 0 ?
                <Icon style={{'fontSize': '96px'}} src="spinner-lg"/> :
                <Table columns={ClientsTable.columns}
                       data={this.state.data}
                       rowDrawer={this.rowDrawer.bind(this)}
                       defaultSort='client_id'/>}
        </div>);
    }

    loadClients() {
        return Promise.all([
            clientService.loadClients(),
            groupService.loadGroups()
        ])
            .then(values => {
                const clients = values[0].data.resources;
                const groups = values[1].data.resources.map(c => c.displayName);
                this.setState({
                    data: clients,
                    groups: _.chain(groups)
                        .sortBy(_.identity)
                        .value()
                });
            });
    }

    rowDrawer(i) {
        const client = this.state.data[i];
        return (
            <div className='table-drawer'>
                <ClientEditModal
                    groups={this.state.groups}
                    updateClient={client =>
                        Loader.withReloading(() =>
                            clientService.updateClient(client)
                                .then(this.loadClients.bind(this)))(this)}
                    data={client}/>
                <ClientDeleteModal
                    deleteClient={clientId =>
                        Loader.withReloading(() =>
                            clientService.deleteClient(clientId)
                                .then(this.loadClients.bind(this)))(this)}
                    data={client}/>
                <br/>
                <div className='table-drawer-content'>
                    <div className='table-drawer-container phxl'>
                        <pre className="pre-scrollable"><code className="language-javascript">{JSON.stringify(client, null, 2)}</code></pre>
                    </div>
                </div>
            </div>
        );
    }


    static propTypes = {
        data: PropTypes.array,
        reload: PropTypes.func
    };
    static columns = [
        {
            attribute: 'client_id',
        }, {
            attribute: 'name',
        }, {
            attribute: 'authorized_grant_types',
            renderTdChildren: data => data.authorized_grant_types && data.authorized_grant_types.join(', ')
        }, {
            attribute: 'authorities',
            renderTdChildren: data => data.authorities && data.authorities.join(', ')
        },
        {
            attribute: 'scope',
            renderTdChildren:
                data => data.scope && data.scope.join(', ')
        }
        ,
        {
            attribute: 'redirect_uri',
            renderTdChildren:
                data => data.redirect_uri && data.redirect_uri.join(', ')
        }
    ];
}

export default ClientsTable;