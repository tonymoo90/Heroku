        const circle = document.createElement('div');
        circle.className = 'circle';
        transactionItem.appendChild(circle);
        
        const details = document.createElement('div');
        details.className = 'headline';

        if (transaction.direction) { // If it's a Tesla transaction
            const transactionDirection = transaction.direction === 'Buy' ? 'Bought' : 'Sold';
            timeDiv.innerText = formatDate(transaction.effective_date);

            if (transaction.direction === 'Buy') {
                circle.classList.add('acquired');
            } else if (transaction.direction === 'Sell') {
                circle.classList.add('disposed');
            }

            details.innerText = `${transactionDirection} ${transaction.shares} shares of Tesla for ${transaction.value}`;
        } else { 
            timeDiv.innerText = formatDate(transaction.transactionDate);
            
            if (transaction.transactionAcquiredDisposed === 'A') {
                circle.classList.add('acquired');
            } else if (transaction.transactionAcquiredDisposed === 'D') {
                circle.classList.add('disposed');
            }

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

        transactionItem.appendChild(details);
        timeline.appendChild(transactionItem);
    });
}