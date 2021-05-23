## Append a complex tooltip to the visualization

**Objective**

* In the last milestone, we have built a colorful and attention-grabbing chart that communicates how the nomination of non-white artists has evolved throughout the years. But if we want to know precisely how many people from the Hispanic community were nominated in 2006, for example, the information can be a little tricky to extract.
* In this milestone, we will create a tooltip that will allow readers to find such specific information quickly. The tooltip will enable readers to see the breakdown of how many nominees were from the Black, Hispanic or Asian community for a particular year. Have a look at [this screencast](https://manning.box.com/s/fbfre8bcyc3wcif4rjmyh0zczk6th6gq) to see the tooltip in action.


**Why is this milestone important to the project?**

* This milestone will be a great occasion to bring further the concept of tooltips that was introduced in the last project.
* This time, the tooltip will be entirely built with SVG rather than traditional HTML elements, allowing you to practice positioning SVG text over multiple lines.
* In this milestone, you will also use mouse events to position the tooltip and retrieve data.


**Workflow**

1. Take a moment to observe the tooltip that we are about to create and its behavior, on [this screencast](https://manning.box.com/s/fbfre8bcyc3wcif4rjmyh0zczk6th6gq).
   * The tooltip consist of three elements: a vertical line, the current year at the bottom and a breakdown of the number of nominees per group at the top.
   * When the mouse moves on the stream graph, the tooltip follows it by translating along the horizontal axis.
   * When the mouse moves outside of the graph, the tooltip remains at its last position.
   * As the tooltip moves, the year label at the bottom is updated.
   * As the tooltip moves, the breakdown of the number of nominees per group at the top is updated.
   * When the tooltip is positioned within the first half of the graph, the nominees' breakdown is displayed on the right. When the tooltip is positioned within the last half of the graph the nominees' breakdown is shown on the left. This is to avoid that a part of the information gets outside of the SVG element and becomes invisible. Any child of an SVG element that is positioned outside of its borders remains hidden.

2. Append a group (`g`) element to your SVG and apply a translation to it so that it is aligned with the left border of the stream graph.
   * Store the group in a variable named `tooltip` so that you can refer to it later.
   * Use the `margin` variable to calculate the position of the group.
   * Although it's also a style in the traditional HTML/CSS world, transformations like translation are an attribute when it comes to SVG. You can learn more about the transform attribute in [this article on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform).

3. Append a vertical SVG line to the tooltip group. The line should be positioned along the left border of the stream graph, start slightly below the x-axis and go up until the top of the SVG container. [This illustration](https://manning.box.com/s/sdag3qzk2zlsdqyify05yeajvvpcz6p4) might help you get situated.
   * Set the required attribute of the line (`x1`, `x2`, `y1`, `y2`);
   * Use the `stroke` and `stroke-width` attributes to style the line to your liking.
   * If you wish the line to be dashed, use the `stroke-dasharray` attribute. You can learn more about its usage [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray).

4. Let's now make the line follow the mouse movements.
   * Append an event listener to your stream graph (only the paths that are making the graph, not the whole SVG element). The event that we want to detect is `mousemove`.
   * Your event listener should look similar to the following:
   ```javascript
      nomineesPaths.on('mousemove', e => {
        // Do something
      });
   ```
   * Note that we only pass the local event `e` as an argument.
   * Log the local event `e` in the console. 
   * Our goal is to know the X position of the mouse, relative to the graph, so that we can apply this position to the tooltip. Which parameters of `e` could help us with that?
   * If your answer to the previous question is `offsetX`, you are right! Log `e.offsetX` in the console and move your mouse over the graph to get a feel of how it works.
   * In the callback function of your event listener, set the `transform` attribute of `tooltip`, so that it follows the mouse. Use `e.offsetX` as the translation value.
   * Test your tooltip. Does it translate horizontally when you move your move over the graph? Does it stop moving once your mouse gets outside the chart? If yes, great!

5. We will now append a label displaying the year to the bottom of the tooltip.
   * Append a `text` element to `tooltip`.
   * Set its attributes so that the label is positioned at the bottom of the vertical line.
   * You can centre the label with the line by setting the attribute `text-anchor` and giving it a value of `middle`.
   * Don't pass any text yet to the label. We will do it dynamically at the next step.
   * Store the label in a variable named `tooltipYear`.

6. Let's set and update the year label as the tooltip moves.
   * When passing a value to a D3 scale, it returns a position on the screen. For example, when we call `scaleX(2012)`, it gives us the X position of the year 2012 on our graph. But did you know that we can also do the reverse? The `invert()` method allows us to pass a position (from the range) to a scale and get the value (from the domain) in return. You can read more about it [here](https://github.com/d3/d3-scale#continuous_invert).
   * In the callback function of your event listener, get the year corresponding to the position of the mouse on the graph. Store this value in a variable.
   * Note that since the x-scale is linear, its domain includes any value between 1928 and 2020, including floating-point numbers. You can use the function `Math.round()` to round the value returned by the scale.
   * Set the text of the tooltip label so that it displays the year.
   * Note that the translation applied to the group `tooltip` is automatically applied to all its children, here the vertical line and the years' label.

7. The last bit of information displayed by the tooltip is the breakdown of nominees per group for a specific year. For example, for the year 2006, the breakdown is as follow. You can also see it on [this screenshot](https://manning.box.com/s/l2eqt6kewqxzhnkle12drfb5sjb1p74n).
   ```text
      40 Nominees total
      27 White or Another
      5 Black
      7 Hispanic
      1 Asian
   ```
   * One way of approaching it is to create an SVG `text` element and append `tspan` elements inside of it and individually set their positions `x` and `dy`. If you are not familiar with multiline SVG texts, take a look at [this article by Jarrett Meyer](https://jarrettmeyer.com/2018/06/05/svg-multiline-text-with-tspan).
   * You can append a `tspan` for each line of text in the breakdown. If you want to keep your code a little more DRY, you can also use the `.selectAll().data().join()` pattern passing `groups` as data and appending a `tspan` for each group. Note that you will still need to handle the total number of nominees separately.
   * Similarly to what we did for the year label, you don't have to set the text yet. We will do it at the next step.

8. Let's set and update the nominations breakdown as the tooltip moves.
   * In order to set and update the values for the nominations breakdown, retrieve the data for the current year (we have already calculated the year at step 6).
   * Use the retrieved data to set the text of the nominations breakdown as the mouse moves.
   * Move your mouse over your graph and ensure that the information displayed on your tooltip corresponds to the original data!

9. As a final step, it would be nice to ensure that the nominations breakdown info is not cut when we get close to the right border of the graph.
   * In the callback function of your event listener, add a condition checking if the mouse is within the first of the second half of the graph.
   * If the mouse is within the first half, display the text on the right side of the tooltip.
   * If the mouse is within the second half, display the text on the left side of the tooltip.
   * You can use the `transform` attribute to position your text.


**Deliverable**

The deliverable for this milestone is your complete javascript file and a screencast of your tooltip in action.

Upload a link to your deliverable in the Submit Your Work section and click submit. After submitting, the Author's solution and peer solutions will appear on the page for you to examine.


**Graduated Help**

Feeling stuck? Use as little or as much help as you need to reach the solution!

*help*

* You can learn more about the transform attribute in [this article on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform).
* Review the attributes of SVG lines in [this article on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line).
* Read about the `stroke-dasharray` attribute [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray).
* Learn more about D3's revert method [here](https://github.com/d3/d3-scale#continuous_invert).
* If you are not familiar with multiline SVG texts, take a look at [this article by Jarrett Meyer](https://jarrettmeyer.com/2018/06/05/svg-multiline-text-with-tspan).



*more help*


* Hint for step 6:
   ```javascript
      nomineesPaths.on('mousemove', e => {
         // Set the position of the tooltip
         tooltip.attr('transform', `translate(${ ... }, 0)`);

         // Get the corresponding year and set the text of the tooltip year label
         const year = Math.round(scaleX.invert( ... ));
         tooltipYear.text(year);
      });
   ```
* Hint for step 7:
   ```javascript
      const tooltipCeremonyBreakdown = tooltip
         .append('text')
            .attr('y', 10)
            .style('font-weight', 700);
      
      const tooltipCeremonyTotal = tooltipCeremonyBreakdown
         .append('tspan')
            .attr('x', 10);
      const tooltipCeremonyWhite = tooltipCeremonyBreakdown
         .append('tspan')
            .attr('x', 10)
            .attr('dy', 18);
      const tooltipCeremonyBlack = tooltipCeremonyBreakdown
         .append('tspan')
            .attr('x', 10)
            .attr('dy', 18);
      // Continue for each tspan
   ```
* Hint for step 8:
   ```javascript
      nomineesPaths.on('mousemove', e => {
         // Set the position of the tooltip
         tooltip.attr('transform', `translate(${ ... }, 0)`);

         // Get the corresponding year and set the text of the tooltip year label
         const year = Math.round(scaleX.invert( ... ));
         tooltipYear.text(year);

         // Get the data related to the current year
         const yearlyData = dataFormatted.find(ceremony => ... );

         // Set the text inside the ceremony breakdown
         d3.select('.ceremony-breakdown-total').text(`${ ... } Nominees total`);
         // ...
      });
   ```


*partial solution*
 
Here is the javascript file for this milestone, but with all of the code removed and the author’s comments and structure remaining.

Download this file, use it to develop your solution, and upload your deliverable.

* You can look at [the partial solution here](https://manning.box.com/s/6du40g35qy2vprh6dz5e6rvz3tq08l9o).



*full solution*

If you try the partial solution and you are unable to complete the project, you can download the full solution here. We hope that before you do this, you’ve tried your best to complete the project on your own. You’ll be able to complete the exam at the end of the project for certification.

* You can look at [the complete solution here](https://manning.box.com/s/3nrx8gj621i5tk7eat1rkkmijmlpn1p7).





