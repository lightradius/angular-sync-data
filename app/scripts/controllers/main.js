'use strict';

var app = angular.module('SharingModelsTest');

// Abstract resource
app.factory('DefaultResource', function($resource){

	var baseURL = 'http://www.mocky.io',
		baseParams = {
            callback: 'JSON_CALLBACK'
		},
		baseOptions = {
			query: {
                method: 'JSONP'
            }
		}

	return function(endpoint, params, options){
		var url = baseURL + endpoint,
			p = _.extend(params, baseParams),
			o = _.extend(options, baseOptions);

		return $resource(url, p, o);
	};

});

// Abstract model
app.factory('DefaultModel', function(){

	var Model = function(defaults, resource){
		this.data = defaults;
		this.resource = resource;
	};

	Model.prototype.fetch = function(){
		var self = this;

		this.resource.query(function(result){
			self.data = result.data;
		});
	};

	return Model;

});

// Session resources will be used to populate the model
app.factory('SessionResource', function(DefaultResource){

	var endpoint = '/v2/519f7daf134b59b9026d8ce4',
		params = {},
		options = {};

	return new DefaultResource(endpoint, params, options);

});

// Session model will be shared in the Session and Media controllers
app.factory('SessionModel', function(DefaultModel, SessionResource){

	var defaults = {
		token: "#my_default_token"
	}

	return new DefaultModel(defaults, SessionResource);

});

// Session controller
app.controller('SessionController', function ($scope, SessionModel) {
	$scope.SessionModel = SessionModel;

	$scope.fetch = function(){
		SessionModel.fetch();	
	};
});

// Media controller
app.controller('MediaController', function ($scope, SessionModel) {
	$scope.SessionModel = SessionModel;
});
