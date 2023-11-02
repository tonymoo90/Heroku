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
    
    let ownerName, action, shareDetails;

    // Handle Tesla transactions by ARK
    if (transaction.source === 'ARK Trades') {
        ownerName = "ARK Invest (ARKK)";
        action = transaction.description.includes('Sell') ? 'Sell' : 'Buy';
        // Extract the number of shares from the description
        const sharesMatch = transaction.description.match(/(\d+) shares/);
        shareDetails = sharesMatch ? sharesMatch[1] : '';
        
        circle.classList.add(action === 'Sell' ? 'disposed' : 'acquired');
        details.innerText = `${ownerName}\n${action}\n${shareDetails} shares`;
    } 
    // Handle Insider Transactions
    else if (transaction.source === 'Insider Transactions') {
        const parts = transaction.description.split(' ');
        ownerName = parts[0] + ' ' + parts[1];  // Extracting the name (assuming it's two words)
        action = parts[2] === 'D' ? 'Sell' : 'Buy';
        const shares = parts[3];
        const price = parts[6];

        circle.classList.add(action === 'Sell' ? 'disposed' : 'acquired');
        details.innerText = `${ownerName}\n${action}\n${shares} shares at ${price}`;
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
