import axios from 'axios';

class Groupservice {
    loadGroups() {
        this.source = axios.CancelToken.source();
        return axios.get('/proxy/groups', {
            cancelToken: this.source.token
        });
    }

    createGroup(group) {
        return axios.post('/proxy/groups', group,);
    }

    updateGroup(group) {
        return axios.put(`/proxy/groups/${group.id}`, group);
    }

    deleteGroup(groupId) {
        return axios.delete(`/proxy/groups/${groupId}`);
    }

    cancel() {
        if (this.source) {
            this.source.cancel('Operation canceled by the user.');
        }
    }
}

export default new Groupservice();