## Create a streamgraph of the representation of ethnic minorities in the Academy Awards nominations

**Objective**

* In this project, we will build an interactive and responsive visualization of the representation of ethnic minorities throughout the Academy Awards nominations' history. As a first step, we will create the visualization, which is a stream graph. You can see the chart that we are about to build [on this screenshot](https://manning.box.com/s/5ml8uandv8c18qnxdgrwr43dyfzzwqz5).
* Stream graphs are an excellent example of a visualization that would be tedious to draw from scratch, given all the areas that build upon each other. But thanks to D3's stack generator, we can generate such an impressive graph relatively easily.
* To build the stream graph, you will learn how to use the stack generator to transform and "stack" your data. You will then use the area generator, that you already know from project 2, to generate the graph.
* As in most D3 project, you will also create scales, axes and legends. Practising these concepts that we have introduced in the previous projects is the best way to master them!


**Why is this milestone important to the project?**

* This milestone is the project's spine and could live on its own as a standalone visualization.
* Discrete graphical marks, called shapes in D3, are the building blocks of most visualizations. Here we will work with three of them: stacks, areas and curves.


**Workflow**

1. Download the project's starter folder [here](https://manning.box.com/s/07svb0sor8pau522v05hl4g4hrm43s8r).

2. Set up your development environment and start your server.
   * If you need a refresher on setting up your development environment using VS Code and the Live Server extension, refer to [the first milestone of Project 1](https://manning.box.com/s/wxmxzv8717tcyqgozrz5cyezwgzugo1b).
   * Read the introduction of the project displayed on your screen. This will give you a little bit of context on the visualization that we are about to build.
   * Open the file `./js/main.js`. Fow now, don't worry for now about the file `./js/rSlider.min.js`, we will use it in Milestone 3.

3. Use D3 to load the data contained in the file `./data/academy_awards.csv`.
   * Log the data in the console. Observe how it is structured and formatted.
   * Each row corresponds to an Academy Awards nominee. The nominations are classified by year and by award. When the nominee is part of the Black, Hispanic or Asian community, it is indicated in the column `ethnic_minority`.

4. In this milestone, we will build a stream graph showing the number of nominees from each ethnic group (White, Black, Hispanic, Asian), per year, throughout the history of the Academy Awards (from 1928 until 2020). In order to build the stream graph, we will need the total nominees, for each year, with a breakdown per ethnic group.
   * If you are not familiar with stream graphs and how they are constructed, take a look at their description on [datavizcatalogue.com](https://datavizcatalogue.com/methods/stream_graph.html).
   * Create an array of objects, where each object corresponds to a year and contains the breakdown of nominations per ethnic group, similarly to the following. From now on, this is what we will refer to as your formatted data.
   ```javascript
      const dataFormatted = [
         { 
            year: // A year,
            nominees_total:  // Total nominees for that year,
            nominees_white:  // Total of white nominees for that year,
            nominees_black:  // Total of Black nominees for that year,
            nominees_hispanic:  // Total of Hispanic nominees for that year,
            nominees_asian:  // Total of Asian nominees for that year
         },
         ...
      ];
   ```
   * Make sure that the year is formatted as a number rather than a string.
   * Once you are done, call the function `createViz()` and pass your formatted data as a parameter.

5. The next step is to create scales. We will need a color scale, attributing a color to nominees of each group. Then, an x-scale will be used to position our data over the horizontal time axis. Finally, a y-scale will allow to display how many nominees of each group there were, for each year, along the vertical y-axis.
   * Create an ordinal color scale, attaching a color to each ethnic group. You can use the colors from the array `groups` available at the top of the `main.js` file, use one of the palettes available in d3, or even create your own!
   * Create a linear x-scale that will position the data horizontally. While you could potentially use `d3.scaleTime()`, a linear scale can also do the trick since we only work with years.
   * Finally, create a y-scale for the vertical axis, linearly proportional to the number of nominees.
   * You can use the variables `margin`, `width` and `height` available at the top of `main.js` to set up your ranges. Feel free to adjust them to your own liking. The `margin` variable can be used to maintain spacing around your stream graph so that there's enough room to display axis and labels.

6. In the file `index.html`, there is a div with an id of `viz`. Append an SVG element to that div and set its attributes.

7. We are ready to build our stream graph! A stream graph consists in a superposition, or a stack, of areas. We have learned how to use D3's area generators in Project 2. We will now learn how to stack them.
   * Start by reading [section 4.5 of D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/106). This will give you an overview of the approach that we are going to use.
   * Take a moment to also read [D3's documentation about the stack generator](https://github.com/d3/d3-shape#stacks).
   * Initialize your stack generator, using `d3.stack()`, and store it in a variable so that you can call it later.
   * Set the keys accessor, using the keys from the `groups` variable available at the top of the `main.js` file. The keys are simply an array of what each area in our stream graph will represent (white, black, hispanic and asian nominees).
   * Set the stack order to `d3.stackOrderAscending`. This will maintain the smallest areas at the bottom and the largest ones at the top.
   * Set the stack offset to `d3.stackOffsetNone` to position the areas on a zero baseline.
   * These stack order and offset options were selected to improve the readability of the graph. At the end of the milestone, play with them to see how they transform the visualization!
   * Your stack generator should look like to following:
   ```javascript
      const stack = d3.stack()
         .keys([]) // Pass your array of keys here
         .order(d3.stackOrderAscending)
         .offset(d3.stackOffsetNone);
   ```

8. Produce a stack with your data by calling your stack generator and passing your formatted data as a parameter. Store this stack in a variable.
   ```javascript
      let series = stack(dataFormatted);
   ```
   * Log your stack of data in the console and observe it is structured. You will see an array for each ethnic groups containing the related key. Each of these arrays also contains nested arrays with the lower and upper limit for each year, as well as the related bit of data (year and number of nominees for each group).

9. Our stack tells us how tall each group should be, for each year, but we still need to generate an area out of it. Use the function `d3.area()` to create an area generator.
   * Review the structure of area generators in [D3's documentation](https://github.com/d3/d3-shape#areas) and/or check your code from project 2.
   * Our areas will strech across the x-axis and will have vertical boundaries (`y0` and `y1`), as shown [on this illustration](https://manning.box.com/s/xe695lx0lnvjwg7j67jcgxib52cged0r).
   * The x-coordinates can be calculated with the x-scale and are proportional to the year.
   * The y-coordinates can be calculated with the y-scale and represent the lower and upper limits in our stack of data.
   * Apply your [curve extrapolation method](https://github.com/d3/d3-shape#curves) of choice.
   * Your area generator should look similar to this:
   ```javascript
      const area = d3.area()
         .x(d => ... )
         .y0(d => ... )
         .y1(d => ... )
         .curve( ... );
   ```
   * Pfffew, that was a lot of preparation before seing any kind of graph on the screen! But hold on, that rewarding moment is approaching :) 

10. In the SVG world, a stream graph is nothing more than some `SVG paths` stacked over each other. Calculating the `d` attribute of each path is quite complex and that's what the area generator is for.
   * Append `paths` to the SVG element, using the `.selectAll().data().join()` pattern and passing the stacked data `series` as the data.
   * Set the `d` attribute of each path using the area generator.
   * Set the `fill` color of each path using the color scale created at step 5.
   * Store your paths in a variable.
   * You can see a partial snippet below. Note that the paths are grouped withing an SVG `g` element to keep the markup clean and easy to explore. This group element will also come handy later.
   ```javascript
      const nomineesPaths = svg
         .append('g')
            .attr('class', 'stream-paths')
         .selectAll( ... )
         .data( ... )
         .join( ... )
            .attr('d',  ... )
            .attr('fill', d =>  ... );
   ```
   * Your stream graph should look similar to the one [on this screenshot](https://manning.box.com/s/2iqwe76ek9zmvvssrp6ixx4c3q7rr89h).
   * Now that we have a graph, let's make it readable by adding proper axes, labels and legend.

11. Append an horizontal axis to the bottom of the graph, showing the years of the ceremonies.
   * Use the `d3.axisBottom()` function, calling the x-scale created at step 5.
   * Append the axis to the SVG element.
   * If your need to format the years on the axis, the `.tickFormat()` might be useful.
   * Add a label to your axis so that users know what this is about.

12. Append a vertical axis to the left of the graph, showing the number of nominees.
   * Use the `d3.axisLeft()` function, calling the y scale created at step 5.
   * Append the axis to the SVG element.
   * Add a label to your axis.

13. Last but not least, append a color legend to the graph.
   * Append your legend to the div with the class `legend`, available in the `index.html` file.
   * The legend should show each of the colors used to build the graph, with the related label.
   * Design it to your liking or similarly to the one on [the screenshot of the final project](https://manning.box.com/s/5ml8uandv8c18qnxdgrwr43dyfzzwqz5).
   * If you wish to use the legend styles available in `main.css`, the markup of your legend should be as follow:
   ```html
      <div class="legend">
         <ul>
            <li>
               <span class="legend-color"></span>
               <span class="legend-label">A Label</span>
            </li>
            <!-- Other legend items go here -->
         </ul>
      </div>
   ```


**Deliverable**

The deliverable for this milestone is your completed `main.js` file and a screenshot of your graph after step 13.

Upload a link to your deliverable in the Submit Your Work section and click submit. After submitting, the Author's solution and peer solutions will appear on the page for you to examine.


**Graduated Help**

Feeling stuck? Use as little or as much help as you need to reach the solution!

*help*

* If you are not familiar with stream graph and how to read them, take a look at their description on [datavizcatalogue.com](https://datavizcatalogue.com/methods/stream_graph.html).
* Review D3 scales and hor to apply their domain and scale in [the section 2.1.3 of D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-2/54). [This Observable notebook](https://observablehq.com/@d3/introduction-to-d3s-scales) is also a great introduction to scales.
* Read more about Ordinal scales in [this Observable notebook](https://observablehq.com/@d3/d3-scaleordinal).
* Refresh your knowledge about D3 selection and data binding in [D3.js in action, Chapter 1, section 1.2.2](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-1/point-10355-30-30-1).
* Read [section 4.5 of D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/106) to have an overview of how stream graphs are built in D3.
* [D3's documentation about the stack generator](https://github.com/d3/d3-shape#stacks) is also a great source of information regarding the different stacking options.
* Review the structure of area generators in [the d3-shape documentation](https://github.com/d3/d3-shape#areas).
* The curve extrapolation options are described in [the d3-shape documentation](https://github.com/d3/d3-shape#curves).
* If you need a refresher on how to create axes in D3, go check [section 4.2 in D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/19) and [the API reference](https://github.com/d3/d3-axis) for in depth information. [This article](https://www.d3-graph-gallery.com/graph/custom_axis.html) is also a great place to start and gives a.



*more help*


* Hint for step 4: In order to format your data, you can loop through the original dataset and count the number of nominees from each group in a given year. Everytime you meet a year that is not yet within your formatted data, add it and initialize the counters. Otherwise, update the counters. Here's how I approached it. Your solution might be different!
   ```javascript
         const dataFormatted = [];
         data.forEach(datum => {
            // If dataFormatted doesn't already contain the current year
            if (!dataFormatted.find(ceremony => ceremony.year == datum.year)) {
               const ceremony = {
               year: , // Convert the year from string to number
               nominees_total: , // Initialize the number of nominees to 1
               nominees_white: , // If ethnic_minority contains an empty string, nominees_white equals 1, otherwise 0
               nominees_black: , // If ethnic_minority is 'black', nominees_black equals 1, otherwise 0
               nominees_hispanic: , // If ethnic_minority is 'hispanic', nominees_hispanic equals 1, otherwise 0
               nominees_asian:  // If ethnic_minority is 'asian', nominees_asian equals 1, otherwise 0
               };
               dataFormatted.push(ceremony); // Add ceremony to dataFormatted
            } else {
               // If dataFormatted already contains the current year, find the related data
               const ceremony = dataFormatted.find(ceremony => ceremony.year == datum.year);

               // Update the counters
               ceremony.nominees_total += 1;
               switch (datum.ethnic_minority) {
                  case '':
                     // Update related counter
                     break;
                  case 'black':
                     // Update related counter
                     break;
                     
                  // ...
               }
            }
         });
   ```
* Hint for step 9: 
   ```javascript
      const area = d3.area()
         .x(d => {
            // The x axis shows the years
            console.log(d); // Inspect d in the console and find how to access the year
            return scaleX( ... );
         })
         .y0(d => {
            // Each area has a lower and upper limit, that have been calculated by the stack.
            // Here we are looking for the lower limit
            console.log(d); // Inspect d in the console and find the lower limit of your stack
            return scaleY( ... );
         })
         .y1(d => {
            // Here we are looking for the upper limit
            console.log(d); // Inspect d in the console and find the upper limit of your stack
            return scaleY( ... );
         })
         .curve( ... ); // Any curve option will do. Once your graph is displayed on the screen, play with the options to find the one that is most appropriate.
   ```

*partial solution*
 
Here is the javascript file for this milestone, but with all of the code removed and the author’s comments and structure remaining.

Download this file, use it to develop your solution, and upload your deliverable.

* You can look at [the partial solution here](https://manning.box.com/s/bxzj5t8ky6anl9nw6s9r3bfxukeldyl0).



*full solution*

If you try the partial solution and you are unable to complete the project, you can download the full solution here. We hope that before you do this, you’ve tried your best to complete the project on your own. You’ll be able to complete the exam at the end of the project for certification.

* You can look at [the complete solution here](https://manning.box.com/s/vga1qceigwdmwm6xj70p0g4ukyvdwatj).





