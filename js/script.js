$(function() {
	var searchField = $('#query');
	var icon = $('#search-btn');


	//Focus handler
	$(searchField).on('focus', function() {
		$(this).animate({
			width: '100%'}, 400);
		$(icon).animate({
			right: '10px'}, 400);
	});

	//Blur handler
	$(searchField).on('blur', function() {
		if (searchField.val() == "") {
			$(searchField).animate({
				width: '45%'}, 400);
			$(icon).animate({
				right: '360px'}, 400);
		}
	}); 

	$('#search-form').submit(function(e){
		e.preventDefault();
	});
});


function searchWithToken(token) {
	// Clear results 
	$('#results').html("");
	$('#buttons').html("");

	// Get query
	var query = $("#query").val();

	// Run the Youtube API 
	$.get(
		"https://www.googleapis.com/youtube/v3/search", 
		{
			part: "snippet, id",
			q:query, 
			pageToken: token,
			type: "video", 
			key: "AIzaSyDM5sBy_pnyOntJz3pFAnfnRVNvM18JzJ4", 
		},

		function(data) {
			// List page
			$.each(data.items, function(i, item) {
				var output = getOutput(item);
				$('#results').append(output); 
			});


			// List buttons
			var prevPageToken = data.prevPageToken;
			var nextPageToken = data.nextPageToken; 
			var buttons = getButtons(prevPageToken, nextPageToken, query);
			$('#buttons').append(buttons);
		}
	);
}

function search() {
	var token = ""; 
	searchWithToken(token);
}

function nextPage() {
	var token = $('#next-button').data('token'); 
	searchWithToken(token);
}

function prevPage() {
	var token = $('#prev-button').data('token'); 
	searchWithToken(token);
}

function getOutput (item) {
	var videoId = item.id.videoId; 
	var title = item.snippet.title;
	var description = item.snippet.description;
	var thumbnail = item.snippet.thumbnails.high.url;
	var channelTitle = item.snippet.channelTitle;
	var publishedAt = item.snippet.publishedAt;


	var output = 
		'<li> ' +   
			'<div class="list-left"> ' + 
				'<img  src="' + thumbnail + '">' + 
			'</div> ' + 
			'<div class="list-right"> '+ 
				'<h3> <a class="fancybox fancybox.iframe"' + 
				'href="http://www.youtube.com/embed/' + videoId + '">' + title + '</a>' + 
				'</h3> ' + 
				'<small>By <span class=cTitle>' + channelTitle + '</span> on ' + publishedAt + 
				'</small> ' + 
				'<p>' + description + '</p> ' + 
			'<div> ' + 
		'</li> ' + 
		'<div class="clear-fix"><div>';  

	return output;

}

function getButtons(prevPageToken, nextPageToken, query) {
	if (!prevPageToken) {
		btn = "<div class='button-container'>" + 
			  	"<button id='next-button' class='page-button'" + 
			  	"data-token='" + nextPageToken + "' data-query='" + query + "'" +  
			  	"onclick='nextPage();'>Next Page</button>"+ 
			  "</div>"
	} else {
		btn = "<div class='button-container'>" + 

			  	"<button id='prev-button' class='page-button'" + 
			  	"data-token='" + prevPageToken + "' data-query='" + query + "'" +  
			  	"onclick='prevPage();'>Prev Page </button>" + 

			  	"<button id='next-button' class='page-button'" + 
			  	"data-token='" + nextPageToken + "' data-query='" + query + "'" +  
			  	"onclick='nextPage();'>Next Page</button>" + 

			  "</div>"
	}
	return btn;
}