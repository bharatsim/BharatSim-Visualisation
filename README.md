# BharatSim Visualization

Visualization engine/tool would accept Simulation engine output or any csv data file and would help users to visualize it by means of creating different graphs and charts.

## Visualization engine/tool provides various abilities such as :

1. Data Import Ex. Simulation Engine output in CSV format
2. Data file Management Ex. Add, edit, delete
3. Plot Widgets Ex. Line, Bar charts, Histogram
4. Geo map Ex. Heatmap and Choropleth
5. Project & Dashboard Management
6. Auto Save for Dashboard
7. Widget management & Configuration
8. Export Widget (PNG)

## Setup Requirements and Installation

-  Prerequisites
    - Docker
      https://www.docker.com/products/docker-desktop 
      <br/>  Docker Resources - Memory >= 8 GB
    - NodeJs version >= 14.15.0 https://nodejs.org/en/download/
-  Code setup
    1. Clone the repository
       `https://github.com/debayanLab/BharatSim-Visualisation`
    2. Setup `.env` file \
       Change below values as per convenience <br/>
       After changing username and password, delete data folder
       ```
        DB_USER=bharatsim_user
        DB_PASS=password
        DB_PORT=27017
        #  for development only
        #DB_HOST=localhost
        DB_HOST=mongodb
        MONGO_INITDB_ROOT_USERNAME=root
        MONGO_INITDB_ROOT_PASSWORD=password
        APP_PORT=3005
               
       ```
       
    3. Run the code `docker-compose up`
    4. Access application on `http://localhost:3005/` or `http://127.0.0.1:3005/`

## Tech stack

    - Frontend
        ReactJs
        Jest
        React Testing Library
    - Chart and Map
        PlotlyJs
        Leaflet
    - Backend
        Express.Js
        Jest
        Mongoose
    - Database
        File System
        MongoDb
