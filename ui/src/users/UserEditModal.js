import React, {Component} from 'react';
import {DefaultButton, PrimaryButton} from "pivotal-ui/react/buttons";
import {Modal} from "pivotal-ui/react/modal";
import PropTypes from 'prop-types';
import {Form} from "pivotal-ui/react/forms";
import {FlexCol, Grid} from "pivotal-ui/react/flex-grids";
import {Input} from "pivotal-ui/react/inputs";

class UserEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    render() {
        const user = this.props.data;
        return (<span>
            <PrimaryButton
                onClick={() => this.setState({showModal: true})}
            >Edit</PrimaryButton>
            <Modal animationDuration={0}
                   title='Edit User'
                   size="80%"
                   show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>
                <Form {...{
                    fields: {
                        userName: {
                            label: 'User Name',
                            initialValue: user.userName,
                            children: <Input disabled={!!this.props.data.externalId}/>
                        },
                        email: {
                            label: 'Email',
                            initialValue: user.emails ? user.emails.map(x => x.value).join(',') : "",
                            children: <Input disabled={!!this.props.data.externalId}/>
                        },
                        givenName: {
                            label: 'Given Name',
                            initialValue: user.name ? user.name.givenName : "",
                            children: <Input disabled={!!this.props.data.externalId}/>
                        },
                        familyName: {
                            label: 'Family Name',
                            initialValue: user.name ? user.name.familyName : "",
                            children: <Input disabled={!!this.props.data.externalId}/>
                        }
                    },
                    onSubmit: ({initial, current}) => {
                        const user = current;
                        user.id = this.props.data.id;
                        user.version = String(this.props.data.meta.version);
                        user.emails = [
                            {
                                primary: true,
                                value: user.email
                            }
                        ];
                        user.name = {
                            givenName: user.givenName,
                            familyName: user.familyName
                        };
                        return this.props.updateUser(user)
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
                                    <FlexCol>{fields.userName}</FlexCol>
                                    <FlexCol>{fields.email}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>{fields.givenName}</FlexCol>
                                    <FlexCol>{fields.familyName}</FlexCol>
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
        updateUser: PropTypes.func
    };
}

export default UserEditModal;