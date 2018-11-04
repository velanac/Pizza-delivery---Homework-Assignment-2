/*
 * Order model.
 *
 */

class Order {
    constructor(cartsModel) {
        this.id = '';
        this.amount = 0;
        this.date = Date.now();
        this.stripeToken = '';

        Object.assign(this, cartsModel);
        this.calculate();
    }

    calculate() {
        this.amount = 0;
        this.menuItems.forEach(e => {
            this.amount += e.price * e.quantity;
        });
    };
}

module.exports = { Order: Order };