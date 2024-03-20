let PickmePicker

$(function()
{

    PickmePicker = function(options = {})
    {

        if ( !options.rootElement[0] ) throw new Error('HTMLElement expected, but received null!')

        const defaultOptions = {
            visible: false,
            locale: 'ar',
            api: {
                endPoint: DEFAULT_INI_SETTINGS.Server_Settings.API_END_POINT+'Emojies/search'
            }
        }

        options = {...defaultOptions, ...options}

        var events = 
        {
            onEmojySelected: new CustomEvent('emojy-selected', { detail: { emojy: {} } }),
        }

        const rootElement = options.rootElement
        var js_pickme_emoji_picker_container = rootElement.find('.js_pickme_emoji_picker_container')
        // append html
        if ( !js_pickme_emoji_picker_container[0] )
            rootElement.append( doGetHTML() )

        js_pickme_emoji_picker_container = rootElement.find('.js_pickme_emoji_picker_container')
        const js_pickme_emoji_picker_background_overlay = rootElement.find('.js_pickme_emoji_picker_background_overlay')

        const js_pickme_emoji_picker_search_input = rootElement.find('.js_pickme_emoji_picker_search_input')

        const js_pickme_emoji_picker_category_tabs_wrapper = rootElement.find('.js_pickme_emoji_picker_category_tabs_wrapper')

        const js_pickme_emoji_picker_categories_list = rootElement.find('.js_pickme_emoji_picker_categories_list')
        const js_pickme_emoji_picker_category_buttons = rootElement.find('.js_pickme_emoji_picker_category_button')

        const LOCALE = {
            ar: {
                search_input_placeholder: "ابحث عن رموز تعبيرية...",
                categories: {
                    smileys: "الوجوه الضاحكة والأشخاص",
                    animals: "الحيوانات والطبيعة",
                }
            },
            en: {
                search_input_placeholder: "Search for emojies...",
                categories: {
                    smileys: "Smileys & People",
                    animals: "Animals & Nature",
                }
            },
            fr: {
                search_input_placeholder: "Rechercher des émoticônes...",
                categories: {
                    smileys: "Smileys et personnes",
                    animals: "Animaux & Nature",
                }
            }
        }

        // init
        init()

        // doGetHTML
        function doGetHTML()
        {
            return `<div class="pickme-emoji-picker-background-overlay js_pickme_emoji_picker_background_overlay"></div>
                    <div class="pickme-emoji-picker-container js_pickme_emoji_picker_container">

                        <div class="pickme-emoji-picker-header">

                            <div class="pickme-emoji-picker-search-input-group">
                                <input type="text" class="pickme-emoji-picker-search-input js_pickme_emoji_picker_search_input" placeholder="">
                                <div class="pickme-emoji-picker-search-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                                        fill="#727586" />
                                    </svg>
                                </div>
                            </div>

                            <ul class="pickme-emoji-picker-categories-list js_pickme_emoji_picker_categories_list">
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button" data-target="#js_pickme_emoji_picker_category_tab__smileys">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path d="M21.995 14c-.937 0-1.5.75-1.5 2s.563 2 1.5 2c.938 0 1.5-.75 1.5-2s-.562-2-1.5-2m-8 0c-.937 0-1.5.75-1.5 2s.563 2 1.5 2c.938 0 1.5-.75 1.5-2s-.562-2-1.5-2m10.136 6.731a1.038 1.038 0 00-1.44.122 6.183 6.183 0 01-4.698 2.142 6.183 6.183 0 01-4.697-2.142 1.04 1.04 0 00-1.44-.122.984.984 0 00-.125 1.408 8.242 8.242 0 006.262 2.855 8.243 8.243 0 006.263-2.855.984.984 0 00-.125-1.408M18 30c-6.628 0-12-5.372-12-12 0-6.627 5.372-12 12-12 6.627 0 12 5.373 12 12 0 6.628-5.373 12-12 12" fill-rule="evenodd"></path></svg>
                                    </button>
                                </li>
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button" data-target="#js_pickme_emoji_picker_category_tab__animals">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path clip-rule="evenodd" d="M13.216 9.172c.29.441.86.608 1.353.423 1.021-.381 2.164-.592 3.43-.592 1.168 0 2.374.213 3.43.597.495.181 1.065.014 1.355-.428 1.158-1.767 2.184-2.61 2.827-3.005a1.112 1.112 0 011.332.125c2.015 1.792 1.91 5.55.616 8.043-.329.632-.442 1.374-.233 2.055.45 1.465.674 3.04.674 4.613 0 2.997-4.037 8-10 8-5.964 0-10-5.003-10-8 0-1.574.222-3.148.673-4.614.21-.681.096-1.423-.232-2.055-1.294-2.492-1.399-6.25.616-8.042a1.112 1.112 0 011.332-.125c.643.394 1.67 1.238 2.827 3.005zm-1.496 2.175a.51.51 0 00.102-.639c-.627-1.027-1.192-1.707-1.64-2.152a.222.222 0 00-.364.067c-.269.635-.394 1.504-.271 2.545.072.61.217 1.17.406 1.66.07.181.313.2.427.04a9.756 9.756 0 011.34-1.52zm13.9 1.522c.113.16.357.141.427-.041a6.85 6.85 0 00.406-1.66c.123-1.04-.002-1.91-.27-2.545a.222.222 0 00-.366-.067c-.447.445-1.013 1.125-1.639 2.153a.51.51 0 00.102.639c.497.456.943.967 1.34 1.521zM14 15.5c-.938 0-1.5.657-1.5 1.75 0 1.095.562 1.75 1.5 1.75.937 0 1.5-.655 1.5-1.75 0-1.093-.563-1.75-1.5-1.75zm4 6.75c-.858 0-1.75-.758-1.75-1.63 0-.689.871-1.12 1.75-1.12.878 0 1.75.431 1.75 1.12 0 .872-.973 1.63-1.75 1.63zm2.5-5c0-1.093.562-1.75 1.5-1.75.937 0 1.5.657 1.5 1.75 0 1.095-.563 1.75-1.5 1.75-.938 0-1.5-.655-1.5-1.75zm-3.128 6.426c-.41.144-.924.325-1.372.325-.426 0-.719-.163-.969-.303-.188-.105-.352-.197-.531-.197-.28 0-.5.222-.5.5 0 .548 1.123 2 4 2s4-1.452 4-2c0-.278-.22-.5-.5-.5-.18 0-.344.092-.532.197-.25.14-.542.303-.968.303-.449 0-.963-.181-1.372-.325-.272-.096-.498-.175-.628-.175s-.357.08-.628.175z" fill-rule="evenodd"></path></svg>
                                    </button>
                                </li>
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path d="M9 7a1 1 0 011 1v7a1 1 0 102 0V8a1 1 0 011-1h.5a1 1 0 011 1v7a1 1 0 102 0V8a1 1 0 011-1h.5a1 1 0 011 1v8.91a4 4 0 01-1.716 3.284l-1.926 1.34a2 2 0 00-.858 1.642V28a1 1 0 01-1 1H13a1 1 0 01-1-1v-4.825a2 2 0 00-.858-1.641l-1.926-1.34A4 4 0 017.5 16.91V8a1 1 0 011-1H9zm12.5 5.053A5.053 5.053 0 0126.553 7c.523 0 .947.424.947.947V28a1 1 0 01-1 1H26a1 1 0 01-1-1v-6a1 1 0 00-1-1h-1.5a1 1 0 01-1-1v-7.947z"></path></svg>
                                    </button>
                                </li>
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path d="M10.127 11.532a.668.668 0 00-1.057.044A10.95 10.95 0 007 18c0 2.398.767 4.617 2.07 6.424a.668.668 0 001.057.044A9.96 9.96 0 0012.5 18a9.96 9.96 0 00-2.373-6.468z"></path><path d="M11.645 9.02c-.36.256-.382.77-.092 1.103A11.954 11.954 0 0114.5 18c0 3.014-1.111 5.769-2.947 7.877-.29.333-.268.847.092 1.103A10.95 10.95 0 0018 29c2.367 0 4.56-.748 6.355-2.02.36-.256.382-.77.092-1.103A11.954 11.954 0 0121.5 18c0-3.014 1.111-5.769 2.947-7.877.29-.333.268-.847-.092-1.103A10.95 10.95 0 0018 7c-2.367 0-4.56.748-6.355 2.02z"></path><path d="M23.5 18a9.96 9.96 0 012.373-6.468.668.668 0 011.057.044A10.95 10.95 0 0129 18a10.95 10.95 0 01-2.07 6.424.668.668 0 01-1.057.044A9.96 9.96 0 0123.5 18z"></path></svg>
                                    </button>
                                </li>
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path clip-rule="evenodd" d="M9.196 11.057C9.669 9.2 11.355 8 13.199 8H22.8c1.844 0 3.53 1.2 4.003 3.057.318 1.245.696 2.928.861 4.488.012.111.06.216.137.297l1.37 1.439A3 3 0 0130 19.35V27a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1.31a.503.503 0 00-.546-.499c-2.328.2-4.838.309-7.454.309-2.616 0-5.126-.109-7.454-.309a.503.503 0 00-.546.5V27a1 1 0 01-1 1H7a1 1 0 01-1-1v-7.65a3 3 0 01.828-2.069l1.37-1.44a.507.507 0 00.137-.296c.165-1.56.543-3.243.86-4.488zm15.826 3.608a.492.492 0 01-.527.568A88.843 88.843 0 0018 15c-2.26 0-4.442.081-6.495.232a.492.492 0 01-.527-.566c.169-1.027.41-2.086.64-2.991.174-.68.807-1.175 1.58-1.175h9.603c.774 0 1.407.495 1.58 1.175.232.905.472 1.964.641 2.99zm-1.983 5.566l.17.284a1 1 0 00.857.485H26c.828 0 1.5-.895 1.5-2v-.5a.5.5 0 00-.724-.446l-3.635 1.825a.25.25 0 00-.102.352zm-10.078 0l-.17.284a1 1 0 01-.857.485H10c-.828 0-1.5-.895-1.5-2v-.5a.5.5 0 01.724-.446l3.635 1.825a.25.25 0 01.102.352z" fill-rule="evenodd"></path></svg>
                                    </button>
                                </li>
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path d="M23.281 18.825c-.723.718-1.373 1.542-1.62 2.53l-.472 1.887a1 1 0 01-.97.758h-4.438a1 1 0 01-.97-.758l-.472-1.887c-.247-.988-.897-1.812-1.62-2.53A7.477 7.477 0 0110.5 13.5c0-4.142 3-7.5 7.5-7.5s7.5 3.358 7.5 7.5a7.477 7.477 0 01-2.219 5.325zM16 26a1 1 0 00-1 1v.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293h1.172a1 1 0 00.707-.293l1.414-1.414a1 1 0 00.293-.707V27a1 1 0 00-1-1h-4z"></path></svg>
                                    </button>
                                </li>
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path d="M22.75 8.25a1.25 1.25 0 112.5 0v2.25c0 .138.112.25.25.25h2.25a1.25 1.25 0 110 2.5H25.5a.25.25 0 00-.25.25v2.25a1.25 1.25 0 11-2.5 0V13.5a.25.25 0 00-.25-.25h-2.25a1.25 1.25 0 110-2.5h2.25a.25.25 0 00.25-.25V8.25zm-5.753 2.104a2.66 2.66 0 00.003-.127C17 8.721 15.83 7.5 14.386 7.5c-1.045 0-1.946.64-2.365 1.565a.024.024 0 01-.042 0C11.56 8.14 10.659 7.5 9.614 7.5 8.17 7.5 7 8.721 7 10.227c0 .043 0 .085.003.127.116 3.525 3.878 6.149 4.997 6.149 1.119 0 4.88-2.624 4.997-6.15zm-.166 10.524a1.25 1.25 0 00-2.162-1.256l-3.441 5.927a.15.15 0 01-.236.03l-1.858-1.858a1.25 1.25 0 00-1.768 1.768l3.145 3.145a1.25 1.25 0 001.965-.256l4.355-7.5zm4.419-1.628a2 2 0 00-2 2v5.5a2 2 0 002 2h5.5a2 2 0 002-2v-5.5a2 2 0 00-2-2h-5.5z"></path></svg>
                                    </button>
                                </li>
                                <li class="pickme-emoji-picker-category-tab">
                                    <button type="button" class="pickme-emoji-picker-category-button js_pickme_emoji_picker_category_button">
                                        <svg viewBox="0 0 36 36" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6" fill="currentColor" height="18" width="18"><path d="M7.961 8.88c2.7-1.332 5.572-1.152 10.039.54 4.096 1.551 6.85 1.303 9.36.005.72-.372 1.64.11 1.64.92v15.132c0 .687-.345 1.34-.961 1.644-2.7 1.33-5.572 1.15-10.039-.541-4.096-1.551-6.85-1.303-9.36-.005-.72.372-1.64-.11-1.64-.92V10.524c0-.687.345-1.34.961-1.644z"></path></svg>
                                    </button>
                                </li>
                            </ul>

                        </div>

                        <div class="pickme-emoji-picker-body">

                            <div class="js-pickme-emoji-picker-category-tabs-wrapper js_pickme_emoji_picker_category_tabs_wrapper">
                                
                            </div>

                        </div>

                    </div>`
        }
        // show
        function doShow()
        {
            js_pickme_emoji_picker_container.addClass('show')
            js_pickme_emoji_picker_background_overlay.addClass('show')
            options.visible = true
        }
        // hide
        function doHide()
        {
            js_pickme_emoji_picker_container.removeClass('show')
            js_pickme_emoji_picker_background_overlay.removeClass('show')
            options.visible = false
        }
        // display emojies
        async function doDisplayEmojies(params)
        {
            if ( params.method_type == 'search' ) var res = await searchEmojies(params)

            if ( res.code == 404 )
            {
                js_pickme_emoji_picker_category_tabs_wrapper.html('')
                return
            }

            var data = res.data
            var html = ''
            var category = ''
            var categories = []
            var data_filtered = []
            // separate categories
            $.each(data, (k,v) =>
            {
                if ( !categories.includes(v.category_code) )
                    categories.push(v.category_code) 
            })
         
            for (let i = 0; i < categories.length; i++) 
            {
                const category = categories[i];
                html += `<div class="pickme-emoji-picker-category-tab-wrapper js_pickme_emoji_picker_category_tab_wrapper" id="js_pickme_emoji_picker_category_tab_${category}">
                                <div class="pickme-emoji-picker-category-tab-name js_pickme_emoji_picker_category_tab_name">
                                    ${ doGetTrans().categories[category] }
                                </div>
                                <div class="pickme-emoji-picker-category-tab-content js_pickme_emoji_picker_category_tab_content">`
                for (let j = 0; j < data.length; j++) 
                {
                    const emojy = data[j];

                    if ( emojy.category_code != category ) continue

                    html += `<div class="pickme-emoji-picker-category-item">
                                <img height="30" width="30" alt="" src="${emojy.icon}" data-role="emojy" data-code="${emojy.code}" data-name="${emojy.name}" data-icon="${emojy.icon}">
                            </div>`
                }

                html += `</div>
                    </div>`
            }

            js_pickme_emoji_picker_category_tabs_wrapper.html(html)
        }
        // set locale
        function doSetLocale(locale)
        {
            options.locale = locale
        }
        // translate
        function doTrans()
        {
            const trans = LOCALE[options.locale]

            js_pickme_emoji_picker_search_input.attr('placeholder', trans.search_input_placeholder)
            // js_pickme_emoji_picker_category_tab_name.text( trans.js_pickme_emoji_picker_category_tab_name )
        }
        // do get trans
        function doGetTrans()
        {
            return LOCALE[options.locale]
        }
        // do set trigger
        function doSetTrigger(trigger)
        {
            options.trigger = trigger
        }
        // do set positions
        function doSetPosition(position)
        {
            js_pickme_emoji_picker_container.css('top', position.y+'px')
            .css('left', position.x+'px')
        }
        // dispatch on emojy selected event
        function doDispatchEvent(event)
        {
            document.dispatchEvent(event)
            rootElement[0].dispatchEvent(event)
        }
        // search emojies
        function searchEmojies(params)
        {
            return $.ajax({
                url: options.api.endPoint,
                type: 'POST',
                data: params,
            })
        }
        
        // init
        function init()
        {
            if ( options.visible )
                doShow()

            doSetLocale(options.locale)
            // translate UI
            doTrans()
            doSetTrigger(options.trigger)
            // trigger
            if ( options.trigger )
            {
                options.trigger.off('click').on('click', e =>
                {
                    if ( !options.visible ) doShow()
                    else doHide()
                })
                .off('mousedown').on('mousedown', e =>
                {
                    doSetPosition({
                        x: e.clientX,
                        y: e.clientY - js_pickme_emoji_picker_container.height(),
                    })
                })
            }
            // hide
            js_pickme_emoji_picker_background_overlay.off('click').on('click', e =>
            {
                doHide()
            })
            // js_pickme_emoji_picker_container
            js_pickme_emoji_picker_container.off('click').on('click', e =>
            {
                var target = $(e.target)

                if ( target.data('role') == 'emojy' )
                {
                    events.onEmojySelected.detail.emojy = {
                        rootElementId: rootElement.attr('id'),
                        name: target.data('name'),
                        code: target.data('code'),
                        css_code: '&#x'+target.data('code'),
                        icon: target.data('icon'),
                        img: `<img height="20" width="20" src="${target.data('icon')}">`,
                        // span: `<span style="background-image: url(${target.data('icon')}); background-size: cover; display: inline-block; width:20px; height:20px; font-size:0;vertical-align:middle;">&#x${target.data('code')}</span>`,
                        span: `<span class="font-family-notocoloremoji">&#x${target.data('code')}</span>`,
                    }

                    doDispatchEvent(events.onEmojySelected)
                    doHide()
                }
            })
            // search
            js_pickme_emoji_picker_search_input.off('keyup').on('keyup', e =>
            {
                doDisplayEmojies({
                    method_type: 'search',
                    query: js_pickme_emoji_picker_search_input.val(),
                    advanced: {
                        orderby: 'id',
                        order: 'asc',
                    }
                })
            })
            js_pickme_emoji_picker_search_input.trigger('keyup')
            // select category tab
            js_pickme_emoji_picker_category_buttons.each((k, element) =>
            {
                const button = js_pickme_emoji_picker_categories_list.find(element)
                
                button.off('click').on('click', e =>
                {
                    var targetTab = js_pickme_emoji_picker_container.find(button.data('target'))

                    button.parent().addClass('active').siblings().removeClass('active')

                    js_pickme_emoji_picker_category_tabs_wrapper.scrollTop(js_pickme_emoji_picker_category_tabs_wrapper[0].scrollHeight)
                })
            })
        }
        
        //
        this.on = (eventType, callback) =>
        {
            $(document).on(eventType, callback)
            return this
        }

        this.off = (eventType, callback) =>
        {
            $(document).off(eventType, callback)
            return this
        }

    }

})