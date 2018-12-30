import React, {Component} from 'react';
import 'pivotal-ui/css/code';
import 'pivotal-ui/css/buttons';
import 'pivotal-ui/css/border';
import 'pivotal-ui/css/box-shadows';
import 'pivotal-ui/css/alignment';
import 'pivotal-ui/css/links';
import './App.css';
import {Tab, Tabs} from 'pivotal-ui/react/tabs';
import ClientsTable from './clients/ClientsTable';
import GroupsTable from './groups/GroupsTable';
import UsersTable from "./users/UsersTable";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='App'>
                <h1>UAA UI</h1>
                <br/>
                <Tabs defaultActiveKey={1}
                      responsiveBreakpoint="md">
                    <Tab eventKey={1}
                         title="Users">
                        <UsersTable/>
                    </Tab>
                    <Tab eventKey={2}
                         title="Clients">
                        <ClientsTable/>
                    </Tab>
                    <Tab eventKey={3}
                         title="Groups">
                        <GroupsTable/>
                    </Tab>
                </Tabs>
                <br/>
            </div>
        );
    }

    componentDidMount() {
    }
}

export default App;
