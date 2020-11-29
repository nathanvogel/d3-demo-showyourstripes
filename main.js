const width = 700;
const height = 380;
const dataUrl = "data.txt";
const getDateFromYear = d3.timeParse("%Y");

const svg = d3.select(".main").append("svg");

const main = async () => {
  const temperatures = await d3.csv(dataUrl);
  const dataset = temperatures.map((row) => {
    return {
      date: getDateFromYear(row.year),
      temperature: parseFloat(row.temperature),
    };
  });
  console.log(dataset);
};

main();
