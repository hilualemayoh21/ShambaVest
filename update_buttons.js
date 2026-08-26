const fs = require('fs');
const path = require('path');

const filepath = "C:\\Users\\hlina\\.gemini\\antigravity-ide\\scratch\\ShambaVest\\index.html";
let content = fs.readFileSync(filepath, 'utf8');

const replacements = [
    {
        old: `<button class="btn-card-buy-navy" onclick="openPurchaseModal('VIP I', '600', '11200', '70', '160')">`,
        new: `<button class="btn-card-buy-navy vip-action-btn" data-vip-index="0" data-plan-name="VIP I" data-price="600" data-total="11200" data-daily="70" data-days="160">`
    },
    {
        old: `<button class="btn-card-buy-navy" onclick="openPurchaseModal('VIP II', '1800', '34500', '230', '150')">`,
        new: `<button class="btn-card-buy-navy vip-action-btn" data-vip-index="1" data-plan-name="VIP II" data-price="1800" data-total="34500" data-daily="230" data-days="150">`
    },
    {
        old: `<button class="btn-card-buy-navy" onclick="openPurchaseModal('VIP III', '3800', '72800', '520', '140')">`,
        new: `<button class="btn-card-buy-navy vip-action-btn" data-vip-index="2" data-plan-name="VIP III" data-price="3800" data-total="72800" data-daily="520" data-days="140">`
    }
];

// For the Coming Soon buttons, they look like:
// <button class="btn-card-buy-navy" style="background: #94a3b8; cursor: not-allowed; border-color: #94a3b8; color: white;">
// And they occur exactly 7 times, in order IV to X.
let comingSoonCount = 0;
const comingSoonData = [
    { name: "VIP IV", price: "7800", total: "156000", daily: "1200", days: "130" },
    { name: "VIP V", price: "12800", total: "276000", daily: "2300", days: "120" },
    { name: "VIP VI", price: "21800", total: "506000", daily: "4600", days: "110" },
    { name: "VIP VII", price: "37700", total: "1000000", daily: "10000", days: "100" },
    { name: "VIP VIII", price: "77000", total: "2610000", daily: "29000", days: "90" },
    { name: "VIP IX", price: "137000", total: "5200000", daily: "65000", days: "80" },
    { name: "VIP X", price: "217000", total: "9100000", daily: "130000", days: "70" }
];

content = content.replace(/<button class="btn-card-buy-navy" style="background: #94a3b8; cursor: not-allowed; border-color: #94a3b8; color: white;">/g, (match) => {
    const data = comingSoonData[comingSoonCount];
    const index = comingSoonCount + 3;
    comingSoonCount++;
    return `<button class="btn-card-buy-navy vip-action-btn" data-vip-index="${index}" data-plan-name="${data.name}" data-price="${data.price}" data-total="${data.total}" data-daily="${data.daily}" data-days="${data.days}" style="background: #94a3b8; cursor: not-allowed; border-color: #94a3b8; color: white;">`;
});

for (const r of replacements) {
    content = content.split(r.old).join(r.new);
}

fs.writeFileSync(filepath, content, 'utf8');
console.log("Done updating buttons!");
