$(function() {


	var emotions_data = (function () {
      var json = null;
      $.ajax({
          'async': false,
          'global': false,
          'url': "data/combined_results_withGender.json",
          'dataType': "json",
          'success': function (data) {
              json = data;
          }
      });
      return json;
  })();
  var text_collection = (function () {
      var json = null;
      $.ajax({
          'async': false,
          'global': false,
          'url': "data/text_collection.json",
          'dataType': "json",
          'success': function (data) {
              json = data;
          }
      });
      return json;
  })();
  text_map = {} 
  text_collection.forEach(function(obj){
    inner = {}
    inner["text"] = obj["text_speach"]
    inner["entities"] = obj["entities"]
    text_map[obj["_id"]] = inner
  }) 
  console.log(text_map)

  var hillary = {'anger' : [],
     "contempt": [],
     "disgust": [],
     "fear": [],
     "happiness": [],
     "neutral": [],
     "sadness": [],
     "surprise": []}
  
  var sanders = {'anger' : [],
     "contempt": [],
     "disgust": [],
     "fear": [],
     "happiness": [],
     "neutral": [],
     "sadness": [],
     "surprise": []}
	var emotions = ['anger',
     "contempt",
     "disgust",
     "fear",
     "happiness",
     "neutral",
     "sadness",
     "surprise"]
	index_hillary = {}
	index_sanders = {}
	var i = 0
	var j = 0

	emotions_data.forEach(function(object){
		if(object["gender"] == "male"){
			emotions.forEach(function(emo){
				sanders[emo].push({"x": i , "y" : object[emo]})
			});
			index_sanders[i] =  object["ID"]
			d3.select("#sanders-picker").append("option").text(i)
			i = i+1
		}else{
			emotions.forEach(function(emo){
				hillary[emo].push({"x": j , "y" : object[emo]})
			});
			index_hillary[j] =  object["ID"]
			d3.select("#hillary-picker").append("option").text(j)
			j = j+1;
		}

	});
	var data_hillary= [
				{
					key: "anger",
					color : "#FA2A00",
					values : hillary["anger"]
				},
				{
					key: "contempt",
					color : "#FABE28",
					values : hillary["contempt"]
				},
				{
					key: "happiness",
					color : "#88C100",
					values : hillary["happiness"]
				},
				{
					key: "fear",
					color : "#984ea3",
					values : hillary["fear"]
				},
				{
					key: "disgust",
					color : "#FF00FF",
					values : hillary["disgust"]
				},
				{
					key: "sadness",
					color : "#183a23",
					values : hillary["sadness"]
				},
				{
					key: "surprise",
					color : "rgba(48, 164, 255, 1)",
					values : hillary["surprise"]
				}
			]
var data_sanders= [
				{
					key: "anger",
					color : "#FA2A00",
					values : sanders["anger"]
				},
				{
					key: "contempt",
					color : "#FABE28",
					values : sanders["contempt"]
				}
				,
				{
					key: "happiness",
					color : "#88C100",
					values : sanders["happiness"]
				},
				{
					key: "fear",
					color : "#984ea3",
					values : sanders["fear"]
				},
				{
					key: "disgust",
					color : "#FF00FF",
					values : hillary["disgust"]
				},
				{
					key: "sadness",
					color : "#183a23",
					values : hillary["sadness"]
				},
				{
					key: "surprise",
					color : "rgba(48, 164, 255, 1)",
					values : hillary["surprise"]
				}
			]
	
  nv.addGraph(function() {
      hillary_chart = nv.models.lineChart()
          .options({
              transitionDuration: 300,
              useInteractiveGuideline: true
          })
      ;
      // hillary_chart.xAxis.tickValues([2007,2008,2009,2010,2011,2012,2013,2014]);

      hillary_chart.yAxis.tickFormat(d3.format(',.2f'));
      hillary_chart.interpolate("bundle")
      hillary_chart.showLegend(true);
      hillary_chart_data = d3.select('#hillary-chart').append('svg')
          .datum(data_hillary)
          .call(hillary_chart);

      nv.utils.windowResize(hillary_chart.update);
      return hillary_chart;
  });
  nv.addGraph(function() {
      sanders_chart = nv.models.lineChart()
          .options({
              transitionDuration: 300,
              useInteractiveGuideline: true
          })
      ;
      // hillary_chart.xAxis.tickValues([2007,2008,2009,2010,2011,2012,2013,2014]);

      sanders_chart.yAxis.tickFormat(d3.format(',.2f'));
      sanders_chart.interpolate("monotone")
      sanders_chart.showLegend(true);
      sanders_chart_data = d3.select('#sanders-chart').append('svg')
          .datum(data_sanders)
          .call(sanders_chart);

      nv.utils.windowResize(sanders_chart.update);
      return sanders_chart;
  });
    $('.selectpicker').selectpicker({
      style: 'btn-info',
      size: 4
    });
	// var chart1 = document.getElementById("line-chart").getContext("2d");
	// window.myLine = new Chart(chart1).Line(lineChartData, {
	// 	responsive: true
	// });
	// var chart12 = document.getElementById("line-chart2").getContext("2d");
	// window.myLine = new Chart(chart12).Line(lineChartData, {
	// 	responsive: true,
	// 	datasetFill : false
	// });
	// var chart2 = document.getElementById("bar-chart").getContext("2d");
	// window.myBar = new Chart(chart2).Bar(barChartData, {
	// 	responsive : true
	// });
	var hillary_select = $("#hillary-picker").on("changed.bs.select", function(e){
    var selectedText = $(this).find("option:selected").text();
    var img_id = index_hillary[selectedText]
    var img_path = "./photos_deb/frame_"+ img_id
    var text_id = "frame_"+ img_id
    var text = text_map[text_id]["text"]

    $("#debate-image").attr("src", img_path)
    $("#candidate-image").attr("src", "img/hillary.jpg")
    $("#candidate-name").text("Hillary Clinton")
    $("#debate-script").text(text)
  })
  var sanders_select = $("#sanders-picker").on("changed.bs.select", function(e){
    var selectedText = $(this).find("option:selected").text();
    var img_id = index_sanders[selectedText]
    var img_path = "./photos_deb/frame_"+ img_id
    var text_id = "frame_"+ img_id
    var text = text_map[text_id]["text"]

    $("#debate-image").attr("src", img_path)
    $("#candidate-image").attr("src", "img/sanders.jpg")
    $("#candidate-name").text("Bernie Sanders")
    $("#debate-script").text(text)
  })
  // var hillary_select = $("#hillary-picker").on("changed.bs.select", function(e){
  //   var selectedText = $(this).find("option:selected").text();
  //   var img_id = index_hillary[selectedText]
  //   var img_path = "./photos_deb/frame_"+ img_id
  //   $("#debate-image").attr("src", img_path)
  //   // $("#debate-script").text()
  // })
	
});