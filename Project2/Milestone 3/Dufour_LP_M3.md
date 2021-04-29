## Add individual players to the visualization

**Objective**

* In milestone 2, we have created a data visualization showing the distribution of earnings for the top 20 professional players in three sports. We will now add circles representing the individual players and adding a second layer of information to the distribution.


**Why is this milestone important to the project?**

* This milestone is an example of why D3 is such a popular and influential library. The visualization that we are about to create doesn't exist in traditional textbooks and is a loose interpretation and combination of existing charts. But thanks to D3, out-of-the-box ideas can jump from our brain to the screen.
* Circles representing each player will be positioned on the visualization using D3's force simulation. The force module is a favorite in the D3 community and is behind some of the most stunning D3 projects. We will use it to calculate the position of each circle and avoid overlapping.


**Workflow**

1. For this milestone, continue working in `gender-gap.js`. First, let's start thinking about how we should position the circles, or players, on the violin plots. Their position according to the y-axis is proportional to their earning, which is straightforward. But how about their position according to the x-axis? The x-axis represents how many players there are in each bin of earnings, and many bins contain more than one player. So how will we stack the circles and calculate their positions? This is where we will use D3's force layout to run a simulation based on different physical parameters and calculate each circle's position.
   * Start by reading [the section 7.2 in D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-7/55). For this project, you don't need to understand every aspect of force-directed layouts since we won't build a network. But an overview of the forces used in the calculations will be helpful.
   * Create two constants that we will use for the calculations:
      * `const circlesRadius = 2.5;`, the radius of each circle.
      * `const circlesPadding = 0.7;`, the padding between circles.
      * Of course, as we build the visualization, feel free to experiment and play with these values.
   * First, let's focus solely on men tennis players. Create an array named tennisDataMen and populate it by filtering the players whose sport is tennis and gender is men. Be careful; we are using the original dataset here, not the bins data.

