import axios from 'axios';

class ClientService {
    loadClients() {
        this.source = axios.CancelToken.source();
        return axios.get('/proxy/clients', {
            cancelToken: this.source.token
        });
    }

    createClient(client) {
        console.log(client);
        return axios.post('/proxy/clients', client,);
    }

    updateClient(client) {
        return axios.put(`/proxy/clients/${client.client_id}`, client);
    }

    deleteClient(clientId) {
        return axios.delete(`/proxy/clients/${clientId}`);
    }

    cancel() {
        if (this.source) {
            this.source.cancel('Operation canceled by the user.');
        }
    }
}

export default new ClientService();