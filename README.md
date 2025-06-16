*Slate: Your Personalized Fitness Companion

 <img src="https://github.com/user-attachments/assets/b0afdb6f-1db3-4311-953a-9d8cfc4f6818" width="300" alt="Slate App Screenshot 1">

<img src="https://github.com/user-attachments/assets/b5b420a5-08a5-45a1-b633-591a9fdf5fb9" width="300" alt="Slate App Screenshot 2">

<img src="https://github.com/user-attachments/assets/64ba0eea-364c-46c7-9887-88ee1ce09c23" width="300" alt="Slate App Screenshot 3">

<img src="https://github.com/user-attachments/assets/ec96458d-d3f9-4e9b-990f-12bb26e3b282" width="300" alt="Slate App Screenshot 4">

<img src="https://github.com/user-attachments/assets/fb172ebb-f611-49c1-aef8-89d76485c3cc" width="300" alt="Slate App Screenshot 5">

<img src="https://github.com/user-attachments/assets/6cc0bb86-94fa-42fe-8aba-4ef98d29a402" width="300" alt="Slate App Screenshot 6">

<img src="https://github.com/user-attachments/assets/de33a73d-1702-4d9d-8ad9-1fbf6ce82904" width="300" alt="Slate App Screenshot 7">

About Slate

Features

Technical Stack

Getting Started

Prerequisites

Installation (Development)

Running the App

APK Installation (for Android Users)

Project Structure

Contributing

Team

License

About Slate
Slate is a modern, intuitive workout application designed to empower users on their fitness journey. It provides personalized workout programs, detailed exercise instructions, progress tracking, and insightful analytics to help users achieve their health and wellness goals. Built with a focus on a seamless user experience and robust backend infrastructure, Slate is designed to be a comprehensive and reliable fitness companion.

Features
Personalized Workout Programs: Access to curated workout plans tailored for different fitness goals (e.g., balanced fitness, weight loss).

Detailed Exercise Library: Comprehensive library of exercises with descriptions and instructions to ensure correct form and prevent injuries.

Daily Workout Diary: Track your daily workouts and activities to maintain consistency and monitor your progress.

Progress Tracking & Analytics: Monitor your fitness journey with detailed insights into your performance and improvements.

Google Login & Authentication: Secure and seamless user authentication using Google Auth and session-based authorization.

Cloud Image Hosting: Efficiently manage and display exercise images and other visual content.

Modern User Interface: A clean, responsive, and user-friendly interface built with modern design principles.

Robust Data Management: Secure and efficient data handling for user profiles, workout plans, and exercise details.

Technical Stack
Slate is built using a powerful and modern technology stack, showcasing proficiency in a wide range of development tools and practices:

Frontend:

React Native (with Expo): For cross-platform mobile application development, enabling a single codebase for Android and iOS. Expo streamlines development with its managed workflow.

Backend:

Node.js/Express.js (deployed on Vercel): A robust and scalable backend server responsible for handling API requests, business logic, and database interactions. Vercel provides seamless deployment and serverless functions capabilities.

Database:

MongoDB: A NoSQL database offering high performance, scalability, and flexibility for storing structured and unstructured data, including user profiles, workout data, and exercise details.

Authentication:

Google Login & Google Auth: For secure and convenient user authentication.

Session Authorization: Implementing secure session management for persistent user logins and authorized access to application resources.

Image Hosting:

Cloud Image Hosting Service: Utilized cloundinary for efficient storage and delivery of all application images, ensuring fast loading times and scalability.

Deployment:

Vercel: For deploying the backend API, leveraging its serverless functions for optimal performance and cost-efficiency.

GitHub: Version control and collaboration.

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js & npm (or Yarn): Download Node.js

Expo CLI:

npm install -g expo-cli

MongoDB Atlas Account (or local MongoDB instance): For setting up your database.

Google Cloud Project: For Google Login API credentials.

Installation (Development)
Clone the repository:

git clone https://your-github-repo-url.git
cd slate-workout-app

Install frontend dependencies:

cd frontend # Assuming your frontend code is in a 'frontend' directory
npm install # or yarn install

Install backend dependencies:

cd ../backend # Assuming your backend code is in a 'backend' directory
npm install # or yarn install

Configure Environment Variables:
Create a .env file in your backend directory and add the following:

MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_web_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=a_strong_random_secret_key
# Add any other environment variables for image hosting, etc.

Create a .env file in your frontend directory (if needed for Expo, usually for API URLs):

EXPO_PUBLIC_API_URL=your_vercel_deployed_backend_url # or http://localhost:PORT for local development
# Add any other necessary client-side environment variables

Refer to the Google API Console to obtain your Google Client ID and Secret.

APK Installation (for Android Users)
For convenient testing and demonstration on Android devices, we have provided a pre-built Android Package Kit (APK) file.

Installation Steps for Users:

Download the APK:
Navigate to the releases folder in our GitHub repository and download the latest Slate_vX.X.X.apk file to your Android device.
Link to APK (e.g., https://github.com/your-username/your-repo/raw/main/releases/Slate_v1.0.0.apk)
(Remember to update the link with your actual GitHub repository URL and APK filename.)

Enable "Install from Unknown Sources":
If prompted, you may need to enable "Install from Unknown Sources" or "Install unknown apps" in your device's security settings to install applications not downloaded from the Google Play Store. The exact path varies by Android version and device manufacturer (e.g., Settings > Apps & notifications > Special app access > Install unknown apps).

Install the APK:
Locate the downloaded APK file (usually in your "Downloads" folder) and tap on it to begin the installation process. Follow the on-screen prompts.

