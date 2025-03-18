const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

const { body, validationResult, param } = require('express-validator');

// Kreiranje nove narudžbe
router.post('/', [
    body('user').notEmpty().withMessage('User is required'),
    body('items').isArray({ min: 1 }).withMessage('Items must be an array with at least one item'),
    body('address').notEmpty().withMessage('Address is required'),
    body('pickupDate').notEmpty().isISO8601().withMessage('Pickup date is required and must be a valid date'),
    body('deliveryDate').optional().isISO8601().withMessage('Delivery date must be a valid date'),
    body('totalPrice').isNumeric().withMessage('Total price must be a number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
router.get('/:id', [
    param('id').isMongoId().withMessage('Invalid order ID')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
router.patch('/:id', [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
    body('deliveryDate').optional().isISO8601().withMessage('Invalid delivery date'),
    body('totalPrice').optional().isNumeric().withMessage('Invalid total price')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

// Ažuriranje statusa narudžbe po ID-u
router.patch('/:id/status', [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = req.body.status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Brisanje narudžbe po ID-u
router.delete('/:id', [
    param('id').isMongoId().withMessage('Invalid order ID')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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