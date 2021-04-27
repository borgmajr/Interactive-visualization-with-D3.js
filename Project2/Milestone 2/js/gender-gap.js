const margin = {top: 30, right: 20, bottom: 50, left: 60};
const width = 1200;
const height = 600;
const colorMen = '#F2C53D';
const colorWomen = '#A6BF4B';
const colorMenCircles = '#BF9B30';
const colorWomenCircles = '#718233';

d3.csv("./data/pay_by_gender_all.csv").then(data => {

  createViz(data);
});


// Create Visualization
createViz = (data) => {

  data.forEach(d => {
    d.earnings_USD_2019 = +d.earnings_USD_2019.replaceAll(',', '');
  });
  console.log(data);

  // Create bins for each sport, men and women
  const sports = [ 'basketball', 'golf', 'tennis'];
  const genders = ['men', 'women'];
  const bins = [];

  sports.forEach(sport => {
    genders.forEach(gender => {
      const binsSet = {
        sport: sport,
        gender: gender,
        bins: d3.bin()(
          data.filter(
            o => { 
                return sport === o.sport &&  gender === o.gender
            }
          ).map(o => { 
              return o.earnings_USD_2019
            }
          )
        )
      };
      bins.push(binsSet);
    });
  });
  console.log(bins);

};