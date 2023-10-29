    document.addEventListener("DOMContentLoaded", function() {
        // Listen for submission
        document.getElementById("searchForm").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent submitting
            performSearch();
        });   
                // listen for button click
        document.getElementById("submit").addEventListener("click", function(event) {
            event.preventDefault(); // Prevent submit
            performSearch();
        });

        function performSearch() {
            let searchTerm = document.querySelector("#searchInput").value; 
            console.log("Search term is:", searchTerm); 

            const data = {
                query: searchTerm 
            };

            fetch("https://pulsemedia-10eb81c0dde4.herokuapp.com/search", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log("Server Response:", response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Data received from server:", data); 
                
                let resultsDiv = document.getElementById("resultsDiv");

                if (!resultsDiv) {
                    resultsDiv = document.createElement("div");
                    resultsDiv.id = "resultsDiv";
                    document.body.appendChild(resultsDiv);
                    resultsDiv.style.whiteSpace = "normal";  // Ensure text wraps
        						resultsDiv.style.maxWidth = "80%";       // Set a maximum width if desired
                }
              resultsDiv.innerText = data;
              // Make resultsDiv visible
              resultsDiv.style.display = "block";
            })
            .catch(error => {
                console.log("There was a problem with fetch:", error.message);
            });
        }
    });
    
    document.addEventListener('click', function(event) {
    let resultsDiv = document.getElementById("resultsDiv");
    let searchInput = document.getElementById("searchInput");

    // If clicked element is not the resultsDiv or a descendant
    if (!resultsDiv.contains(event.target)) {
        resultsDiv.style.display = "none";  // Hide resultsDiv
        searchInput.value = "";             // Reset search
    }
});

const API_ENDPOINT = "https://pulsemedia-10eb81c0dde4.herokuapp.com/news";

async function fetchNews() {
    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
      
        const todaysDate = new Date();
        todaysDate.setDate(todaysDate.getDate() - 5);  // Set it to yesterday
        todaysDate.setHours(0, 0, 0, 0);  // Set hours, minutes, seconds and milliseconds to 0
    
        // Filter articles that are published today
        const todaysArticles = data.articles.filter(article => {
            const articleDate = new Date(article.publishedAt);
            articleDate.setHours(0, 0, 0, 0); // Reset time of article's date for comparison
            return articleDate.getTime() === todaysDate.getTime();
        });

        appendToTimeline(todaysArticles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function getTimeFromPublishedAt(publishedAt) {
    const date = new Date(publishedAt);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function appendToTimeline(todaysArticles) {
    const timeline = document.querySelector('.timeline');
    
    todaysArticles.forEach((article, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'event';

        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        timeDiv.innerText = getTimeFromPublishedAt(article.publishedAt);
        newsItem.appendChild(timeDiv);

        const circle = document.createElement('div');
        circle.className = 'circle';
        newsItem.appendChild(circle);

        const headline = document.createElement('div');
        headline.className = 'headline';
        
        // Append source name to the end of the description
        const appendedDescription = article.description + " - " + article.source.name;
        
        if (index === 0) {
            newsItem.classList.add('active'); // Add this line to make the first event active
            headline.classList.add('text-highlighted');
            timeDiv.style.color = "#ffffff";  // Set to white for the active event
            circle.style.backgroundColor = "#ffffff"; // Set the circle color to white for the active event
        }
        
        headline.innerText = appendedDescription; // Use the modified description here        
        newsItem.appendChild(headline);
        
         // Create an anchor element and set its href attribute to the article's URL
        const articleLink = document.createElement('a');
        articleLink.href = article.url;
        articleLink.target = "_blank"; // To open the link in a new tab
        articleLink.className = "article-link"; // Add this line
        articleLink.appendChild(newsItem); // Append newsItem to the anchor

        // Add the text-highlighted class to the topmost event
        if (index === 0) {
            headline.classList.add('text-highlighted');
        }

        timeline.appendChild(articleLink);
    });
}

fetchNews();

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
    const activationPoint = window.innerHeight * 0.15;  // 15% from the top of the viewport

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
});