window.onload = () => {
    const url1 = 'https://bensfarmshop.co.uk/wp-content/uploads/2017/09/dairy-cow.jpg';
    const url2 =
        'https://www.alltech.com/sites/default/ddd789/styles/social_friendly/public/2018-03/PigPhoto.png?itok=rnFsXJf5';
    const url3 =
        'https://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/H-P/pig-fence.adapt.945.1.jpg';

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.height = 100;
            image.src = url;
            document.body.append(image);
            image.addEventListener('load', () => {
                resolve();
            });
            image.addEventListener('error', () => {
                reject();
            })
        })
    }

    loadImage(url1)
        .then(() => loadImage(url2))
        .then(() => loadImage(url3))

        .catch(() => console.log('nein'));
};