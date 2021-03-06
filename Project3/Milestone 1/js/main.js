const margin = {top: 100, right: 20, bottom: 40, left: 50};
const width = 1160;
const height = 600;
const groups = [
  { id: 'white', label: 'White or Another', color: '#FFFFF7' },
  { id: 'black', label: 'Black', color: '#7D6B7D' },
  { id: 'hispanic', label: 'Hispanic', color: '#FFF587' },
  { id: 'asian', label: 'Asian', color: '#FF665A' },
];


// {
//   "year_label": "1927/28 (1st)",
//   "year": 1928,
//   "ceremony_number": "1",
//   "award_id": "best_actor_leading_role",
//   "award_label": "Best Actor in a Leading Role",
//   "name": "Emil Jannings ",
//   "film": "The Last CommandThe Way of All Flesh",
//   "winner": "TRUE",
//   "ethnic_minority": "",
//   "milestone-note": ""
// }

// const dataFormatted = [
//   { 
//      year: // A year,
//      nominees_total:  // Total nominees for that year,
//      nominees_white:  // Total of white nominees for that year,
//      nominees_black:  // Total of Black nominees for that year,
//      nominees_hispanic:  // Total of Hispanic nominees for that year,
//      nominees_asian:  // Total of Asian nominees for that year
//   },
//   ...
// ];

// Load the data here
d3.csv('./data/academy_awards.csv').then(data => {


  // data.forEach(datum => {
  //   // Convert earning to number
  //   datum.year = +datum.year;
  // });

  let dataFormatted = new Map()

  data.forEach(datum => {
    if (dataFormatted.has(+datum.year)) {

      let yearObj = dataFormatted.get(+datum.year);
      yearObj.nominees_total++;
      yearObj.nominees_white = datum.ethnic_minority === "" ? yearObj.nominees_white+1 : yearObj.nominees_white;
      yearObj.nominees_black =  datum.ethnic_minority === "black" ? yearObj.nominees_black+1 : yearObj.nominees_black;
      yearObj.nominees_hispanic = datum.ethnic_minority === "hispanic" ? yearObj.nominees_hispanic+1 : yearObj.nominees_hispanic;
      yearObj.nominees_asian = datum.ethnic_minority === "asian" ? yearObj.nominees_asian+1 : yearObj.nominees_asian;

      dataFormatted.set(+datum.year, yearObj);
    } else {
      dataFormatted.set(+datum.year,
        {
          year: +datum.year,
          nominees_total: 1,
          nominees_white: datum.ethnic_minority === "" ? 1 : 0,
          nominees_black: datum.ethnic_minority === "black" ? 1 : 0,
          nominees_hispanic: datum.ethnic_minority === "hispanic" ? 1 : 0,
          nominees_asian: datum.ethnic_minority === "asian" ? 1 : 0,
        }
      )
    }
  });

  createViz( Array.from(dataFormatted.values()));
});

// Create your visualization here
const createViz = (data) => {
  //console.log(data);

  var svg = d3.select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    //https://github.com/d3/d3-array/blob/v2.12.1/README.md#extent
  var xscale = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year }))
    .range([0, width - margin.left - 10]);

  var yscale = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return d.nominees_total })])
    .range([height - margin.bottom, margin.top]);

  var x_axis = d3.axisBottom().scale(xscale);
  x_axis.tickFormat(x => `${x}`);

  var y_axis = d3.axisLeft().scale(yscale);

  svg.append("g")
    .attr("transform", "translate(" + (margin.right + 20) + ", " + (-margin.top + margin.bottom) + ")")
    .call(y_axis);


  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 )
    .attr("x", -10 - (height / 2))
    .attr("dy", "1em")
    .attr("fill", "white")
    .style("text-anchor", "middle")
    .text("Number of Nominations");

  svg.append("g")
    .attr("transform", "translate(" + (margin.right + 20) + ", " + (height - margin.top) + ")")
    .call(x_axis)

  // text label for the x axis
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height - margin.bottom ) + ")")
    .attr("fill", "white")
    .style("text-anchor", "middle")
    .text("Year");

    ///////////////////
    console.log(data);

  let keys = ["nominees_white","nominees_black","nominees_hispanic","nominees_asian"];

  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);
    
    var stack = d3.stack()
          .keys(keys)
          .order(d3.stackOrderAscending)
          .offset(d3.stackOffsetNone);

    let series = stack(data);
    console.log(series);

    var area = d3.area()
          .x(function(d) { 
              return xscale(d.data.year); 
          })
          .y0(function(d) { 
              return yscale(d[0]); 
          })
          .y1(function(d) { 
              return yscale(d[1]); 
          })
          .curve(d3.curveBasis);

    const nomineesPaths = svg
          .append('g')
             .attr('class', 'paths')
             .attr("transform", "translate(" + (margin.right + 20) + ", " + (-margin.top + margin.bottom) + ")")
          .selectAll("path")
          .data(series)
          .join("path")
             .attr('d',  area )
             .attr('fill', function(d, i){
                  return color(d.key);
             });
 
/////////////////////

//legand

var legSvg = d3.select(".legend")

var size = 20
svg.selectAll("myrect")
  .data(groups)
  .enter()
  .append("rect")
    .attr('x', (d,i) => i *200)
    .attr('y', height -margin.bottom)
    .attr("width", size)
    .attr("height", size)
    .style("fill",function(d, i){
        return color("nominees_"+d.id)
    });


svg.selectAll("mylabels")
  .data(groups)
  .enter()
  .append("text")
  .attr('x', (d,i) => (i *200)+23)
  .attr('y', height -margin.bottom + 18)
    .style("fill", "white")
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment", "bottom")
    .text(d => d.label);


};