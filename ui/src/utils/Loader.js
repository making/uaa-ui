import axios from 'axios';

class Loader {
    static withReloading(func) {
        return (that) => {
            that.setState({
                showLoading: true
            });
            return func.call(that)
                .then(() => {
                    that.setState({
                        showLoading: false
                    });
                })
                .catch((error) => {
                    if (!(error instanceof axios.Cancel)) {
                        console.error(error.response);
                        alert(error.response.data.message || error.response.data.error);
                        that.setState({
                            showLoading: false
                        });
                    }
                });
        };
    }

}

export default Loader;