# BharatSim Visualization

Visualization engine/tool would accept Simulation engine output or any csv data file and would help users to visualize it by means of creating different graphs and charts.The tool allows user to visualize data using Line chart, bar chart and histogram. Along with these basic charts, the tool supports GIS data in the geoJson format and can plot heat map and choropleth. Further more, user can visualize these heat maps and choropleths across time dimension.

## Visualization engine/tool provides various abilities such as :

1. Data Import Ex. Simulation Engine output in CSV format
2. Data file Management Ex. Add, edit, delete
3. Plot charts/widgets Ex. Line, Bar charts, Histogram
4. Plot geo map Ex. Heatmap and Choropleth
5. Project & Dashboard management Ex. Add, edit, delete
6. Auto-Save action for Dashboards
7. Widget management & it's configuration
8. Export widget (PNG, SVG)

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
       After changing username and password, delete `data` folder
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

## Development setup with docker [Hot-Reload]
-  Prerequisites
    - Docker
      https://www.docker.com/products/docker-desktop
      <br/>  Docker Resources - Memory >= 8 GB
    - NodeJs version >= 14.15.0 https://nodejs.org/en/download/
-  Step to start application
    1. Clone the repository
       `https://github.com/debayanLab/BharatSim-Visualisation`
    2. Setup `.env` file \
       we are using same `.env` file production and development setup with docker <br/>
       Change below values as per convenience <br/>
       After changing username and password, delete `dev-data` folder
       ```
        DB_USER=bharatsim_user
        DB_PASS=password
        DB_PORT=27017
        DB_HOST=mongodb
        MONGO_INITDB_ROOT_USERNAME=root
        MONGO_INITDB_ROOT_PASSWORD=password
        APP_PORT=3005
               
       ```
    3. Run the code `docker-compose -f docker-compose.dev.yml up`
    4. Access application on `http://localhost:3005/` or `http://127.0.0.1:3005/`

## Development setup without docker [Hot-Reload]
-  Prerequisites
    - MongoDb version >= 4
      <br>https://docs.mongodb.com/manual/administration/install-community/
    - NodeJs version >= 14.15.0 https://nodejs.org/en/download/
-  Step to start application
    1. Clone the repository
       `https://github.com/debayanLab/BharatSim-Visualisation`
    2. Start mongo service and check mongodb has root user, if not create one.
       ```
       use admin
       db.createUser(
        {
            user: "root",
            pwd: "password",
            roles: [ "root" ]
        })
       ```
    3. Setup `dev.env` file \
       Change below values as per convenience <br/>
       ```
        DB_USER=bharatsim_user
        DB_PASS=password
        DB_PORT=27017
        DB_HOST=localhost
        MONGO_INITDB_ROOT_USERNAME=root
        MONGO_INITDB_ROOT_PASSWORD=password
        APP_PORT=3005
       ```
    4. Install node modules for root `yarn install`
    5. Install node modules for a frontend and backend `yarn install-deps`  
    6. For single terminal window
        `yarn dev`
       <br/> OR <br/>
       For separate window of frontend and backend<br>
       Frontend - `yarn dev-frontend` <br/>
       Backend - `yarn dev-backend`
       

    
