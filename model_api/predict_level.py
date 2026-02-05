import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

model = joblib.load("model.pkl")

# correctness = np.array([1, 1, 1, 1, 0])
# time_taken = np.array([8, 10, 9, 11, 12])
# attempts = np.array([1, 1, 1, 1, 2])
    
# features = np.array([[
#         np.sum(correctness),
#         np.mean(time_taken),  
#         np.mean(attempts),     
#     ]])

# print(model.predict(features))

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    correctness = np.array(data['correctness'])
    time_taken = np.array(data['time_taken'])
    attempts = np.array(data['attempts'])
    features = np.array([[
        np.sum(correctness),
        np.mean(time_taken),  
        np.mean(attempts),     
    ]])
    res = model.predict(features)
    return jsonify({"Message": "Success", "IsReady" : int(res[0])}) , 201

if __name__ == '__main__':
    app.run(debug=True)
