## Play with Distributions

**Objective**

* Learn how to distribute data into bins.
* Use D3's generator functions for lines and areas.
* Visualize data distribution with three different graphs.


**Why is this milestone important to the project?**

* We mentioned in the first project that D3 provides us with the building block to create charts rather than functions to generate specific types of charts. This project will be an excellent example of this approach. There is often more than one way to visualize a dataset. For example, when it comes to distributions, both histograms and violin plots are valid approaches. During this milestone, we will use the function d3.bin() to distribute our data into bins. These bins will then be the base to create these three different graphs.


**Workflow**

1. Download the starter folder for this project [here](https://manning.box.com/s/1890i5o443tlaperjbvbkzv2qh45nfxj).

2. Set up your development environment and start your server.
   * If you need a refresher on setting up your development environment using VS Code and the Live Server extension, refer to [the first milestone of Project 1](https://manning.box.com/s/wxmxzv8717tcyqgozrz5cyezwgzugo1b).

3. Open the file `./js/histogram.js` and use D3 to load the data file `./data/pay_by_gender_tennis.csv`.
   * Log the data in the console. Observe how it is structured and formatted.

4. In this milestone, we will build charts to visualize the distribution of earnings of the top 20 men and the top 20 women of professional tennis in 2019. In our dataset, we will then be interested solely by the `earnings_USD_2019` attribute. Create an array containing all the earnings from the dataset and pass it as a parameter to the function `createHistogram`.
   * Make sure that the earnings are formatted as numbers.
   * Having to reconfigure a dataset partially is very common when doing data visualization. It can be done with different tools like a spreadsheet, SQL or, in our case, javascript.

5. Now that our data is ready let's start working within the function `createHistogram`. First, we will group our data into buckets or bins. Call the function `d3.bin()` and pass your array of earnings as data. Store the result into a variable so that you can refer to it later.
   * Start by reading [this article about d3.bin](https://observablehq.com/@d3/d3-bin).
   * As you read [section 5.1 of D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-5/9) or look at older examples on the web, you might meet the function d3.histogram. `D3.bin()` replaced this function in the v6 of D3, but the usage remains similar.
   * Log the variable where you stored the bins into the console and take a look at its structure. Note that it consists of nested arrays of data binned by value and that each array contains the keys `x0` and `x1`, which represent the boundaries of each bin. It already starts to look like a histogram!

6. Before we can draw our first graph, we need to create our scales. The x scale will represent the earning of the tennis players, while the y scale will be the number of data points within each bin. Both the x and y scales will be linear. Create both scales and store them in variables.
   * If you need a refresher about D3 scales, read [section 2.1.3 in D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-2/55).
   * Use the boundaries of the bins mentioned in the last step to set the domain of the x scale.
   * The file `./js/histogram.js` already contains the constants `margin`, `width` and `height` to help you create your scales.

7. In the `./index.html` file, there is already a div with an id of `viz`. Append an SVG element to it and set its required attributes. Store this selection into a variable so that you can refer to it later.

8. Using the scales created at step 5, append the x and y-axis for the histogram.
   * The result should look similar to the one on [this screenshot](https://manning.box.com/s/sfad0gj4upaxm1qni4j1y9d67raq6ew4).
   * Refer to [D3.js in action section 4.2](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/19) and [d3-axis module](https://github.com/d3/d3-axis) for a refresher on creating and styling axis.

9. We are finally ready to generate a histogram! Since histograms are composed of rectangles, we need to append a series of `rect` elements to our SVG and position them based on our data.
   * Append a group element to your SVG that will contain the rectangles. Groups keep the markup organized and easy to inspect.
   * Bind the data (the bins created at step 5) to the upcoming rectangles using the `select - data - join` pattern. Check [this article](https://observablehq.com/@d3/selection-join) if you don't remember how to proceed.
   * Set the rectangles' attributes `x`, `y`, `width` and `height`. The width of each rectangle is related to the boundaries of their bins. The height of each rectangle represents the number of data points within each bin.
   * You can leave a little bit of padding between each rectangle. You can use the variable named `padding` for that.
   * Your histogram should look similar to the one on [this screenshot](https://manning.box.com/s/kmqcttk9ft2mcdazzne3g7zkhy9u5s50).
   * Take a moment to read the histogram and understand the information it carries. How much most of the top tennis players earned in 2019? What were the maximum and minimum earnings in this dataset?

10. We mentioned in the introduction that d3.bin() is used to create more than one type of graph, making it a flexible tool. We will see a first example here by appending a curve to our histogram, which will create something like the border of a density plot. In SVG, curves are made with the path element. [SVG paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)  are a powerful tool but writing the code for their d attribute is not something we always want to do by hand (although we sometimes do!). D3 has useful built-in functions for that, starting with `d3.line()`.
   * First, read about D3's line generator in [D3.js in action section 4.4](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/77) and in [this Observable notebook](https://observablehq.com/@d3/d3-line).
   * Note that the line generator requires coordinates in x and y, as well as a curve interpolation function. It looks like `d3.line().x().y().curve()`
   * Create a line generator function where the x coordinates are the centre of each rectangle and the y coordinate the top of the rectangles. Drawing and calculating the position of a few of these coordinates on a piece of paper can help!
   * As an interpolation function for the curve, try `d3.curveCatmullRom` or feel free to explore [the other ones available](https://github.com/d3/d3-shape#curves).
   * Finally, append a `path` to your SVG and use your line generator function to set the `d` attribute. Pass the bins data to the generator.
   * [Here's a screenshot](https://manning.box.com/s/lu6r26bz0atd4xistmfgrvh0clb396oh) of the result.

11. What should we do to fill the area below the curve appended at step 10 to create a density plot? You can think of an area as a closed curve, and yes, D3 has a generator for them!
   * Read about D3's area generator in [D3.js in action section 4.5](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/106) and in the [D3 documentation](https://github.com/d3/d3-shape#areas).
   * Note that the area generator is quite similar to the line generator, except that one of the coordinate needs a starting and an endpoint, making the function look like `d3.area().x0().x1().y().curve()`.
   * Create an area generator function whose purpose is to fill the area below the curve we appended at step 10. Which coordinate needs both a starting and an endpoint?
   * Append a new `path` element to your SVG and use your area generator function to set the `d` attribute.
   * Set the `fill-opacity` attribute of your area to see the histogram behind it.
   * It should look similar to [this screenshot](https://manning.box.com/s/g8l0k7x4tkt7hs3rhsc5xu8i6poq1a51).
   * Now, imagine if you mirrored the area that you have just created. What would the resulting graph look like? A violin plot! See what we did here? From a simple binning function, we have generated a histogram, a density plot and a violin plot (almost). Once our data is formatted in a certain way, D3 grants us a lot of flexibility to create different visualizations.
   * Note the stacking order of our SVG shapes. We first appended the rectangles for the histogram, then a curve and finally an area (a closed path). On the screen, they appear precisely in that order. When working with SVG shapes, the rendering order is the same as the document order.



**Deliverable**

The deliverable for this milestone is your completed `histogram.js` file and a screenshot of your visualization after step 11.

Upload a link to your deliverable in the Submit Your Work section and click submit. After submitting, the Author's solution and peer solutions will appear on the page for you to examine.


**Graduated Help**

Feeling stuck? Use as little or as much help as you need to reach the solution!

*help*

Resources related to D3.js concepts
* Review how to import data with D3 in [section 2.1.1 of D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-2/point-10383-13-13-1).
* Loading data is an asynchronous process.
* Read about the creation of histograms and violin plot [in D3.js in action, section 5.1](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-5/9). Note that d3.histogram became d3.bin in the v6 of D3.
* Read [D3's documentation about the bin function](https://github.com/d3/d3-array/blob/master/README.md#bin).
* If you need a refresher about D3 scales, read [section 2.1.3 in D3.js in action](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-2/55).
* Refer to [this article](https://www.d3indepth.com/selections/) to review how to perform selections with D3.
* Refer to [D3.js in action section 4.2](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/19) and to [d3-axis module](https://github.com/d3/d3-axis) for a refresher on how to create and styling axis.
* Review how to bind data to SVG shapes by reading [this Observable notebook](https://observablehq.com/@d3/selection-join).
* Learn more about D3's line generator in [D3.js in action section 4.4](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/77) and in [this Observable notebook](https://observablehq.com/@d3/d3-line).
* Read about the curve the interpolation functions [here](https://github.com/d3/d3-shape#curves) and explore their effect with [this great online tool](http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8).
* Read about D3's area generator in [D3.js in action section 4.5](https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-4/106) and in [D3 documentation](https://github.com/d3/d3-shape#areas).

Other Resources
* Learn more about the javascript data types and type conversion in [this article from w3schools](https://www.w3schools.com/js/js_type_conversion.asp).
* Remember that in javascript, functions that apply to strings can also often be used with arrays and vice versa.
* Learn how to replace a string with another one in javascript [this article from MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll).
* Review the attributes of SVG rectangles in [this article by w3school](https://www.w3schools.com/graphics/svg_rect.asp).
* Read about SVG paths in [this article from MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths).


*more help*

* Hint for step 3:
   ```javascript
      d3.csv('path_to_file').then(data => {
         // Do something with data
      });
   ```
* Hint for step 4:
   ```javascript
      const x = '2';   // x is a string
      const y = +x;    // y is a number
   ```
* Hint for step 5:
   ```javascript
      const bins = d3.bin()(your_data);
   ```
* Hints for step 6: 
   * The value `x0` of the first bin and the value `x1`of the last bin can help you set your domain for the x scale.
   * The max length of all bins is representative of the domain for the y scale.
   * Remember that the vertical position is calculated top to bottom in the SVG world.
* Hint for step 8: 
   * You can use the parameters `.ticks()` and `.tickSizeOuter()` to style your axis and obtain the desired result.
* Hints for step 9: 
   * Pass your bins as the data for the rectangles.
   * For each bin, the attributes `x0` and `x1` are proportional to the x position and the rectangle's width.
* Hints for step 10:
   ```javascript
      const curveGenerator = d3.line()
         .x(d => 'calculate the centre of your rectangles here, based on your bins data')
         .y(d => 'use the length of each bin to calculate the top position of each rectangle')
         .curve(d3.curveCatmullRom); 

      svg
         .append('path')
            .attr('d', curveGenerator('your data'))
            .attr('other attributes...', '')
   ```




*partial solution*
 
Here is the javascript for this milestone, but with all of the code removed and the author’s comments and structure remaining.

Download this file, use it to develop your solution, and upload your deliverable.

* You can look at [the partial solution here](https://manning.box.com/s/cjvsca5ynduptv4l4z2wn72swu7bghqc).



*full solution*

If you try the partial solution and you are unable to complete the project, you can download the full solution here. We hope that before you do this, you’ve tried your best to complete the project on your own. You’ll be able to complete the exam at the end of the project for certification.

* You can look at [the complete solution here](https://manning.box.com/s/1f263w1th902sjwsho0xfyfmeegt2dtw).





