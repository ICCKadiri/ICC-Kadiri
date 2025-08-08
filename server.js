const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const BookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    slot: String,
    date: String,
    paymentId: String,
    status: { type: String, default: 'pending' }
});
const Booking = mongoose.model('Booking', BookingSchema);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post('/api/book', async (req, res) => {
    try {
        const options = {
            amount: 50000, // INR in paise
            currency: "INR",
            receipt: `receipt_order_${Math.random()}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                                .update(sign.toString())
                                .digest("hex");

    if (razorpay_signature === expectedSign) {
        res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
        res.status(400).json({ success: false });
    }
});

app.listen(process.env.PORT || 4000, () => console.log("Server running"));
