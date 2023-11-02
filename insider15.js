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
    
    let ownerName, action, shareDetails, price;

    const arkRegex = /(ARK Invest \(ARKK\)) (Sell|Buy) .+ (\d+ shares)/;
    const insiderRegex = /(.+) (D|[^D]+) (\d+ shares) at (\$.+)/;


    if (transaction.source === 'ARK Trades') {
        const matches = transaction.description.match(arkRegex);
        
        if (matches) {
            ownerName = matches[1];
            action = matches[2];
            shareDetails = matches[3];
            
            circle.classList.add(action === 'Sell' ? 'disposed' : 'acquired');
            details.innerText = `${ownerName}\n${action}\n${shareDetails}`;
        }
     else if (transaction.source === 'Insider Transactions') {
        const matches = transaction.description.match(insiderRegex);
        
        if (matches) {
            ownerName = matches[1];
            action = parts[2] === 'D' ? 'Sell' : 'Buy';
            const shares = parts[3];
            const price = parts[6];
            circle.classList.add(action === 'Sell' ? 'disposed' : 'acquired');
            details.innerText = `${ownerName}\n${action}\n${shareDetails} at ${price}`;
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

