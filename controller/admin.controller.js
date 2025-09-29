const { Op, fn, col, literal } = require("sequelize");
const Order = require("../model/order.model");
const User = require("../model/user.model");

const dailyRevenue = async (req, res) => {
  try {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 29);

    const revenueData = await Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("amount")), "totalRevenue"],
        [fn("COUNT", col("id")), "orderCount"]
      ],
      where: {
        createdAt: {
          [Op.between]: [last30Days, today]
        }
      },
      group: [fn("DATE", col("createdAt"))],
      order: [[literal("date"), "ASC"]]
    });

    // Fill missing days with 0
    let results = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(last30Days);
      d.setDate(last30Days.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const found = revenueData.find(
        (r) => r.dataValues.date === dateStr
      );
      results.push({
        x: dateStr,
        y: found ? parseFloat(found.dataValues.totalRevenue) : 0,
        orders: found ? parseInt(found.dataValues.orderCount) : 0,
        date: dateStr
      });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const orderStatusSummary = async (req, res) => {
  try {

    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [processing, delivered, canceled] = await Promise.all([
      Order.count({ where: { status: "processing" } }),
      Order.count({ where: { status: "delivered" } }),
      Order.count({ where: { status: "canceled" } })
    ])

    res.json({ processing, delivered, canceled })

  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const userByCountry = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'selectCountry',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['selectCountry'],
      raw: true
    })

    res.status(200).json(users)

  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const monthlyRevenue = async (req, res) => {
  try{ 

    const startOfYear = new Date(new Date().getFullYear(), 0, 1)
    const revenueData = await Order.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("SUM", col("amount")), "totalRevenue"],
        [fn("COUNT", col("id")), "orderCount"]
      ],
      where : {
        createdAt: {
          [Op.gte]: startOfYear
        }
      },
      group: [fn("MONTH", col("createdAt"))],
      order: [[literal("month"), "ASC"]],
    })

    const results = Array.from({length: 12}, (_, i) => {
      const monthNum = i + 1
      const found = revenueData.find(
        r => parseInt(r.dataValues.month) === monthNum
      )
      return{
        x: new Date(2025, i).toLocaleString("default", {month : "short"}),
        y: found ? parseFloat(found.dataValues.totalRevenue) : 0,
        orders : found ? parseInt(found.dataValues.orderCount) : 0
      }
    })

    const withChange = results.map((item, idx) => {
      if (idx === 0) return { ...item, change: 0 };
      const last = results[idx - 1].y;
      const change = last === 0 ? 0 : ((item.y - last) / last) * 100;
      return { ...item, change: parseFloat(change.toFixed(2)) };
    });

    res.status(200).json(withChange)

  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

module.exports = { dailyRevenue, orderStatusSummary, userByCountry, monthlyRevenue }