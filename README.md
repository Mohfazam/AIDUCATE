# EduPlay: Gamified Learning Platform

 Learning Made Playful
 
To transform traditional learning into an engaging, interactive, and fun experience through gamification. EduPlay helps students and professionals develop skills while enjoying the process.

---

## **Features**
 
### **1. InstantQuiz**
- **Highlight Any Digital Text:** Generate quizzes from PDFs, articles, or textbooks.  
- **AI-Powered Quiz Generation:** Create MCQs, flashcards, and fill-in-the-blanks instantly.  
- **Track Progress:** Spaced repetition reminders and shareable quizzes.

### **2. Social Learning**
- **Collaborate with Peers:** Join team challenges and discuss topics in forums.  
- **Team Challenges:** Work together to complete group tasks and earn rewards.  
- **Discussion Forums:** Share insights, ask questions, and engage with the community.

### **3. Interactive Content**
- **Interactive Quizzes with Feedback:** Engage with quizzes that provide instant feedback.  
- **Simulations and Role-Playing:** Experience real-world scenarios for practical learning.  
- **Multimedia Content:** Learn through videos, animations, and infographics.  
- **Real-World Scenarios:** Apply knowledge in simulated environments.

### **4. Analytics**
- **Track Your Progress:** Monitor your learning journey with detailed reports.  
- **Skill Gap Analysis:** Identify areas for improvement based on quiz results.  
- **Performance Insights:** Get actionable insights to enhance your learning.  
- **Learning Recommendations:** Receive personalized recommendations for further study.

### **5. Rewards**
- **Earn Virtual Currency:** Collect coins or tokens for completing tasks.  
- **Unlock Exclusive Content:** Access advanced lessons or exclusive content by achieving milestones.

---

## **Setup Instructions**

### **Prerequisites**
- Node.js (v16 or higher)  
- MongoDB Compass (for database management)  
- OpenAI API key (for quiz generation)  

## **API Endpoints**

### **Authentication**
- **Signup:** `POST /api/auth/signup`  
  - Request Body: `{ username, email, password }`  
  - Response: `{ message: "User created successfully", token }`  

- **Signin:** `POST /api/auth/signin`  
  - Request Body: `{ email, password }`  
  - Response: `{ message: "Login successful", token }`  

### **Quiz Generation**
- **Generate Quiz:** `POST /api/quiz/generate`  
  - Request Body: `{ text: "Highlighted text" }`  
  - Response: `{ quiz: { questions: [...] } }`  

---

## **Contributing**

We welcome contributions! Please follow these steps:
1. Fork the repository.  
2. Create a new branch: `git checkout -b feature/YourFeatureName`.  
3. Commit your changes: `git commit -m "Add some feature"`.  
4. Push to the branch: `git push origin feature/YourFeatureName`.  
5. Open a pull request.  

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
