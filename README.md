# BharatSim Visualization

The BharatSim visualization engine was designed to accept the output of models created using the [simulation engine](https://github.com/bharatsim/BharatSim) and visualise them by creating dashboards with different graphs and charts. However, this tool can also be used independently to visualise any type of CSV data. The visualisation tool allows users analyse their data with a variety of different graphs, including line graphs, bar graphs, and histograms. Along with these basic graphs, the tool also allows for studying spatio-temporal data by accepting Geographic Information System (GIS) data in a `geoJSON` format. This geographical data can be used to plot choropleths and heatmaps to show spatial and temporal variation.

## Visualization engine provides various abilities such as :

1. **Data Import:**  Data (for example, Simulation Engine output) can be imported in CSV format
2. **Data Management:** The data files can be added, edited, and deleted from within the visualisation tool.
3. **Project & Dashboard management:** Different projects can be added, edited, and deleted, along with dashboards in each project.
4. **Plotting charts and widgets:** including line and bar charts and histograms
5. **Plotting geographical maps:** Heatmaps and Choropleths can be plotted, and variation across time can be visualised
6. **Autosave:** All dashboards are automatically saved to prevent data loss.
7. **Widget management and configuration:** All widgets can be managed and configured by the user.
8. **Export:** Graphs and charts created can be exported either as a raster (`PNG`) or vector (`SVG`) image.

## Setup Requirements and Installation

### Prerequisites
  - [Docker](https://www.docker.com/products/docker-desktop): an open platform for developing, shipping, and running applications.
    <br/>Docker resources required: Memory >= 8 GB
  - [Node.js](https://nodejs.org/en/download/) version >= 14.15.0

### Setup and installation

  1. Clone the repository: `git clone https://github.com/bharatsim/BharatSim-Visualisation`
  2. Setup `.env` file \
     Change the values below depending on your preferences <br/>
     After changing the username and password, delete the `data` folder

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

  3. Run `yarn install`
  4. Run `yarn deep-clean` to cleanup `node_modules`, cache, and unused files and folders
  5. Run `docker-compose up`
  6. Access the application at `http://localhost:3005/` or `http://127.0.0.1:3005/`

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

## Development setup with Docker [Hot-Reload]

### Prerequisites
  - [Docker](https://www.docker.com/products/docker-desktop)
    <br/> Docker resources required: Memory >= 8 GB
  - [Node.js](https://nodejs.org/en/download/) version >= 14.15.0

### Setup and installation

  1. Clone the repository: `https://github.com/bharatsim/BharatSim-Visualisation`
  2. Setup `.env` file \
     We use the same `.env` file for both production and development setup with docker <br/>
     Change the values below depending on your preferences <br/>
     After changing the username and password, delete the `dev-data` folder

     ```
      DB_USER=bharatsim_user
      DB_PASS=password
      DB_PORT=27017
      DB_HOST=mongodb
      MONGO_INITDB_ROOT_USERNAME=root
      MONGO_INITDB_ROOT_PASSWORD=password
      APP_PORT=3005

     ```

  3. Run `yarn install`
  4. Run `yarn deep-clean` to cleanup `node_modules`, cache, and unused files and folders
  5. Run `docker-compose -f docker-compose.dev.yml up`
  6. Access the application at `http://localhost:3005/` or `http://127.0.0.1:3005/`

## Development setup without Docker [Hot-Reload]

### Prerequisites
  - [MongoDB](https://docs.mongodb.com/manual/administration/install-community/): version >= 4
  - [Node.js](https://nodejs.org/en/download/) version >= 14.15.0 

### Step to start application
  1. Clone the repository
     `https://github.com/bharatsim/BharatSim-Visualisation`
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
     Change the values below depending on your preferences <br/>
     ```
      DB_USER=bharatsim_user
      DB_PASS=password
      DB_PORT=27017
      DB_HOST=localhost
      MONGO_INITDB_ROOT_USERNAME=root
      MONGO_INITDB_ROOT_PASSWORD=password
      APP_PORT=3005
     ```
  4. Install node modules for root using `yarn install`
  5. Install node modules for a frontend and backend using `yarn install-deps`
  6. - If you want a single terminal window: use `yarn dev`
     - Alternatively, for separate windows for the frontend and backend, use
         - Frontend: `yarn dev-frontend`
         - Backend: `yarn dev-backend`

## License

[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg

