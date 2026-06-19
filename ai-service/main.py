from fastapi import FastAPI
import requests
from io import BytesIO
import face_recognition

import cv2

import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv
import os

from datetime import datetime


load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


app = FastAPI()




@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}


@app.post("/face-attendance")
def face_attendance(data: dict):
    try:

        group_image_url = data["groupImage"]
        students = data["students"]

        # Group Image Download
        group_response = requests.get(group_image_url,timeout=15)

        group_image = face_recognition.load_image_file(
            BytesIO(group_response.content)
        )

        # Group Face Encodings
        group_locations = face_recognition.face_locations(group_image)

        group_encodings = face_recognition.face_encodings(
            group_image,
            group_locations
        )

        if len(group_encodings) == 0:
            return {
                "error": "No face detected in group image"
            }

        present_students = []
        absent_students = []
        face_issue = []

        # Students Loop
        for student in students:

            try:

                profile_url = student["profileImage"]

                profile_response = requests.get(profile_url,timeout=15)

                profile_image = face_recognition.load_image_file(
                    BytesIO(profile_response.content)
                )

                profile_encodings = face_recognition.face_encodings(
                    profile_image
                )

                # Profile image issue
                if len(profile_encodings) == 0:

                    face_issue.append({
                        "admissionNo": student["admissionNo"],
                        "problem": "PROFILE_IMAGE",
                        "reason": "No clear face found in profile image"
                    })

                    continue

                student_encoding = profile_encodings[0]

                matched = False

                # Compare with all group faces
                for i, group_face in enumerate(group_encodings):

                    top, right, bottom, left = group_locations[i]


                    match = face_recognition.compare_faces(
                        [group_face],
                        student_encoding,
                        tolerance=0.5
                    )

                    if True in match:

                        present_students.append(
                            student["admissionNo"]
                        )

                        matched = True

                        # GREEN BOX
                        cv2.rectangle(
                            group_image,
                            (left, top),
                            (right, bottom),
                            (0,255,0),
                            3
                        )

                        cv2.putText(
                            group_image,
                            student["admissionNo"],
                            (left, top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.8,
                            (255,255,255),
                            2
                        )

                        break

                # # Not matched
                if not matched:

                    absent_students.append({
                        "admissionNo": student["admissionNo"],
                        "reason": f"Face not found in group image"
                    })

            except Exception as e:

                face_issue.append({
                    "admissionNo": student["admissionNo"],
                    "problem": "PROCESSING_ERROR",
                    "reason": str(e)
                })



        current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        output_file = f"attendance_{current_time}.jpg"

        cv2.imwrite(
            output_file,
            cv2.cvtColor(
                group_image,
                cv2.COLOR_RGB2BGR
            )
        )


        try:

            upload_result = cloudinary.uploader.upload(
                output_file,
                folder="AttendanceSystemFolder",
                public_id=f"attendance_{current_time}",
                overwrite=False
            )


            annotatedImageUrl = upload_result.get(
                "secure_url",
                ""
            )


        except Exception as e:
            print(f"Cloudinary Error: {e}")
            annotatedImageUrl = ""

        finally:

            if os.path.exists(output_file):
                os.remove(output_file)

        return {
            "totalPresent": len(present_students),
            "totalAbsent": len(absent_students),
            "totalIssue": len(face_issue),

            "presentStudents": present_students,
            "absentStudents": absent_students,
            "faceIssue": face_issue,

            "annotatedImageUrl": annotatedImageUrl
        }

    except Exception as e:
        return {
            "error": str(e)
        }