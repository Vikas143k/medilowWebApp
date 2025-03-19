import pandas as pd
import numpy as np
import faiss
import os
import pickle
import time
from tqdm import tqdm
from rapidfuzz import process
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import IncrementalPCA
print(os.getcwd()) 
# File paths
# File paths (Updated)
faiss_index_file = "model/faiss_index.bin"
vectorizer_file = "model/tfidf_vectorizer.pkl"
pca_file = "model/pca_model.pkl"


# Load dataset
print("🔄 Loading dataset...")
df = pd.read_csv(r"F:\Code\project\mediLow\backend\data\medicine_data.csv")
# Preprocessing
df['name'] = df['name'].str.lower()
df["short_composition1"] = df["short_composition1"].fillna("")
df["short_composition2"] = df["short_composition2"].fillna("")
df["full_composition"] = df["short_composition1"] + " " + df["short_composition2"]

# Load or train TF-IDF Vectorizer
if os.path.exists(vectorizer_file):
    print("✅ Loading pre-trained TF-IDF vectorizer...")
    with open(vectorizer_file, "rb") as f:
        vectorizer = pickle.load(f)
        composition_vectors = vectorizer.transform(df["full_composition"])
else:
    print("⚡ Training TF-IDF vectorizer (This may take time)...")
    start_time = time.time()
    vectorizer = TfidfVectorizer(max_features=10000)  # Limit features for speed
    composition_vectors = vectorizer.fit_transform(df["full_composition"])
    end_time = time.time()
    with open(vectorizer_file, "wb") as f:
        pickle.dump(vectorizer, f)
    print(f"✅ TF-IDF training complete! Time taken: {end_time - start_time:.2f} seconds")

# Load or train PCA using Incremental PCA with progress tracking
if os.path.exists(pca_file):
    print("✅ Loading pre-trained PCA model...")
    with open(pca_file, "rb") as f:
        pca = pickle.load(f)
        reduced_vectors = pca.transform(composition_vectors.toarray())
else:
    print("⚡ Training PCA model (Estimated Time: ~5 minutes)...")
    start_time = time.time()
    pca = IncrementalPCA(n_components=100, batch_size=10000)

    num_batches = (composition_vectors.shape[0] // 10000) + 1
    reduced_vectors = []
    
    for i in tqdm(range(num_batches), desc="🛠 Processing PCA", unit="batch"):
        batch_start = i * 10000
        batch_end = min((i + 1) * 10000, composition_vectors.shape[0])
        batch = composition_vectors[batch_start:batch_end].toarray()
        reduced_vectors.append(pca.fit_transform(batch))

    reduced_vectors = np.vstack(reduced_vectors)
    end_time = time.time()
    
    with open(pca_file, "wb") as f:
        pickle.dump(pca, f)
    
    print(f"✅ PCA training complete! Time taken: {end_time - start_time:.2f} seconds")

# Build or load FAISS Index
d = reduced_vectors.shape[1]
if os.path.exists(faiss_index_file):
    print("✅ Loading FAISS index...")
    index = faiss.read_index(faiss_index_file)
else:
    print("⚡ Building FAISS index...")
    start_time = time.time()
    index = faiss.IndexFlatL2(d)
    index.add(reduced_vectors)
    faiss.write_index(index, faiss_index_file)
    end_time = time.time()
    print(f"✅ FAISS index built! Time taken: {end_time - start_time:.2f} seconds")

print("🎯 Setup complete! Ready for medicine recommendations.")

# def get_correct_name(user_input, df, top_n=5):
#     """Use RapidFuzz for fuzzy matching."""
#     best_matches = process.extract(user_input.lower(), df["name"], limit=top_n)
#     return best_matches[0][0] if best_matches else None
def get_correct_name(user_input, df, top_n=5, min_similarity=80):
    """Use RapidFuzz for fuzzy matching with a minimum similarity threshold."""
    best_match = process.extractOne(user_input.lower(), df["name"])
    
    if best_match and best_match[1] >= min_similarity:  # Check similarity score
        return best_match[0]
    else:
        return None  # Reject incorrect input

# def get_generic_alternatives(correct_name, df, index, k=5):
#     """Use FAISS for fast nearest neighbor search."""
#     if correct_name not in df["name"].values:
#         return "Medicine not found."
    
#     idx = df.index[df["name"] == correct_name].tolist()[0]
#     query_vector = reduced_vectors[idx].reshape(1, -1)
    
#     _, indices = index.search(query_vector, k+1)
#     alternative_indices = indices[0][1:]  # Exclude self match
    
#     return df["name"].iloc[alternative_indices].tolist()
# def get_generic_alternatives(correct_name, df, index, k=3):
#     """Use FAISS for fast nearest neighbor search and return top 3 alternatives with details."""
#     if correct_name not in df["name"].values:
#         return "Medicine not found."
    
#     idx = df.index[df["name"] == correct_name].tolist()[0]
#     query_vector = reduced_vectors[idx].reshape(1, -1)
    
#     _, indices = index.search(query_vector, k+1)  # Get nearest neighbors
#     alternative_indices = indices[0][1:k+1]  # Exclude the first one (itself)
    
#     alternatives = df.iloc[alternative_indices][["name", "manufacturer_name", "price", "short_composition1", "short_composition2", "full_composition"]]
    
#     return alternatives.to_dict(orient="records")  # Convert to list of dictionaries
def get_generic_alternatives(correct_name, df, index, k=3):
    """Retrieve top 3 alternatives with at least one common composition, sorted by lowest price."""
    if correct_name not in df["name"].values:
        return "Medicine not found."

    idx = df.index[df["name"] == correct_name].tolist()[0]
    query_vector = reduced_vectors[idx].reshape(1, -1)

    _, indices = index.search(query_vector, k+10)  # Fetch more results to filter later
    alternative_indices = indices[0][1:]  # Exclude the exact match

    # Fetch data
    selected_medicine = df.iloc[idx]
    selected_composition = set(selected_medicine["full_composition"].split())

    alternatives = df.iloc[alternative_indices][["name", "manufacturer_name", "price", "full_composition"]]

    # Drop rows with missing or zero price
    alternatives = alternatives.dropna(subset=["price"])
    alternatives = alternatives[alternatives["price"] > 0]

    # Filter alternatives that have at least one common composition
    def has_common_composition(row):
        alt_composition = set(row["full_composition"].split())
        return len(selected_composition & alt_composition) > 0  # Intersection check

    alternatives = alternatives[alternatives.apply(has_common_composition, axis=1)]

    # Sort by price (ascending) and return top k results
    alternatives = alternatives.sort_values(by="price").head(k)

    return alternatives.to_dict(orient="records")  # Convert to list of dictionaries




# Main function
def get_medicine_recommendations(user_input):
    correct_name = get_correct_name(user_input, df)
    if not correct_name:
        return "Could not find a close match. Please check the input."
    
    print(f"🔍 Selected: {correct_name}")
    alternatives = get_generic_alternatives(correct_name, df, index)
    return alternatives

# Example usage
user_input = input("Enter the medicine name: ")
recommendations = get_medicine_recommendations(user_input)
# print("💊 Generic Alternatives:", recommendations)
if isinstance(recommendations, list):
    print("💊 Top 3 Alternatives:")
    for i, alt in enumerate(recommendations, 1):
        print(f"{i}. {alt['name']} ({alt['manufacturer_name']}) - ₹{alt['price']}")
        print(f"   Composition: {alt['full_composition']}\n")
else:
    print(recommendations)  # Handles "Medicine not found" case


