import React, {Component} from 'react';
import {SortableFlexTable, withRenderTdChildren, withRowDrawer} from 'pivotal-ui/react/table';
import PropTypes from 'prop-types';
import {Icon} from "pivotal-ui/react/iconography";
import Loader from "../utils/Loader";
import groupService from './GroupService';
import GroupDeleteModal from "./GroupDeleteModal";
import GroupCreateModal from "./GroupCreateModal";
import GroupEditModal from "./GroupEditModal";
import _ from "lodash";

class GroupsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        Loader.withReloading(this.loadGroups.bind(this))(this);
    }

    render() {
        const Table = withRowDrawer(withRenderTdChildren(SortableFlexTable));

        return (<div>
            <GroupCreateModal createGroup={group =>
                Loader.withReloading(() =>
                    groupService.createGroup(group)
                        .then(this.loadGroups.bind(this)))(this)}/>
            <br/>
            {this.state.showLoading > 0 ?
                <Icon style={{'fontSize': '96px'}} src="spinner-lg"/> :
                <Table columns={GroupsTable.columns}
                       data={this.state.data}
                       rowDrawer={this.rowDrawer.bind(this)}
                       defaultSort='meta.created'/>}
        </div>);
    }

    rowDrawer(i) {
        const group = this.state.data[i];
        return (
            <div className='table-drawer'>
                <GroupEditModal
                    updateGroup={group =>
                        Loader.withReloading(() =>
                            groupService.updateGroup(group)
                                .then(this.loadGroups.bind(this)))(this)}
                    data={group}/>
                <GroupDeleteModal
                    deleteGroup={groupId =>
                        Loader.withReloading(() =>
                            groupService.deleteGroup(groupId)
                                .then(this.loadGroups.bind(this)))(this)}
                    data={group}/>
                <br/>
                <div className='table-drawer-content'>
                    <div className='table-drawer-container phxl'>
                        <pre class="pre-scrollable"><code class="language-javascript">{JSON.stringify(group, null, 2)}</code></pre>
                    </div>
                </div>
            </div>
        );
    }

    loadGroups() {
        return groupService.loadGroups()
            .then(res => {
                const groups = res.data.resources;
                this.setState({
                    data: _.chain(groups)
                        .sortBy(x => x.displayName)
                        .value()
                });
            });
    }

    static propTypes = {
        data: PropTypes.array,
        reload: PropTypes.func
    };

    static columns = [
        {
            attribute: 'displayName',
        }
    ];
}

export default GroupsTable;