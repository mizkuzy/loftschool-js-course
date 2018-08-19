window.onload = () => {
    const myName = document.querySelector('#myName');
    const bday = document.querySelector('#bday');
    const about = document.querySelector('#about');

    const save = document.querySelector('#save');
    const load = document.querySelector('#load');
    const isSessionStorage = document.querySelector('#isSessionStorage');

    let storage = localStorage;

    function saveData() {
        try {
            storage.data = JSON.stringify({
                myName: myName.value,
                bday: bday.value,
                about: about.value
            });
        } catch (e) {
            alert(`ой вей! Что-то не так! ${e}`);
        }
    }

    save.addEventListener('click', () => {
        saveData();
    });
    load.addEventListener('click', () => {
        const data = JSON.parse(storage.data || {});

        myName.value = data.myName || '';
        bday.value = data.bday || '';
        about.value = data.about || '';
    });

    // Когда что-то изменяет localStorage происходит событие storage для других открытых на том же домене вкладок
    window.addEventListener('storage', (event) => {
        load.click();
    });

};