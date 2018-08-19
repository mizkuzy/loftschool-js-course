/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie.
 Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie

 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

window.onload = () => {
    const homeworkContainer = document.querySelector('#homework-container');
    // текстовое поле для фильтрации cookie
    const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
    // текстовое поле с именем cookie
    const addNameInput = homeworkContainer.querySelector('#add-name-input');
    // текстовое поле со значением cookie
    const addValueInput = homeworkContainer.querySelector('#add-value-input');
    // кнопка "добавить cookie"
    const addButton = homeworkContainer.querySelector('#add-button');
    // таблица со списком cookie
    const listTable = homeworkContainer.querySelector('#list-table tbody');

    fillListTable(convertCookieToObject(document.cookie));

    filterNameInput.addEventListener('keyup', event => {
        const cookieObj = convertCookieToObject(document.cookie);
        const filterValue = event.currentTarget.value;
        let filteredCookies = {};

        for (const prop in cookieObj) {
            if (prop.includes(filterValue) || cookieObj[prop].includes(filterValue)) {
                filteredCookies[prop] = cookieObj[prop];
            }
        }

        fillListTable(filteredCookies);
    });

    addButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (addNameInput && addValueInput) {
            document.cookie = `${addNameInput.value}=${addValueInput.value}`;

            fillListTable(convertCookieToObject(document.cookie));
        }
    });

    listTable.addEventListener('click', (event) => {
        // remove cookie
        if (event.target.classList.contains('remove-btn')) {
            const tableRow = event.target.parentElement.parentElement;
            const cookieName = tableRow.querySelector('.cookie-name').innerText;

            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

            fillListTable(convertCookieToObject(document.cookie));
        }
    });

    function fillListTable(cookiesObj) {
        // clear table
        listTable.innerText = '';

        const tableRowsFragment = document.createDocumentFragment();

        for (const cookie in cookiesObj) {
            // create elements
            const tableRow = document.createElement('tr');
            const cookieNameTd = document.createElement('td');
            const cookieValueTd = document.createElement('td');
            const removeTd = document.createElement('td');
            const removeBtn = document.createElement('input');

            // add attributes to these elements
            removeBtn.type = 'image';
            removeBtn.src = 'trash.png';
            removeBtn.width = 30;
            removeBtn.height = 30;
            removeBtn.classList.add('remove-btn');
            removeTd.appendChild(removeBtn);

            cookieNameTd.innerText = cookie;
            cookieNameTd.classList.add('cookie-name');

            cookieValueTd.innerText = cookiesObj[cookie];

            // insert table data to table row
            tableRow.appendChild(cookieNameTd);
            tableRow.appendChild(cookieValueTd);
            tableRow.appendChild(removeTd);

            tableRowsFragment.appendChild(tableRow);
        }

        listTable.appendChild(tableRowsFragment);
    }

    document.querySelector('#filter-clear-btn').addEventListener('click', () => {
        filterNameInput.value = '';

        fillListTable(convertCookieToObject(document.cookie));
    })
};

function convertCookieToObject(cookie) {
    return cookie.split('; ')
        .reduce((prev, cur) => {
            const [key, value] = cur.split('=');

            prev[key] = value;

            return prev;
        }, {});
}