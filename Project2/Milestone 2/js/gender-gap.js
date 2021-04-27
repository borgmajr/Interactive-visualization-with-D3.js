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


// Create Visualization
createViz = (data) => {

  data.forEach(d => {
    d.earnings_USD_2019 = +d.earnings_USD_2019.replaceAll(',', '');
  });
  console.log(data);

  // Create bins for each sport, men and women
  const sports = [ 'basketball', 'golf', 'tennis'];
  const genders = ['men', 'women'];
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

  const maxXScale = binContainer.filter(o => o.maxNumber === maxNumber);
  console.log("maxXScale", maxXScale);

};

function injectScales(binContainer){
      //console.log("xvals",xvals);
      const maxNumber = Math.max(...binContainer.bins.flat());
      //console.log("maxNumber",maxNumber);

      binContainer.maxNumber = maxNumber;

      let xScale = d3.scaleLinear()
              .domain([0, maxNumber])
              .range([0, width - margin.left - margin.right - 30])
              .nice();

              binContainer.xScale = xScale;
  
      const maxBucketSize = Math.max(...binContainer.bins.flatMap(o => o.length));
      //console.log("maxBucketSize",maxBucketSize);

      binContainer.maxBucketSize = maxBucketSize;

      let yScale = d3.scaleLinear()
          .domain([maxBucketSize, 0])
          .range([10, height - margin.top - margin.bottom])
          .nice();
  
      //console.log("xScale",xScale);

      binContainer.xScale = xScale;
}