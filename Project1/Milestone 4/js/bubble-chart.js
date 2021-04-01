d3.csv('../data/top_albums.csv').then(data => {
    createBubbleChart(data);
 });

 function createBubbleChart(musicData){
    console.log(musicData); 

    const margin = {top: 40, right: 0, bottom: 60, left: 40};
    const width = 1160;
    const height = 380;

    const metrics = ['total_album_consumption_millions', 'album_sales_millions', 'song_sales', 'on_demand_audio_streams_millions', 'on_demand_video_streams_millions'];
    const artists = [];

    musicData.forEach(datum => {
        metrics.forEach(metric => {
           datum[metric] = parseFloat(datum[metric]); // Convert strings to numbers
        });
        artists.push(datum.artist); // Populate the artists array
     });

    const topBubbbleSection = d3.select('#bubble-chart');

    const bubbleChart = topBubbbleSection
        .append('svg')
            .attr('viewbox', [0, 0, width, height])
            .attr('width', width)
            .attr('height', height);    

    const audioStreamsScale = d3.scaleLinear()
        .domain([0, d3.max(musicData, d => d.on_demand_audio_streams_millions)]) 
        .range([margin.left, width - (margin.left - margin.right)]); 

    bubbleChart
      .append('g')
         .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
         .call(d3.axisBottom(audioStreamsScale));

    let yVideoScale = d3.scaleLinear()
         .domain([0, d3.max(musicData, d => d.on_demand_video_streams_millions)]) 
         .range([height - margin.top - margin.bottom, margin.top ]);

    bubbleChart
         .append('g')
            .attr('transform', 'translate('+margin.left+', 0)')
            .call(d3.axisLeft(yVideoScale))

    bubbleChart
        .append('text')
            .attr('text-anchor', 'end')
            .attr('x', width - margin.right)
            .attr('y', height - margin.bottom)
            .text('On-demand Audio Streams (millions)');

    bubbleChart
        .append('text')
            .attr('text-anchor', 'start')
            .attr('x', margin.left)
            .attr('y', margin.top)
            .text('On-demand Video Streams (millions)');

    const bubblesAreaScale = d3.scaleLinear()
            .domain([0, d3.max(musicData, d => d.album_sales_millions)])
            .range([6, 30]);

    const colorScale = d3.scaleOrdinal()
            .domain(artists)
            .range(d3.schemeTableau10);

    let bubbleGroups = bubbleChart.selectAll('circle')
            .data(musicData)
            .join('circle')
                .attr('cx', d => {
                    return audioStreamsScale(d.on_demand_audio_streams_millions)
                })
                .attr('cy', d => yVideoScale(d.on_demand_video_streams_millions))
                .attr('r', d => bubblesAreaScale(d.album_sales_millions))
                .attr('fill', d => colorScale(d.artist));

    // Legand  
    const legend = d3.select('.legend-color')
        .append("ul")
        .selectAll('.li-albums')
            .data(musicData)
            .join('li')
                .attr('class', 'li-albums');
    
    legend.append('span')
            .attr('class', 'legend-circle')
            .attr('style', (d, i) => 'background-color:'+ colorScale(d.artist)  );

    legend.append('span')
            .text(d => d.title + ", "+d.artist)
            .attr("style", "margin-left: 10px;");
  
    //// Bubble Legand
    const bubbleLegandHeight = 100;
    const bubbleLegandWidth = 200;
    let bubbleLegand = d3.select('.legend-area')
            .append('svg')
            .attr('id','areaCircles')
            .attr('viewbox', [0, 0, bubbleLegandWidth, bubbleLegandHeight])
            .attr('width', bubbleLegandWidth)
            .attr('height', bubbleLegandHeight);    

    bubbleLegand.selectAll('circle')
        .data([.1,.5,1.5])
        .join('circle')
            .attr('cx', 50)
            .attr('cy', 50)
            .attr('r', d =>  bubblesAreaScale(d) )
            .attr('fill', '#727a87')
            .attr('style', (d, i) => "opacity: "+ .4)
            .attr('id',(d, i) => 'areaCircles'+i);
    
    let c = d3.selectAll('#areaCircles circle');
    bubbleLegand.selectAll('line')
            .data(c)
            .join('line')
                .attr('x1', 50)
                .attr('y1', (d, i) => {
                    let circle = d3.select('#areaCircles'+i);
                    let circleHeight = + circle.node().getBoundingClientRect().height;
                    circle.attr('cy', bubbleLegandHeight - circleHeight / 2);
                    return ( bubbleLegandHeight - circleHeight);
                })
                .attr('x2', 100)
                .attr('y2', (d, i) => {
                    let circle = d3.select('#areaCircles'+i);
                    let circleHeight = + circle.node().getBoundingClientRect().height;
                    return ( bubbleLegandHeight - circleHeight);
                })
                .attr('stroke', '#333')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5 5 5 5');

    bubbleLegand.selectAll('.label-value')
        .data(c)
        .join('text')
            .attr('class', 'label label-value')
            .attr('text-anchor', 'start')
            .attr('x', 100 )
            .attr('y', (d, i) => {
                let circle = d3.select('#areaCircles'+i);
                let circleHeight = + circle.node().getBoundingClientRect().height;
                return ( bubbleLegandHeight - circleHeight+ 5);
            })
            .text((d,i) => {
                let circle = d3.select('#areaCircles'+i);
                return circle.datum() + 'M';
            });

    
 }
