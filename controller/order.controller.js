const Order = require('../model/order.model')

// helper
const createOrderInDb = async ({ userId, transactionId, customerName, customerEmail, amount, country, city, state, address, appartment, zipCode, phone, quantity }) => {
    const existing = await Order.findOne({ where: { transactionId } })
    if (existing) {
        throw new Error("Order already exists")
    }

    const order = await Order.create({
        userId,
        transactionId,
        customerName,
        customerEmail,
        amount,
        country,
        city,
        state,
        address,
        appartment,
        zipCode,
        phone,
        quantity,
        status: "processing"
    })

    setTimeout(async () => {
        await Order.update(
            { status: "delivered" },
            { where: { id: order.id, status : "processing" }}
        )
    }, 15000);

    return order
}

const createOrder = async (req, res) => {
    try {
        const { transactionId, customerName, customerEmail, amount, country, city, state, address, appartment, zipCode, phone, quantity, status } = req.body
        const userId = req.user.id

        const order = await createOrderInDb({ userId, transactionId, customerName, customerEmail, amount, country, city, state, address, appartment, zipCode, phone, quantity, status })
        res.json(order)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const getOrders = async (req, res) => {
    try {
        const userId = req.user.id
        const orders = await Order.findAll({ where: { userId } })
        res.json(orders)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const totalOrders = async (req, res) => {
    try{
        const count = await Order.count()
        res.status(200).json({ totalOrders : count })
    } catch(err){
        res.status(500).json({err: err.message})
    }
}

const calculateRevenue = async (req, res) => {
    try{
        const revenue = await Order.sum('amount')
        res.status(200).json({ revenue })
    } catch(err){
        res.status(500).json({ err : err.message })
    }
}

module.exports = { getOrders, createOrder, createOrderInDb, totalOrders, calculateRevenue }
