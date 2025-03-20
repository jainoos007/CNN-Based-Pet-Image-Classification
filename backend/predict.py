import os
import sys
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Suppress TensorFlow logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

try:
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "cat_dog_classifier.keras")

    if not os.path.exists(MODEL_PATH):
        print("Error: Model file not found!")
        sys.exit(1)

    model = tf.keras.models.load_model(MODEL_PATH)

    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        sys.exit(1)

    img_path = sys.argv[1]

    if not os.path.exists(img_path):
        print(f"Error: Image file '{img_path}' not found!")
        sys.exit(1)

    img = image.load_img(img_path, target_size=(150, 150))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)[0][0]
    result = "Dog" if prediction > 0.5 else "Cat"

    # Print only the final result, so it doesn't get mixed with logs
    print(result)

except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
