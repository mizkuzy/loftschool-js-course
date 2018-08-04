function slice(array, from = 0, to = array.length) {
    var slicedArray = [];

    if (from < 0) {
        from = array.length - Math.abs(from);

    }
    if (to < 0) {
        to = array.length - 1 - Math.abs(from);
    }
    if (to > array.length) {
        to = array.length;
    }

    for (let i = from; i < to; i++) {
        slicedArray.push(array[i]);
    }

    return slicedArray;
}

var a = ['Почему', 'надо', 'учить', 'JavaScript'];

console.log(slice(a, -2));
console.log(a.slice(-2));
console.log('***');
console.log(slice(a, 1, 1));
console.log(a.slice(1, 1));
console.log('***begin is more than end***');
console.log(slice(a, 5, 1));
console.log(a.slice(5, 1));
console.log('***end is more than last array element***');
console.log(slice(a, 1, 10));
console.log(a.slice(1, 10));
console.log('***end is more than last array element***');
console.log(slice(a, 1, a.length + 1));
console.log(a.slice(1, a.length + 1));
console.log('***begin and end are negative***');
console.log(slice(a, -4, -1));
console.log(a.slice(-4, -1));