function getApiKey() {
	return 'AIzaSyAXwb8gGqL5QfOLAmKyT7vF3OHEtiaV-Nw';
}

var language = "en_us"
var localeDatePattern = "M/d/yyyy"

function bootstrap() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['quotation']);
	});
}
	
function onLoadGoogleClient() {
    gapi.client.setApiKey(getApiKey());

	var location = window.location;
	var query = location.protocol + "//" + location.host + "/" + "locale/locale";
	$.getJSON(query, {}).done(function(locale) {
		language = locale.language;
		localeDatePattern = locale.date;
		bootstrap();
	}).fail(function(jqxhr, textStatus, error) {
		bootsratp();
    });
}
