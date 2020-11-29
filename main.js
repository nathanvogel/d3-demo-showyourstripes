const width = 700;
const height = 380;
const getDateFromYear = d3.timeParse("%Y");
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
  .style("overflow", "visible");

const graph = svg.append("g").classed("graph", true);

const main = async () => {
  const temperatures = await d3.csv("data.txt");
  const dataset = temperatures.map((row) => {
    return {
      date: getDateFromYear(row.year),
      temperature: parseFloat(row.temperature),
    };
  });

  const dateMinMax = d3.extent(dataset, (d) => d.date);
  const tempMinMax = d3.extent(dataset, (d) => d.temperature);
  const xScale = d3.scaleTime().domain(dateMinMax).rangeRound([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain(tempMinMax)
    .rangeRound([height, 0])
    .nice();
  // const colorScale = d3.scaleLinear().domain(tempMinMax).range(["blue", "red"]);
  const colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain(tempMinMax.reverse());

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

  graph.on("mouseout", () => {
    hoverinfoText.text("");
    hoverinfoRect
      .transition()
      .ease(d3.easeQuadOut)
      .duration(100)
      .attr("width", 0);
  });

  graph
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("width", (d) => xScale(addAYear(d.date)) - xScale(d.date))
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

  // const xAxis = d3.axisBottom(xScale);
  // const yAxis = d3
  //   .axisLeft(yScale)
  //   .tickFormat((temperature) => `${temperature} °C`);
  // svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
  // svg.append("g").call(yAxis);

  // /** @type{d3.Line<{temperature: number; date: Date;}>} */
  // const line = d3.line();
  // line.x((d) => xScale(d.date)).y((d) => yScale(d.temperature));
  // svg
  //   .append("path")
  //   .datum(dataset)
  //   .attr("d", line)
  //   .attr("fill", "none")
  //   .attr("stroke", "steelblue");
};

main();
