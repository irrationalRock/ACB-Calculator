let etfs = JSON.parse(localStorage.getItem('etfs')) || {};

const saveETFs = () => {
    localStorage.setItem('etfs', JSON.stringify(etfs));
};

const calculateETFACB = (activities) => {
    let totalCost = 0;
    let totalShares = 0;

    activities.forEach(activity => {
        switch (activity.type) {
            case 'Buy':
            case 'Reinvest':
                totalCost += activity.shares * activity.price;
                totalShares += activity.shares;
                break;
            case 'Sell':
                totalShares -= activity.shares;
                break;
            case 'ROC':
                totalCost -= activity.shares * activity.price;
                break;
            case 'RCGD':
                totalCost += activity.shares * activity.price;
                break;
            case 'Split':
                totalShares *= activity.shares;
                break;
        }
    });

    return totalShares > 0 ? totalCost / totalShares : 0;
};

const renderETFs = () => {
    const etfList = document.getElementById('etf-list');
    etfList.innerHTML = '';

    Object.entries(etfs).forEach(([ticker, activities]) => {
        let runningShares = 0;
        let runningCost = 0;
        let runningACB = 0;
        let previousTotalValue = 0;

        const etfItem = document.createElement('div');
        etfItem.className = 'etf-item';
        etfItem.innerHTML = `<strong>${ticker}</strong>`;
        etfList.appendChild(etfItem);

        activities.forEach((activity, index) => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';

            let valueAdjustment = '';
            let valueChangeClass = '';
            let totalValue = 0;

            switch (activity.type) {
                case 'Buy':
                case 'Reinvest':
                    runningShares += activity.shares;
                    runningCost += activity.shares * activity.price;
                    totalValue = runningShares * activity.price;
                    valueAdjustment = `Total value increased by $${(activity.shares * activity.price).toFixed(2)}`;
                    valueChangeClass = 'value-increase';
                    break;
                case 'Sell':
                    runningShares -= activity.shares;
                    totalValue = runningShares * activity.price;
                    valueAdjustment = `Total value decreased by $${(activity.shares * runningACB).toFixed(2)}`;
                    valueChangeClass = 'value-decrease';
                    break;
                case 'ROC':
                    runningCost -= activity.shares * activity.price;
                    totalValue = runningShares * activity.price;
                    valueAdjustment = `Total value decreased by $${(activity.shares * activity.price).toFixed(2)}`;
                    valueChangeClass = 'value-decrease';
                    break;
                case 'RCGD':
                    runningCost += activity.shares * activity.price;
                    totalValue = runningShares * activity.price;
                    valueAdjustment = `Total value increased by $${(activity.shares * activity.price).toFixed(2)}`;
                    valueChangeClass = 'value-increase';
                    break;
                case 'Split':
                    runningShares *= activity.shares;
                    totalValue = runningShares * (activity.price / activity.shares);
                    valueAdjustment = `Shares multiplied by ${activity.shares}, total value unchanged`;
                    valueChangeClass = 'value-unchanged';
                    break;
            }

            runningACB = runningShares > 0 ? runningCost / runningShares : 0;

            activityItem.innerHTML = `
                <div>
                    ${activity.type}: ${activity.shares} shares @ $${activity.price} on ${activity.date}
                    <br>
                    <span class="value-adjustment ${valueChangeClass}">${valueAdjustment}</span>
                    <br>
                    <span class="running-total">Running total: ${runningShares.toFixed(4)} shares, ACB: $${runningACB.toFixed(2)} per share, Total Value: $${totalValue.toFixed(2)}</span>
                    <button onclick="editActivity('${ticker}', ${index})" class="edit-btn">Edit</button>
                    <button onclick="removeActivity('${ticker}', ${index})" class="remove-btn">Remove</button>
                </div>
            `;
            etfList.appendChild(activityItem);

            previousTotalValue = totalValue;
        });

        const etfSummary = document.createElement('div');
        etfSummary.className = 'etf-summary';
        etfSummary.innerHTML = `
            <strong>ETF Summary:</strong> ${runningShares.toFixed(4)} shares, ACB: $${runningACB.toFixed(2)} per share, Total Value: $${(runningShares * runningACB).toFixed(2)}
            <button onclick="removeETF('${ticker}')" class="remove-btn">Remove ETF</button>
        `;
        etfList.appendChild(etfSummary);
    });

    calculateOverallSummary();
};

