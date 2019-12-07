const _ = require('lodash');

module.exports = {
    listCrusts: (items, options) => {
        let out = '';

        for(let i=0, l=items.length; i<l; i++) {
            const value = _.toLower(_.split(options.fn(items[i]), ' ', 1 ));

            if (i === 0) {
                out += `<input type="radio" name="crust" class="crust" value=${value} id=${value} checked="checked"><label for=${value}>${options.fn(items[i])}</label>`
            
            } else {
                out += `<input type="radio" name="crust" class="crust" value=${value} id=${value}><label for=${value}>${options.fn(items[i])}</label>`
            }
        }

        return out;
    },
    kebabCase: (str) => _.kebabCase(str),
    removeSpaces: (str) => str.split(' ').join(''),
    capitalizeSingle: (str) => _.capitalize(str),
    capitalize: (str) => {
        let concat = '';
        str.split(' ').forEach(x => concat += _.capitalize(x) + ' ');        
        return _.trim(_.replace(concat, 'Crust', ''));
    }
};