function getApiKey() {
	return 'AIzaSyAXwb8gGqL5QfOLAmKyT7vF3OHEtiaV-Nw';
}

function onLoadGoogleClient() {
    gapi.client.setApiKey(getApiKey());
    
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['quotation']);
      });
}
