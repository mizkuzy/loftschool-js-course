window.onload = () => {
    // PREPEND
    var divBefore = document.createElement('div');
    divBefore.textContent = 'before';

    var divAfter = document.createElement('div');
    divAfter.textContent = 'after';

    var body = document.body;
    body.appendChild(divAfter);

    let firstElementBody = body.firstElementChild;

    body.insertBefore(divBefore, firstElementBody);


};