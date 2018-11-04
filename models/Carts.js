/*
 * Carts model.
 *
 */

class Carts {
    constructor(data) {
        this.menuItems = [];
        Object.assign(this, data);
    }

    getItem(pizzaName) {
        return this.menuItems.find(e => e.name === pizzaName);
    };

    addOrUpdateQuantityItem(item) {
        const edit = this.menuItems.find(e => e.name === item.name);
        if (edit) {
            const index = this.menuItems.indexOf(edit);
            const beforeItems = this.menuItems.slice(0, index);
            const afterItems = this.menuItems.slice(index + 1);
            edit.quantity += 1;
            this.menuItems = [].concat(beforeItems).concat(edit).concat(afterItems);
        } else {
            item.quantity = 1;
            this.menuItems = this.menuItems.concat(item);
        }
    };

    removeItem(pizzaName) {
        const edit = this.menuItems.find(e => e.name === pizzaName);
        if (edit && edit.quantity > 1) {
            const index = this.menuItems.indexOf(edit);
            const beforeItems = this.menuItems.slice(0, index);
            const afterItems = this.menuItems.slice(index + 1);
            edit.quantity -= 1;
            this.menuItems = [].concat(beforeItems).concat(edit).concat(afterItems);
        } else {
            this.menuItems = this.menuItems.filter(e => e.name !== pizzaName);
        }
    };
}

module.exports = { Carts: Carts };