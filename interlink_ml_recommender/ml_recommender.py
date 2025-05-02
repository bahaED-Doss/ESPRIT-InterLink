from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Sample internships data (can be replaced with real DB data later)
internships = [
    {"id": 1, "title": "Java Developer", "requirements": "Java SpringBoot"},
    {"id": 2, "title": "Web Developer", "requirements": "HTML CSS JavaScript"},
    {"id": 3, "title": "Data Analyst", "requirements": "Python Pandas Excel"},
    {"id": 4, "title": "AI Intern", "requirements": "Python Machine Learning"},
]

@app.route('/recommend', methods=['POST'])
def recommend():
    student_skills = request.json.get('skills', [])  # List of strings
    skill_string = " ".join(student_skills)

    internship_texts = [i["requirements"] for i in internships]
    all_texts = [skill_string] + internship_texts

    tfidf = TfidfVectorizer()
    vectors = tfidf.fit_transform(all_texts)

    similarity_scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    top_indices = similarity_scores.argsort()[::-1][:3]

    recommendations = [internships[i] for i in top_indices]

    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5000)
