window.onload = () => {
    VK.init({
        apiId: 5350105
    });

    function auth() {
        return new Promise((resolve, reject) => {
            VK.Auth.login(function (response) {
                if (response.session) {
                    resolve();
                } else {
                    reject(new Error('Authorisation was not succeed!'));
                }
            }, 8);
        });
    }

    function callApi(method, params) {
        params.v = '5.80';

        return new Promise((resolve, reject) => {
            VK.api(method, params, (data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data.response);
                }
            })
        })
    }

    auth()
        .then(() => {
            return callApi('friends.get', {fields: 'photo_100, first_name, last_name'})
        })
        .then((friends) => {
            const friendTemplate = document.getElementById('user-tmplt').textContent;
            const render = Handlebars.compile(friendTemplate);
            const html = render(friends);

            const allFriends = document.querySelector('#friends-list');
            allFriends.innerHTML = html;
        })
};