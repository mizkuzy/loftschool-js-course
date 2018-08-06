function calculator(number = 0) {
    function isNumber(number) {
        if (isFinite(number)) {
            return true;
        }

        throw new Error('number is not a number');
    }

    return {
        sum: () => {
            if (isNumber(number)) {
                let result = number;
// можем получить один массив с элементами, а можем получить просто список элементов.
// а можем ли мы получить два массива?

                for (let i = 0; i < arguments.length; i++) {
                    if (arguments[i] instanceof Array) {
                        arguments[i].forEach((item) => {
                            if (isFinite(item)) {
                                result += item;
                            }
                        })
                    }

                }

                return result;
            }
        },
        dif: () => {
            if (isNumber(number)) {
                let result = number;

                for (let i = 0; i < arguments.length; i++) {
                    let arg = arguments[i];

                    if (isFinite(arg)) {
                        result -= arg;
                    }
                }

                return result;
            }
        },
        div: () => {
            if (isNumber(number)) {
                let result = number;

                for (let i = 0; i < arguments.length; i++) {
                    let arg = arguments[i];

                    if (isFinite(arg)) {
                        if (arg !== 0) {
                            result /= arg;
                        } else {
                            throw new Error('division by 0');
                        }
                    }
                }

                return result;
            }
        },
        mul: () => {
            if (isNumber(number)) {
                let result = number;

                for (let i = 0; i < arguments.length; i++) {
                    let arg = arguments[i];

                    if (isFinite(arg)) {
                        result *= arg;
                    }
                }

                return result;
            }
        }
    }
}

let initialValue = 10;
let calc = calculator(initialValue);
let args = [5, 0];

calc.sum(args);