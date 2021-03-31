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

//console.log(barLenghtScale(700000));

const barThickness = 20;
const barPadding = 5;
barChart.selectAll('rect')
   .data(topRockAlbums)
   .join('rect')
      .attr('width', d => {
        //console.log(d);
        return barLenghtScale(d.eq_albums)
      })
      .attr('height', barThickness)
      .attr('x', paddingLeft + 1)
      .attr('y', (d, i) => {
        //console.log(i);
        return barPadding + (barThickness + barPadding) * i
     })
      .attr('fill', '#a6d854');

barChart.selectAll('.label-value')
    .data(topRockAlbums)
    .join('text')
        .attr('class', 'label label-value')
        .attr('x', d => paddingLeft + barLenghtScale(d.eq_albums) + 10)
        .attr('y', (d, i) => (barPadding + (barThickness + barPadding) * i) + 14)
        .text(d => d.eq_albums / 1000000 + 'M');

barChart.selectAll('.label-value')
    .data(topRockAlbums)
    .join('text')
        .attr('class', 'label label-value')
        .attr('text-anchor', 'end')
        .attr('x', d => paddingLeft - 10 )
        .attr('y', (d, i) => (barPadding + (barThickness + barPadding) * i) + 14)
        .text(d => d.artist + ', ' + d.title);