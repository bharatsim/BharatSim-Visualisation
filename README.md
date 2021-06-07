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

1. Prerequisites
    - Docker
      https://www.docker.com/products/docker-desktop
    - NodeJs version >= 14.15.0 https://nodejs.org/en/download/
2. Code setup
    1. Clone the repository
       `https://github.com/debayanLab/BharatSim-Visualisation`
    2. Run the code `docker-compose up`

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
