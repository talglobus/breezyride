# Clear memory
##########################
rm(list=ls())

# Set directory
##########################
setwd("~/Documents/breezyride/dataPredict/")

# Load packages
##########################

library(foreign)
library(dplyr)
library(magrittr)
library(leaflet)
library(maps)
library(htmltools)
library(jsonlite)
library(htmlwidgets)
library(rgdal)

# Import Stata dataset
##########################
mydata <- read.dta("predicted_updated.dta")
mydata <- subset(mydata, a_region==3) # Subset only the MD/DE/WV/DC area
mydata$mildscore <- round(mydata$mild100, 0) # Round
mydata$modscore <- round(mydata$mod100, 0) # Round
mydata$sevscore <- round(mydata$sev100, 0) # Round
mydata$meanscore <- round(mydata$meanscore, 0) # Round
mydata$meanscore_mod <- round(mydata$meanscore_mod, 0) # Round
mydata$meanscore_sev <- round(mydata$meanscore_mod, 0) # Round

mydata$g_postcode <- as.numeric(as.character(mydata$g_postcode))
mydata$g_postcode1 <- as.numeric(as.character(mydata$g_postcode1))

mydata$g_postcode[is.na(mydata$g_postcode)] <- 0
mydata$g_postcode1[is.na(mydata$g_postcode1)] <- 0

newdata <- mydata[(mydata$g_postcode >= 20000 & mydata$g_postcode < 30000) | 
          (mydata$g_postcode1 >= 20000 & mydata$g_postcode1 < 30000),]

newdata$total[is.na(newdata$total)] <- 0

# newdata Risk Level
##########################
newdata$risk[newdata$total == 0] <- "Very Low"
newdata$risk[newdata$total >= 1 & newdata$total <=2] <- "Low"
newdata$risk[newdata$total >= 3 & newdata$total <=4] <- "Moderate"
newdata$risk[newdata$total >= 5 & newdata$total <=6] <- "High"
newdata$risk[newdata$total >= 7] <- "Very High"

# Gather Zip Code data from geoJSON
##########################

geojson <- readLines("maryland-zips-single.geojson", warn = FALSE) %>% 
  paste(collapse = "\n") %>%
  fromJSON(simplifyVector =FALSE)

zip <- sapply(geojson$features, function(feat){feat$properties$name})
zip <- as.numeric(as.character(zip))

eligZip <- data.frame(zip)

# merge(geoJSON and Risk)
##########################

trafficRisk <- eligZip %>% left_join(newdata, by = c("zip" = "g_postcode"))
var <- c("zip", "quartiles_mod", "longitud", "latitude", "total", "risk")
trafficRisk <- trafficRisk[,var]

levels(trafficRisk$quartiles_mod) = c("Very Low", "Low", "Moderate", "High", "Very High")
trafficRisk$quartiles_mod[is.na(trafficRisk$quartiles_mod)] <- "Very Low"

levels(trafficRisk$risk) = c("Very Low", "Low", "Moderate", "High", "Very High")
trafficRisk$risk[is.na(trafficRisk$risk)] <- "Very Low"

# Clean up ZipCode File
##########################

library(zipcode)
data(zipcode)
zipcode$zip <- as.numeric(as.character(zipcode$zip))

trafficRisk1 <- trafficRisk %>% select(-longitud, -latitude)

allZip <- zipcode %>% 
              left_join(trafficRisk1, by = c("zip")) %>%
              filter(zip != 0 & state == "MD")
                    
allZip$total[is.na(allZip$total)] <- 0
allZip$risk[is.na(allZip$risk)] <- "Very Low"

# Leaflet - All Zip Codes
##########################
# mapStates = map("state", fill = TRUE, plot = FALSE)

var <- c("longitude", "latitude")
uniZip <- allZip[!duplicated(allZip[,var]),]

allZipCodes <- leaflet() %>% 
  setView(lng = -76.631929, lat = 39.32535, zoom = 11) %>%
  addProviderTiles("CartoDB.Positron") %>%
  addGeoJSON(geojson, weight = 1, color = "#444444", fillOpacity = 0.1) %>%
  addCircleMarkers(data = uniZip, lng=~longitude, lat=~latitude, 
                   radius = 3, fillOpacity = uniZip$total, color = "green",
                   popup = paste(
                     "<b>Zipcode:</b>", uniZip$zip, "</br>",
                     "<b>Number of accident(s):</b>", uniZip$total, "</br>",
                     "<b>Probability of accident:</b>", uniZip$risk, "</br>"),
                   options = popupOptions(closeOnClick = TRUE, closeButton = TRUE)) %>%
  addCircles(data = newdata, lng=~longitud, lat=~latitude,
                   radius = 2, fillOpacity = newdata$quartiles_mod, color = "red")
  
allZipCodes

# Leaflet - Crash Zip Codes Predicting Severity
#################################################
# mapStates = map("state", fill = TRUE, plot = FALSE)

crash.zip <- leaflet() %>% 
  setView(lng = -76.631929, lat = 39.32535, zoom = 11) %>%
  addProviderTiles("CartoDB.Positron") %>%
  addGeoJSON(geojson, weight = 0.5, color = "#444444", fillOpacity = 0.1) %>%
  addCircleMarkers(data = newdata, lng=~longitud, lat=~latitude, radius = 4,
                   popup = paste(
                     "<b>Zipcode:</b>", newdata$zip, "</br>",
                     "<b>Number of accident(s):</b>", newdata$total, "</br>",
                     "<b>Probability of severe accident:</b>", newdata$quartiles_mod, "</br>"),
                   options = popupOptions(closeOnClick = TRUE, closeButton = TRUE))

crash.zip