const fs = require('fs')

const names = ["Ali Khan", "Sarah Malik", "Ahmed Raza", "Fatima Noor", "Usman Tariq", "Laiba Ahmed", "Zain Ali", "Jane Smith", "Bilal Aslam", "Hira Shah", "Saad Javed"];
const emails = ["ali@example.com", "sarah@example.com", "ahmed@example.com", "fatima@example.com", "usman@example.com", "laiba@example.com", "zain@example.com", "jane@example.com", "bilal@example.com", "hira@example.com", "saad@example.com"];
const comments = [
    "Great product, highly recommend!",
    "Not bad for the price.",
    "Will definitely buy again.",
    "Could be better.",
    "Exceeded my expectations.",
    "Looks good and performs well.",
    "Quality isn't consistent.",
    "Love the design!",
    "Works perfectly.",
    "Not what I expected."
];


let products = JSON.parse(fs.readFileSync('./seeders/updatedProducts.json', 'utf-8'))

products = products.map(product => {

    const reviewCount = Math.floor(Math.random() * 3) + 2
    if (!product.reviews) product.reviews = [];

    for (let i = 0; i < reviewCount; i++) {

        const nameIndex = Math.floor(Math.random() * names.length)
        product.reviews.push({

            rating: Math.floor(Math.random() * 3) + 3,
            comment: comments[Math.floor(Math.random() * comments.length)],
            date: new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString(),
            reviewerName: names[nameIndex],
            reviewerEmail: emails[nameIndex]

        })        
    }

    return product

})

fs.writeFileSync('./seeders/updatedProducts.json', JSON.stringify(products, null, 2))


