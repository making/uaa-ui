import React, {Component} from 'react';
import {SortableFlexTable, withRenderTdChildren, withRowDrawer} from 'pivotal-ui/react/table';
import PropTypes from 'prop-types';
import {Icon} from 'pivotal-ui/react/iconography';
import UserCreateModal from './UserCreateModal';
import UserDeleteModal from './UserDeleteModal';
import userService from './UserService';
import UserEditModal from "./UserEditModal";
import Loader from "../utils/Loader";

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showLoading: true,
        };
    }

    componentDidMount() {
        Loader.withReloading(this.loadUsers.bind(this))(this);
    }

    componentWillUnmount() {
        userService.cancel();
    }

    render() {
        const Table = withRowDrawer(withRenderTdChildren(SortableFlexTable));
        return (<div>
            <UserCreateModal createUser={user =>
                Loader.withReloading(() =>
                    userService.createUser(user)
                        .then(this.loadUsers.bind(this)))(this)}/>
            <br/>
            {this.state.showLoading ?
                <Icon style={{'fontSize': '96px'}} src="spinner-lg"/> :
                <Table columns={UsersTable.columns}
                       data={this.state.data}
                       rowDrawer={this.rowDrawer.bind(this)}
                       defaultSort='meta.created'/>
            }
        </div>);
    }

    rowDrawer(i) {
        const user = this.state.data[i];
        return (
            <div className='table-drawer'>
                <UserEditModal
                    updateUser={user =>
                        Loader.withReloading(() =>
                            userService.updateUser(user)
                                .then(this.loadUsers.bind(this)))(this)}
                    data={user}/>
                <UserDeleteModal
                    deleteUser={userId =>
                        Loader.withReloading(() =>
                            userService.deleteUser(userId)
                                .then(this.loadUsers.bind(this)))(this)}
                    data={user}/>
                <br/>
                <div className='table-drawer-content'>
                    <div className='table-drawer-container phxl'>
                        <pre className="pre-scrollable"><code className="language-javascript">{JSON.stringify(user, null, 2)}</code></pre>
                    </div>
                </div>
            </div>
        );
    }

    loadUsers() {
        return userService.loadUsers()
            .then(res => {
                const users = res.data.resources;
                this.setState({
                    data: users
                });
            });
    }


    static propTypes = {
        data: PropTypes.array,
        reload: PropTypes.func
    };

    static columns = [
        {
            attribute: 'userName',
        }, {
            attribute: 'emails',
            renderTdChildren: data => data.emails.map(x => x.value).join(', ')
        }, {
            attribute: 'groups',
            renderTdChildren: data => data.groups.map(x => x.display).join(', ')
        }, {
            attribute: 'origin',
        }, {
            attribute: 'lastLogonTime',
            renderTdChildren: data => new Date(data.lastLogonTime).toISOString()
        }
    ];

}

export default UsersTable;