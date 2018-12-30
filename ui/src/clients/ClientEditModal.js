import React, {Component} from 'react';
import {DefaultButton, PrimaryButton} from "pivotal-ui/react/buttons";
import {Modal} from "pivotal-ui/react/modal";
import PropTypes from 'prop-types';
import {Form} from "pivotal-ui/react/forms";
import {FlexCol, Grid} from "pivotal-ui/react/flex-grids";
import {CheckboxDropdown} from "pivotal-ui/react/checkbox-dropdown";
import _ from "lodash";
import {Input} from "pivotal-ui/react/inputs";

class ClientEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    render() {
        const client = this.props.data;
        const grantTypesLabels = {
            client_credentials: false,
            authorization_code: false,
            implicit: false,
            password: false,
            refresh_token: false
        };
        const authorities = this.toCheckbox(this.props.groups);
        const scope = this.toCheckbox(this.props.groups);

        client.authorized_grant_types.forEach(x => grantTypesLabels[x] = true);
        client.authorities.forEach(x => authorities[x] = true);
        client.scope.forEach(x => scope[x] = true);
        delete authorities['uaa.none'];
        delete scope['uaa.none'];

        return (<span>
            <PrimaryButton
                onClick={() => this.setState({showModal: true})}
            >Edit</PrimaryButton>
            <Modal animationDuration={0}
                   title='Edit Client'
                   size="80%"
                   show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>
                <Form {...{
                    fields: {
                        client_id: {
                            label: 'Client ID',
                            initialValue: client.client_id,
                            children: <Input disabled={"disabled"}/>
                        },
                        name: {
                            label: 'Name',
                            initialValue: client.name,
                            optional: true,
                        },
                        authorized_grant_types: {
                            label: 'Grant Types',
                            children: <CheckboxDropdown {...{
                                labels: grantTypesLabels,
                            }} />,
                            optional: true,
                            help: 'At least one grant type is required (Blank does not change the value).',

                        },
                        client_secret: {
                            label: 'Client Secret',
                            optional: true,
                            help: 'Required for client_credentials and authorization_code grant types (Blank does not change the value).',
                            children: <Input type="password"/>
                        },
                        authorities: {
                            label: 'Authorities',
                            optional: true,
                            children: <CheckboxDropdown {...{
                                labels: authorities,
                            }} />
                        },
                        scope: {
                            label: 'Scope',
                            optional: true,
                            children: <CheckboxDropdown {...{
                                labels: scope,
                            }} />
                        },
                        redirect_uri: {
                            label: "Redirect URI",
                            optional: true,
                            initialValue: client.redirect_uri && client.redirect_uri.join(','),
                            help: 'At least one redirect URL is required for authorization_code and implicit grant type (Blank does not change the value).',
                            children: <Input placeholder='Comma separated URL'/>
                        },
                        access_token_validity: {
                            label: 'Access Token Validity',
                            optional: true,
                            initialValue: client.access_token_validity,
                            children: <Input type="number"/>
                        },
                        refresh_token_validity: {
                            label: 'Refresh Token Validity',
                            optional: true,
                            initialValue: client.refresh_token_validity,
                            children: <Input type="number"/>
                        }
                    },
                    onSubmit: ({initial, current}) => {
                        const client = current;
                        const checkEmpty = o => _.isEmpty(o) ? ['uaa.none'] : o;
                        client.client_id = this.props.data.client_id;
                        client.authorized_grant_types = this.filterCheckbox(current.authorized_grant_types);
                        client.authorities = checkEmpty(this.filterCheckbox(current.authorities));
                        client.scope = checkEmpty(this.filterCheckbox(current.scope));
                        client.redirect_uri = this.filterRedirectUri(current.redirect_uri);
                        if (_.isEmpty(client.client_secret)) {
                            delete client.client_secret;
                        }
                        return this.props.updateClient(client)
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
                                            disabled={!canSubmit()}
                                        >Edit</PrimaryButton></FlexCol>
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
        data: PropTypes.object,
        updateClient: PropTypes.func,
        groups: PropTypes.array
    };
}

export default ClientEditModal;