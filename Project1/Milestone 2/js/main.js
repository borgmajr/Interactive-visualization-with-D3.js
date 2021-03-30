const topRockAlbums = [
    { artist: "Queen", title: "Greatest Hits", eq_albums: 929000 },
    { artist: "Elton John", title: "Diamonds", eq_albums: 743000 },
    { artist: "Fleetwood Mac", title: "Rumours", eq_albums: 721000 },
    { artist: "CCR", title: "The 20 Greatest Hits", eq_albums: 630000 },
    { artist: "Journey", title: "Journey's Greatest Hits", eq_albums: 561000 }
 ];

 const topAlbumsSection = d3.select('#top-albums');

 topAlbumsSection
    .append('h3')
        .text('Top Rock Albums');
//
const barChartWidth = 500;
const barChartHeight = 130;
const barChart = topAlbumsSection
    .append('svg')
        .attr('viewbox', [0, 0, barChartWidth, barChartHeight])
        .attr('width', barChartWidth)
        .attr('height', barChartHeight);

const paddingLeft = 200;
barChart
    .append('line')
        .attr('x1', paddingLeft)
        .attr('y1', 0)
        .attr('x2', paddingLeft)
        .attr('y2', barChartHeight)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

const barLenghtScale = d3.scaleLinear()
    .domain([0, 1000000]) // In our data, the number of album-equivalent goes up to about 1,000,000
    .range([0, barChartWidth - paddingLeft - 100]); // Based on the space that we have on screen and the space we need for the labels

console.log(barLenghtScale(700000));