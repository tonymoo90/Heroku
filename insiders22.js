const createTransactionItem = (transaction) => {
    const transactionEvent = document.createElement('div');
    transactionEvent.className = 'event';

    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';
    timeDiv.innerText = transaction.date;

    const circle = document.createElement('div');
    circle.className = 'circle';

    const details = document.createElement('div');
    details.className = 'headline';

    if (transaction.source === 'ARK Trades') {
        circle.classList.add(transaction.action === 'Sell' ? 'disposed' : 'acquired');
        details.innerText = `${transaction.ownerName}\n${transaction.action}\n${transaction.shares}`;
    } else if (transaction.source === 'Insider Transactions') {
        const action = transaction.action === 'D' ? 'Sell' : 'Buy';
        circle.classList.add(action === 'Sell' ? 'disposed' : 'acquired');
        details.innerText = `${transaction.ownerName}\n${action}\n${transaction.shares} at $${transaction.price}`;

        // If type and more data exist, append them
        if (transaction.Type && transaction.More) {
            const typeDiv = document.createElement('div');
            typeDiv.className = 'type';
            typeDiv.innerText = transaction.type;
            details.appendChild(typeDiv);

            const moreDiv = document.createElement('div');
            moreDiv.className = 'more';
            moreDiv.innerText = transaction.more;
            details.appendChild(moreDiv);
        }
    }

    transactionEvent.appendChild(timeDiv);
    transactionEvent.appendChild(circle);
    transactionEvent.appendChild(details);
    timeline.appendChild(transactionEvent);
};


function fetchTransactions() {
    fetch("https://pulsemedia-10eb81c0dde4.herokuapp.com/timeline-data")  // Replace with the actual endpoint
    .then(response => response.json())
    .then(data => {
        // Now loop through the transactions and create the items
        data.forEach(createTransactionItem);
    })
    .catch(error => {
        console.error("Error fetching transactions:", error);
    });
}

// Call the function to fetch the transactions when the page loads:
fetchTransactions();

