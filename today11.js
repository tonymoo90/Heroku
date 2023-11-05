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

const NEWS_API_ENDPOINT = "https://pulsemedia-10eb81c0dde4.herokuapp.com/news";
const POSTS_API_ENDPOINT = "https://pulsemedia-10eb81c0dde4.herokuapp.com/curator_posts";

// Fetch News and Curator Posts
async function fetchData() {
    try {
        const [newsResponse, postsResponse] = await Promise.all([
            fetch(NEWS_API_ENDPOINT),
            fetch(POSTS_API_ENDPOINT),
        ]);

        const newsData = await newsResponse.json();
        const postsData = await postsResponse.json();

        // Combine news and posts into a single timeline
        const combinedData = [...newsData.articles, ...postsData].sort(
            (a, b) => new Date(b.publishedAt || b.source_created_at) - new Date(a.publishedAt || a.source_created_at)
        );

        appendToTimeline(combinedData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// This single appendToTimeline function works for both news and posts
function appendToTimeline(items) {
    const timeline = document.querySelector('.timeline');

    items.forEach((item, index) => {
        // Determine if the item is a news article or a Twitter post
        const isNewsArticle = item.hasOwnProperty('publishedAt');
        
        const newsItem = document.createElement('div');
        newsItem.className = 'event';

        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        // Use 'publishedAt' for news, 'source_created_at' for posts
        timeDiv.innerText = getTimeFromPublishedAt(isNewsArticle ? item.publishedAt : item.source_created_at);
        newsItem.appendChild(timeDiv);

        const circle = document.createElement('div');
        circle.className = 'circle';
        newsItem.appendChild(circle);

        const headline = document.createElement('div');
        headline.className = 'headline';
        const appendedDescription = isNewsArticle ? `${item.description} - ${item.source.name}` : `${item.text} - ${item.user_full_name}`;
        headline.innerText = appendedDescription;
        newsItem.appendChild(headline);

        const articleLink = document.createElement('a');
        articleLink.href = item.url; // Assuming both have 'url'
        articleLink.target = "_blank";
        articleLink.className = "article-link";
        articleLink.appendChild(newsItem);

        if (index === 0) {
            newsItem.classList.add('active');
            headline.classList.add('text-highlighted');
            timeDiv.style.color = "#ffffff";
            circle.style.backgroundColor = "#ffffff";
        }

        timeline.appendChild(articleLink);
    });
}

// Helper function to format the date string
function getTimeFromPublishedAt(dateTime) {
    if (!dateTime) return ''; // Handle any potential undefined/null dateTime values
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Call fetchData on page load to get both news and posts
fetchData();


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
});