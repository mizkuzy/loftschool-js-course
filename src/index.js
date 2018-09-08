const friendsListId = 'friends-list';
const choseFriendsListId = 'chose-vk-friends';

// check that we have at least friends list in storage
function savedFriendsExistInLocalStorage() {
    return localStorage[friendsListId];
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

    function getItem(node) {
        return item = {
            first_name: node.querySelector('.name').innerText,
            last_name: node.querySelector('.surname').innerText,
            photo_50: node.querySelector('img').src,
        };
    }

    function convertNodeToObject(node) {
        let obj = {items: []};
        let items = [];

        for (const n of node.children) {
            items.push(getItem(n));
        }

        obj.items = items;

        return obj;
    }

    function saveListTo(storageField, list, isLocalStorage = false) {
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

    function getIndex(items, node) {
        let index = 0;
        let foundNodeIndex = false;

        while (!foundNodeIndex) {
            const firstName = node.querySelector('.name').innerText;
            const lastName = node.querySelector('.surname').innerText;

            if (items[index].first_name === firstName && items[index].last_name === lastName) {
                foundNodeIndex = true;
            } else {
                index++;
            }
        }

        return index;
    }

    function updateSession(friend, from, to, nextNode) {
        const name = friend.querySelector('.name').innerText;
        const surname = friend.querySelector('.surname').innerText;

        // remove a friend from source list
        const updatedFromList = getSavedListFrom(from, false).items
            .filter((item) => item.first_name !== name && item.last_name !== surname);

        const items = getSavedListFrom(to, false).items;

        // add a friend to destination list
        if (nextNode) {
            const index = getIndex(items, nextNode);

            items.splice(index, 0, getItem(friend));
        } else {
            items.push(getItem(friend));
        }

        // save both lists
        saveListTo(from, {items: updatedFromList});
        saveListTo(to, {items: items});
    }

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

    function moveElementToLeft(event) {
        const friend = event.target.parentElement;
        const actionItem = friend.querySelector('.remove-item');

        updateNodeAction(actionItem);

        const friends = document.querySelector('#' + friendsListId);

        friends.appendChild(friend);

        updateSession(friend, choseFriendsListId, friendsListId);
    }

    function moveElementToRight(event) {
        const friend = event.target.parentElement;
        const actionItem = friend.querySelector('.add-item');

        updateNodeAction(actionItem);

        const friends = document.querySelector('#' + choseFriendsListId);

        friends.appendChild(friend);

        updateSession(friend, friendsListId, choseFriendsListId);
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
            console.log('load friends from local storage');
            fillFriendsList(choseFriendsListId, getSavedListFrom(choseFriendsListId, true));
        } else {
            // put friends list in the session storage
            saveListTo(friendsListId, friends);
            saveListTo(choseFriendsListId, {items: []});
            fillFriendsList(friendsListId, friends);
        }

        return new Promise(resolve => resolve())
    }

    function addMoveRightAction() {
        const addItems = document.querySelectorAll('.add-item');

        addItems.forEach((item) => {
            item.draggable = true;
            item.addEventListener('click', moveElementToRight, {once: true});
        });
    }

    function addMoveLeftActions() {
        const addItems = document.querySelectorAll('.add-item');

        addItems.forEach((item) => {
            item.draggable = true;
            item.addEventListener('click', moveElementToRight, {once: true});
        });
    }

    function addActions(friendsId) {
        if (friendsId === friendsListId) {
            addMoveRightAction()
        } else {
            addMoveLeftActions()
        }
    }

    function initVkFriends() {
        getVkFriends()
            .then(renderVkFriends)
            .then(addMoveRightAction) // todo think!
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

    document.addEventListener('drop', (event) => {
        if (currentDrag) {
            const dropZone = getCurrentZone(event.target);

            event.preventDefault();

            if (dropZone && currentDrag.startZone !== dropZone) {
                const friend = currentDrag.node;
                const action = friend.querySelector('.action');

                updateNodeAction(action);

                const dropList = dropZone.querySelector('.list');

                if (event.target.classList.contains('drop-zone')) {
                    dropList.appendChild(friend);
                } else {
                    dropList.insertBefore(friend, getFriendNode(event.target));
                }

                updateSession(friend, currentDrag.startZone.firstElementChild.id, dropList.id,
                    getFriendNode(event.target));
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
