📝 Notes Management System

A full-stack Notes Management web application built using Node.js, Express, MongoDB, and EJS.
This application allows users to register, login, and manage their personal notes securely.

---

🚀 Features

- 🔐 User Authentication (Register & Login)
- 📝 Create, Read, Update, Delete (CRUD) Notes
- 🔒 Password hashing using bcrypt
- 🍪 Authentication using JWT & Cookies
- 📦 MongoDB database integration
- 🎨 EJS templating for dynamic UI

---

🛠️ Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Frontend: EJS, HTML, CSS
- Authentication: JWT, bcrypt

---

📂 Project Structure

mern-prac/
│── models/
│   ├── user.js
│   └── notes.js
│
│── middleware/
│   └── auth.js
│
│── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── notes.ejs
│   └── profile.ejs
│
│── app.js
│── package.json
│── .env

---

⚙️ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/your-username/notes-management.git
cd notes-management

2️⃣ Install dependencies

npm install

3️⃣ Setup environment variables

Create a ".env" file in root directory:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notesapp
SESSION_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret

---

4️⃣ Start MongoDB

Make sure MongoDB is running:

mongod

---

5️⃣ Run the application

node app.js

---

🌐 Usage

Open your browser and go to:

http://localhost:5000

---

📸 Screens

- Login Page
- Register Page
- Notes Dashboard
- Profile Page

---

🔐 Security Features

- Passwords are hashed using bcrypt
- JWT-based authentication
- Protected routes using middleware

---

🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

📄 License

This project is licensed under the MIT License.

---

👨‍💻 Author

Palepu Sai

---

⭐ If you like this project, give it a star on GitHub!
