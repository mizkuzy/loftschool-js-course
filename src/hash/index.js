window.onload = () => {
    const pageMap = {
        '#feed': '.news-content',
        '#friends': '.friends-content',
    };

    let currentPage;

    window.addEventListener('hashchange', handlePage);
    handlePage();

    function handlePage() {
        const pageName = pageMap[location.hash];

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

