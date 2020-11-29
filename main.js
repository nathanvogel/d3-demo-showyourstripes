// ECAL 2020 Tech Talk by Nathan Vogel.

// Data from:
// https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html
// The file annual-temperatures.txt is from:
// https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/time_series/HadCRUT.4.6.0.0.annual_ns_avg.txt

const url = "data/annual-temperatures.txt";
const width = 1000;
const height = 500;
const parseDateFromYear = d3.timeParse("%Y");
const addAYear = (date) => {
  const nextYear = new Date(date);
  nextYear.setFullYear(date.getFullYear() + 1);
  return nextYear;
};

const svg = d3
  .select(".main")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("overflow", "visible")
  .classed("svg-content", true);

const graph = svg.append("g").attr("id", "graph");

const main = async () => {
  const temperatures = await d3.csv(url);
  const dataset = temperatures.map((t) => {
    return {
      date: parseDateFromYear(t.year),
      temperature: parseFloat(t.temp),
    };
  });

  const tempMinMax = d3.extent(dataset, (d) => d.temperature);
  const dateMinMax = d3.extent(dataset, (d) => d.date);
  dateMinMax[1] = addAYear(dateMinMax[1]);
  const xScale = d3.scaleTime().rangeRound([0, width]).domain(dateMinMax);
  const yScale = d3
    .scaleLinear()
    .rangeRound([height, 0])
    .domain(tempMinMax)
    .nice();
  const colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([tempMinMax[1], tempMinMax[0]]);
  // @ts-ignore
  // const colorScale = d3.scaleLinear().range(["red", "blue"]);

  // const xaxis = d3.axisBottom(xScale);
  // // .ticks(
  // //   (xScale.domain()[1].getFullYear() - xScale.domain()[0].getFullYear()) / 4
  // // );
  // const yaxis = d3
  //   .axisLeft(yScale)
  //   .tickFormat((temperature) => `${temperature} °C`);
  // svg
  //   .append("g")
  //   .classed("axis", true)
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(xaxis);
  // // .selectAll("g")
  // // .select("text")
  // // .style("transform", "rotate(45deg) translate(1em, 1em)");
  // svg
  //   .append("g")
  //   .classed("axis", true)
  //   .attr("transform", `translate(0, 0)`)
  //   .call(yaxis);

  // /** @type{d3.Line<{temperature: number; date: Date;}>} */
  // const line = d3.line();

  // graph
  //   .append("path")
  //   .datum(dataset)
  //   .attr("fill", "none")
  //   .attr("stroke", "steelblue")
  //   .attr("stroke-width", 1)
  //   .attr(
  //     "d",
  //     line.x((d) => xScale(d.date)).y((d) => yScale(d.temperature))
  //   );

  const hoverinfoRect = svg
    .append("rect")
    .attr("id", "hoverinfo")
    .attr("height", height)
    .attr("width", 0)
    .attr("transform", "translate(0)")
    .style("pointer-events", "none");
  const hoverinfoText = svg
    .append("text")
    .attr("fill", "black")
    .attr("height", height)
    .attr("width", 50)
    .attr("transform", `translate(0, ${height - 16}) rotate(-90)`)
    .style("pointer-events", "none")
    .style("font-weight", "400")
    .style("color", "black")
    .style("font-size", "17px");

  graph.on("mouseout", (e) => {
    hoverinfoRect
      .transition()
      .duration(100)
      .ease(d3.easeQuadOut)
      .attr("width", 0);
    hoverinfoText.html("");
  });

  graph
    .selectAll("rect")
    .data(dataset)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("height", height)
          .attr("width", (d) => xScale(addAYear(d.date)) - xScale(d.date)) // round to pixels, unlike  width / dataset.length
          .attr("fill", (d) => colorScale(d.temperature))
          .attr("transform", (d, i) => `translate(${xScale(d.date)})`)
          .on("mouseover", (_event, d) => {
            hoverinfoRect
              .transition()
              .duration(100)
              .ease(d3.easeQuadOut)
              .attr("transform", `translate(${xScale(d.date) - 25})`)
              .attr("width", 50)
              .attr("fill", colorScale(d.temperature));
            hoverinfoText
              .html(
                d.date.getFullYear() +
                  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                  d.temperature.toFixed(2) +
                  " °C"
              )
              .transition()
              .duration(100)
              .ease(d3.easeQuadOut)
              .attr(
                "transform",
                `translate(${xScale(d.date) + 5}, ${height - 16}) rotate(-90)`
              );
          }),
      (update) => undefined,
      (remove) => remove.remove()
    );
};

main();
