White book visualizations in D3.js
==================================

Contents:
---------
- samedate_barchart.js: Barchart with offset bars for comparing several years and the same date across several years.

Install on a R/Shiny-server:
----------------------------
sudo su - -c "R -e \"devtools::install_github(\"sorenb/whitebookviz\")\""

Install locally for e.g. RStudio:
---------------------------------
devtools::install_github("sorenb/whitebookviz")



Samedate Barchart
-----------------

### Configuration parameters with examples:
(These would be set in an R file e.g. app.R in a Shiny app, cf. the example app.R)

  curDate <- "2018-04-30"      # The matching date you want data from, across the years. Date format kan contain hours etc.  
  sortx <- "desc"              # Controls direction of the sorting of the years on the x-axis  

  frontColors <- c('#aeb051','#468c8c','#3b364a','#c03953','#1d72aa')

			       # This vector contains the colors in the specified order of the foreground bars. 
                               # The colors will start over, if you have more bars than colors.  
                               # You can use color names, rgb or hex values.    

  backColor <- "Gainsboro"     # The color of the background bars.  
  vizWidth <- ""  
  labelx <- "År"  
  labely <- "Antal"  
  tickNumY <- 7  
  showScaleY <- "false"        # Show or hide the Y-axis. "true" or "false" must be lowercase strings, not R booleans.  
  fontSizeX <- ""  
  fontSizeY <- ""  
  barWidth <- 0.8              # This is a percentage. 1 (i.e. 100%) means no gap between bars.  
  barsOffset <- 10             # This is the offset between the bars in the foreground and the bars in the background.  

