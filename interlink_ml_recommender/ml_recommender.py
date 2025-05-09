from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# DB connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/Interlink_DB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)

# Database Model - EXACTLY matching your schema
class Internship(db.Model):
    __tablename__ = 'internship'
    
    internship_id = db.Column('internship_id', db.BigInteger, primary_key=True, autoincrement=True)
    available_spots = db.Column(db.Integer, nullable=False)
    company_name = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(255), nullable=True)
    duration = db.Column(db.Enum('EIGHT_WEEKS', 'FOUR_WEEKS', 'SIX_MONTHS', 'THREE_MONTHS', 'TWELVE_WEEKS'), nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)
    localisation = db.Column(db.String(255), nullable=True)
    skill = db.Column(db.Enum('BI', 'DATASCIENCE', 'GENIELOGICIEL'), nullable=True)
    start_date = db.Column(db.DateTime, nullable=True)
    title = db.Column(db.String(255), nullable=True)
    type = db.Column(db.Enum('FULL_TIME', 'HYBRID', 'PART_TIME', 'REMOTE'), nullable=True)

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        logger.info("Received recommendation request")
        
        # Verify connection
        db.session.execute(text("SELECT 1"))
        logger.info("Database connection verified")
        
        request_data = request.get_json()
        if not request_data:
            return jsonify({"error": "No data provided"}), 400
            
        student_skills = [skill.upper().strip() for skill in request_data.get('skills', [])]
        logger.info(f"Processing skills: {student_skills}")

        if not student_skills:
            return jsonify({"error": "No skills provided"}), 400

        try:
            # Handle potential enum value mismatches
            internships = db.session.execute(text("""
                SELECT * FROM internship 
                WHERE skill IN ('BI', 'DATASCIENCE', 'GENIELOGICIEL')
                AND duration IN ('EIGHT_WEEKS', 'FOUR_WEEKS', 'SIX_MONTHS', 'THREE_MONTHS', 'TWELVE_WEEKS')
            """)).fetchall()
            
            logger.info(f"Found {len(internships)} internships")
        except Exception as e:
            logger.error(f"Database query failed: {str(e)}")
            return jsonify({"error": "Database query failed", "details": str(e)}), 500

        recommendations = []
        for internship in internships:
            try:
                required_skill = internship.skill
                # Create mapping between database values and expected skills
                skill_mapping = {
                    'BI': 'BUSINESS_INTELLIGENCE',
                    'DATASCIENCE': 'DATA_SCIENCE',
                    'GENIELOGICIEL': 'SOFTWARE_ENGINEERING'
                }
                normalized_skill = skill_mapping.get(required_skill, required_skill)
                skill_match = 1 if normalized_skill and normalized_skill in student_skills else 0

                recommendations.append({
                    "internship": {
                        "id": internship.internship_id,
                        "title": internship.title,
                        "description": internship.description,
                        "requiredSkill": required_skill,
                        "companyName": internship.company_name,
                        "duration": internship.duration,
                        "type": internship.type,
                        "location": internship.localisation,
                        "startDate": internship.start_date.isoformat() if internship.start_date else None,
                        "endDate": internship.end_date.isoformat() if internship.end_date else None,
                        "availableSpots": internship.available_spots
                    },
                    "score": skill_match,
                    "matchedSkill": normalized_skill if skill_match else None
                })
            except Exception as e:
                logger.error(f"Error processing internship {internship.internship_id}: {str(e)}")
                continue

        recommendations.sort(key=lambda x: x['score'], reverse=True)

        return jsonify({
            "success": True,
            "recommendations": recommendations,
            "studentSkills": student_skills
        })

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    with app.app_context():
        try:
            db.session.execute(text("SELECT 1"))
            logger.info("Database connection successful")
        except Exception as e:
            logger.error(f"Failed to connect to database: {str(e)}")
    
    app.run(debug=True, port=5000)