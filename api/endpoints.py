import os
import random
import string
from flask import app, Flask, jsonify, request
import requests
import numpy as np
import tensorflow as tf
import cv2
import matplotlib.pyplot as plt

def analyseImg():
    eyeimg = request.files.get('eyeimg')
    if eyeimg:
        img_dir = os.path.join("static/media/eyes")
        os.makedirs(img_dir, exist_ok=True)
        img_path = os.path.join(img_dir,eyeimg.filename)
        eyeimg.save(img_path)
        saved_model_path = 'static/media/model/cataract_detection_model.h5'
        test_image_path = 'static/media/eyes/'+eyeimg.filename
        result, confidence = predict_cataract(saved_model_path, test_image_path)
        os.remove(test_image_path)
        print(f"Prediction: {result}")
        print(f"Confidence: {confidence:.2f}%")
        

        return jsonify(result,confidence)
    else:
        return jsonify("No file uploaded"), 400

    
# Function to preprocess a single image for prediction
def preprocess_image(image_path, target_size=(224, 224)):
    """
    Preprocess a single image for prediction
    Args:
        image_path: Path to the image
        target_size: Target size for the model input
    Returns:
        Preprocessed image ready for model prediction
    """
    # Load the image
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
    # Resize the image
    img = cv2.resize(img, target_size)
    # Convert to numpy array and normalize
    img_array = np.array(img) / 255.0
    # Expand dimensions to match the model's expected input shape
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Function to make prediction on a single image
def predict_cataract(model_path, image_path):
    """
    Predict whether an image shows cataract or not
    Args:
        model_path: Path to the saved model
        image_path: Path to the image to classify
    Returns:
        Prediction result: "Cataract" or "No Cataract"
    """
    # Load the saved model
    loaded_model = tf.keras.models.load_model(model_path)
    # Preprocess the image
    processed_img = preprocess_image(image_path)
    # Make prediction
    prediction = loaded_model.predict(processed_img)[0][0]
    # Interpret result (assuming 0 is no cataract, 1 is cataract)
    result = "No Cataract" if prediction > 0.5 else "Cataract"
    confidence = prediction if prediction > 0.5 else 1 - prediction
    return result, confidence * 100