from flask import *
import pytz
import os
from werkzeug.utils import secure_filename
import label_image
from datetime import datetime
import image_fuzzy_clustering as fem
import os
import secrets
from PIL import Image
from flask import url_for, current_app
from flask_cors import CORS
import traceback 
import sqlite3
from flask import request, jsonify
from fpdf import FPDF
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.platypus import Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from datetime import datetime

def load_image(image):
    text = label_image.main(image)
    return text

def get_db_connection():
    conn = sqlite3.connect('users.db')  # Make sure this is your database filename
    conn.row_factory = sqlite3.Row
    return conn

def prepare_image(image, target):
    # if the image mode is not RGB, convert it
    if image.mode != "RGB":
        image = image.convert("RGB")

    # resize the input image and preprocess it
    image = image.resize(target)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = imagenet_utils.preprocess_input(image)

    # return the processed image
    return image
app = Flask(__name__)
CORS(app)
model = None

UPLOAD_FOLDER = os.path.join(app.root_path ,'static','img')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')

@app.route('/success', methods=['POST'])
def success():
    if request.method == 'POST':
        try:
            i = request.form.get('cluster')
            f = request.files['file']
            fname, f_ext = os.path.splitext(f.filename)

            # Save original image
            original_pic_path = save_img(f, f.filename)

            # Segmented image filename (e.g., segmented_c(2).jpg)
            segmented_filename = f"segmented_{fname}{f_ext}"
            segmented_path = os.path.join(current_app.root_path, 'static/images', segmented_filename)

            print(f"Running segmentation on: {original_pic_path} with {i} clusters")

            # Run clustering and save result
            fem.plot_cluster_img(original_pic_path, int(i), output_path=segmented_path)

            return jsonify({
                "status": "success",
                "segmented_image": segmented_filename
            })

        except Exception as e:
            print("🔥 ERROR during clustering:")
            traceback.print_exc()
            return jsonify({"status": "error", "message": str(e)}), 500

def save_img(img, filename):
    picture_path = os.path.join(current_app.root_path, 'static/images', filename)
    
    i = Image.open(img)

    # Convert RGBA to RGB to prevent JPEG save error
    if i.mode == 'RGBA':
        i = i.convert('RGB')

    i.save(picture_path)

    return picture_path

from fpdf import FPDF
import os
from datetime import datetime

class ModernPDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font('DejaVu', 'I', 9)
        self.set_text_color(128)
        self.cell(0, 10, f'© Vitamin Deficiency Detector | Generated on {datetime.now().strftime("%d %b %Y, %I:%M %p")}', 0, 0, 'C')

