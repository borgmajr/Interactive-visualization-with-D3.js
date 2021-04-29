## Make the visualization interactive and add special visual effects

**Objective**

* During milestone 2, we have appended circles representing the players to the visualization. But we have no way to know which circle belongs to which player. We will now implement a tooltip that will display the name of the player and some more information from the dataset when passing the mouse over a circle.
* We will also add a color legend for the gender.
* Finally, we will add a glow effect to the violin plots to help them stand out a little bit more.


**Why is this milestone important to the project?**

* Tooltips are a general requirement in interactive visualizations, and knowing how to implement them is a must. For this purpose, we will introduce event listeners and how D3 passes event arguments.
* Simple SVG filters can jazz up any visualization and make it go from standard to attention-worthy.


**Workflow**

1. For this milestone, continue working in `gender-gap.js`. Let's start by adding an event listener for when the mouse enters a circle. 
   * First, read [the section 3.2.1 of D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-3/32) and look at [D3's documentation on events handling](https://github.com/d3/d3-selection#selection_on).
   * Now, add the following snippet to your code:
   ```javascript
      d3.selectAll('circle')
         .on('mouseover', (event, d) => {
            console.log(event, d);
         });
   ```
   * We first select all the circles on our visualization.
   * Then we add a listener by chaining the method `.on()` and passing the string event type `mouseover`.
   * In the callback function, note that D3 passes both the mouse local event (`event`) and the datum (`d`). These will be useful to position the tooltip and append the datum related information.
   * Move your mouse over some of the circles and look at the event and data logged in the console.

2. We will later come back to this event listener, but for now, let's start building our tooltip. If you go to `./index.html`, you will see that a div with the class `tooltip` already exists and contains placeholders for the player's name, country, and earning.
   * In `gender-gap.js`, select `div.tooltip` and store it in a variable named `tooltip`.
   * Creating our tooltip using HTML element will allow easy styling and the text to flow if needed. Handling and positioning multiple pieces of text with SVG is much more complicated.
   * Note that the file `./main.css` already contains styles for the tooltip. These styles could have been added with D3, but keeping the separation of concerns results in more readable code and easier maintenance.
   * `div.tooltip` has an absolute positioning, meaning that it is pulled outside of the flow of the page, and an opacity of 0. As we mouse over the circles, we will calculate the tooltip's position and apply it with javascript. We will also control the opacity of the tooltip by adding and removing the class visible. This class name will also apply a smooth transition to the opacity.
   * Transitions can also be applied with D3 and will be discussed in Project 3.

3. Create a function named `handleMouseOver` that accepts two parameters, the mouse local event and the datum discussed in step 2. This function will perform three tasks. It will populate the tooltip with the information from the datum, position the tooltip and make it appear on the screen.
   * From `handleMouseOver`, populate the divs inside the tooltip with the player's name, country or team, and earnings for 2019. Once the proper divs are selected, use the method `.text()` to set the text inside each div.
   * You can format the earnings using `d3.format()`.
   * Use the `.style()` method to set the `top` and `left` position of the tooltip based on the local mouse event information.
   * Make the tooltip appear by giving it the class `visible`. You can use the `.classed()` method, which allows you to turn a class on and off without affecting the other classes that this element might have.

4. We also need to hide the tooltip once the mouse leaves a circle. Create a function named `handleMouseOut` that removes the class `visible` from the tooltip.

5. We are now ready to call the functions `handleMouseOver` and `handleMouseOut` when the mouse enters and leaves circles.
   * Go back to the script written in step 1.
   * Within the callback function of the event listener for `mouseover`, call `handleMouseOver` and pass the mouse local event (`event`) and the datum (`d`) as parameters.
   * Chain an event listener for when the mouse leaves the circle and call `handleMouseOut`.
   * Your tooltip should appear and disappear similarly to [this screencast](https://manning.box.com/s/bieh00m15ejxcva2lp92g8vugrzmispz).

6. Now that we have a functioning tooltip, let's add a simple legend explaining the colors used for women and men. You can style and position it like [on this screenshot](https://manning.box.com/s/cpwkaoqf7oyr1mg3d2bxyell9rbilen1), or adapt it to your preference.

7. Finally, we are ready to jazz up our visualization by adding a glow effect to the violin plot.
   * First, read [this article written by Nadieh Bremer](https://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization/) on how to add a glow effect to an SVG element.
   * Following the instructions in the article, append a `defs` element to your SVG container and add the following SVG filter to it. It's a little wordy but will be super easy to apply afterwards.
   ```javascript
      // Append container for the effect: defs
      const defs = svg.append('defs');

      // Add filter for the glow effect
      const filter = defs
         .append('filter')
            .attr('id', 'glow');
      filter
         .append('feGaussianBlur')
            .attr('stdDeviation', '3.5')
            .attr('result', 'coloredBlur');
      const feMerge = filter
         .append('feMerge');
      feMerge.append('feMergeNode')
         .attr('in', 'coloredBlur');
      feMerge.append('feMergeNode')
         .attr('in', 'SourceGraphic');
   ```

8. Note that we have given an id of `glow` to our filter. We now need to call this filter from our SVG shape. In your code, go back to where you have appended the paths for the violin plots. Chain a `.style()` method that calls the filter using the `glow` id.
   * Booom, your chart is already a little sexier. Take a look at [the final project](https://manning.box.com/s/utqm8aba7e9k36nsvd66i0rrw6q9k5h9) for comparison.
   * Experiment with the value of the standard deviation to adapt the blur to your liking.
   * SVG filters are, of course, a question of taste and should be used with parsimony. But they can give a whole other dimension to your work!


**Deliverable**

The deliverable for this milestone is your completed `gender-gap.js` file, a screenshot of your visualization after step 7 and a short video showing your tooltip working.

Upload a link to your deliverable in the Submit Your Work section and click submit. After submitting, the Author's solution and peer solutions will appear on the page for you to examine.


**Graduated Help**

Feeling stuck? Use as little or as much help as you need to reach the solution!

*help*

* Learn more about event handling by reading [the section 3.2.1 of D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-3/32) and taking a look at [D3's documentation](https://github.com/d3/d3-selection#selection_on).
* [This article](https://www.tutorialsteacher.com/d3js/dom-manipulation-using-d3js) shows an example of how to add text to a selection.
* If you are wondering about the difference between `.attr('class')` and `.classed()`, [this article explains it](https://benclinkinbeard.com/d3tips/attrclass-vs-classed/) in  a short and sweet manner.
* Learn how to use `d3.format()` by reading [D3's documentation](https://github.com/d3/d3-format).
* Read [this article written by Nadieh Bremer](https://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization/) on how to add a glow effect to an svg element.
* Learn more about the different effects that can be applied to svg [in this series of article by Nadieh Bremer](https://www.visualcinnamon.com/2016/04/svg-beyond-mere-shapes/).
* Take a look at [the documentation on `defs` elements by MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs).



*more help*


* Hint for step 3:
   ```javascript
      // To apply text to a selection
      selection.text('some text');

      // To apply a style to a selection
      selection.style('css property', ...);

      // To access the x position of the mouse on the screen relative to the page
      // Log the event into the console to check the properties available
      event.pageX

      // There are 2 ways to apply or remove a class with D3
      selection.attr('class', 'my-class');
      selection.classed('my-class', boolean);
   ```


*partial solution*
 
Here is the javascript for this milestone, but with all of the code removed and the author’s comments and structure remaining.

Download this file, use it to develop your solution, and upload your deliverable.

* You can look at [the partial solution here](https://manning.box.com/s/sgd3hf3gn2zczs8868qh40nd8l4t8uyx)



*full solution*

If you try the partial solution and you are unable to complete the project, you can download the full solution here. We hope that before you do this, you’ve tried your best to complete the project on your own. You’ll be able to complete the exam at the end of the project for certification.

* You can look at [the complete solution here](https://manning.box.com/s/10q0tcp86wmpxrg7o4httbcigf57xkp1)





