# Clear memory
rm(list=ls())

# Set directory
setwd("/Users/estherkim/Desktop/FARS2015NationalCSV")

# Load packages
library(psych)
library(dplyr)
library(pastecs)
library(gmodels)
library(tidyr)
library(data.table)
library(bit64)
library(plyr)
library(magrittr)
library(tm)
library(foreign)
library(ggplot2)
library(MASS)
library(Hmisc)
library(reshape2)
library(leaflet)
library(maps)
library(RCurl)
library(htmltools)
library(jasonlite)
library(htmlwidgets)


# Import Stata dataset
mydata <- read.dta("predicted_updated.dta")
mydata <- subset(mydata, a_region==3) # Subset only the MD/DE/WV/DC area
mydata$mildscore <- round(mydata$mild100, 0) # Round
mydata$modscore <- round(mydata$mod100, 0) # Round
mydata$sevscore <- round(mydata$sev100, 0) # Round
mydata$meanscore <- round(mydata$meanscore, 0) # Round
mydata$meanscore_mod <- round(mydata$meanscore_mod, 0) # Round
mydata$meanscore_sev <- round(mydata$meanscore_mod, 0) # Round

# Leaflet
mapStates = map("state", fill = TRUE, plot = FALSE)
geodata <- readLines(textConnection(getURL("https://sickhacks.s3-us-west-2.amazonaws.com/maryland-zips-single.geojson"))) %>% paste(collapse = "\n")

crash.zip <- leaflet(data = mapStates) %>% 
  addProviderTiles("CartoDB.Positron") %>%
  addGeoJSON(geodata, weight = 0.5, color = "#444444", fill = TRUE, fillOpacity = 0.5) %>%
  setView(lng = -76.881929, lat = 38.91535, zoom = 9) %>%
  addPolygons(fillColor = topo.colors(10, alpha = NULL), stroke = FALSE) %>%
  addCircleMarkers(data = mydata, lng=~longitud, lat=~latitude,radius = 4,
                   popup = paste(
                                "<b>Number of accident(s):", mydata$total, "</b></br>",
                                "<b>Probability of severe accident:", mydata$quartiles_mod, "</b></br>"),
                   options = popupOptions(closeOnClick = TRUE, closeButton = TRUE))
crash.zip



