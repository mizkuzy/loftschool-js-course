window.onload = () => {
    function loadAndSortTowns() {
        return new Promise(() => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
            xhr.responseType = 'json';
            xhr.send();
            xhr.addEventListener('load', () => {
                // all error statuses which are more then 400 means that
                // something is wrong
                if (xhr.status >= 400) {
                    if (xhr.status === 400) {
                        console.log('file not found');
                    } else {
                        console.log('something is wrong');
                    }
                } else {
                    const response = xhr.response;
                    console.log(response)
                    const sort = response
                        .sort((a, b) => {
                            var aA = a.name.toLowerCase()
                            var bB = b.name.toLowerCase()

                            if (a.name > b.name) {
                                return -1
                            }

                            return 1;

                        });

                    console.log(sort)
                    resolve(sort);
                }
            })
        })
    }

    loadAndSortTowns();
};