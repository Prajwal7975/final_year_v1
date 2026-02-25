from flask import Flask, jsonify
from flask_cors import CORS
from db import get_db_connection
import os
import jwt
from flask import Flask, request, jsonify
from passlib.hash import bcrypt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from db import get_db_connection
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_EXPIRATION = int(os.environ.get("JWT_EXPIRATION", 3600))


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Join with department table
        cur.execute("""
            SELECT a.admin_id, a.password_hash,a.role, d.department_name
            FROM admins a
            JOIN departments d ON a.department_id = d.department_id  
            WHERE a.email = %s
        """, (email,))

        user = cur.fetchone()

        cur.close()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        admin_id, password_hash, role, department = user

        # Verify password
        if not bcrypt.verify(password, password_hash):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT
        payload = {
            "user_id": str(admin_id),
            "role": role,
            "department": department,
            "exp": datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION)
        }

        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        return jsonify({
            "access_token": token,
            "role": role,
            "department": department
        }), 200

    except Exception as e:
        print("Login error:", str(e))
        return jsonify({"error": "Server error"}), 500


if __name__ == "__main__":
    app.run(debug=True)


# app = Flask(__name__)
# CORS(app)
# # ==============================
# # ADMIN DASHBOARD API
# # ==============================

# @app.route("/api/admin/health/complaints", methods=["GET"])
# def get_health_complaints():
#     conn = get_db_connection()
#     cur = conn.cursor()

#     query = """
#         SELECT complaint_id, user_id, description, status, category, ward, created_at
#         FROM complaints
#         WHERE category = %s
#         ORDER BY created_at DESC
#         LIMIT 10;
#     """

#     cur.execute(query, ("health",))
#     rows = cur.fetchall()

#     cur.close()
#     conn.close()

#     complaints = []
#     for row in rows:
#         complaints.append({
#             "complaint_id": row[0],
#             "user_id": row[1],
#             "description": row[2],
#             "status": row[3],
#             "category": row[4],
#             "ward": row[5],
#             "created_at": row[6]
#         })

#     return jsonify(complaints)


# ==============================
# START FLASK SERVER
# ==============================

if __name__ == "__main__":
    app.run(debug=True, port=5000)
