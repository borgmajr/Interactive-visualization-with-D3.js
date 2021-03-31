const topRockSongs = [
    { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000 },
    { artist: "AJR", title: "Bang!", sales_and_streams: 1627000 },
    { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000 },
    { artist: "Journey", title: "Don't Stop Believin'", sales_and_streams: 1497000 },
    { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000 }
 ];

 const topSongsSection = d3.select('#top-songs');

 topSongsSection
 .append('h3')
     .text('Top Rock Songs');


const circlesChartWidth = 550;
const circlesChartHeight = 130;
const circlesChart = topSongsSection
    .append('svg')
        .attr('viewbox', [0, 0, circlesChartWidth, circlesChartHeight])
        .attr('width', circlesChartWidth)
        .attr('height', circlesChartHeight);    

    
const circlesPaddingLeft = 100;
circlesChart
    .append('line')
        .attr('x1', 0)
        .attr('y1', circlesChartHeight / 2 )
        .attr('x2', circlesChartWidth)
        .attr('y2', circlesChartHeight / 2 )
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

const circlesThickness = 20;
const circlesPadding = 5;
let circleGroups = circlesChart.selectAll('g')
    .data(topRockSongs)
    .join('g');

const circletScale = d3.scaleLinear()
    .domain([0, d3.max(topRockSongs, d => d.sales_and_streams)]) 
    .range([0, (circlesChartHeight / 2) - 25]); 

circleGroups = circlesChart.selectAll('g')
    .append('circle')
        .attr('cx', (d,i) => 50 + (i * 110))
        .attr('cy',circlesChartHeight / 2)
        .attr('r', d => circletScale(d.sales_and_streams))
        .attr('fill', 'DodgerBlue');

circlesChart.selectAll('.label-value')
    .data(topRockSongs)
    .join('text')
        .attr('class', 'label label-value')
        .attr('text-anchor', 'middle')
        .attr('x', (d,i) => 50 + (i * 110))
        .attr('y', 10)
        .text(d => (d.sales_and_streams / 1000000) + 'M');

circlesChart.selectAll('.label-name')
    .data(topRockSongs)
    .join('text')
        .attr('class', 'label label-name')
        .attr('text-anchor', 'middle')
        .attr('x', (d,i) => 50 + (i * 110))
        .attr('y', 120)
        .text(d => d.title);