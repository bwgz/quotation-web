var controllers = angular.module('controllers', []);

function updateAuthor($scope, author) {
	//console.log("updateAuthor - author: " + JSON.stringify(author));
    var request = gapi.client.request({
    	'path': '/freebase/v1/topic' + author.id
    	});
	request.execute(function(data) {
		//console.log("updateAuthor - data: " + JSON.stringify(data));
		author.setName(data.property['/type/object/name']);
		author.setNotableFor(data.property['/common/topic/notable_for']);
		author.setDescription(data.property['/common/topic/description']);
		author.setImage(data.property['/common/topic/image']);
		author.setDateOfBirth(data.property['/people/person/date_of_birth']);
		author.setPlaceOfBirth(data.property['/people/person/place_of_birth']);
		author.setDateOfDeath(data.property['/people/deceased_person/date_of_death']);
		author.setPlaceOfDeath(data.property['/people/deceased_person/place_of_death']);
		author.setQuotations(data.property['/people/person/quotations']);
		//console.log("updateAuthor - author: " + JSON.stringify(author));
		$scope.$apply()
	});
};

function updateSubject($scope, subject) {
    var request = gapi.client.request({
    	'path': '/freebase/v1/topic' + subject.id
    	});
	request.execute(function(data) {
		subject.setName(data.property['/type/object/name']);
		subject.setDescription(data.property['/common/topic/description']);
		subject.setImage(data.property['/common/topic/image']);
		subject.setQuotations(data.property['/media_common/quotation_subject/quotations_about_this_subject']);
		$scope.$apply()
	});
};

function updateSource($scope, source) {
    var request = gapi.client.request({
    	'path': '/freebase/v1/topic' + source.id
    	});
	request.execute(function(data) {
		source.setType(data.property['/common/topic/notable_types']);
		$scope.$apply()
	});
};

controllers.controller('AuthorController', [ '$routeParams', '$scope',
	function($routeParams, $scope) {
		//console.log("AuthorController - id: " + $routeParams.id);
		
		var author = new Person('/m/' + $routeParams.id);
		$scope.author = author;
		updateAuthor($scope, author);
	}]);

controllers.controller('QuotationController', [ '$http', '$routeParams', '$scope',
	function($http, $routeParams, $scope) {
		//console.log("QuotationController - id: " + $routeParams.id);
	
	    var request = gapi.client.request({
	    	'path': '/freebase/v1/topic/m/' + $routeParams.id
	    	});
		request.execute(function(data) {
			//console.log("QuotationController - data: " + JSON.stringify(data));
			var quotation = new Quotation(data.id);
			$scope.quotation = quotation;
			
			quotation.setQuotation(data.property['/type/object/name']);
			quotation.setSpokenByCharacter(data.property['/media_common/quotation/spoken_by_character']);
			quotation.setSource(data.property['/media_common/quotation/source']);

			if (quotation.source) {
				updateSource($scope, quotation.source);
			}
			
			quotation.setAuthors(data.property['/media_common/quotation/author']);
			if (quotation.authors) {
				for (var i = 0; i < quotation.authors.length; i++) {
					var author = quotation.authors[i];
					updateAuthor($scope, author);
				}
			}
			
			quotation.setSubjects(data.property['/media_common/quotation/subjects']);
			if (quotation.subjects) {
				for (var i = 0; i < quotation.subjects.length; i++) {
					var subject = quotation.subjects[i];
					// console.log("QuotationController - subject.id: " + subject.id);
					updateSubject($scope, subject);
				}
			}
			
			$http.get('/quotation/random/mid').success(function(data) {
				$scope.refresh = data.mid;
			});
			
			var options = {
				    calltoactionlabel: 'OPEN',
				    calltoactionurl: 'http://quotation.bwgz.org/quotation'+ quotation.id,
					clientid: '848640002630-vgap1rvadjan9hv51j0r8phatdsv4kt9.apps.googleusercontent.com',
					contenturl: 'http://quotation.bwgz.org',
				    cookiepolicy: 'single_host_origin',
				    prefilltext: quotation.quotation
				  };
			
			gapi.interactivepost.render('gplus-share', options);
		});
	}]);

controllers.controller('SubjectController', [ '$routeParams', '$scope',
	function($routeParams, $scope) {
		// console.log("SubjectController - id: " + $routeParams.id);
		
		var subject = new Subject('/m/' + $routeParams.id);
		$scope.subject = subject;
		
		updateSubject($scope, subject);
	}]);

controllers.controller('TopicController', [ '$routeParams', '$scope',
	function($routeParams, $scope) {
		// console.log("TopicController - id: " + $routeParams.id);

	    var request = gapi.client.request({
	    	'path': '/freebase/v1/topic/m/' + $routeParams.id
	    	});
		request.execute(function(data) {
			$scope.data = data;
		});
	}]);

controllers.controller('RandomQuotationController', [ '$http', '$location', '$scope',
	function($http, $location, $scope) {
		// console.log("RandomQuotationController");
		$http.get('/quotation/random/mid').success(function(data) {
			$location.path('/quotation' + data.mid).replace();
		});
	}]);

controllers.controller('SearchSubmitController', [ '$location', '$scope',
  	function($location, $scope) {
  		// console.log("SearchSubmitController");
		$scope.submit = function() {
			if ($scope.query) {
				// console.log("Ctrl - text: " + $scope.text);
				$location.path('/search');
				$location.search({query: $scope.query});
				//console.log("Ctrl - path: " + $location.path());
			}
		};
  	}]);

controllers.controller('SearchController', [ '$http', '$routeParams', '$scope', 'ngTableParams',
 	function($http, $routeParams, $scope, ngTableParams) {
 		// console.log("SearchController");
 		
 		$scope.query = $routeParams.query;
 		// console.log("SearchController - query: " + $scope.query);
 		
 	    $scope.tableParams = new ngTableParams({
 	        page: 1,
 	        count: 10
 	    }, {
 	        total: 0,
 	        getData: function($defer, params) {
	 	   	    var request = gapi.client.request({
	 		    	'path': '/freebase/v1/search',
	 		    	'params': { 'query': $scope.query, 'filter': '(any type:/media_common/quotation)', 'limit': 100 }
	 		    	});
	 			request.execute(function(data) {
	 				var results = data.result;
                    params.total(results.length);
 	    			$defer.resolve(results.slice((params.page() - 1) * params.count(), params.page() * params.count()));
	 			});
 	        }
 	    });

 	}]);
