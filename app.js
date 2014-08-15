/**************************************************************************************************
 * 
 * IBM Bluemix app with Cloudant service using Node.js
 * Name: Tinniam V Ganesh                                               Date:27 Jul 2014
 * 
 */

// Obtain the mongodb interface from VCAP_SERVICES
var pouchdb = require('pouchdb');
var http = require('http');
if (process.env.VCAP_SERVICES) {
	  // Running on Bluemix. Parse out the port and host that we've been assigned.
	  var env = JSON.parse(process.env.VCAP_SERVICES);
	  var host = process.env.VCAP_APP_HOST; 
	  var port = process.env.VCAP_APP_PORT;
	  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    
	  // Also parse out Cloudant settings.
	  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	}


// Callback function
var mycallback = function(err,results) {
    console.log("mycallback");
    if(err) throw err;
};

//Insert records into the test DB
var insert_records = function(req, res) {
	console.log("aa");
	if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  // Also parse Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
		}
	//var db = new pouchdb('test', {adapter : 'websql'}),
	var db = new pouchdb('test'),
	 remote =cloudant.url + '/test';
	opts = {
	  continuous: true
	  };
     //Create a collection test
	console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);
	
	
	db.put({
		  author: 'John Grisham',
		  Title : 'The Firm'		  
		}, 'book1', function (err, response) {
		  console.log(err || response);
		});
	 db.put({
		  author: 'Authur C Clarke',
		  Title : '2001: A Space Odyssey'		  
		}, 'book2', function (err, response) {
		  console.log(err || response);
		});
	 db.put({
		  author: 'Dan Brown',
		  Title : 'Digital Fortress'		  
		}, 'book3', function (err, response) {
		  console.log(err || response);
		});
	 res.writeHead(200, {'Content-Type': 'text/plain'});
	 res.write("2 records is inserted");
	 res.end();
}; // End insert_records


// Update records in the test DB
var update_records = function(req, res) {
	if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  // Also parse Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	}
	//var db = new pouchdb('test', {adapter : 'websql'}),
	var db = new pouchdb('test'),
	remote =cloudant.url + '/test';

	opts = {
	  continuous: true
	  };
     //Create a collection test
	console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);
	db.get('book1', function(err, otherDoc) {
		  db.put({
		    title: "The Client"
		  }, ' book1', function(err, response) {
		  });
		});
	res.writeHead(200, {'Content-Type': 'text/plain'});
 	res.write("Updated 1 records");
 	res.end();

}; //End update-records

//Delete records from the test DB
var delete_record = function(req, res) {
	if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse out the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;
		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  // Also parse out Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
		}
	//var db = new pouchdb('test', {adapter : 'websql'}),	
	var db = new pouchdb('test'),
	  remote =cloudant.url + '/test';
	opts = {
	  continuous: true
	 };
     //Create a collection test
	console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);
    //Deleting documents
	db.get('book1', function(err, doc) {
		db.remove(doc, function(err, response) { });
	});
	
	
	
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
 	res.write("Deleted 2 records");
 	res.end();
}; //End delete-records



//List Records from the test DB
var list_records = function(req, res) {
	if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse out the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;
		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  // Also parse out Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
		}
	//var db = new pouchdb('test', {adapter : 'websql'}),	
	var db = new pouchdb('test'),
	  remote =cloudant.url + '/test';
	opts = {
	  continuous: true
	 };
		
   //Create a collection test
	console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);	

	var docs = db.allDocs(function(err, response) { 
		console.log("1");
		val = response.total_rows;
		
		var details = "";
		j=0;
		for(i=0; i < val; i++) {
			console.log("3");			
				//get_docs(db.get(response.rows[i].id),res, function (err,doc){
			db.get(response.rows[i].id, function (err,doc){
				 j++;
				console.log("i=" + i + "j = " + j);			
				res.write(JSON.stringify(doc.Title) + "\n");			
				console.log(JSON.stringify(doc.Title) + "\n");									
			    details= details + JSON.stringify(doc.Title) + "\n";
			    if(j == 3) {
			    	console.log('Here');
			    	res.writeHead(200, {'Content-Type': 'text/plain'});
			    	res.write(details);
			    	res.end();
			    }
			    console.log(details);
			   
			    
			   
		   }); // End db.get
			
		} //End for
		console.log("6");
		
        console.log("in list");	
	
     }); // End db.allDocs

   
  };


var port = (process.env.VCAP_APP_PORT || 1337);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');

//Create a Webserver and wait for REST API CRUD calls
require('http').createServer(function(req, res) {	  
	//Set up the DB connection
	 if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse out the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  // Also parse out Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	 }
	 //var db = new pouchdb('test',{adapter : 'websql'}),
	 var db = new pouchdb('test'),
	
	   remote =cloudant.url + '/test';	  
	  opts = {
	    continuous: true
	    };	   
	    console.log(remote);
		db.replicate.to(remote, opts);
		db.replicate.from(remote, opts);			
		console.log("Reached3");
	// Perform CRUD operations through REST APIs
	  if(req.method == 'POST') {
	             insert_records(req,res);
	             
	  }
	  else if(req.method == 'GET') {   
	          list_records(req,res);	          
	   }
	   else if(req.method == 'PUT') {
	          update_records(req,res);
	    }
	     else if(req.method == 'DELETE') {
	          delete_record(req,res);
	    }      
  
}).listen(port, host);
console.log("Connected to port =" + port + " host =  " + host);