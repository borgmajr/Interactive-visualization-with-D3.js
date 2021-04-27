const margin = {
    top: 30,
    right: 20,
    bottom: 50,
    left: 60
};
const width = 1200;
const height = 600;
const padding = 1;
const color = 'steelblue';

d3.csv("./data/pay_by_gender_tennis.csv").then(data => {

    createHistogram(data);
});

function createHistogram(data) {
    
    let saleries = [];
    for (let index = 0; index < data.length; index++) {
        //data[index].earnings_USD_2019 = +data[index].earnings_USD_2019.replaceAll(",","");
        saleries.push(+data[index].earnings_USD_2019.replaceAll(",",""));
    }
    //console.log(data);


    let bin = d3.bin();
    let buckets = bin(saleries);
    console.log("buckets",buckets);

    //console.log("xvals",xvals);
    const maxNumber = Math.max(...buckets.flat());
    console.log("maxNumber",maxNumber);
    let xScale = d3.scaleLinear()
            .domain([0, maxNumber])
            .range([0, width - margin.left - margin.right]);


    const maxBucketSize = Math.max(...buckets.flatMap(o => o.length));
    console.log("maxBucketSize",maxBucketSize);
    let yScale = d3.scaleLinear()
        .domain([maxBucketSize, 0])
        .range([0, height - margin.top - margin.bottom]);

    console.log("xScale",xScale);


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

};

// Dufour_LP_M1.md step 5 