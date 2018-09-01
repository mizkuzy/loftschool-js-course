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
        updateNodeAction(actionItem);

        const choseFriends = document.querySelector('#friends-list');
        choseFriends.appendChild(friend)
    }

    function moveElementToRight(event) {
        const friend = event.target.parentElement;
        const actionItem = friend.querySelector('.add-item');
        updateNodeAction(actionItem);

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
                item.draggable = true;
                item.addEventListener('click', moveElementToRight, {once: true});
            });
        });

    let currentDrag;

    function getFriendNode(node) {
        let friendNode = node;

        while (!friendNode.classList.contains('friend')) {
            friendNode = friendNode.parentElement
        }

        return friendNode;
    }

    document.addEventListener('dragstart', (event) => {
        const zone = getCurrentZone(event.target);

        if (zone) {
            currentDrag = {startZone: zone, node: getFriendNode(event.target)};
        }
    });

    document.addEventListener('dragover', (event) => {
        // todo check with only method e.preventDefault();. Without any logic
        const zone = getCurrentZone(event.target);

        if (zone) {
            event.preventDefault();
        }
    });

    function updateNodeAction(node) {
        if (node.classList.contains('remove-item')) {
            node.textContent = '+';
            node.classList.remove('remove-item');
            node.classList.add('add-item');
            node.addEventListener('click', moveElementToRight, {once: true});
        } else {
            node.textContent = 'x';
            node.classList.remove('add-item');
            node.classList.add('remove-item');
            node.addEventListener('click', moveElementToLeft, {once: true});
        }
    }

    document.addEventListener('drop', (event) => {
        if (currentDrag) {
            const dropZone = getCurrentZone(event.target);

            event.preventDefault();

            if (dropZone && currentDrag.startZone !== dropZone) {
                const action = currentDrag.node.querySelector('.action');

                updateNodeAction(action);

                const dropList = dropZone.querySelector('.list');
                if (event.target.classList.contains('drop-zone')) {
                    dropList.appendChild(currentDrag.node);
                } else {
                    dropList.insertBefore(currentDrag.node, getFriendNode(event.target));
                }
            }

            currentDrag = null;
        }
    });

    function getCurrentZone(from) {
        do {
            if (from.classList.contains('drop-zone')) {
                return from;
            }
        } while (from = from.parentElement);

        return null;
    }

    /* FILTERS*/
    const filters = document.querySelectorAll('.filter');

    function filterZoneBy(zone, filter) {
        //const cookieObj = convertCookieToObject(document.cookie);
        let filteredCookies = {};

        /*        for (const key in cookieObj) {
                    if (hasFilterValue(key, cookieObj[key], filter)) {
                        filteredCookies[key] = cookieObj[key];
                    }
                }*/

        return filteredCookies;
    }

    filters.forEach((filter) => {
        filter.addEventListener('keyup', (event) => {
            const curFilter = event.currentTarget;
            const filteredCookies = filterZoneBy(curFilter.parentElement.querySelector('.list'), curFilter.value);

            //fillListTable(filteredCookies);
        })
    });

    console.log(filters)
};