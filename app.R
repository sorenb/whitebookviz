library(whitebookviz)
library(shiny)
library(RPostgreSQL)

source("~/.postpass")

drv <- dbDriver("PostgreSQL")

# connection parameters must be given in the ~/.postpass file
con <- dbConnect(drv, 
                 dbname = dbname,
                 host = host,
                 port = port,
                 user = user, 
                 password = password)

data <- dbGetQuery(con, "select * from datamart.whitebook_test_1 where substr(date::text,1,4) in ('2018','2017','2016','2015','2014');")

dbDisconnect(con)
dbUnloadDriver(drv)


ui = shinyUI(fluidPage(
  samedate_barchartOutput('whity')
))


server = function(input, output) {
  
  curDate <- "2018-04-30" # the matching date you want data from, across all the years on the x-axis
  sortx <- "desc"         # controls direction of the sorting of the years on the x-axis
  frontColors <- c('#aeb051', '#468c8c', '#3b364a','#c03953','#1d72aa') # this vector turns into a javascript array
  backColor <- "Gainsboro"
  vizWidth <- ""
  labelx <- "År"
  labely <- "Antal"
  tickNumY <- 7
  showScaleY <- "false"
  fontSizeX <- ""
  fontSizeY <- ""
  barWidth <- 0.8    # This is a percentage. 1 means no gap between bars (i.e. 100%)
  barsOffset <- 10
  
  output$whity <- renderSamedate_barchart({
    samedate_barchart(data,curDate,sortx,frontColors,backColor,labelx,labely,tickNumY,showScaleY,barWidth,barsOffset)
  })
}

shinyApp(ui = ui, server = server)
