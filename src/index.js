const friendsList = 'friends-list';
const choseFriendsList = 'chose-vk-friends';

// check that we have at least friends list in storage
function savedFriendsExistInLocalStorage() {
    return localStorage[friendsList];
}

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

    function getVkFriends() {
        return callApi('friends.get', {fields: 'photo_50, first_name, last_name'})
    }

    function moveElementToLeft(event) {
        const friend = event.target.parentElement;
        const actionItem = friend.querySelector('.remove-item');

        updateNodeAction(actionItem);

        const choseFriends = document.querySelector('#' + friendsList);

        choseFriends.appendChild(friend)
    }

    function moveElementToRight(event) {
        const friend = event.target.parentElement;
        const actionItem = friend.querySelector('.add-item');

        updateNodeAction(actionItem);

        const choseFriends = document.querySelector('#' + choseFriendsList);

        choseFriends.appendChild(friend)
    }

    function saveListTo(storageField, list, isLocalStorage) {
        try {
            if (isLocalStorage) {
                localStorage[storageField] = JSON.stringify(list);
            } else {
                sessionStorage[storageField] = JSON.stringify(list);
            }

        } catch (e) {
            alert(`ой вей! Что-то не так! ${e}`);
        }
    }

    function getSavedListFrom(storageField, isLocalStorage) {
        let list = {};

        if (isLocalStorage) {
            list = localStorage[storageField];
        } else {
            list = sessionStorage[storageField];
        }

        return list ? JSON.parse(list) : {};
    }

    function fillFriendsList(listId, friends) {
        const friendTemplate = document.getElementById('user-tmplt').textContent;
        const render = Handlebars.compile(friendTemplate);
        const html = render(friends);

        const allFriends = document.querySelector(`#${listId}`);

        allFriends.innerHTML = html;
    }

    function renderVkFriends(friends) {
        if (savedFriendsExistInLocalStorage()) {
            console.log('liad friends from local storage')
        } else {
            // put friends list in the session storage
            saveListTo(friendsList, friends, false);
            fillFriendsList(friendsList, friends);
            fillFriendsList(choseFriendsList, getSavedListFrom(choseFriendsList, true));
        }

        return new Promise(resolve => resolve())
    }

    function addActions() {
        const addItems = document.querySelectorAll('.add-item');

        addItems.forEach((item) => {
            item.draggable = true;
            item.addEventListener('click', moveElementToRight, {once: true});
        });
    }

    function initVkFriends() {
        getVkFriends()
            .then(renderVkFriends)
            .then(addActions)
    }

    auth()
        .then(initVkFriends);

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
};
