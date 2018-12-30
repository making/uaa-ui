import React, {Component} from 'react';
import {DangerButton, DefaultButton} from "pivotal-ui/react/buttons";
import {Modal} from "pivotal-ui/react/modal";
import PropTypes from 'prop-types';

class GroupDeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    render() {
        return (<span>
            <DangerButton
                onClick={() => this.setState({showModal: true})}
            >Delete</DangerButton>
            <Modal animationDuration={0}
                   title={`Delete ${this.props.data.displayName} ?`}
                   size="60%"
                   show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>

                <DefaultButton>NO</DefaultButton>
                <DangerButton
                    onClick={() => this.props.deleteGroup(this.props.data.id)
                        .then(() => this.setState({showModal: false}))}
                >YES</DangerButton>
            </Modal></span>);
    }

    static propTypes = {
        data: PropTypes.object,
        deleteGroup: PropTypes.func
    };
}

export default GroupDeleteModal;