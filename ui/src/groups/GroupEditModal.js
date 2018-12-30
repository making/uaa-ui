import React, {Component} from 'react';
import {DefaultButton, PrimaryButton} from "pivotal-ui/react/buttons";
import {Modal} from "pivotal-ui/react/modal";
import PropTypes from 'prop-types';
import {Form} from "pivotal-ui/react/forms";
import {FlexCol, Grid} from "pivotal-ui/react/flex-grids";

class GroupEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    render() {
        const group = this.props.data;
        return (<span>
            <PrimaryButton
                onClick={() => this.setState({showModal: true})}
            >Edit</PrimaryButton>
            <Modal animationDuration={0}
                   title='Edit Group'
                   size="80%"
                   show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>
                <Form {...{
                    fields: {
                        displayName: {
                            label: 'Display Name',
                            initialValue: group.displayName
                        }
                    },
                    onSubmit: ({initial, current}) => {
                        const group = current;
                        group.id = this.props.data.id;
                        group.version = String(this.props.data.meta.version);
                        return this.props.updateGroup(group)
                            .then(() => {
                                this.setState({
                                    showModal: false
                                });
                            });
                    }
                }}>
                    {({fields, state, canSubmit}) => {
                        return (
                            <div>
                                <Grid>
                                    <FlexCol>{fields.displayName}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>
                                        <DefaultButton
                                            onClick={() => this.setState({showModal: false})}
                                        >Close</DefaultButton>
                                    </FlexCol>
                                    <FlexCol fixed>
                                        <PrimaryButton
                                            type='submit'
                                            disabled={!canSubmit()}
                                        >Edit</PrimaryButton></FlexCol>
                                </Grid>
                            </div>
                        );
                    }}
                </Form>
            </Modal></span>);
    }

    static propTypes = {
        data: PropTypes.object,
        updateGroup: PropTypes.func
    };
}

export default GroupEditModal;