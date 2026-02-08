# Adaptive Learning Application

For the EPICS (Engineering Project in Community Service) we are aiming to create an application that teaches students math and english concepts via quizes.  
Below is the instruction to set up our project.


## Setting up the model API

Navigate to the `model_api` folder  

In the model API section create a Python Virtual Environment using
```
python -m venv model_env
```

After creating the environment start it by running the activation script. This step differs based on your OS.  
  
For Window:  
```
model_env\Scripts\Activate.ps1
```

For Mac/Linux
```
source model_env/bin/activate
```

Install all the applications in `requirements.txt`  
```
pip install -r requirements.txt
```

Finally run the `predict_level.py` file. This will start the development server.  

## Setting up the Typescript API (for auth, database connection etc)

Installed the packages in `package.json`
```
npm i
```

In the `api` directory, create a `.env` file with the values
```
PORT=number
DATABASE_URL="database_url"
PASSWORD_SALT=12
JWT_SECRET="256 bits string"
```

To start the development server
```
npm run start
```

To compile the Typescript file (production)
```
npm run build
```

To run production version
```
npm run start
```
