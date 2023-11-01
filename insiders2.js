const TRANSACTIONS_ENDPOINT = "https://pulsemedia-10eb81c0dde4.herokuapp.com/insider_transactions?ticker=tsla.us";

const TESLA_TRANSACTIONS_ENDPOINT = "https://arkfunds.io/api/v2/etf/trades?symbol=arkk&date_from=2023-01-01&date_to=2023-10-31";


async function fetchInsiderData() {
    try {
        const now = Date.now();
        const url = `https://pulse-stockprice.s3.us-east-2.amazonaws.com/insidersrc.json?timestamp=${now}`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching insider data:", error);
        return [];
    }
}


async function fetchTeslaTransactions() {
    try {
        const response = await fetch(TESLA_TRANSACTIONS_ENDPOINT);
        const data = await response.json();
        return data.trades.filter(trade => trade.ticker === 'TSLA');
    } catch (error) {
        console.error("Error fetching Tesla transactions:", error);
        return [];
    }
}



async function fetchTransactions() {
    try {
        const [transactions, insiderData] = await Promise.all([
            fetch(TRANSACTIONS_ENDPOINT).then(res => res.json()),
            fetchInsiderData()
        ]);
        appendToTimeline(null, transactions, insiderData);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}


function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

 function appendToTimeline(todaysArticles, todaysTransactions, insiderData) {
    const timeline = document.querySelector('.timeline');

    if (todaysTransactions) {
        todaysTransactions.forEach((transaction, index) => {
            
            const transactionItem = document.createElement('div');
            transactionItem.className = 'event';

            const timeDiv = document.createElement('div');
            timeDiv.className = 'time';
            transactionItem.appendChild(timeDiv);

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

fetchTransactions();

document.querySelector('.timeline').addEventListener('wheel', function(event) {
    var deltaY = event.deltaY;
    var contentHeight = this.scrollHeight;
    var visibleHeight = this.offsetHeight;
    var scrollTop = this.scrollTop;

    if (scrollTop === 0 && deltaY < 0)
        event.preventDefault();
     else if (visibleHeight + scrollTop === contentHeight && deltaY > 0)
        event.preventDefault();

});

function setActiveEvent() {
    const events = document.querySelectorAll('.event');
    let closestEventToTop = null;
    let closestDistance = Infinity;

    // Adjust this value to change the activation point
    const activationPoint = window.innerHeight * 0.25;  // 15% from the top of the viewport

    events.forEach(event => {
        const rect = event.getBoundingClientRect();
        const distanceFromActivationPoint = Math.abs(rect.top - activationPoint);
        if (rect.top >= 0 && distanceFromActivationPoint < closestDistance) {
            closestDistance = distanceFromActivationPoint;
            closestEventToTop = event;
        }
    });

    events.forEach(event => {
        event.classList.remove('active');
        const timeText = event.querySelector('.time');
        const circle = event.querySelector('.circle'); // Assuming each event has a circle with the class "circle"

        timeText.style.color = "#999999";  // Set to grey for non-active events
        circle.style.backgroundColor = "#999999"; // Set the circle color to grey for non-active events
    });

    if (closestEventToTop) {
        closestEventToTop.classList.add('active');
        const timeText = closestEventToTop.querySelector('.time');
        const circle = closestEventToTop.querySelector('.circle'); // Get the circle of the active event

        timeText.style.color = "#ffffff";  // Set to white for the active event
        circle.style.backgroundColor = "#ffffff"; // Set the circle color to white for the active event

        return timeText.innerText; // Return the active time
    }

    return null; // Return null if no active event found
}


function highlightEventTextOnScroll() {
    const events = Array.from(document.querySelectorAll('.event'));
    const viewportCenter = window.innerHeight / 2;

    events.forEach(event => {
        const rect = event.getBoundingClientRect();
        const eventCenter = rect.top + rect.height / 2;

        if (eventCenter < viewportCenter) {
            event.classList.add('text-highlighted');
        } else {
            event.classList.remove('text-highlighted');
        }
    });
}

document.querySelector('.timeline').addEventListener('scroll', function() {
    const activeTime = setActiveEvent();
    highlightEventTextOnScroll();
    
     if (activeTime) {
        synchronizeChartToTime(activeTime); // Sync the line chart to the active time
    }
    
    const scrollTop = this.scrollTop;
    const scrollHeight = this.scrollHeight;
    const visibleHeight = this.offsetHeight;
    const percentageScrolled = scrollTop / (scrollHeight - visibleHeight) * 100;
    
    // Adjusting the height of the .timeline::before pseudo-element
    this.style.setProperty('--scroll-percentage', `${percentageScrolled}%`);
});

    const timelinewrapper = document.querySelector('.timelinewrapper');

    timelinewrapper.addEventListener('scroll', function() {
      if (timelinewrapper.scrollTop + timelinewrapper.clientHeight >= timelinewrapper.scrollHeight) {
        timelinewrapper.scrollTop -= 100; // adjust as needed
      }
    }
    )}