2. Next, we will create a function that will call D3's force simulation and calculate the position of each circle. Here's a code snippet to help you understand the structure of the simulation function.
   ```javascript
      const simulation = d3.forceSimulation(tennisDataMen)
         .force('forceX', d3.forceX(margin.left + (3 * spaceBetweenSports)).strength(0.1))
         .force('forceY', d3.forceY(d => yScale(d.earnings_USD_2019)).strength(10))
         .force('collide', d3.forceCollide(circlesRadius + circlesPadding))
         .stop();
   ```
   * We first call `d3.forceSimulation()` and pass the dataset as a parameter, here the simplified `tennisDataMen`.
   * `d3.forceSimulation()` accepts different methods, and you can read about them in [the d3-force API](https://github.com/d3/d3-force). We will apply a force in the x-direction, one in the y-direction and a collision force.
   * `forceX` and `forceY` apply positioning forces to the circles, and the `.strength()` method specifies how strictly these positions should be maintained.
   * In our snippet, `forceX` positions the circles around the tennis violin plot's centerline and gives them some freedom of movement due to the low strength applied. This low strength will allow circles to spread horizontally, like if we stacked them within each bin.
   * `forceY` positions the circles on the earnings axis (y) and has a stronger force, which will ensure that the circles y position is proportional to their earning attribute.
   * The `collide` attribute stipulates how close the centre of the circles can be from one another. For our visualization, we don't want any overlapping between the circles. We instead wish to have a little bit of padding between each circle.
   * Finally, the `.stop()` method stops the internal simulation timer and returns the simulation.

3. Now that we have set our simulation parameters in step 2, we are ready to run it. To do so, we call the simulation function multiple times from within a loop. Every time the simulation runs, the position of each circle is refined. Here's how we can call the simulation:
   ```javascript
      const numIterations = 300;
      for (let i = 0; i < numIterations; i++) {
         simulation.tick();
      }

      simulation.stop();
   ```
   * We first set the number of iterations, or the number of times the simulation will be called. By default, D3 runs 300 ticks or iterations. It's a good point to start and is plenty for our needs. This number can be modified depending on the complexity of a simulation. As you'll probably guess, this comes with performance considerations that are outside the scope of this project but should undoubtedly be taken into account when working with the force layout.
   * Once the loop is completed, we call `simulation.stop()` to interrupt any remaining internal timers and return the simulation.
   * Log `tennisDataMen` into the console. Did something change in the data? You should notice that D3 added the parameters `index`, `x`, `y`, `vx` and `vy` to every data point. As exained in [the d3-force API](https://github.com/d3/d3-force#simulation_nodes), every data point is now considered as a `node`, and the new parameters mean the following:
      * `index`: The zero-based index of the node in the overall collection of nodes
      * `x`: The node's x position within the SVG container element
      * `y`: The node's y position within the SVG container element
      * `vx`: The node's x velocity
      * `vy`: The node's y velocity
   * D3 did all the heavy lifting, and we can now use the `x` and `y` parameters of each node to position them on the visualization.

4. All we have to do now is to bind the data and append the circles to the visualization.
   * Append a group (`g`) to the SVG container that will contain all the circles. This will keep the markup organized and easy to inspect.
   * Bind `tennisDataMen` to the upcoming circles, using the `.selectAll().data().join()` pattern.
   * Set the `cx` and `cy` attributes of each circle based on the parameters calculated by the simulation. As we have seen in the previous step, these parameters are now accessible directly into the dataset.
   * Set the radius attribute of the circles using the constant `circlesRadius` created earlier.
   * For the fill and the stroke attributes, you can use the color constant `colorMenCircles` already available at the top of `gender-gap.js`.
   * The result should look [similar to this screenshot](https://manning.box.com/s/qnuh71p1fzhyerhqidu0cs4vnvb2n25h).


5. You probably observed that the men's circles are currently spread on both sides of the central line of the tennis violin plot. This is expected since `forceX` is applied as a centre point around which the nodes can spread. If we want the men's circles to remain to the right side of this centre line, we need to apply a boundary. One way to do this is to add a verification of the node's current x position and, if it is to the left side of the centerline, increase its velocity toward the right. For example:
   ```javascript
      const simulation = d3.forceSimulation(tennisDataMen)
         .force('forceX', ...)
         .force('forceY', ...)
         .force('collide', ...)
         .force('axis', () => {
            data.forEach(datum => {
               if (datum.x < (margin.left + (3 * spaceBetweenSports))) {
                  datum.vx += 0.01 * datum.x;
               }
            });
         })
         .stop();
   ```
   * In the last chaining of the `.force()` method, we loop through our data and verify their parameter `x`.
   * If `x` is smaller than the position of the violin's centerline, we increase its x velocity toward the right.
   * As we iterate through the simulation, all the circles converge toward the right side of the centerline.
   * Your result should look [similar to this screenshot](https://manning.box.com/s/qxr9l2dfmj3pg7q9qjphjdb71gwxb80y).

6. Now that you know how to set up the force simulation and append the circles update the code you wrote during steps 2, 4 and 5 to take the complete dataset into account and position circles for each sport and both gender.
   * Set the `forceX` parameter of the simulation based on the centerline of the violin for each sport.
   * Ensure that women's circles remain to the left side of the centerline of their violin plot.
   * Ensure that circles cannot go below the x-axis.
   * [Here's my result](https://manning.box.com/s/5jejmcklw8iu9q8ubeg6n91bfxrpops7). Yours might vary depending on the forces applied to your simulation.
   * Note how the circles representing women basketball players stack up at the bottom. This is normal since they all earn a similar salary, and the forces applied to the simulation group them together. But this is also misleading. These women made around 100,000$(US) in 2019, but some look like they earned between 1 and 2 M$(US). This is one of these gotcha moments when doing data visualization and would need to be addressed if we were to publish it. As mentioned in milestone 2, a solution could be to allow users to zoom on a certain bracket of earnings so that they can appreciate the pay gender gap between men and women in professional basketball.

   

**Deliverable**

The deliverable for this milestone is your completed `gender-gap.js` file and a screenshot of your visualization after step 6.

Upload a link to your deliverable in the Submit Your Work section and click submit. After submitting, the Author's solution and peer solutions will appear on the page for you to examine.


**Graduated Help**

Feeling stuck? Use as little or as much help as you need to reach the solution!

*help*

* For an overview of force-directed layouts, read [the section 7.2 in D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-7/55).
* For an in-depth look at the force module, refer to [the d3-force API](https://github.com/d3/d3-force).
* Review how an SVG circle is built and its required attributes [on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle).



*more help*

* Hint for step 4:
   ```javascript
      const circlesGroup = svg
         .append('g')
            .attr('class', 'circles-group');
      circlesGroup
         .selectAll(...) // To which DOM element do we want to bind data to?
         .data(...) // Which dataset are we using?
         .join(...) // What's the svg shape that we are adding to the simulation?
            .attr('class', 'player')
            .attr('cx', d => ...) // the x parameter added to the data by the simulation
            .attr('cy', d => ...) // the y parameter added to the data by the simulation
            .attr('r', ...)
            .style('fill', ...)
            .style('fill-opacity', ...)
            .style('stroke', ...);
   ```


*partial solution*
 
Here is the javascript for this milestone, but with all of the code removed and the author’s comments and structure remaining.

Download this file, use it to develop your solution, and upload your deliverable.

* You can look at [the partial solution here](https://manning.box.com/s/uyby6580xe681ex7mbstpx0dgybzo4a9)



*full solution*

If you try the partial solution and you are unable to complete the project, you can download the full solution here. We hope that before you do this, you’ve tried your best to complete the project on your own. You’ll be able to complete the exam at the end of the project for certification.

* You can look at [the full solution here](https://manning.box.com/s/wgonpczneyffh84fh9s20darar7eqtgf)





