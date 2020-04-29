var natural = require('natural');
var classifierGnl = new natural.LogisticRegressionClassifier();
var readline = require('readline');
var fs = require('fs');
var fs = require('fs');
var parse = require('csv-parse');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var exitNow = false;
//var pathToModule = require.resolve('deviceprofiler');
var dataPath = "..";//pathToModule.substring(0,pathToModule.indexOf('deviceprofiler'));
rl.on('SIGINT', function() {
  rl.question('Are you sure you want to exit?', function(answer) {
    if (answer.match(/^y(es)?$/i)) {

                classifierGnl.save('classifier.json', function(err, classifier) {
			if (err) console.log(err);
                        console.log("classifier saved");
			process.exit()
                });
                rl.pause();
		exitNow = true;

   }
  });
});
var csvData=[];
fs.createReadStream(dataPath+'/deviceProfiler/data/browscap.csv')
    .pipe(parse({delimiter: ',',skip_lines_with_error:true}))
    .on('data', function(csvrow) {
        //do something with csvrow
        csvData.push(csvrow);
    })
    .on('end',function() {
      //do something wiht csvData
      natural.LogisticRegressionClassifier.load(dataPath+'/deviceProfiler/data/classifier.json', null, function(err, classifier) {
        var fromFile = true;
        console.log("not model found",err,classifier);
        if (!classifier){
               var data = [];

             data = shuffle(csvData);

             data.forEach(function(r,i){
                 if (i>2 && i<150000)
                {
                         var device = r[6];
			 var userAgent = r[0];
			 console.log(userAgent);
                        if (device!==undefined)
                        {
                           if (device.indexOf('Mobile')!==-1) device = "Mobile";
                           if (device.indexOf('TV')!==-1) device = "TV";
                           if (device.indexOf('Mobile')!=-1 || device.indexOf('Tv')!=-1 || device.indexOf('Desktop')!=-1 || device.indexOf('Tablet')!=-1 && userAgent.length>25) { 
                                   classifierGnl.addDocument(tokenizer.tokenize(userAgent),device);

                           }
                        }
                 }

                });
                classifierGnl.train();
                fromFile = false;
                console.log('reading rules from database');
        }
        console.log("Loading done",fromFile);
        if (classifier) classifierGnl = classifier;
//      console.log(classifierGnl);
});

    });
var tokenizer = new natural.WordTokenizer();
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
/*natural.LogisticRegressionClassifier.load(dataPath+'/deviceProfiler/data/classifier.json', null, function(err, classifier) {
	var fromFile = true;
	console.log("not model found",err,classifier);
	if (!classifier){
	       var data = [];
	       var rules = require(dataPath+'/deviceProfiler/data/browscap.json');
                Object.keys(rules).forEach(function(r,i){
                 if (i>2 && i<200000)
                {
		     var tnp = JSON.parse (rules[r]);
		     var device = tnp.Device_Type;
		     if (device!==undefined && device!=0 )
                        {
	                    data.push({agent:r,device:device})

			}
		}
	
		});
	
	     data = shuffle(data);	

	     console.log("reading browscap",err);
             data.forEach(function(r,i){
		 if (i>2 && i<200000)
	        {
                	 var device = r.device;
	                if (device!==undefined)
                        {
                           if (device.indexOf('Mobile')!==-1) device = "Mobile";
	        	   if (device.indexOf('TV')!==-1) device = "TV";
			   if (device.indexOf('Mobile')!=-1 || device.indexOf('Tv')!=-1 || device.indexOf('Desktop')!=-1 || device.indexOf('Tablet')!=-1 && r.agent.length>25) { 
				   if (device.indexOf('Desktop')!=-1) console.log(r.device,r.agent);
				   classifierGnl.addDocument(tokenizer.tokenize(r.agent),r.device);
		
			   }
                        }
       		 }

		});
		classifierGnl.train();
		fromFile = false;
		console.log('reading rules from database');
	}
	console.log("Loading done",fromFile);
	if (classifier) classifierGnl = classifier;
//	console.log(classifierGnl);
});*/
 function checkDevice (userAgent,logger){
         logger.info(userAgent);
         var result ={};
	       result.deviceType = classifierGnl.classify(userAgent);
         logger.info("Device type:"+result.deviceType);
         var probability= classifierGnl.getClassifications(userAgent);
         if (probability[0].value<0.75) logger.warn('Not sure');
         logger.info(probability[0].value);
         result.fiability = probability[0].value;
	 result.userAgent = userAgent;
	return result;
 }
function learn (question,answer){
	console.log(question,answer);
	classifierGnl.addDocument(question,answer);
  classifierGnl.train();
	console.log("train done");
  console.log(question,answer);
	var result = classifierGnl.classify(question);
  console.log("Device type:"+result);
	return true;
}
module.exports.checkDevice = checkDevice;
module.exports.learn = learn;
