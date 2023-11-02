const createTransactionItem = (transaction) => {
    const transactionItem = document.createElement('div');
    const circle = document.createElement('div');
    circle.className = 'circle';

    const details = document.createElement('div');
    details.className = 'headline';

    // Handle Tesla transactions
    if (transaction.direction) {
        const transactionDirection = transaction.direction === 'Buy' ? 'Bought' : 'Sold';
        timeDiv.innerText = formatDate(transaction.effective_date);

        circle.classList.add(transaction.direction === 'Buy' ? 'acquired' : 'disposed');
        details.innerText = `${transactionDirection} ${transaction.shares} shares of Tesla for ${transaction.value}`;
    } else {
        // Handle other transactions
        timeDiv.innerText = formatDate(transaction.transactionDate);

        circle.classList.add(transaction.transactionAcquiredDisposed === 'A' ? 'acquired' : 'disposed');
        details.innerText = `${transaction.ownerName} `;

        const insider = insiderData.find(insider => insider.ownerName === transaction.ownerName);
        if (insider && insider.Type) {
            const typeElement = document.createElement('div');
            typeElement.className = 'insiderType';
            typeElement.innerText = `${insider.Type}`;
            details.appendChild(typeElement);

            if (insider.More) {
                const moreElement = document.createElement('div');
                moreElement.className = 'moreDetails';
                moreElement.innerText = insider.More;
                details.appendChild(moreElement);
            }
        } 

        details.appendChild(document.createTextNode(`${transaction.transactionAcquiredDisposed === 'A' ? 'Bought' : 'Sold'}`));
        details.appendChild(document.createElement('br'));
        details.appendChild(document.createTextNode(`${transaction.transactionAmount} at ${transaction.transactionPrice}`));
    }

    transactionItem.appendChild(circle);
    transactionItem.appendChild(details);
    timeline.appendChild(transactionItem);
};

// Assuming you have a list of transactions, you can loop through them:
transactions.forEach(createTransactionItem);
