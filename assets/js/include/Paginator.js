

$(function()
{

Paginator = function(parent, data, options = {})
{
    const POS_TOP = 'top';
    const POS_BOTTOM = 'bottom';
    const NAV_NEXT = 'next';
    const NAV_PREVIOUS = 'previous';
    
    const PARENT = (parent[0].nodeName == 'TABLE') ? parent.find('tbody') : parent;
    const PAGINATION_CONTAINER = (options.paginationContainer) ?? null;
    const PAGINATION_CONTAINER_ID = `pagination_${parent.attr('id')}_`;
    const DATA = data.filter((val) => val != '');
    const PER_PAGE = (options.perPage) ?? 8;
    const POSITION = (options.position) ?? POS_TOP;

    var LINKS = {
        visible: true,
        max: 0,
        position: 'center',
    };
    if ( options.links )
    {
        LINKS.visible = options.links.visible;
        LINKS.position = (options.links.position) ?? LINKS.position;
    }
    var currentPage = (options.currentPage) ?? 1;
    var paginated = [];

    let paginationContainer = $('');
    let nextBTN;
    let previousBTN;

    var currentLinksIteration = 1;
    var currentPageNavigation = NAV_NEXT;

    doPaginate();

    // navigate
    paginationContainer.off('click');
    paginationContainer.on('click', e =>
    {
        e.preventDefault();
        var target = $(e.target);
        if ( target.data('role') == 'link' )
        {
            doGoToPage(target.data('page'));
        }
        else if ( target.data('role') == 'next' )
        {
            doNextPage();
        }
        else if ( target.data('role') == 'previous' )
        {
            doPreviousPage();
        }
    });
    // do paginate
    function doPaginate()
    {
        var results = 1;
        var index = 1;
        var dataPerPage = '';
        DATA.forEach((row, i, array) => 
        {
            dataPerPage += row;

            if ( results == PER_PAGE || i == array.length -1 )
            {
                paginated[index] = dataPerPage;
                dataPerPage = '';
                results = 0;
                index++;
            } 

            results++;
        });
        doGoToPage(1);

        if ( paginated.length - 1 > 1 )
            doCreatePagin();
    }
    // do go to page
    function doGoToPage(page)
    {
        PARENT.html(paginated[page]);
        currentPage = page;
        doUpdateButtons();
        setSelectedLink();
        lastVisibleLink()
        //dispatch_onNewAjaxContentLoaded()
        dispatch_onNewAjaxContentLoaded()
    }
    // do go to next page
    function doNextPage()
    {
        previousBTN.removeClass('is-disabled');
        ++currentPage;
        PARENT.html(paginated[currentPage]);
        currentPageNavigation = NAV_NEXT;
        doCreatePaginLinks();
        setSelectedLink();
        //dispatch_onNewAjaxContentLoaded()
        dispatch_onNewAjaxContentLoaded()
        
        if ( currentPage == paginated.length -1 )
        {
            nextBTN.addClass('is-disabled');
            return;
        }
    }
    // do go to previous page
    function doPreviousPage()
    {
        nextBTN.removeClass('is-disabled');
        --currentPage;
        PARENT.html(paginated[currentPage]);
        currentPageNavigation = NAV_PREVIOUS;
        doCreatePaginLinks(currentPage);
        setSelectedLink();
        //dispatch_onNewAjaxContentLoaded()
        dispatch_onNewAjaxContentLoaded()

        if ( currentPage == 1 )
        {
            previousBTN.addClass('is-disabled');
            return;
        }
    }
    // update buttons
    function doUpdateButtons()
    {
        if ( !nextBTN && !previousBTN )
            return;
        nextBTN.removeClass('is-disabled');
        previousBTN.removeClass('is-disabled');
        if ( currentPage == 1 )
        {
            previousBTN.addClass('is-disabled');
            return;
        }

        if ( currentPage == paginated.length -1 )
        {
            nextBTN.addClass('is-disabled');
            return;
        }
    }
    // do set selected link
    function setSelectedLink()
    {
        if ( !paginationContainer )
            return;

        var links = getLinks();
        for (let i = 0; i < links.length; i++)
        {
            link = $(links[i]);

            if ( currentPage == link.data('page') )
            {
                link.addClass('is-current')
                .parent().siblings().find('[data-role="link"]').removeClass('is-current');
                return;
            }
        };
    }
    // links
    function getLinks()
    {
        return paginationContainer.find('[data-role="link"]');
    }
    // do links
    function doCreatePagin()
    {
        var html = `<div class="paginator-links" id="${PAGINATION_CONTAINER_ID}" style="margin: 1em 0;">
                        <nav class="pagination is-small justify-content-${LINKS.position}" role="navigation" aria-label="pagination">
                            <a class="pagination-previous is-disabled" data-role="previous">${FUI_DISPLAY_LANG.views.pages.global.pagination.previous}</a>
                            <a class="pagination-next" data-role="next">${FUI_DISPLAY_LANG.views.pages.global.pagination.next}</a>
                            <ul class="pagination-list">
                                
                            </ul>
                        </nav>
                    </div>`;
        //
        paginationContainer = $('#'+PAGINATION_CONTAINER_ID);

        if ( paginationContainer[0] ) paginationContainer.remove()

        if ( PAGINATION_CONTAINER )
            PAGINATION_CONTAINER.html(html);
        else
        {
            if ( POSITION == POS_TOP )
            {
                if ( PARENT[0].nodeName == 'TBODY' )
                    $(html).insertBefore(PARENT.parent());
                else
                    $(html).insertBefore(PARENT);    
            }
            else if ( POSITION == POS_BOTTOM )
            {
                if ( PARENT[0].nodeName == 'TBODY' )
                    $(html).insertAfter(PARENT.parent());
                else
                    $(html).insertAfter(PARENT);    
            }
        }

        paginationContainer = $('#'+PAGINATION_CONTAINER_ID);
        nextBTN = paginationContainer.find('[data-role="next"]');
        previousBTN = paginationContainer.find('[data-role="previous"]');
        doCreatePaginLinks();
        
    }
    // do draw links
    function doCreatePaginLinks()
    {
        var links = '';
        if ( LINKS.visible )
        {
            if ( paginated.length > 0 )
                LINKS.max = paginated.length;
            
            if ( paginated.length >= 7 )
                LINKS.max = 5;

            iteration = currentLinksIteration;

            if ( currentPageNavigation == NAV_NEXT )
            {
                if ( getLinks().length == LINKS.max )
                {
                    if ( isLastVisibleLink() )
                    {
                        currentLinksIteration = currentPage;
                        iteration = currentLinksIteration;   
                    }
                    else if ( isBeforeLastVisibleLink() )
                    {
                        currentLinksIteration = lastVisibleLink().data('page');
                        iteration = currentLinksIteration;   
                    }
                }   
            }
            else if ( currentPageNavigation == NAV_PREVIOUS )
            {
                if ( isFirstVisibleLink() )
                {
                    currentLinksIteration = ( Math.abs(currentPage - LINKS.max) + 1) * 1;
                    if ( isFirstIterationLink() )
                        currentLinksIteration = 1
                    iteration = currentLinksIteration;   
                }
                else if ( isBeforeFirstVisibleLink() )
                {
                    currentLinksIteration = ( Math.abs(currentPage - LINKS.max + 1) + 1) * 1;
                    if ( isFirstIterationLink() )
                        currentLinksIteration = 1
                    iteration = currentLinksIteration;   
                }  
            }

            var max = 1;
            for (let i = iteration; i < paginated.length; i++) 
            {
                if ( max == Math.round(LINKS.max/2) )
                {
                    links += `<li>
                                <span class="pagination-ellipsis">&hellip;</span>
                            </li>`;
                }
                if ( i == 1 )
                {
                    links += `<li>
                                <a class="pagination-link is-current" data-role="link" data-page="${i}">${i}</a>
                            </li>`; 
                }
                else
                {
                    links += `<li>
                                <a class="pagination-link" data-role="link" data-page="${i}">${i}</a>
                            </li>`; 
                }    

                if ( LINKS.max == max )
                {
                    break;
                }
                
                max++;
            }
        }
        paginationContainer.find('.pagination-list').html(links);
    }
    // do last visible link
    function lastVisibleLink()
    {
        return getLinks().last();
    }
    // do first visible link
    function firstVisibleLink()
    {
        return getLinks().first();
    }
    // is last visible link
    function isLastVisibleLink()
    {
        return (lastVisibleLink().data('page') == currentPage) ? true : false;
    }
    // is before last visible link
    function isBeforeLastVisibleLink()
    {
        return (lastVisibleLink().data('page') == currentPage -1) ? true : false;
    }
    // is first visible link
    function isFirstVisibleLink()
    {
        return (firstVisibleLink().data('page') == currentPage) ? true : false;
    }
    // is before first visible link
    function isBeforeFirstVisibleLink()
    {
        return (firstVisibleLink().data('page') == currentPage +1) ? true : false;
    }
    // is first iteration link
    function isFirstIterationLink()
    {
        return (firstVisibleLink().data('page') == 1) ? true : false;
    }
    // do unique id
    function doUniqueId(length = 10) 
    {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

});