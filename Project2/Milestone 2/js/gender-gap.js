const margin = {top: 30, right: 20, bottom: 50, left: 60};
const width = 1200;
const height = 600;
const colorMen = '#F2C53D';
const colorWomen = '#A6BF4B';
const colorMenCircles = '#BF9B30';
const colorWomenCircles = '#718233';

d3.csv("./data/pay_by_gender_all.csv").then(data => {

  createViz(data);
});

const sports = [ 'basketball', 'golf', 'tennis'];
const genders = ['men', 'women'];

// Create Visualization
createViz = (data) => {

  data.forEach(d => {
    d.earnings_USD_2019 = +d.earnings_USD_2019.replaceAll(',', '');
  });
  console.log(data);

  // Create bins for each sport, men and women

  const binContainer = [];

  sports.forEach(sport => {
    genders.forEach(gender => {
      const binsSet = {
        sport: sport,
        gender: gender,
        bins: d3.bin()(
          data.filter(
            o => { 
                return sport === o.sport &&  gender === o.gender
            }
          ).map(o => { 
              return o.earnings_USD_2019
            }
          )
        )
      };
      binContainer.push(binsSet);
    });
  });
  console.log(binContainer);

  binContainer.forEach(b => {
    injectScales(b);
  });

  console.log(binContainer);

  const maxNumber = Math.max(...binContainer.map(o => o.maxNumber));
  const maxBucketSize = Math.max(...binContainer.map(o => o.maxBucketSize));
  console.log("maxNumber", maxNumber);
  console.log("maxBucketSize", maxBucketSize);

  const maxWidth = 60;

  // const maxYScale = binContainer.filter(o => o.maxNumber === maxNumber)[0].yScale;
  // console.log("maxYScale", maxYScale);

  // const xScale = d3.scaleLinear()
  //   .domain([0, maxBucketSize])
  //   .range([0, (maxWidth*6)]);

  var xScale = d3.scaleBand()
      .domain(binContainer.map(o => o.sport))
      .range([ 0, width - margin.left - margin.right ])
      //.padding(0.05)   

  const yScale = d3.scaleLinear()
    .domain([0, maxNumber + 15000000])
    .range([height - margin.bottom - margin.top, margin.top]);


  const vizDiv = d3.select('#viz');

  const vizChart = vizDiv
      .append('svg')
          .attr('viewbox', [0, 0, width, height])
          .attr('width', width)
          .attr('height', height);    

  vizChart
      .append('g')
          .attr('transform', `translate(${margin.left}, ${height - margin.bottom - margin.top})`)
          .call(d3.axisBottom(xScale));   
  
      
  vizChart
      .append('g')
          .attr('transform', 'translate('+margin.left+', 0)')
          .call(d3.axisLeft(yScale));

  vizChart
          .append('text')
              .attr('text-anchor', 'start')
              .attr('x', margin.left)
              .attr('y', margin.top - 5)
              .text('Earnings in 2019 (USD)');

// Dufour_LP_M1.md step 8

//https://www.d3-graph-gallery.com/graph/violin_basicDens.html


let spaceBetweenSports = 60;
      
vizChart
    .append('g')
      .attr('class', 'violins')
    .selectAll('.violin')
    .data(binContainer)
    .join('path')
      .attr('class', d => `violin violin-${d.sport} violin-${d.gender}`)
      .attr('d', d => 
        createAreaGenerator(d, xScale, yScale)
      )
      // .attr('transform', d => {
      //   const index = sports.indexOf(d.sport) + 1;
      //   const translationX = index * spaceBetweenSports;
      //   return `translate(${translationX}, 0)`; // The margin.left part of the translation is applied in the areaGenerator functions to avoid negative x values for women
      // })
      .attr('fill', d => d.gender === 'women' ? colorWomen : colorMen)
      .attr('fill-opacity', 0.8)
      .attr('stroke', 'none');

};

function createAreaGenerator(binContainer, xScale, yScale){
  // const sports = [ 'basketball', 'golf', 'tennis'];
  // const genders = ['men', 'women'];  

    let bins = binContainer.bins;

    let xIdx = sports.findIndex(o => o === binContainer.sport);
    let pxSpacing = ((width) / 3) - margin.right - margin.left;

    let pxOfset = pxSpacing * (xIdx + 1);

    if(binContainer.gender === 'women'){

      var areaGeneratorWomen = d3.area()
            .y((d, i) => { 
              return yScale(d.x1); 
            }) 
            .x0((d, i) => { 
              return  xScale(binContainer.sport) + pxSpacing - 75
            })
            .x1((d, i) => { 
              return xScale(binContainer.sport) + pxSpacing - 75 - 120
            }) 
            .curve(d3.curveCatmullRom);

      return areaGeneratorWomen(bins);
    }
    if(binContainer.gender === 'men'){

      var areaGeneratorMen = d3.area()
        .y((d, i) => { 
          return yScale(d.x1); 
        }) 
        .x0((d, i) => { 
          return xScale(binContainer.sport) + pxSpacing - 75;
        })
        .x1((d, i) => { 
          return xScale(binContainer.sport) + pxSpacing - 75 + 120
        }) 
        .curve(d3.curveCatmullRom);

      return areaGeneratorMen(bins);
    }

};

function injectScales(binContainer){
      //console.log("xvals",xvals);
      const maxNumber = Math.max(...binContainer.bins.flat());
      //console.log("maxNumber",maxNumber);

      binContainer.maxNumber = maxNumber;

      // let xScale = d3.scaleLinear()
      //         .domain([0, maxNumber])
      //         .range([0, width - margin.left - margin.right - 30])
      //         .nice();

      // binContainer.xScale = xScale;
  
      const maxBucketSize = Math.max(...binContainer.bins.flatMap(o => o.length));
      //console.log("maxBucketSize",maxBucketSize);

      binContainer.maxBucketSize = maxBucketSize;

      // let yScale = d3.scaleLinear()
      //     .domain([maxBucketSize, 0])
      //     .range([10, height - margin.top - margin.bottom])
      //     .nice();

      // //console.log("xScale",xScale);

      // binContainer.yScale = yScale;
}