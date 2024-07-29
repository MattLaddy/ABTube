document.getElementById('videoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;

    // Validate the URL format
    const urlPattern = /^(https:\/\/www\.youtube\.com\/watch\?v=)[\w-]+$/;
    if (!urlPattern.test(videoUrl)) {
        document.getElementById('results').innerHTML = '<p style="color: red;">Please enter a valid YouTube URL.</p>';
        return;
    }

    fetch('/get_video_stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoUrl: videoUrl })
    })
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (data.error) {
            resultsDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
        } else {
            resultsDiv.innerHTML = `
                <div class="stat"><strong>Title:</strong> ${data.title}</div>
                <div class="stat"><strong>Description:</strong> ${data.description}</div>
                <div class="stat"><strong>Channel Title:</strong> ${data.channelTitle}</div>
                <div class="stat"><strong>Published At:</strong> ${data.publishedAt}</div>
                <div class="stat"><strong>Category ID:</strong> ${data.categoryId}</div>
                <div class="stat"><strong>Tags:</strong> ${data.tags.join(', ')}</div>
                <div class="stat"><strong>Duration:</strong> ${data.duration}</div>
                <div class="stat"><strong>View Count:</strong> ${data.viewCount}</div>
                <div class="stat"><strong>Like Count:</strong> ${data.likeCount}</div>
                <div class="stat"><strong>Dislike Count:</strong> ${data.dislikeCount}</div>
                <div class="stat"><strong>Comment Count:</strong> ${data.commentCount}</div>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '<p style="color: red;">An error occurred. Please try again later.</p>';
    });
});
