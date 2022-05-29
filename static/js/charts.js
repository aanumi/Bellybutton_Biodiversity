function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
   
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var totalSamples = data.samples;
    // console.log(totalSamples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    desiredSample = totalSamples.filter(ID => ID.id === sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = data.samples[0];
    console.log(firstSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = desiredSample[0].otu_ids;

    var labels = desiredSample[0].otu_labels;

    var values = desiredSample[0].sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yTicks = ids.slice(0,10).reverse().map(id => 'OTU' + id);
    var xTicks = values.slice(0,10).reverse();
    var hoverText = labels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xTicks,
      y: yTicks,
      type: 'bar',
      text: hoverText,
      orientation: 'h'
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Value Counts"},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)

// -----------------------------------------------------Bubble_Chart---------------------------------------------------------------------------------------

// Bar and Bubble charts
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
        colorscale: 'Rainbow'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Value Counts"},
      height: 500,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
 
// ----------------------------------------------------Gauge_Chart-------------------------------------------------------------------------------------
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    
    // // 2. Create a variable that holds the first sample in the metadata array.
    var initialSample = metadataArray[0];

    // 3. Create a variable that holds the washing frequency. 
    var wfreqGauge = parseFloat(metadataArray['0'].wfreq);

    // 4. Create the trace for the gauge chart.
   var gaugeData = [
     {
     domain: { x: [0,1], y: [0,1]},
     value: wfreqGauge,
     title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
     type: "indicator",
     mode: "gauge+number",

     gauge: {
       bar: { color: "black"},
       axis: {range: [null,10]},
       steps: [
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color:"lime"},
          {range: [8,10], color:"green"}
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 10
        }
       }
     }];
  
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    width: 600,
    height: 400,
    margin: { t: 0, b: 0 },  
  
  };
  
  Plotly.newPlot ('gauge', gaugeData, gaugeLayout)

  });
};