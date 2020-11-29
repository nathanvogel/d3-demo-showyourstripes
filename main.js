const width = 700;
const height = 380;
const dataUrl = "data.txt";
const getDateFromYear = d3.timeParse("%Y");

const svg = d3
  .select(".main")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("overflow", "visible");

const main = async () => {
  const temperatures = await d3.csv(dataUrl);
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

  const xaxis = d3.axisBottom(xScale);
  const yaxis = d3
    .axisLeft(yScale)
    .tickFormat((temperature) => `${temperature} °C`);
  svg
    .append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(xaxis);
  svg
    .append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(yaxis);

  /** @type{d3.Line<{temperature: number; date: Date;}>} */
  const line = d3.line();
  line.x((d) => xScale(d.date)).y((d) => yScale(d.temperature));

  svg
    .append("path")
    .datum(dataset)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue");
};

main();
