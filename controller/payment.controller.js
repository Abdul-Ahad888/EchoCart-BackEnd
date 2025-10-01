import Stripe from "stripe";
import { createOrderInDb } from "./order.controller.js";
import Product from "../model/product.model.js"
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    const { items, discountPercent, deliveryPrice } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",

            line_items: [
                // Products
                ...items.map(item => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: Math.round(item.price * (1 - discountPercent / 100) * 100),
                    },
                    quantity: item.quantity,
                })),

                // Dynamic Delivery
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Delivery",
                        },
                        unit_amount: Math.round(deliveryPrice * 100),
                    },
                    quantity: 1,
                }
            ],

            billing_address_collection: "required",
            phone_number_collection: { enabled: true },
            shipping_address_collection: {
                allowed_countries: ["US", "PK", "CA", "GB", "AE"]
            },

            success_url: "https://echocart-ecommerce.netlify.app/cart/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://echocart-ecommerce.netlify.app/cart",
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};


export const getSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id, {
            expand: ["line_items"]
        })

        const itemsOnly = session.line_items.data.filter(
            li => li.description !== "Delivery" && li.price?.product_data?.name !== "Delivery"
        );
        const itemCount = itemsOnly.length;

        const userId = req.user.id
        const transactionId = session.payment_intent
        const customerName = session.customer_details?.name || "Guest";
        const customerEmail = session.customer_details?.email || "unknown";
        const amount = (session.amount_total / 100).toFixed(2);

        const country = session.customer_details?.address?.country || null;
        const city = session.customer_details?.address?.city || null;
        const state = session.customer_details?.address?.state || null;
        const address = session.customer_details?.address?.line1 || null;
        const appartment = session.customer_details?.address?.line2 || null;
        const zipCode = session.customer_details?.address?.postal_code || null;
        const phone = session.customer_details?.phone || null;


        for (const line of itemsOnly) {
            const product = await Product.findOne({ title: line.description })

            if (product) {
                product.stock = product.stock - line.quantity
                await product.save()
            }
        }

        const order = await createOrderInDb({ userId, transactionId, customerName, customerEmail, amount, country, city, state, address, appartment, zipCode, phone, quantity: itemCount })

        res.json({ order, session })
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

