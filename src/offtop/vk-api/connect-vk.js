// https://handlebarsjs.com/
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
            console.log('Auth is resolved');

            return callApi('users.get', {name_case: 'gen'});
        })
        .then(([user]) => {
            console.log(user);
            const userData = document.querySelector('#userData');

            userData.textContent = `${user.first_name} ${user.last_name}`;

            return callApi('friends.get', {fields: 'city, country, photo_100'})
        })
        .then((friends) => {
            console.log(friends);
            var source = document.getElementById('user-tmplt').textContent;
            var render = Handlebars.compile(source);
            const html = render(friends);

            const querySelector = document.querySelector('#friends-list');
            querySelector.innerHTML = html

        })
};
