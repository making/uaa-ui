import React, {Component} from 'react';
import {DefaultButton, PrimaryButton} from "pivotal-ui/react/buttons";
import {Modal} from "pivotal-ui/react/modal";
import {Form} from 'pivotal-ui/react/forms';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {Input} from 'pivotal-ui/react/inputs';
import PropTypes from 'prop-types';

class UserCreateModal extends Component {
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
                   title='New User'
                   size="80%"
                   show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>
                <Form {...{
                    fields: {
                        userName: {
                            label: 'User Name',
                        },
                        email: {
                            label: 'Email'
                        },
                        givenName: {
                            label: 'Given Name',
                        },
                        familyName: {
                            label: 'Family Name',
                        },
                        password: {
                            label: 'Password',
                            validator: currentValue => currentValue.length < 8 ? 'Password must be 8+ characters' : null,
                            children: <Input type="password" placeholder="Password"/>
                        },
                        password2: {
                            help: 'Enter a matching password (button will remain disabled unless they match)',
                            retainLabelHeight: true,
                            children: <Input type="password" placeholder="Re-enter password"/>
                        }
                    },
                    onSubmit: ({initial, current}) => {
                        const user = current;
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
                        return this.props.createUser(user)
                            .then(() => {
                                this.setState({
                                    showModal: false
                                });
                            })
                            ;
                    }
                }}>
                    {({fields, state, canSubmit}) => {
                        const passwIsValid = state.current.password !== "" && state.current.password === state.current.password2;
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
                                    <FlexCol>{fields.password}</FlexCol>
                                    <FlexCol>{fields.password2}</FlexCol>
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
                                            disabled={!passwIsValid || !canSubmit()}
                                        >Add</PrimaryButton></FlexCol>
                                </Grid>
                            </div>
                        );
                    }}
                </Form>
            </Modal></span>);
    }

    static propTypes = {
        createUser: PropTypes.func
    };
}

export default UserCreateModal;