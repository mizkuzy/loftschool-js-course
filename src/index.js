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

    function moveElementToLeft(event) {
        const friend = event.target.parentElement;
        const actionItem = friend.querySelector('.remove-item');
        actionItem.textContent = '+';
        actionItem.classList.remove('remove-item');
        actionItem.classList.add('add-item');
        actionItem.addEventListener('click', moveElementToRight, {once: true});

        const choseFriends = document.querySelector('#friends-list');
        choseFriends.appendChild(friend)
    }

    function moveElementToRight(event) {
        const friend = event.target.parentElement;
        const actionItem = friend.querySelector('.add-item');
        actionItem.textContent = 'x';
        actionItem.classList.remove('add-item');
        actionItem.classList.add('remove-item');
        actionItem.addEventListener('click', moveElementToLeft, {once: true});

        const choseFriends = document.querySelector('#chose-vk-friends');
        choseFriends.appendChild(friend)
    }

    auth()
        .then(() => {
            return callApi('friends.get', {fields: 'photo_50, first_name, last_name'})
        })
        .then((friends) => {
            const friendTemplate = document.getElementById('user-tmplt').textContent;
            const render = Handlebars.compile(friendTemplate);
            const html = render(friends);

            const allFriends = document.querySelector('#friends-list');

            allFriends.innerHTML = html;

            return new Promise(resolve => resolve())
        })
        .then(() => {
            const addItems = document.querySelectorAll('.add-item');
            addItems.forEach((item) => {
                item.addEventListener('click', moveElementToRight, {once: true});
            });
        });
};