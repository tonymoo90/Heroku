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
    
    // Handle Tesla transactions by ARK
    if (transaction.source === 'ARK Trades') {
        const direction = transaction.description.includes('Sell') ? 'disposed' : 'acquired';
        circle.classList.add(direction);
        details.innerText = transaction.description;
    } 
    // Handle Insider Transactions
    else if (transaction.source === 'Insider Transactions') {
        const direction = transaction.description.includes('D') ? 'disposed' : 'acquired';
        circle.classList.add(direction);
        details.innerText = transaction.description;
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

