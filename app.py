from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)
load_dotenv()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_video_stats', methods=['POST'])
def get_video_stats():
    data = request.json
    video_url = data.get('videoUrl')
    if not video_url:
        return jsonify({'error': 'No video URL provided'}), 400

    video_id = video_url.split('v=')[-1].split('&')[0]
    api_key = os.getenv('YOUTUBE_API_KEY')
    url = f'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id={video_id}&key={api_key}'

    response = requests.get(url)
    data = response.json()

    if 'items' in data and len(data['items']) > 0:
        video = data['items'][0]
        snippet = video.get('snippet', {})
        content_details = video.get('contentDetails', {})
        statistics = video.get('statistics', {})

        return jsonify({
            'title': snippet.get('title', 'N/A'),
            'description': snippet.get('description', 'N/A'),
            'channelTitle': snippet.get('channelTitle', 'N/A'),
            'publishedAt': snippet.get('publishedAt', 'N/A'),
            'categoryId': snippet.get('categoryId', 'N/A'),
            'tags': snippet.get('tags', []),
            'duration': content_details.get('duration', 'N/A'),
            'viewCount': statistics.get('viewCount', 'N/A'),
            'likeCount': statistics.get('likeCount', 'N/A'),
            'dislikeCount': statistics.get('dislikeCount', 'N/A'),
            'commentCount': statistics.get('commentCount', 'N/A')
        })
    else:
        return jsonify({'error': 'Video not found or an error occurred'}), 404

if __name__ == '__main__':
    app.run(debug=True)
