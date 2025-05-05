import tensorflow as tf
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
import os

# Function to extract frames from a video
def extract_frames(video_path, max_frames=10):
    frames = []
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    while cap.isOpened() and frame_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (224, 224))  # Resize for model input
        frames.append(frame)
        frame_count += 1
    cap.release()
    return frames

# Load and preprocess data
data_dir = "Celeb-DF"  # Update this to your local data path
images = []
labels = []

# Process real and fake videos
for folder in os.listdir(data_dir):
    folder_path = os.path.join(data_dir, folder)
    if os.path.isdir(folder_path):  # Skip files like List_of_testing_videos.txt
        is_fake = 1 if "synthesis" in folder.lower() else 0  # Label fake (1) or real (0)
        for file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file)
            if file.endswith('.mp4'):
                frames = extract_frames(file_path, max_frames=5)  # Extract up to 5 frames per video
                for frame in frames:
                    images.append(frame)
                    labels.append(is_fake)

# Convert to numpy arrays
images = np.array(images)
labels = np.array(labels)

# Check if any data was loaded
if len(images) == 0:
    raise ValueError("No frames were extracted. Check your video files and paths.")

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.2, random_state=42)

# Normalize the data
X_train = X_train / 255.0
X_test = X_test / 255.0

# Build a simple CNN model
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

# Save the model as a .keras file
model.save('deepfake_model.keras', save_format='keras')
print("Model saved as deepfake_model.keras")