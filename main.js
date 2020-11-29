// ECAL 2020 Tech Talk by Nathan Vogel.

// d3 has a bunch of shortcuts to modify the HTML DOM.
// d3.select("body").style("background-color", "blue");
// d3.select("p").style("color", "white");

// https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/time_series/HadCRUT.4.6.0.0.annual_ns_avg.txt

const url = "data/annual-temperatures.txt";

async function main() {
  const temperatures = await d3.csv(url);
  temperatures.forEach((t) => {
    console.log(t);
    t.year = parseInt(t.year);
    t.temp = parseFloat(t.temp);
  });

  console.log(temperatures);
  // temperatures = [ { }]

  const updateWithData = (data) => {
    let myNodes = d3
      .select(".main")
      .selectAll("p")
      .data(data)
      .join(
        (enter) =>
          enter
            .append("p")
            .text((datum, index) => index + ": " + JSON.stringify(datum))
            .style("font-size", (d) => (d.year - 1849) / 2),
        (update) => undefined,
        // .text((datum, index) => index + ": " + JSON.stringify(datum))
        // .style("font-size", (d) => d.year / 100),
        (remove) => remove.remove()
      );
  };

  // let currentIndex = 0;
  // document.getElementById("removeButton").addEventListener("click", () => {
  //   // const currentData = myNodes.data();
  //   // console.log("Current:", currentData);
  //   // myNodes.merge(currentData.slice(10, currentData.length));
  //   currentIndex += 10;
  //   updateWithData(temperatures.slice(currentIndex, temperatures.length));
  // });

  updateWithData(temperatures);
}

main();