def generate_pdf_report(user_name, deficiency_description, filename_base, user_info=None, original_image=None, segmented_image=None):
    pdf = ModernPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Fonts
    pdf.add_font("DejaVu", "", "fonts/DejaVuSans.ttf", uni=True)
    pdf.add_font("DejaVu", "B", "fonts/DejaVuSans-Bold.ttf", uni=True)
    pdf.add_font("DejaVu", "I", "fonts/DejaVuSans-Oblique.ttf", uni=True)

    # Logo (optional)
    logo_path = os.path.abspath(os.path.join("static", "S:/vitamin-deficiency-detector/static/logo.png"))
    print("Logo path:", logo_path)
    if os.path.exists(logo_path):
        pdf.image(logo_path, x=10, y=8, w=20)
    else:
        print("❌ Logo not found at", logo_path)

    # Header title
    pdf.set_xy(0, 10)
    pdf.set_fill_color(33, 150, 243)  # Modern blue
    pdf.set_text_color(255)
    pdf.set_font("DejaVu", "B", 18)
    pdf.cell(210, 15, "Vitamin Deficiency Detection Report", ln=True, align="C", fill=True)
    pdf.ln(10)

    # Reset text color
    pdf.set_text_color(0)

    # User Info Section
    pdf.set_font("DejaVu", "B", 13)
    pdf.set_fill_color(232, 245, 253)
    pdf.cell(0, 10, "User Details", ln=True, fill=True)

    pdf.set_font("DejaVu", "", 12)
    if user_info:
        for key, value in user_info.items():
            pdf.cell(0, 8, f"{key}: {value}", ln=True)
    else:
        pdf.cell(0, 8, f"Name: {user_name}", ln=True)
    pdf.ln(5)

    # Separator
    pdf.set_draw_color(200)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # Deficiency Section
    pdf.set_font("DejaVu", "B", 13)
    pdf.set_fill_color(255, 224, 178)
    pdf.cell(0, 10, " Deficiency Identified", ln=True, fill=True)

    pdf.set_font("DejaVu", "", 12)
    pdf.multi_cell(0, 8, deficiency_description)
    pdf.ln(2)

    # Explanation and Suggestions
    explanations = {
        "Vitamin A": "Vitamin A is essential for vision, immune system, and reproduction. Deficiency can lead to night blindness and dry eyes.",
        "Vitamin B": "Vitamin B complex helps with energy production and red blood cell formation. Lack of it may cause fatigue and nerve damage.",
        "Vitamin C": "Important for skin and immunity. Deficiency can cause scurvy, bleeding gums, and slow healing.",
        "Vitamin D": "Regulates calcium and bone metabolism. Lack of Vitamin D leads to weak bones and fatigue.",
        "Vitamin E": "An antioxidant that protects cells. Deficiency may cause muscle weakness and vision problems.",
    }
    suggestions = {
        "Vitamin A": "Eat carrots, sweet potatoes, spinach, mangoes.",
        "Vitamin B": "Include dairy, eggs, leafy greens, and legumes.",
        "Vitamin C": "Consume citrus fruits, strawberries, broccoli.",
        "Vitamin D": "Sunlight exposure, fortified milk, fatty fish.",
        "Vitamin E": "Add almonds, sunflower seeds, and avocados.",
    }

    for vit, explain in explanations.items():
        if vit in deficiency_description:
            pdf.ln(5)
            pdf.set_font("DejaVu", "B", 13)
            pdf.set_fill_color(200, 230, 201)
            pdf.cell(0, 10, " Explanation", ln=True, fill=True)
            pdf.set_font("DejaVu", "", 12)
            pdf.multi_cell(0, 8, explain)

            pdf.ln(3)
            pdf.set_font("DejaVu", "B", 13)
            pdf.set_fill_color(255, 241, 118)
            pdf.cell(0, 10, " Food Suggestions", ln=True, fill=True)
            pdf.set_font("DejaVu", "", 12)
            pdf.multi_cell(0, 8, suggestions[vit])
            break

    # Separator
    pdf.ln(5)
    pdf.set_draw_color(220)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())

    # Images
    if original_image and os.path.exists(original_image):
        pdf.ln(10)
        pdf.set_font("DejaVu", "B", 13)
        pdf.cell(0, 10, " Original Image", ln=True)
        pdf.image(original_image, x=10, w=90)

    if segmented_image and os.path.exists(segmented_image):
        pdf.set_y(pdf.get_y() - 50 if original_image else pdf.get_y())
        pdf.set_font("DejaVu", "B", 13)
        pdf.set_xy(110, pdf.get_y())
        pdf.cell(0, 10, "Segmented Image", ln=True)
        pdf.image(segmented_image, x=110, w=90)

    # Save
    output_dir = os.path.join("static", "reports")
    os.makedirs(output_dir, exist_ok=True)
    report_path = os.path.join(output_dir, f"{filename_base}_report.pdf")
    pdf.output(report_path)
    print(f"✅ Modern PDF report saved at: {report_path}")
    return report_path


