## Illustrate the gender pay gap in sports

**Objective**

* The last milestone was all about the representation of data distribution with D3. We’ve learned how to bin data and use these bins to create different types of graphs. We will apply what we’ve learned to visualize the gender pay gap in 3 professional sports: Basketball, Golf and Tennis. Take a look at [the final visualization here](https://manning.box.com/s/utqm8aba7e9k36nsvd66i0rrw6q9k5h9). We will now focus on creating two-sided violin or density plots, showing the distribution of earnings for women on the left in green and men on the right in yellow.


**Why is this milestone important to the project?**

* This milestone will give you the occasion to work on the spatial positioning of visual elements in D3. Creating these violin plots will require a similar process to what we did in the first milestone. The challenge will reside in the rotation of these graphs. The ability to think about the space on the screen and adapt our code accordingly is essential to creating unique visualizations. Don’t hesitate to sketch and break down your problems on a piece of paper. That can help tremendously!
* In this milestone, we will work with a dataset containing the data for three sports. It will be a great occasion to practice applying different attributes to our SVG shapes based on data parameters, like sport and gender.


**Workflow**

1. Open the file `./index.html`. Comment out the script calling `histogram.js` and uncomment the one calling `gender-gap.js`. Open `./js.gender-gap.js`.

2. Prepare the dataset.
   * Load the csv file `./data/pay_by_gender_all.csv`.
   * Format `earnings_USD_2019` by removing commas and converting strings into numbers.
   * Call the function `createViz()` and pass the formatted data as parameter.

3. Notice that this time, we didn’t isolate the earnings from the rest of the dataset. Having access to the entire dataset will allow us to position our violins for each sport and both genders but will require a little more work to access the data. To facilitate accessing data, let’s create a nested array of bins, classified by sport and gender.
   * The function `createViz()` already contains a `sports` and a `gender` array, as well as an empty `bins` array.
   * The function also contains a double loop through the `sports` and the `gender` arrays.
   * At line 25, generate the bins for each combination of sport and gender, using the `d3.bin()` function.
   * Javascript methods like filter and map might be helpful to access the data you need to generate each set of bins. Understanding these javascript functions is essential to almost any real-life D3 project. Also, remember that there is often more than one way to perform a programming task.
   * Log the `bins` array in the console to validate your result, which should [look like this](https://manning.box.com/s/wplbgcr8tld0khevh4ulfn7resplxp5m).

4. Now, generate two linear scales for both the x and the y-axis.
   * To create your domains, you will need to find the maximum earning and the maximum length of a bin. Use the function `d3.max()` to find these informations.
   * You will also need to decide on the maximum width you want to give to each half-violin plot. For reference, the final project used 60px, but feel free to experiment!

5. Append an SVG element to the div with an id of `viz` and set its attributes. Store this selection into a variable so that you can refer to it later.

6. Append the x-axis.
   * Take another look at [the final project](https://manning.box.com/s/utqm8aba7e9k36nsvd66i0rrw6q9k5h9). Note that we don't use a traditional axis but rather an SVG line to which we append a label with the name of each sport.
   * Calculate the position at which to append each sports label to keep an equal distance between each violin plot. Store this value in a variable that you will reuse later.
   * Refer to [this screenshot](https://manning.box.com/s/pjt2mfwhlonyqitcuoogrz6urmxe9v61) for comparison. Note that your axis might be slightly different.

7. Append the y-axis and a label `Earnings in 2019 (USD)`.
   * If you want to make sure that the axis built from a scale ends with round numbers, you can use the .nice() method, as explained [in this article](https://www.d3indepth.com/scales/).
   * Refer to [this screenshot](https://manning.box.com/s/pjt2mfwhlonyqitcuoogrz6urmxe9v61) for comparison. Note that your axis might be slightly different.

8. As we did in milestone 1, we will need an area generator to create our violin plots. But this time, we will have two area generators, one for men (toward the right) and one for women (toward the left). Refer to [the final project](https://manning.box.com/s/utqm8aba7e9k36nsvd66i0rrw6q9k5h9) if you need a visual reminder.
   * Create two area generator functions, using `d3.area()`, for men and women. The women's area generator will simply be a mirrored version of the one for men.
   * Append a violin plot for each combination of sport and gender. Call the right area generator based on gender.
   * Use the `transform` attribute and the distance between each sport calculated at step 6 to position the paths on the chart.
   * As a `fill` attribute, you can use the variables `colorWomen` and `colorMen`. 
   * When approaching coding problems that are a little more robust, it's always a good idea to break them down into more chewable chunks. If that helps you, you could start by creating the area generator only for men and append the path for a single sport. Then, extend your solution to both genders and finally to all sports.
   * Your result should look [similar to this one](https://manning.box.com/s/ne6rh62mkeru6vdr4r7uo7hxq1hwqvmb).
   * You'll probably notice that the violin plot for women basketball players is barely visible. This is due to the considerable difference between men's and women's salaries that the linear scale doesn't allow us to perceive. This is a common problem in data visualization, and different approaches could help up solve it. Using a logarithmic scale could be an option, but these scales are challenging to read and interpret for most people and should be used cautiously. A fun and engaging solution could be allowing users to zoom to the lower earnings sections of the y-axis. For this project, women basketball players will become visible after the next milestone.


**Deliverable**

The deliverable for this milestone is your completed `gender-gap.js` file and a screenshot of your visualization after step 8.

Upload a link to your deliverable in the Submit Your Work section and click submit. After submitting, the Author's solution and peer solutions will appear on the page for you to examine.


**Graduated Help**

Feeling stuck? Use as little or as much help as you need to reach the solution!

*help*

Resources related to D3.js concepts
* Read [D3's documentation about the bin function](https://github.com/d3/d3-array/blob/master/README.md#bin).
* Review how to use `d3.max()` in [this Observable notebook](https://observablehq.com/@d3/d3-extent).
* Review how to use D3's area generator in [D3.js in action section 4.5](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/106) and in [D3 documentation](https://github.com/d3/d3-shape#areas).
* Read about the curve the interpolation functions [here](https://github.com/d3/d3-shape#curves) and explore their effect with [this great online tool](http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8).

Other Resources
* Learn more about the javascript `.filter()` method in [this article by MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
* Learn more about the javascript `.map()` method in [this article by MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).



*more help*


* Hint for step 3: Filter your dataset by sport and gender, then use the `.map()` method to generate a new array containing only the earning for each specific sport and gender combination. Don't hesitate to break the steps down into multiple variables and functions if that helps.
* Hints for step 4:
   ```javascript
      // The maximum earning is relatively straightforward to find using d3.max()
      const maxEarning = d3.max(data, d => d.attribute); // Specify the attribute for which you want to find the max value

      // The maximum length of a bin requires a bit more work since we have a total of 6 sets of bins
      // The first parameter passed to d3.max() is an array. Nested arrays are also fine.
      // So, how could you group all your bins into an array?
      const binsMaxLength = d3.max(['pass the bins here'], d => d.length);
   ```
* Hints for step 8:
   ```javascript
      const areaGeneratorMen = d3.area()
         .x0(...) // Where do the area start in the x-direction?
         .x1(d => ...) // Remember how we were calculating the length of the rectangles for the histogram?
         .y(d => ...)  // Based on earnings 
         .curve(...);
      const areaGeneratorWomen = d3.area() // The area for women can be calculated by mirroring the men's one
        .x0(...)
        .x1(...)
        .y(d => ...)
        .curve(...);

      svg
        .selectAll('.violin')
        .data(...) // Bind the data
        .join(...) // What svg shape are we creating?
          .attr('class', 'violin')
          .attr('d', d => ...) // Call the right area generator based on the gender
          .attr('transform', d => {
            const translationX = ...; // Calculate the x translation based on the sport
            return `translate(${translationX}, 0)`;
          })
          .attr('fill', d => ...) // Apply the fill color based on gender
          .attr('fill-opacity', 0.8)
          .attr('stroke', 'none');
   ```


*partial solution*
 
Here is the [INSERT FILE TYPE] for this milestone, but with all of the code removed and the author’s comments and structure remaining.

Download this file, use it to develop your solution, and upload your deliverable.

* You can look at [the partial solution here](https://manning.box.com/s/3k3xvgbz4p5z6jfq7zur9oyezt0gthf7)



*full solution*

If you try the partial solution and you are unable to complete the project, you can download the full solution here. We hope that before you do this, you’ve tried your best to complete the project on your own. You’ll be able to complete the exam at the end of the project for certification.

* You can look at [the full solution here](https://manning.box.com/s/6fi72222lssf9fwjr8566cl61npgk72b)





