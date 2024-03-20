SmoothPagination = function(){};

$(function()
{


// Pagination
SmoothPagination = function(parent, dataTarget, object)
{
	var data = object.data.filter((val) => val != '');
	var resultsData = [];
	var totalResults = data.length;
	var pageLinksCount = (object.linksCount == null) ? 0 : object.linksCount;
	var isVisible = (object.isVisible == null) ? true : false;
	var parent = parent;
	var append = (object.append) ? true: false;
	var page = 0;
	var resultsPerPage = (object.resultsPerPage == null) ? 15 : object.resultsPerPage;
	var totalPages = 0
	var firstPage = 0;

	// results per page
	setResultsPerPage(data)
	// html Container
	var htmlContainer = '<div class="smooth-pagination-container"></div>';
	// Page Links
	var links = `<ul class="sp-navmenu">
					<li class="spnm-list-item"><a href="#" class="spnmli-nav-link" data-role="PAGE_LINK_FIRST">${FUI_DISPLAY_LANG.views.pages.global.pagination.first}</a></li>
					<li class="spnm-list-item"><a href="#" class="spnmli-nav-link" data-role="PAGE_LINK_PREVIOUS">${FUI_DISPLAY_LANG.views.pages.global.pagination.previous}</a></li>`;
	for (var i = 0; i < pageLinksCount; i++) 
	{
		links += '<li class="spnm-list-item"><a href="#" class="spnmli-nav-link spnmli-page-num" data-role="PAGE_LINK">'+i+'</a></li>';
	}
	links += `<li class="spnm-list-item"><a href="#" class="spnmli-nav-link" data-role="PAGE_LINK_NEXT">${FUI_DISPLAY_LANG.views.pages.global.pagination.next}</a></li>
				<li class="spnm-list-item"><a href="#" class="spnmli-nav-link" data-role="PAGE_LINK_LAST">${FUI_DISPLAY_LANG.views.pages.global.pagination.last}</a></li>
			</ul>`;
	
	// results to show numbers
	var resultsToShowOptions = ''
	for (let i = 10; i <= 300; i+=10) 
	{
		resultsToShowOptions += `<option value="${i}">${i}</option>`
	}

	links += `<div class="results-to-show-select-wrapper results_to_show_select_wrapper">
				<select class="results-to-show-select results_to_show_select">
					<option value="5" selected>${FUI_DISPLAY_LANG.views.pages.global.placeholder12}</option>
					${resultsToShowOptions}
				</select>
			</div>`

	var resultsPerPage = resultsPerPage;
	parent.html(htmlContainer);
	//dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()
	// Select Container
	var smoothPaginationContainer = $('.smooth-pagination-container');

	smoothPaginationContainer.html(links);
	// check if has total results data attribute
	if ( parent.data('total-results') )
	{
		var htmlPagePagCounter = `<div class="spc-pagination-counter-div">
								<div><span>${FUI_DISPLAY_LANG.views.pages.global.pagination.text1}: </span><span class="spcpc-counter-label">${parent.data('total-results')}</span></div>
							</div>`;
		//
		smoothPaginationContainer.append(htmlPagePagCounter);
	}
	// smoothPaginationContainer.append(htmlPagePagCounter);

	var results_to_show_select = smoothPaginationContainer.find('.results_to_show_select');

	// ovveride resultsPerPage if results_to_show_select has value selected
	if ( results_to_show_select.find(':selected').val() != '' )
		resultsPerPage = results_to_show_select.find(':selected').val()

	// set visibility
	if ( !isVisible )
		smoothPaginationContainer.css('display', 'none');
	// Assign page link count
	var pageLinksCount = pageLinksCount;
	// Current page
	var pageLinkIndex = 0;
	var pliCount = 0;
	// Page Counter
	var spcpcPage = smoothPaginationContainer.find('.spc-pagination-counter-div #spcpcPage');
	parent.off('click');
	parent.on('click', function(e)
	{
		e.preventDefault();
		
		if ( $(e.target).data('role') == 'PAGE_LINK' )
		{
			var target = $(e.target);
			page = parseInt(target.text());
			dataTarget.html( resultsData[page] );
		}
		else if ( $(e.target).data('role') == 'PAGE_LINK_NEXT' )
		{	
			var target = $(e.target);
			
			if ( page == totalPages )
				return;
			
			page++;
			dataTarget.html( resultsData[page] );
			//dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			// Re-assign page numbers to links
			pageLinkIndex = page;
			if ( pageLinkIndex > totalPages )
				return;
			for (var i = 0; i < pageLinksCount; i++) 
			{
				if ( pageLinkIndex > totalPages )
					break;
				$(smoothPaginationContainer.find('.spnmli-page-num')[i]).text(pageLinkIndex);
				pageLinkIndex++;
			}
			pliCount = pageLinkIndex;
		}
		else if ( $(e.target).data('role') == 'PAGE_LINK_PREVIOUS' )
		{
			var target = $(e.target);
			
			if ( page == firstPage )
				return;
			
			page--;
			dataTarget.html( resultsData[page] );
			//dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			// Re-assign page numbers to links
			pageLinkIndex = pliCount;
			pliCount--;
			if ( pageLinkIndex < pageLinksCount )
				return;

			pageLinkIndex--;
			for (var i = pageLinksCount-1; i >= 0; i--) 
			{
				$(smoothPaginationContainer.find('.spnmli-page-num')[i]).text(pageLinkIndex);
				pageLinkIndex--;
			}
			
		}
		else if ( $(e.target).data('role') == 'PAGE_LINK_FIRST' )
		{
			var target = $(e.target);
			
			if ( page == firstPage )
				return;
			
			page = 0;
			dataTarget.html( resultsData[page] );
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			// Re-assign page numbers to links
			pliCount = 0;
			pageLinkIndex = 0;
			for (var i = pageLinksCount-1; i >= 0; i--) 
			{
				$(smoothPaginationContainer.find('.spnmli-page-num')[i]).text(i);
			}
		}
		else if ( $(e.target).data('role') == 'PAGE_LINK_LAST' )
		{
			var target = $(e.target);
			
			if ( page == totalPages )
				return;
			
			page = resultsData.length-1;
			dataTarget.html( resultsData[page] );
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			// Re-assign page numbers to links
			pageLinkIndex = page - pageLinksCount;
			for (var i = 0; i < pageLinksCount; i++) 
			{
				$(smoothPaginationContainer.find('.spnmli-page-num')[i]).text(pageLinkIndex);
				pageLinkIndex++;
			}
			pliCount = pageLinkIndex;
		}
		// Set page counter
		spcpcPage.text(page);
	});
		
	// select results to show
	results_to_show_select.off('change').on('change', e =>
	{
		var val = results_to_show_select.find(':selected').val()

		resultsPerPage = parseInt(val)
		// reset page to first
		page = 0
		setResultsPerPage(data)
	})

	// set results per page
	function setResultsPerPage(data)
	{
		// results results array
		resultsData = []
		// results per page array
		var res = 0;
		var results = '';
		for (var i=0; i <= data.length; i++ )
		{
			if ( res == resultsPerPage || i == data.length )
			{	
				resultsData.push(results);
				res = 0;
				results = '';

			}
			results += data[i];
			res++;
		}

		// totalPages = resultsData.length-1;
		totalPages = data.length;
		// append html
		if ( !append )
			dataTarget.html( resultsData[page] );
		else
			dataTarget.append( resultsData[page] );

		//
		dispatch_onNewAjaxContentLoaded()
	}
}



});