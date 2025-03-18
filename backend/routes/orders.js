const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

// Kreiranje nove narudžbe
router.post('/', async (req, res) => {
    try {
        const { user, items, address, pickupDate, deliveryDate, totalPrice } = req.body;
        const newOrder = new Order({
            user,
            items,
            address,
            pickupDate,
            deliveryDate,
            totalPrice
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Dohvat svih narudžbi
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Dohvat narudžbe po ID-u
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ažuriranje narudžbe po ID-u
router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (req.body.status) {
            order.status = req.body.status;
        }
        if (req.body.deliveryDate) {
            order.deliveryDate = req.body.deliveryDate;
        }
        if (req.body.totalPrice) {
            order.totalPrice = req.body.totalPrice;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Brisanje narudžbe po ID-u
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;