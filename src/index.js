/* ДЗ 3 - работа с исключениями и отладчиком */

/*
 Задание 1:

 1.1: Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true только если fn вернула true для всех элементов массива

 1.2: Необходимо выбрасывать исключение в случаях:
   - array не массив или пустой массив (с текстом "empty array")
   - fn не является функцией (с текстом "fn is not a function")

 Зарпещено использовать встроенные методы для работы с массивами

 Пример:
   isAllTrue([1, 2, 3, 4, 5], n => n < 10) // вернет true
   isAllTrue([100, 2, 3, 4, 5], n => n < 10) // вернет false
 */
function isAllTrue(array, fn) {
    if (!(array instanceof Array) || array.length === 0) {
        throw new Error('empty array');
    }
    if (!(fn instanceof Function)) {
        throw new Error('fn is not a function');
    }

    let isAllTrueResult = true;

    for (let i = 0; i < array.length; i++) {
        isAllTrueResult = isAllTrueResult && fn(array[i]);
    }

    return isAllTrueResult;
}

/*
 Задание 2:

 2.1: Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true если fn вернула true хотя бы для одного из элементов массива

 2.2: Необходимо выбрасывать исключение в случаях:
   - array не массив или пустой массив (с текстом "empty array")
   - fn не является функцией (с текстом "fn is not a function")

 Зарпещено использовать встроенные методы для работы с массивами

 Пример:
   isSomeTrue([1, 2, 30, 4, 5], n => n > 20) // вернет true
   isSomeTrue([1, 2, 3, 4, 5], n => n > 20) // вернет false
 */
function isSomeTrue(array, fn) {
    if (!(array instanceof Array) || array.length === 0) {
        throw new Error('empty array');
    }
    if (!(fn instanceof Function)) {
        throw new Error('fn is not a function');
    }

    let isSomeTrueResult = false;

    for (let i = 0; i < array.length; i++) {
        isSomeTrueResult = isSomeTrueResult || fn(array[i]);
    }

    return isSomeTrueResult;
}

/*
 Задание 3:

 3.1: Функция принимает заранее неизветсное количество аргументов, первым из которых является функция fn
 Функция должна поочередно запустить fn для каждого переданного аргумента (кроме самой fn)

 3.2: Функция должна вернуть массив аргументов, для которых fn выбросила исключение

 3.3: Необходимо выбрасывать исключение в случаях:
   - fn не является функцией (с текстом "fn is not a function")
 */
function returnBadArguments(fn) {
    if (!(fn instanceof Function)) {
        throw new Error('fn is not a function');
    }

    let args = [];

    if (arguments.length > 0) {
        for (let i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    } else {
        return args;
    }

    let thrownElements = [];

    args.forEach(item => {
        try {
            fn(item);
        } catch (e) {
            thrownElements.push(item);
        }
    });

    return thrownElements;
}

export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    // calculator
};