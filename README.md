### **MediLow**  
MediLow is a web application designed to help users find medicines and their affordable alternatives. By entering a medicine name, users can quickly discover similar or lower-cost options. The goal of this app is to provide a user-friendly platform that assists individuals in making informed decisions about their medication purchases.  

### **📌 Features**  
- 🔍 **Medicine Search** – Users can search for a medicine by its name.  
- 🏥 **Alternative Suggestions** – Fetches and displays similar medicines from the database.  
- 🎨 **User-Friendly Interface** – Styled with TailwindCSS for a clean and responsive design.  
- ⚡ **Fast & Efficient** – Utilizes a backend API to quickly fetch medicine alternatives.  

### **📌 Installation**  
Follow these steps to set up and run the MediLow project on your local machine:  

#### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/your-username/MediLow.git
cd MediLow
```

#### **2️⃣ Install Dependencies**  
Make sure you have **Node.js** installed. Then, run:  
```sh
npm install
```

#### **3️⃣ Start the Development Server**  
To start the frontend:  
```sh
npm run dev
```

If using a backend, navigate to the backend directory and start the server:  
```sh
cd backend
pip install -r requirements.txt  # Install Python dependencies
uvicorn server:app --reload  # Start FastAPI backend
```

#### **4️⃣ Open the App**  
Visit **`http://localhost:5173`** in your browser to use MediLow.  

### **📌 Usage**  
1. Enter the name of a medicine in the search bar.
2. Click on the **Search** button.
3. View the list of alternative medicines along with their manufacturer and price.
4. Use the information to make an informed decision.

### **📌 Model Details**  
The alternative medicine recommendations in **MediLow** are powered by a combination of **TF-IDF, Incremental PCA, FAISS, and RapidFuzz** to ensure fast and accurate similarity searches.  

#### **🔹 How It Works**  
1. **TF-IDF (Term Frequency-Inverse Document Frequency)**  
   - Converts medicine descriptions and compositions into numerical vectors based on word importance.  
2. **Incremental PCA (Principal Component Analysis)**  
   - Reduces dimensionality for efficiency while preserving key features.  
3. **FAISS (Facebook AI Similarity Search)**  
   - Provides fast and scalable similarity searches across the dataset.  
4. **RapidFuzz**  
   - Performs fuzzy string matching to refine and improve recommendations.  

Using this hybrid approach, MediLow ensures **accurate and fast** medicine recommendations, helping users find affordable alternatives with similar compositions.  

### **📌 Technologies Used**  
- **Frontend**: React.js, TailwindCSS  
- **Backend**: FastAPI (Python) 


Feel free to contribute by submitting issues and pull requests! 🚀

