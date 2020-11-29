// ECAL 2020 Tech Talk by Nathan Vogel.

// d3 has a bunch of shortcuts to modify the HTML DOM.
// d3.select("body").style("background-color", "blue");
// d3.select("p").style("color", "white");

// https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/time_series/HadCRUT.4.6.0.0.annual_ns_avg.txt

const url = "data/annual-temperatures.txt";
const width = 1000;
const height = 500;
const parseDateFromYear = d3.timeParse("%Y");

const svg = d3
  .select(".main")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("overflow", "visible")
  .classed("svg-content", true);

const graph = svg.append("g").attr("id", "graph");

async function main() {
  const temperatures = await d3.csv(url);
  const dataset = temperatures.map((t) => {
    return {
      date: parseDateFromYear(t.year),
      temperature: parseFloat(t.temp),
    };
  });

  console.log(dataset);

  const xScale = d3.scaleTime().rangeRound([0, width]);
  const yScale = d3.scaleLinear().rangeRound([height, 0]);
  xScale.domain(d3.extent(dataset, (d) => d.date));
  yScale.domain(d3.extent(dataset, (d) => d.temperature));
  const yaxis = d3
    .axisLeft(yScale)
    .tickFormat((temperature) => `${temperature} °C`);
  const xaxis = d3.axisBottom(xScale);
  // .ticks(
  //   (xScale.domain()[1].getFullYear() - xScale.domain()[0].getFullYear()) / 4
  // );
  svg
    .append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(xaxis);
  // .selectAll("g")
  // .select("text")
  // .style("transform", "rotate(45deg) translate(1em, 1em)");
  svg
    .append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(yaxis);

  /** @type{d3.Line<{temperature: number; date: Date;}>} */
  const line = d3.line();

  graph
    .append("path")
    .datum(dataset)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr(
      "d",
      line.x((d) => xScale(d.date)).y((d) => yScale(d.temperature))
    );

  // const updateWithData = (data) => {
  // let myNodes = d3
  //   .select(".main")
  //   .select("svg")
  //   .selectAll("rect")
  //   .data(data)
  //   .join(
  //     (enter) =>
  //       enter
  //         .append("p")
  //         .text((datum, index) => index + ": " + JSON.stringify(datum))
  //         .style("font-size", (d) => (d.year - 1849) / 2),
  //     (update) => undefined,
  //     // .text((datum, index) => index + ": " + JSON.stringify(datum))
  //     // .style("font-size", (d) => d.year / 100),
  //     (remove) => remove.remove()
  //   );
  // };

  // let currentIndex = 0;
  // document.getElementById("removeButton").addEventListener("click", () => {
  //   // const currentData = myNodes.data();
  //   // console.log("Current:", currentData);
  //   // myNodes.merge(currentData.slice(10, currentData.length));
  //   currentIndex += 10;
  //   updateWithData(temperatures.slice(currentIndex, temperatures.length));
  // });

  // updateWithData(temperatures);
}

main();
