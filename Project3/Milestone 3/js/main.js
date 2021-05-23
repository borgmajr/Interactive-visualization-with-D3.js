const margin = {top: 100, right: 20, bottom: 40, left: 50};
const width = 1160;
const height = 600;
const groups = [
  { id: 'white', label: 'White or Another', color: '#FFFFF7' },
  { id: 'black', label: 'Black', color: '#7D6B7D' },
  { id: 'hispanic', label: 'Hispanic', color: '#FFF587' },
  { id: 'asian', label: 'Asian', color: '#FF665A' },
];

let series;
let stack;
let area;
let nomineesPaths;
let awards = new Map();
let dataFormatted = new Map();
let dataFormattedFiltered = new Map();

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



  data.forEach(datum => {
    
    gatherData(dataFormatted, datum, function(){
        return true;
    });

    awards.set("all", {id: "all", label: "All"});
    if (!awards.has(datum.award_id)) {
      awards.set(datum.award_id, {id: datum.award_id, label: datum.award_label});
    }

  });

  {
    var s = d3.select("#selectAward");
    Array.from(awards.values()).forEach(datum => {
      s.append("option")
              .text(function (i) { return datum.label; })
              .attr("value", datum.id);
    });

    s.on('change', () => {
        console.log(s.node().value);

        dataFormattedFiltered = new Map();
        data.forEach(datum => {
            
            gatherData(dataFormattedFiltered, datum, function(){
              
              if("all" === s.node().value){
                return true;
              }else{
                return datum.award_id === s.node().value;
              }
   
            });
      
        });

        const filtereddata = Array.from(dataFormattedFiltered.values());

        series = stack(filtereddata);

        nomineesPaths
          .data(series)
          .transition() 
          .duration(700)
            .attr('d', area);
    })
  }


  createViz( dataFormatted, awards);
});

function gatherData(dataFormatted, datum, predicate){
  
  if(predicate()){

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

  }
}

// Create your visualization here
const createViz = (dataMap, awardsMap) => {
  //console.log(data);



  const data = Array.from(dataMap.values());

  {
    const yearsSlider = new rSlider({
      target: '#yearsSlider',
      values: [], // Set the values array here
      range: true,
      tooltip: true,
      scale: true,
      labels: false,
      set: [], // Set the initial values here
      onChange: values => {
         // Handle change here
      }
   });
  }


  var svg = d3.select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    //https://github.com/d3/d3-array/blob/v2.12.1/README.md#extent
  var xscale = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year }))
    .range([0, width - margin.right - 50]);

  var yscale = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return d.nominees_total })])
    .range([height - margin.bottom, margin.top + 50]);

  var x_axis = d3.axisBottom().scale(xscale);
  x_axis.tickFormat(x => `${x}`);

  var y_axis = d3.axisLeft().scale(yscale);

  { //AXIS
    svg.append("g")
      .attr("transform", "translate(" + (margin.right + 20) + ", " + (-margin.top + margin.bottom) + ")")
      .call(y_axis);


    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
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
      .attr("transform", "translate(" + (width / 2) + " ," + (height - margin.bottom) + ")")
      .attr("fill", "white")
      .style("text-anchor", "middle")
      .text("Year");
  }
    ///////////////////
    console.log(data);

  let keys = ["nominees_white","nominees_black","nominees_hispanic","nominees_asian"];

  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);
    
    stack = d3.stack()
          .keys(keys)
          .order(d3.stackOrderAscending)
          .offset(d3.stackOffsetNone);

    series = stack(data);
    //console.log(series);

    area = d3.area()
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

    nomineesPaths = svg
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

/////////////////////////

  let tooltipG = svg.append("g");

  let line = tooltipG.append("line")
          .attr("x1", (width /2) - margin.right )
          .attr("y1", margin.bottom - 50)
          .attr("x2", (width /2) - margin.right)
          .attr("y2",height - margin.top)
          .attr("style", "stroke:rgb(255,0,0);stroke-width:2");

  let text = tooltipG.append("text")
          .attr('x', (width /2) - margin.right)
          .attr('y', height - margin.top + 30)
          .style("fill", "white")
          .attr("text-anchor", "middle")
          .style("alignment", "bottom")
          .text(Math.round(xscale.invert((width /2) - margin.right)));

  let stats = tooltipG.selectAll("mylabels")
          .data(groups)
          .enter()
          .append("text")
          .attr('x', (d,i) => (width /2) - margin.right + 10)
          .attr('y', (d,i) => (i * 15)+ 20)
            .style("fill", "white")
            .text(function(d){ return d})
            .attr("text-anchor", "right")
            .style("alignment", "top")
            .text(d =>  {
                  let year = (Math.round(xscale.invert((width /2) - margin.right)));
                  let obj = dataMap.get(year);
                  return obj["nominees_"+d.id] + " " + d.label;
            });

  nomineesPaths.on('mousemove', e => {
  
    let x = e.offsetX;

    line.attr("x1", x)
        .attr("x2", x);

        //https://github.com/d3/d3-scale/blob/v3.3.0/README.md#continuous_invert
        text.text(Math.round(xscale.invert(x- margin.right - 20)))
            .attr('x', x);

    stats.attr('x', x)
        .text(d =>  {
          let year = (Math.round(xscale.invert(x - 40)));
          //console.log(year);
          let obj = dataMap.get(year);
          if(obj){
            return obj["nominees_"+d.id] + " " + d.label;
          }
        });
    
      if(x > (width /2)){
          toolTipX = x - 150;
          stats.attr('x', toolTipX);
      }else{
        stats.attr('x', x + 10);
      }
  });

};