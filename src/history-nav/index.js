window.onload = () => {
    const pageMap = {
        '#feed': '.news-content',
        '#friends': '.friends-content',
    };

    const list = document.querySelector('.list');
    let currentPage;

    list.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();

            const newPage = event.target.getAttribute('href');

            history.pushState({
                page: newPage
            }, 'new page');

            handlePage(newPage);
        }
    });
    // браузер генерирует событие popstate при нажатии на кнопки назад-вперёд
    // для движения по истории
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            handlePage(event.state.page);
        }
    });
    handlePage();

    function handlePage(page) {
        const pageName = pageMap[page];

        if (pageName) {
            const page = document.querySelector(pageName);

            if (page) {
                if (currentPage) {
                    currentPage.classList.add('hide');
                }

                page.classList.remove('hide');
                currentPage = page;
            }
        }
    }
};

