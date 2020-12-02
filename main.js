const width = 700;
const height = 380;

// Tiny helper functions
const getDateFromYear = d3.timeParse("%Y");
const addYears = (date, yearsToAdd) => {
  const nextYear = new Date(date);
  nextYear.setFullYear(date.getFullYear() + yearsToAdd);
  return nextYear;
};

// Create the main SVG element
const svg = d3
  .select(".main")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("overflow", "visible");

// Just a container for our visual graph.
const graph = svg.append("g").classed("graph", true);

// Wrap the main code in an async function
// so that we can 'await' the CSV data loading.
const main = async () => {
  // Here we load the CSV file with D3, but we could use any library
  // to do it or use any JS array as data.
  const temperatures = await d3.csv("data.txt");
  // Convert the year and temperature strings to a Date object and a number.
  const dataset = temperatures.map((row) => {
    return {
      date: getDateFromYear(row.year),
      temperature: parseFloat(row.temperature),
    };
  });

  // Ask D3 to figure out the extent (min/max) of our data.
  const dateMinMax = d3.extent(dataset, (d) => d.date);
  // Modify max to also fit-in the width of the last year.
  dateMinMax[1] = addYears(dateMinMax[1], 1);
  const tempMinMax = d3.extent(dataset, (d) => d.temperature);
  // D3 scales are functions that take an input in the "native" data format
  // (like a Date, a number, anything) and return the corresponding plotted value.
  // This value is typically a numeric coordinate on an axis.
  // So xScale is a little function that goes
  // - from  [1850, 2020] as Date object inputs
  // - to    [0, 700] as number outputs.
  // We use rangeRound() instead of range() so that d3 takes care of
  // aligning anything (axis 'ticks', our rects, etc.) pixel-perfectly.
  const xScale = d3.scaleTime().domain(dateMinMax).rangeRound([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain(tempMinMax)
    .rangeRound([height, 0])
    .nice();
  // But we can also have scales that return colors instead of numbers!
  // const colorScale = d3.scaleLinear().domain(tempMinMax).range(["blue", "red"]);
  // Especially with this plugin: https://github.com/d3/d3-scale-chromatic
  const colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain(tempMinMax.reverse());

  // Our little hover box + text, we initialize them with a width of zero
  // and empty text so that they don't show up, but can smoothly be
  // animated in.
  const hoverinfoRect = svg
    .append("rect")
    .attr("id", "hoverinfoRect")
    .style("pointer-events", "none")
    .attr("width", 0)
    .attr("height", height)
    .attr("transform", "translate(0)")
    .attr("fill", "white");
  const hoverinfoText = svg
    .append("text")
    .attr("id", "hoverinfoText")
    .style("pointer-events", "none")
    .attr("height", height)
    .attr("transform", `translate(0, ${height - 16}) rotate(-90)`)
    .attr("fill", "black");

  graph
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    // We use this year difference trick to let rangeRound() decide which
    // rect should be rounded to 1px more, or 1px less.
    // This way, everything is super sharp and there are no blurry pixels.
    // Note: if we set the width of the dataviz to a multiple of our dataset length
    // (170 years, so 680px or 850px), this is not needed.
    .attr("width", (d) => xScale(addYears(d.date, 1)) - xScale(d.date))
    .attr("height", height)
    .attr("fill", (d) => colorScale(d.temperature))
    .attr("transform", (d) => `translate(${xScale(d.date)})`)
    .on("mouseover", (event, d) => {
      hoverinfoRect
        .transition()
        .ease(d3.easeQuadOut)
        .duration(100)
        .attr("fill", colorScale(d.temperature))
        .attr("width", 50)
        .attr("transform", `translate(${xScale(d.date) - 25})`);
      hoverinfoText
        .html(
          d.date.getFullYear() +
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            d.temperature.toFixed(2) +
            " °C"
        )
        .transition()
        .ease(d3.easeQuadOut)
        .duration(100)
        .attr(
          "transform",
          `translate(${xScale(d.date) + 5}, ${height - 16}) rotate(-90)`
        );
    });

  // We want to make our hover tooltip thingy to disappear when
  // the mouse moves out of the graph
  graph.on("mouseout", () => {
    hoverinfoText.text("");
    hoverinfoRect
      .transition()
      .ease(d3.easeQuadOut)
      .duration(100)
      .attr("width", 0);
  });

  // D3 includes functions such as axisBottom() that can generate axis legends
  // with so called 'ticks' etc. and can be configured.
  // const xAxis = d3.axisBottom(xScale);
  // const yAxis = d3
  //   .axisLeft(yScale)
  //   .tickFormat((temperature) => `${temperature} °C`);
  // svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
  // svg.append("g").call(yAxis);

  // D3 include the line() helper to generate SVG lines, which are just strings
  // of text instructions that can be given to the "d" attribute of <path> elements.
  // We just need this little comment to tell VSCode what the line function
  // expect as data.
  // /** @type{d3.Line<{temperature: number; date: Date;}>} */
  // const line = d3.line();
  // line.x((d) => xScale(d.date)).y((d) => yScale(d.temperature));
  // // Here we give the entire dataset as a "datapoint" because <path>
  // // is just one object that has a long and complicated attribute.
  // svg
  //   .append("path")
  //   .datum(dataset)
  //   .attr("d", line)
  //   .attr("fill", "none")
  //   .attr("stroke", "steelblue");
};

main();
