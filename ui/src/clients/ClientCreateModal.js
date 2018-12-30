import React, {Component} from 'react';
import {DefaultButton, PrimaryButton} from "pivotal-ui/react/buttons";
import {Modal} from "pivotal-ui/react/modal";
import {Form} from 'pivotal-ui/react/forms';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {CheckboxDropdown} from 'pivotal-ui/react/checkbox-dropdown';
import {Input} from 'pivotal-ui/react/inputs';
import _ from 'lodash';
import PropTypes from 'prop-types';

class ClientCreateModal extends Component {
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
                   title='New Client'
                   size="90%"
                   show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>
                <Form {...{
                    fields: {
                        client_id: {
                            label: 'Client ID'
                        },
                        name: {
                            label: 'Name',
                            optional: true
                        },
                        authorized_grant_types: {
                            label: 'Grant Types',
                            children: <CheckboxDropdown {...{
                                labels: {
                                    client_credentials: false,
                                    authorization_code: false,
                                    implicit: false,
                                    password: false,
                                    refresh_token: false
                                },
                            }} />
                        },
                        client_secret: {
                            label: 'Client Secret',
                            optional: true,
                            help: 'Required for client_credentials and authorization_code grant types.',
                            children: <Input type="password"/>
                        },
                        authorities: {
                            label: 'Authorities',
                            optional: true,
                            children: <CheckboxDropdown {...{
                                labels: this.toCheckbox(this.props.groups),
                            }} />
                        },
                        scope: {
                            label: 'Scope',
                            optional: true,
                            children: <CheckboxDropdown {...{
                                labels: this.toCheckbox(this.props.groups),
                            }} />
                        },
                        redirect_uri: {
                            label: "Redirect URI",
                            optional: true,
                            help: 'At least one redirect URL is required for authorization_code and implicit grant type.',
                            children: <Input placeholder='Comma separated URL'/>
                        },
                        access_token_validity: {
                            label: 'Access Token Validity',
                            optional: true,
                            children: <Input type="number"/>
                        },
                        refresh_token_validity: {
                            label: 'Refresh Token Validity',
                            optional: true,
                            children: <Input type="number"/>
                        }
                    },
                    onSubmit: ({initial, current}) => {
                        const client = current;
                        const checkEmpty = o => _.isEmpty(o) ? ['uaa.none'] : o;
                        client.authorized_grant_types = this.filterCheckbox(current.authorized_grant_types);
                        client.authorities = checkEmpty(this.filterCheckbox(current.authorities));
                        client.scope = checkEmpty(this.filterCheckbox(current.scope));
                        client.redirect_uri = this.filterRedirectUri(current.redirect_uri);
                        return this.props.createClient(_.omitBy(client, _.isEmpty))
                            .then(() => {
                                this.setState({
                                    showModal: false
                                });
                            });
                    }
                }}>
                    {({fields, state, canSubmit}) => {
                        const client = state.current;
                        const authorized_grant_types = this.filterCheckbox(client.authorized_grant_types);
                        const clientSecretIsValid = (!_.includes(authorized_grant_types, 'client_credentials') &&
                            !_.includes(authorized_grant_types, 'authorization_code'))
                            || !_.isEmpty(client.client_secret);
                        const redirect_uri = this.filterRedirectUri(client.redirect_uri);
                        const redirectUriIsValid = (!_.includes(authorized_grant_types, 'implicit') &&
                            !_.includes(authorized_grant_types, 'authorization_code')) || !_.isEmpty(redirect_uri);

                        return (
                            <div>
                                <Grid>
                                    <FlexCol>{fields.client_id}</FlexCol>
                                    <FlexCol>{fields.name}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>{fields.authorized_grant_types}</FlexCol>
                                    <FlexCol>{fields.client_secret}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>{fields.authorities}</FlexCol>
                                    <FlexCol>{fields.scope}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>{fields.redirect_uri}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>{fields.access_token_validity}</FlexCol>
                                    <FlexCol>{fields.refresh_token_validity}</FlexCol>
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
                                            disabled={!(clientSecretIsValid && redirectUriIsValid && canSubmit())}
                                        >Add</PrimaryButton></FlexCol>
                                </Grid>
                            </div>
                        );
                    }}
                </Form>
            </Modal></span>);
    }


    toCheckbox(array) {
        return _.chain(array)
            .map(x => [x, false])
            .fromPairs()
            .value()
    }

    filterCheckbox(o) {
        return _.chain(o)
            .toPairs()
            .filter(x => x[1])
            .map(x => x[0])
            .value();
    }

    filterRedirectUri(redirect_uri) {
        if (!_.isString(redirect_uri)) {
            return redirect_uri;
        }
        return _.reject(redirect_uri.split(',').map(x => x.trim()), _.isEmpty);
    }

    static propTypes = {
        createClient: PropTypes.func,
        groups: PropTypes.array
    };
}

export default ClientCreateModal;