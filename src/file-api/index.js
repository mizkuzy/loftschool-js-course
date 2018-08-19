window.onload = () => {
    const theImage = document.querySelector('#theImage');
    const imgInput = document.querySelector('#imgInput');
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
        theImage.src = fileReader.result;
    });

    imgInput.addEventListener('change', (event) => {
        const [file] = event.target.files;

        if (file) {
            if (file.size > 300 * 1024) {
                alert('Too big file');
            } else {
                fileReader.readAsDataURL(file);
            }
        }
    })
};