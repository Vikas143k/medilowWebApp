import requests
response = requests.get("http://127.0.0.1:5000/search", params={"name": "zuspaz"})
print(response.json())  # Should print the alternative medicines
