window.onload = () => {
    const cookieName = document.querySelector('#name');
    const cookieValue = document.querySelector('#value');
    const add = document.querySelector('#add');

    add.addEventListener('click', () => {
        document.cookie = `${cookieName.value}=${cookieValue.value}`;

        cookieName.value = '';
        cookieValue.value = '';
    });

    function convertCookieToObject(cookie) {
        document.cookie.split('; ')
            .reduce((prev, cur) => {
                const [key, value] = cur.split('=');

                prev[key] = value;

                return prev;
            }, {});
    }
};