@app.route('/predict', methods=['POST'])
def predict_route():
    print("✅ /predict route hit")
    try:
        print("Request content-type:", request.content_type)
        print("Request form keys:", request.form.keys())
        print("Request files keys:", request.files.keys())

        file = request.files['file']
        email = request.form.get('email')
        # print("📞 Received email:", email)

        if not email:
            return jsonify({'status': 'error', 'message': 'email number not received'}), 400

        # Save original image
        fname, f_ext = os.path.splitext(file.filename)
        safe_filename = secure_filename(file.filename)
        original_image_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
        file.save(original_image_path)
        print("✅ Saved original image")

        # Run your ML model
        result = load_image(original_image_path)
        result = result.title()

        # Description mapping
        vitamin_descriptions = {
            "Vitamin A": " -> Deficiency of vitamin A is associated with night blindness and dry eyes.",
            "Vitamin B": " -> Vitamin B12 deficiency may lead to fatigue, anemia, and nerve issues.",
            "Vitamin C": " -> Lack of vitamin C can result in scurvy, bleeding gums, and poor healing.",
            "Vitamin D": " -> Vitamin D deficiency may cause bone density loss and fatigue.",
            "Vitamin E": " -> Deficiency can lead to nerve and muscle damage, or immune system issues."
        }

        description = vitamin_descriptions.get(result, '')

        # Generate segmented image
        segmented_filename = f"segmented_{fname}{f_ext}"
        segmented_path = os.path.join('static/images', segmented_filename)
        fem.plot_cluster_img(original_image_path, 3, output_path=segmented_path)
        print("✅ Saved clustered image:", segmented_path)

        # Get user_id from phone
        DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM users WHERE email=?", (email,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
        user_id, user_name = row

        # Generate PDF report
        report_path = generate_pdf_report(user_name, result + description, fname)

       # Store web paths in the DB instead of local paths
        original_image_web_path = f"static/img/{safe_filename}"
        segmented_web_path = f"static/images/{segmented_filename}"
        report_web_path = f"static/reports/{fname}_report.pdf"
        ist = pytz.timezone('Asia/Kolkata')
        created_at = datetime.now(ist).strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("""
            INSERT INTO user_reports (user_id, original_image, segmented_image, deficiency, report_path,created_at)
            VALUES (?, ?, ?, ?, ?,?)
        """, (
            user_id,
            original_image_web_path,
            segmented_web_path,
            result,
            report_web_path,
            created_at
        ))
        conn.commit()
        conn.close()
        return jsonify({
            "status": "success",
            "segmented_image": segmented_filename,
            "deficiency": result,
            "description": description,
            "report_path": report_path
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    phone = data.get('phone')
    password = data.get('password')
    name = data.get('name')
    age = data.get('age')
    email = data.get('email')
    height = data.get('height')
    weight = data.get('weight')
    gender = data.get('gender')
    diet_type = data.get('diet_type')
    medical_conditions = data.get('medical_conditions', '')

    try:
        import sqlite3
        import os
        DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')

        with sqlite3.connect(DB_PATH, timeout=10, check_same_thread=False) as conn:
            cursor = conn.cursor()

            # Ensure email or phone are not duplicated
            cursor.execute("SELECT * FROM users WHERE phone = ? OR email = ?", (phone, email))
            if cursor.fetchone():
                return jsonify({'status': 'error', 'message': 'Phone or Email already exists'}), 400

            cursor.execute("""
                INSERT INTO users (phone, password, name, age, email, height, weight, gender, diet_type, medical_conditions)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (phone, password, name, age, email, height, weight, gender, diet_type, medical_conditions))

            conn.commit()

        return jsonify({'status': 'success', 'message': 'User registered successfully'}), 201

    except Exception as e:
        print("Error in /register:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone = data['phone']
    password = data['password']

    try:
        import sqlite3
        import os
        DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')

        with sqlite3.connect(DB_PATH, timeout=10, check_same_thread=False) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            cursor.execute("SELECT * FROM users WHERE phone=? AND password=?", (phone, password))
            user = cursor.fetchone()

        if user:
            user_dict = {key: user[key] for key in user.keys()}
            return jsonify({'status': 'success', 'message': 'Login successful', 'user': user_dict})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid phone or password'}), 401

    except Exception as e:
        print("Error in /login:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    try:
        import sqlite3, os
        DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE users
            SET name = ?, age = ?, email = ?, height = ?, weight = ?, gender = ?, diet_type = ?, medical_conditions = ?
            WHERE phone = ?
        """, (
            data['name'], data['age'], data['email'], data['height'], data['weight'],
            data['gender'], data['diet_type'], data['medical_conditions'], data['phone']
        ))

        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Profile updated successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/get-reports', methods=['POST'])
def get_reports():
    data = request.get_json()
    phone = data.get('email')

    try:
        DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT image_name, segmented_image, deficiency_detected, report_path, timestamp
            FROM user_reports
            WHERE phone = ?
            ORDER BY timestamp DESC
        """, (phone,))
        
        reports = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return jsonify({'status': 'success', 'reports': reports})
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
@app.route('/api/user-reports')
def get_user_reports():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify([])

    DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("""
        SELECT original_image, segmented_image, deficiency, report_path, created_at
        FROM user_reports
        WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    # ✅ Return keys as-is without renaming
    reports = [dict(row) for row in rows]
    return jsonify(reports)

@app.route('/api/user-report-stats')
def get_report_stats():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400

    DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Total images uploaded
    cursor.execute("SELECT COUNT(*) FROM user_reports WHERE user_id = ?", (user_id,))
    images_uploaded = cursor.fetchone()[0]

    # Total reports downloaded (non-empty report_path)
    cursor.execute("""
        SELECT COUNT(*) FROM user_reports
        WHERE user_id = ? AND report_path IS NOT NULL AND TRIM(report_path) != ''
    """, (user_id,))
    reports_downloaded = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "images_uploaded": images_uploaded,
        "reports_downloaded": reports_downloaded
    })
if __name__ == '__main__':
    app.run()