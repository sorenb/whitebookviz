#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export

samedate_barchart <- function(data, 
                              curDate, 
                              sortx, 
                              frontColors, 
                              backColor = "Gainsboro", 
                              labelx = NULL, 
                              labely = NULL, 
                              tickNumY, 
                              showScaleY, 
                              barWidth,
                              barsOffset,
                              width = NULL, 
                              height = NULL, 
                              elementId = NULL)
{
  # forward options using x
  opts = list(
    data = data,
    curDate = curDate,
    sortx = sortx,
    frontColors = frontColors,
    backColor = backColor,
    labelx = labelx,
    labely = labely,
    tickNumY = tickNumY,
    showScaleY = showScaleY,
    barWidth = barWidth,
    barsOffset = barsOffset
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'samedate_barchart',
    opts,
    width = width,
    height = height,
    package = 'whitebookviz',
    elementId = elementId
  )
}

#' Shiny bindings for samedate_barchart
#'
#' Output and render functions for using samedate_barchart within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a samedate_barchart
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name samedate_barchart-shiny
#'
#' @export
samedate_barchartOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'samedate_barchart', width, height, package = 'whitebookviz')
}

#' @rdname samedate_barchart-shiny
#' @export
renderSamedate_barchart <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, samedate_barchartOutput, env, quoted = TRUE)
}