const addActivity = (event) => {
    event.preventDefault();
    const ticker = document.getElementById('ticker').value.toUpperCase();
    const type = document.getElementById('activity').value;
    const shares = parseFloat(document.getElementById('shares').value);
    const price = parseFloat(document.getElementById('price').value);
    const date = document.getElementById('date').value;

    if (!etfs[ticker]) etfs[ticker] = [];
    etfs[ticker].push({ type, shares, price, date });
    saveETFs();
    renderETFs();

    document.getElementById('etf-form').reset();
    setDefaultDate();
};

const removeETF = (ticker) => {
    delete etfs[ticker];
    saveETFs();
    renderETFs();
};

const removeActivity = (ticker, index) => {
    etfs[ticker].splice(index, 1);
    if (etfs[ticker].length === 0) delete etfs[ticker];
    saveETFs();
    renderETFs();
};

const calculateOverallSummary = () => {
    let totalCost = 0;
    let totalShares = 0;

    Object.values(etfs).forEach(activities => {
        activities.forEach(activity => {
            switch (activity.type) {
                case 'Buy':
                case 'Reinvest':
                    totalCost += activity.shares * activity.price;
                    totalShares += activity.shares;
                    break;
                case 'Sell':
                    totalShares -= activity.shares;
                    break;
                case 'ROC':
                    totalCost -= activity.shares * activity.price;
                    break;
                case 'RCGD':
                    totalCost += activity.shares * activity.price;
                    break;
                // Split doesn't affect overall cost
            }
        });
    });

    const overallACB = totalShares > 0 ? totalCost / totalShares : 0;

    document.getElementById('overall-summary').innerHTML = `
        <div>Overall Portfolio Summary:</div>
        <div>Total Shares: ${totalShares.toFixed(4)}</div>
        <div>Total Cost: $${totalCost.toFixed(2)}</div>
        <div>Overall ACB: $${overallACB.toFixed(2)}</div>
        <div>Total Portfolio Value: $${(totalShares * overallACB).toFixed(2)}</div>
    `;
};

const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const setDefaultDate = () => {
    const today = new Date();
    document.getElementById('date').value = formatDate(today);
};

const editActivity = (ticker, index) => {
    const activity = etfs[ticker][index];
    document.getElementById('ticker').value = ticker;
    document.getElementById('activity').value = activity.type;
    document.getElementById('shares').value = activity.shares;
    document.getElementById('price').value = activity.price;
    document.getElementById('date').value = activity.date;

    // Change the form submit button to "Update"
    const submitBtn = document.querySelector('#etf-form button[type="submit"]');
    submitBtn.textContent = 'Update Activity';
    submitBtn.onclick = (event) => updateActivity(event, ticker, index);
};

const updateActivity = (event, ticker, index) => {
    event.preventDefault();
    const type = document.getElementById('activity').value;
    const shares = parseFloat(document.getElementById('shares').value);
    const price = parseFloat(document.getElementById('price').value);
    const date = document.getElementById('date').value;

    etfs[ticker][index] = { type, shares, price, date };
    saveETFs();
    renderETFs();

    // Reset the form and change the submit button back to "Add Activity"
    document.getElementById('etf-form').reset();
    setDefaultDate();
    const submitBtn = document.querySelector('#etf-form button[type="submit"]');
    submitBtn.textContent = 'Add Activity';
    submitBtn.onclick = addActivity;
};

document.getElementById('etf-form').addEventListener('submit', addActivity);
setDefaultDate();
renderETFs();