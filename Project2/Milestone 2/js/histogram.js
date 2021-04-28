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
            .range([0, width - margin.left - margin.right - 30])
            .nice();


    const maxBucketSize = Math.max(...buckets.flatMap(o => o.length));
    console.log("maxBucketSize",maxBucketSize);
    let yScale = d3.scaleLinear()
        .domain([maxBucketSize, 0])
        .range([10, height - margin.top - margin.bottom])
        .nice();

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

    vizChart
        .append('text')
            .attr('text-anchor', 'end')
            .attr('x', width - margin.right)
            .attr('y', height - margin.bottom)
            .text('Earnings in 2019 (USD)');

    vizChart
        .selectAll("rect")
            .data(buckets)
            .join('rect')
               .style("fill", "#69b3a2")
               .style("stroke", "1px solid white")
              .attr("x", d => {
                return xScale(d.x0);
              })
              .attr("y", d => {
                return yScale(d.length);
              })
              .attr("width", d => {
                return xScale(d.x1) - xScale(d.x0) -1;
              })
              .attr("height", d => {
                return yScale(0) - yScale(d.length);
              })
            .attr("transform",  "translate(" + margin.left + "," + 0 + ")");;
              
    
     var line = d3.line()
            .x((d, i) => { return xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)); }) 
            .y((d, i) => { return yScale(d.length); }) 
            .curve(d3.curveCatmullRom);
     
    vizChart.append("path")
            .datum(buckets) 
            .attr("class", "line") 
            .attr("d", line)
            .style("stroke", "#000")
            .style("fill", "none")
            .style("stroke-width", "3"); 

    var areaGenerator = d3.area()
            .x((d, i) => { return xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)); }) 
            .y0((d, i) => { return height - margin.bottom - margin.top; })
            .y1((d, i) => { return yScale(d.length); }) 
            .curve(d3.curveCatmullRom);
        
        var area = areaGenerator(buckets);
        
        // Create a path element and set its d attribute
        vizChart
            .append('path')
            .datum(buckets) 
            .attr("class", "area") 
            .attr('d', area)
            .attr('fill', 'yellow')
            .attr('fill-opacity', 0.2)
            .attr('stroke', 'none');

};

