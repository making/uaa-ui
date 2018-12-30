import axios from 'axios';

class UserService {
    loadUsers() {
        this.source = axios.CancelToken.source();
        return axios.get('/proxy/users', {
            cancelToken: this.source.token
        });
    }

    createUser(user) {
        return axios.post('/proxy/users', user,);
    }

    updateUser(user) {
        return axios.put(`/proxy/users/${user.id}`, user);
    }

    deleteUser(userId) {
        return axios.delete(`/proxy/users/${userId}`);
    }

    cancel() {
        if (this.source) {
            this.source.cancel('Operation canceled by the user.');
        }
    }
}

export default new UserService();