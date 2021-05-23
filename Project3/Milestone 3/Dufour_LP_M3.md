## Filter the data and Play with transitions

**Objective**

* In this milestone, we will introduce a super fun concept: D3 transitions! The D3 `transition` method allows us to change the state of a visualization smoothly. We get impressive results with little effort :)
* As you can see on [this screencast](https://manning.box.com/s/ul29jt6a6la6by9mz7q2ynniuct72fnj), we will add two filters to our graph.
* The first filter will allow selecting a specific award.
* The second filter will be a slider, allowing to select a specific year range.


**Why is this milestone important to the project?**

* One of the main goals of building data visualizations on the web is to allow users to interact with them and explore them further. This is exactly what you will learn to do in this milestone!


**Workflow**

1. Open the `index.html` file and find the div with a class of `filters`.
   * Remove the class `hidden` from that div.
   * You should now have a filters section above your graph. Both filters are empty and unusable for now. We will take care of that!

2. The first filter will allow us to select a specific award, like `Best Actor in a Leading Role` and update the graph to show nominees for that award only. This filter consist in a simple HTML `select` element. Take a look at the markup, and observe that it is empty. We will start by populating its award options!
   * If you are not familiar with HTML `select` or need a refresher, [this article on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) contains many examples and details.
   * To generate the `option` elements inside the `select`, we will need an id for each award, that will be passed to the `value` attribute. We will also need a label that will be the name of the award displayed in the list.
   * Go back to the original dataset. It contains an `award_id` and an `award_label` for each nominee, which is what we'll need.
   * Go back to the function where you have loaded and formatted your data. Initialize a new array and name it `awards`;
   * Populate the awards array with objects containing the id and the label of each award. The structure could look like this:
   ```javascript
      const awards = [
         {id: "best_actor_leading_role", label: "Best Actor in a Leading Role"},
         {id: "best_actress_leading_role", label: "Best Actress in a Leading Role"},
         // ...
      ];
   ```
   * The default state of our graph is the combination of all the awards, and we want to be able to go back to that state after selecting a specific award. To allow this, add the following object to the beginning of the `awards` array:
   ```javascript
      {id: "all", label: "All"}
   ```
   * Pass the `awards` array to the function `createViz()`;

3. Inside the function `createViz()`, populate the `select` element with the information from the `awards` arrays.
   * Append an `option` element for each award, as well as the option `All`.
   * The first `option` inside the `select` element will be the default one, which should be `All`.
   * Pass the id of each award as the `value` attribute.
   * Pass the label of each award as `text`.
   * If you click on the select element, you should now have a list similar to the one [on this screenshot](https://manning.box.com/s/zt1gzn72jagrf81o3h6rwc4iw2njwnjf).

4. Add an event listener for selection of an award in the `select` element.
   * You can use `.on('change', () => {})` as an event listener.
   * Store the value of the selection within a variable named `selectedAward`. You can get this value using the D3 `selection.property()` method.

5. When selecting an award, we want the stream graph to show only nominees for that specific award. To do so, we need to filter our original dataset, recalculate the breakdown of nominees for each group and generate the data stack.
   * First, store the original dataset within a separate variable named `dataOriginal` and pass it to the `createViz()` function. This way, we will always be able to refer back to the original data and filter it based on the award selection.
   * In the callback function of the select event listener, filter the original data to a new array containing only nominees for the selected award. Store this array in a variable named `dataFiltered`.
   * Remember how, at the step 4 of milestone 1 we have formatted the data by calculating the number of nominees for each group, per year? Well, we need to do that again, but with the filtered data.
   * Finally, update the variable `series` by passing the formatted data to the stack generator, as we did when we first created the graph.
   * Tap yourself on the back; that was a lot!

6. Ok, now comes the fun part. Let's update the graph and watch the transition happen!
   * To update the graph, we only need to pass the new data and let it recalculate the `d` attribute of the paths, as follow.
   ```javascript
      nomineesPaths
         .data(series)
            .attr('d', area);
   ```
   * Test your code by selecting an award and watch the graph update. It's working, but a smooth transition would be much nicer.
   * D3 transitions are amazing and work pretty much out of the box. They look impressive with very little work. Start by reading [this article](https://www.tutorialspoint.com/d3js/d3js_transition.htm) for a brief overview of the transition method. Refer to [D3's documentation](https://github.com/d3/d3-transition) for a deeper dive into the many available options.
   * The transition method affects any attribute or style that is declared after it. In our case, we want the transition to happen on the paths redrawing themselves. To do so, we have to chain the transition method before updating the paths.
   ```javascript
      nomineesPaths
         .data(series)
         .transition()
            .attr('d', area);
   ```
   * By default, D3's transition last 250ms. If we want a longer or a shorter transition, we can set it by using the `.duration()` method and passing the desired duration, in milliseconds.
   ```javascript
      nomineesPaths
         .data(series)
         .transition()
         .duration(700)
            .attr('d', area);
   ```
   * Similarly to CSS transitions, you can also change the transition's timing function, add a delay, etc.
   * That's it! Play with your award selector and watch the graph transform. How satisfying is that?
   * Note also that our tooltip is also updating, displaying the breakdown of the selected award. This is because we update the variable `dataFormatted` when selecting an award.

7. We will now set up a slider selector that will allow us to select a year range and update the graph accordingly. We won't build the slider from scratch but instead, use an external js library called [Range Slider](https://slawomir-zaziablo.github.io/range-slider/). The library is already included in the project, in the file `./js/rSlider.min.js` and is loaded in `index.html`.
   * To initialize the slider, we need to create a new `rSlider`, and set its configuration. Copy the following snippet in your code. For now, I suggest doing it inside the `createViz()` so that you have access to the variable created previously.
   ```javascript
      const yearsSlider = new rSlider({
         target: '#yearsSlider',
         values: [], // Set the values array here
         range: true,
         tooltip: true,
         scale: true,
         labels: false,
         set: [], // Set the initial values here
         onChange: values => {
            // Handle change here
         }
  });
   ```
   * In the configuration, the element `values` needs to be initialized with an array of all the years in our dataset. D3 makes it quite easy with the `.range()` function. You can learn more about D3 range in this [Observable notebook](https://observablehq.com/@d3/d3-range). Pay attention to the fact that this function has a non-inclusive upper bound!
   * Then, set the initial values of the slider to the first and the last year in our dataset.
   * Your slider should now look like the one on [this screenshot](https://manning.box.com/s/e0jdzzlhizt7mfb4py10u9t8r2mv5uwl).

8. Let's update the x-axis with a smooth transition when changing the years' range, like on [this screencast](https://manning.box.com/s/2sj0pj82dcryfhgb3bv36t5bwxaxsu9l).
   * In the slider configuration, there is an `onChange()` method that is called every time a year is selected with the slider. This function's argument `values` returns the two selected values as a comma-separated string. Play with the slider and log `values` in the console to get a better feel of it.
   * Extract the two selected years and store them as an array of numbers. For example `[1928, 2015]`. This array becomes our new domain for the x-scale.
   * Update the domain of the x-scale by passing the array with the two selected years as the new domain.
   * All we have to do now is update the x-axis and apply a transition. Take a look at [this example](https://www.d3-graph-gallery.com/graph/scatter_buttonXlim.html) if you are unsure how to proceed.

9. All that remains is to transition the stream graph as well on year selection.
   * Remaining in the callback function of the slider `onChange()` method, update the `d` attribute of the stream graph's paths and apply a transition.
   * Do you observe something unexpected? As you can see on [this screencast](https://manning.box.com/s/sxv1y41ntlrypwu54nxfiogmfeqx2hr6), the stream graph overflows its boundaries on the left and on the right due to its enlargement. The parts that get outside the SVG element are hidden, but the overflow is visible on the left and the right margins.
   * As a workaround, we can use SVG clipping. If you are not familiar with clip paths, [this article](http://tutorials.jenkov.com/svg/clip-path.html) is a good introduction. Clip paths are applied within a `defs` element, which we have discussed in the milestone 4 of project 2.
   * Append a `defs` element to your SVG wrapper. Add a `clipPath` element to it which will contain a rectangle of the size of the graph. Refer to the same [article linked above]((http://tutorials.jenkov.com/svg/clip-path.html)) for an example.
   * If the paths of your streamgraph are inside a group element, it is then quite easy to apply the clipping on that group, using the `clip-path` attribute.
   * The overflow caused by the transition should not be visible anymore, as you can see [here](https://manning.box.com/s/pc4ioxy0dpw21pp6djbgkvwn6bst2dl2).



**Deliverable**

The deliverable for this milestone is your complete javascript file and a screencast of your two filters in action.

Upload a link to your deliverable in the Submit Your Work section and click submit. After submitting, the Author's solution and peer solutions will appear on the page for you to examine.


**Graduated Help**

Feeling stuck? Use as little or as much help as you need to reach the solution!

*help*

* If you are not familiar with HTML select or need a refresher, [this article on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) contains many examples and details.
* For a brief overview of D3's transition method, start by reading [this article](https://www.tutorialspoint.com/d3js/d3js_transition.htm). Refer to [D3's documentation](https://github.com/d3/d3-transition) for a deeper dive into the many available options.
* You can learn more about D3 range in this [Observable notebook](https://observablehq.com/@d3/d3-range).
* If you are not familiar with clip paths, [this article](http://tutorials.jenkov.com/svg/clip-path.html) is a good introduction.



*more help*


* Hint for step 4:
   ```javascript
      const categorySelect = d3.select('#selectAward');

      // Event listener
      categorySelect.on('change', () => {
         // Get a specific property of an element by calling the .property method and passing the name of the property as a parameter
         const selectedAward = categorySelect.property( ... );
      });
   ```
* Hint for step 5:
   ```javascript
      categorySelect.on('change', () => {
         // Get the selected award
         const selectedAward = categorySelect.property('value');

         // Filter the dataset and recalculate the series
         const dataFiltered = selectedAward === 'all'
            ? dataOriginal
            : dataOriginal.filter(datum => ... );
         // Format the filtered data
         dataFormatted = formatData(dataFiltered);
         // Stack the data
         series = stack(dataFormatted);
      });

      const formatData = (data) => {
         const dataFormatted = [];

         // Loop through data and update counters of the number of nominees per category, per year.
         // This is exactly the same operation as we did in step 4 of milestone 1.
         
         return dataFormatted;
      };
   ```
* Hint for step 8:


*partial solution*
 
Here is the javascript file for this milestone, but with all of the code removed and the author’s comments and structure remaining.

Download this file, use it to develop your solution, and upload your deliverable.

* You can look at [the partial solution here](https://manning.box.com/s/fenk3b6a82rzo871quajzl8a72lovcb7).



*full solution*

If you try the partial solution and you are unable to complete the project, you can download the full solution here. We hope that before you do this, you’ve tried your best to complete the project on your own. You’ll be able to complete the exam at the end of the project for certification.

* You can look at [the complete solution here](https://manning.box.com/s/cy0cpk6318o4x6vw7wywcykh0lxl4t1b).





