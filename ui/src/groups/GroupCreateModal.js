import React, {Component} from 'react';
import {DefaultButton, PrimaryButton} from "pivotal-ui/react/buttons";
import {Modal} from "pivotal-ui/react/modal";
import {Form} from 'pivotal-ui/react/forms';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import PropTypes from 'prop-types';

class GroupCreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    render() {
        return (<span>
            <PrimaryButton
                onClick={() => this.setState({showModal: true})}
            >New</PrimaryButton>
            <Modal animationDuration={0}
                   title='New Group'
                   size="80%"
                   show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>
                <Form {...{
                    fields: {
                        displayName: {
                            label: 'Display Name'
                        }
                    },
                    onSubmit: ({initial, current}) => {
                        const group = current;
                        return this.props.createGroup(group)
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
                                        >Add</PrimaryButton></FlexCol>
                                </Grid>
                            </div>
                        );
                    }}
                </Form>
            </Modal></span>);
    }

    static propTypes = {
        createGroup: PropTypes.func
    };
}

export default GroupCreateModal;