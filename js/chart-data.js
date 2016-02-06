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
			index_sanders[i*15] =  object["ID"]
			d3.select("#sanders-picker").append("option").text(i*15)
			i = i+1
		}else{
			emotions.forEach(function(emo){
				hillary[emo].push({"x": j , "y" : object[emo]})
			});
			index_hillary[j*15] =  object["ID"]
			d3.select("#hillary-picker").append("option").text(j*15)
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

	var hillary_select = $("#hillary-picker").on("changed.bs.select", function(e){
    var selectedText = $(this).find("option:selected").text();
    var img_id = index_hillary[selectedText]
    var img_path = "./photos_deb/frame_"+ img_id
    var text_id = "frame_"+ img_id
    var text = text_map[text_id]["text"]
    console.log(text_id)

    $("#debate-image").attr("src", img_path)
    $("#candidate-image").attr("src", "img/hillary.jpg")
    $("#candidate-name").text("Hillary Clinton")
    $("#debate-script").text(text)
    entities = text_map[text_id]["entities"]
    entities_list = []
    for(var key in entities){
      entities_list.push({"entity": key, "sentiment":entities[key]["sent"], "score":entities[key]["sent_score"]})
      
    }
    
    d3.select("#entities-container").text("")
    div = d3.select("#entities-container").selectAll("div")
        .data(entities_list)
        .enter()
    dl = div.append("dl").attr("class","dl-horizontal")

    dl.append("dt").text("Entity")
    dl.append("dd").text(function(d){return(d["entity"])})
    dl.append("dt").text("Sentiment")
    dl.append("dd").text(function(d){return(d["sentiment"])})
    dl.append("dt").text("Score")
    dl.append("dd").text(function(d){return(d["score"])})
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
    entities = text_map[text_id]["entities"]
    entities_list = []

    for(var key in entities){
      entities_list.push({"entity": key, "sentiment":entities[key]["sent"], "score":entities[key]["sent_score"]})
      
    }
    
    d3.select("#entities-container").text("")
    div = d3.select("#entities-container").selectAll("div")
        .data(entities_list)
        .enter()
    dl = div.append("dl").attr("class","dl-horizontal")

    dl.append("dt").text("Entity")
    dl.append("dd").text(function(d){return(d["entity"])})
    dl.append("dt").text("Sentiment")
    dl.append("dd").text(function(d){return(d["sentiment"])})
    dl.append("dt").text("Score")
    dl.append("dd").text(function(d){return(d["score"])})
  })
  function init(){
      default_time_id = 50*15

      var img_id = index_hillary[default_time_id]
      var img_path = "./photos_deb/frame_"+ img_id
      var text_id = "frame_"+ img_id

      var text = text_map[text_id]["text"]

      $("#debate-image").attr("src", img_path)
      $("#candidate-image").attr("src", "img/hillary.jpg")
      $("#candidate-name").text("Hillary Clinton")
      $("#debate-script").text(text)
      entities = text_map[text_id]["entities"]
      entities_list = []
      for(var key in entities){
        entities_list.push({"entity": key, "sentiment":entities[key]["sent"], "score":entities[key]["sent_score"]})
        
      }
      
      d3.select("#entities-container").text("")
      div = d3.select("#entities-container").selectAll("div")
          .data(entities_list)
          .enter()
      dl = div.append("dl").attr("class","dl-horizontal")

      dl.append("dt").text("Entity")
      dl.append("dd").text(function(d){return(d["entity"])})
      dl.append("dt").text("Sentiment")
      dl.append("dd").text(function(d){return(d["sentiment"])})
      dl.append("dt").text("Score")
      dl.append("dd").text(function(d){return(d["score"])})
    }
  init()
});