// window.$ = window.jQuery = require('jquery');

let WindowDialog
let DialogBox;
let PromptInputDialog;
let PromptConfirmDialog;
let AddAppointementPatientsDialog;
let OrderCartDialog;
let OrdersCartDialog;
let PreviewFileDialog;
let AddConsommablesToPatientDialog;
let SelectEmployeeDialog;
let FullpageDialog
let RingingBellDialog
let SelectDirDialog
let RequestDriverDialog
let MapDialog
let CreateImageSliderDialog
// let ImageCropperDialog
let CreateChatGroupPostDialog
let CreateChatPrivateConversationDialog
let CreateChatGroupConversationDialog
let TextDialog
let CreateAppointmentDialog__CentralAdmin
let CreateAppointmentDialog__Centers
let CreatePrescriptionDialog__CentralAdmin
let CreatePrescriptionDialog__Centers
let CreatePrescriptionProductDialog
let CreateDepartmentDialog__CentralAdmin
let PreviewImageDialog
let PreviewPDFDialog
let PreviewVideoDialog
let CreateCenterDialog__CentralAdmin
let CreateCenterDialog__Centers
let CreateVideoDialog__CentralAdmin
let CreateHealthyKitchenPostDialog__CentralAdmin
let CreateCustomerDialog__CentralAdmin
let CreateCustomerDialog__Centers
let CreateEmployeeTypeDialog__CentralAdmin
let CreateProductDialog__CentralAdmin
let CreateProductDialog__Centers
let CopyInvoiceDialog__Centers
let CopyInvoiceDialog__CentralAdmin
let CreateSupplierCategory__Centers
let CreateDocitMediaDialog
let CreateDocitFolderDialog
let CreateDocitGroupDialog
let AddPeopleToDocitGroupDialog
let ShareDocitFileDialog
let DeleteShareDocitFileDialog
let DeleteShareDocitFolderDialog
let ShareDocitFolderDialog
let SetOrderGlobalSettings

$(function()
{

// 
// WindowDialog
WindowDialog = function(options = {})
{

	const defaultOptions = {
		visible: true,
		rootId: 'window_dialog',
		title: 'Dialog',
		position: {
			top: '10%',
			left: '10%',
		},
		overlay: {
			visible: true,
		}
	}

	options = {...defaultOptions, ...options}

	var html = fs.readFileSync( path.resolve(__dirname, '../views/dialogs/window-dialog.ejs') ).toString()

	// set id
	var dialog_element = $(html)
	dialog_element.attr('id', options.rootId)

	var dialog_container = $(`#${options.rootId}`)

	if ( !dialog_container[0] )
	{
		$( dialog_element[0].outerHTML ).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $(`#${options.rootId}`)
	}

	// Overlay
	var js_window_dialog_overlay = $('.js_window_dialog_overlay')

	// Toolbar
	const js_window_dialog_toolbar = dialog_container.find('.js_window_dialog_toolbar')
	const js_window_dialog_toolbar_middle = dialog_container.find('.js_window_dialog_toolbar_middle')

	const js_window_dialog_toolbar_title = dialog_container.find('.js_window_dialog_toolbar_title')

	const js_window_dialog_toolbar_action_button_close = dialog_container.find('.js_window_dialog_toolbar_action_button_close')
	const js_window_dialog_toolbar_action_button_maximize = dialog_container.find('.js_window_dialog_toolbar_action_button_maximize')
	const js_window_dialog_toolbar_action_button_maximize_restore = dialog_container.find('.js_window_dialog_toolbar_action_button_maximize_restore')
	const js_window_dialog_toolbar_action_button_minimize = dialog_container.find('.js_window_dialog_toolbar_action_button_minimize')
	const js_window_dialog_toolbar_action_button_minimize_restore = dialog_container.find('.js_window_dialog_toolbar_action_button_minimize_restore')
	// Body
	const js_window_dialog_body = dialog_container.find('.js_window_dialog_body')

	// Initialize
	init()

	// hide
	js_window_dialog_toolbar_action_button_close.off('click').on('click', e =>
	{
		doHide()
	})
	// maximize
	js_window_dialog_toolbar_action_button_maximize.off('click').on('click', e =>
	{
		doMaximize()
	})
	// maximize restore
	js_window_dialog_toolbar_action_button_maximize_restore.off('click').on('click', e =>
	{
		doMaximizeRestore()
	})
	// minimize
	js_window_dialog_toolbar_action_button_minimize.off('click').on('click', e =>
	{
		doMinimize()
	})
	// minimize restore
	js_window_dialog_toolbar_action_button_minimize_restore.off('click').on('click', e =>
	{
		doMinimizeRestore()
	})

	// Methods
	//
	this.show = () =>
	{
		doShow()
		return this
	}
	//
	this.hide = () =>
	{
		doHide()
		return this
	}
	//
	this.maximize = () =>
	{
		doMaximize()
		return this
	}
	//
	this.maximizeRestore = () =>
	{
		doMaximizeRestore()
		return this
	}
	//
	this.minimize = () =>
	{
		doMinimize()
		return this
	}
	//
	this.minimizeRestore = () =>
	{
		doMinimizeRestore()
		return this
	}
	// 
	this.setHTML = (html) =>
	{
		doSetHTML(html)
		return this
	}
	//
	this.getContainer = () =>
	{
		return dialog_container
	}
	//
	this.showOverlay = () =>
	{
		doShowOverlay()
		return this
	}
	//
	this.hideOverlay = () =>
	{
		doHideOverlay()
		return this
	}
	//
	this.setTitle = (title) =>
	{
		doSetTitle(title)
		return this
	}
	//
	this.enableDragging = () =>
	{
		doEnableDragging()
		return this
	}
	//
	this.disableDragging = () =>
	{
		doDisableDragging()
		return this
	}
	//
	this.enableResizing = () =>
	{
		doEnableResizing()
		return this
	}
	//
	this.disableResizing = () =>
	{
		doDisableResizing()
		return this
	}
	//
	this.setPosition = (position) =>
	{
		doSetPosition(position)
		return this
	}
	//
	this.setSize = (size) =>
	{
		doSetSize(size)
		return this
	}
	// 
	this.destroy = () =>
	{
		dialog_container.remove()
	}

	// show
	function doShow()
	{
		dialog_container.addClass('show')
		doCenter()
		if ( options.overlay.visible ) doShowOverlay()

		// dispatch an event
		var event = new CustomEvent('window-dialog:opened', { 
			detail: {} 
		})

		dialog_container[0].dispatchEvent(event)
	}
	// hide
	function doHide()
	{
		dialog_container.removeClass('show')
		doHideOverlay()
		// dispatch an event
		var event = new CustomEvent('window-dialog:closed', { 
			detail: {} 
		})

		dialog_container[0].dispatchEvent(event)
	}
	// maximize
	function doMaximize()
	{
		dialog_container.addClass('maximized')
		doDisableDragging()
		doDisableResizing()
		// dispatch an event
		var event = new CustomEvent('window-dialog:maximize', { 
			detail: {} 
		})

		dialog_container[0].dispatchEvent(event)
	}
	// restore
	function doMaximizeRestore()
	{
		dialog_container.removeClass('maximized')
		doEnableDragging()
		doEnableResizing()
		// dispatch an event
		var event = new CustomEvent('window-dialog:maximize-restore', { 
			detail: {} 
		})

		dialog_container[0].dispatchEvent(event)
	}
	// minimize
	function doMinimize()
	{
		dialog_container.addClass('minimized')
		doMaximizeRestore()
		doHideOverlay()
		doDisableDragging()
		doDisableResizing()
		// dispatch an event
		var event = new CustomEvent('window-dialog:minimize', { 
			detail: {}  
		})

		dialog_container[0].dispatchEvent(event)
	}
	// minimize restore
	function doMinimizeRestore()
	{
		dialog_container.removeClass('minimized')
		// .css('top', '10%')
		// .css('left', '10%')
		doCenter()
		doShowOverlay()
		doEnableDragging()
		doEnableResizing()
		// dispatch an event
		var event = new CustomEvent('window-dialog:minimize-restore', { 
			detail: {}  
		})

		dialog_container[0].dispatchEvent(event)
	}
	// centered
	function doCenter()
	{
		// dialog_container.addClass('centered')
		// Get the viewport dimensions
		const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		
		// Get the dimensions of the element
		const elementWidth = dialog_container[0].offsetWidth;
		const elementHeight = dialog_container[0].offsetHeight;
		
		// Calculate the center position
		const centerX = (viewportWidth - elementWidth) / 2;
		const centerY = (viewportHeight - elementHeight) / 2;

		// Set the CSS properties to center the element
		dialog_container[0].style.left = centerX + 'px';
		dialog_container[0].style.top = centerY + 'px';
		// element.style.transform = 'translate(-50%, -50%)'; // Optional: Center the element perfectly
	}
	// restore centered
	function doRestoreCenter()
	{
		// dialog_container.removeClass('centered')
	}
	// show verlay
	function doShowOverlay()
	{
		js_window_dialog_overlay.addClass('show')
	}
	// hide verlay
	function doHideOverlay()
	{
		js_window_dialog_overlay.removeClass('show')
	}
	// set title
	function doSetTitle(title = 'Dialog')
	{
		js_window_dialog_toolbar_title.text(title)
	}
	// set position
	function doSetPosition(position)
	{
		dialog_container.css('top', position.top)
		.css('left', position.left)
	}
	// set size
	function doSetSize(size)
	{
		dialog_container.css('width', size.width)
		.css('height', size.height)
	}
	// disable dragging
	function doDisableDragging()
	{
		js_window_dialog_toolbar_middle.addClass('window-dialog-disabled')
	}
	// enable dragging
	function doEnableDragging()
	{
		js_window_dialog_toolbar_middle.removeClass('window-dialog-disabled')
	}
	// disable resizing
	function doDisableResizing()
	{
		dialog_container.resizable('disable')
	}
	// enable resizing
	function doEnableResizing()
	{
		dialog_container.resizable('enable')
	}
	// set html
	function doSetHTML(html)
	{
		js_window_dialog_body.html(html)
	}

	// init
	function init()
	{
		// append overlay
		if ( !js_window_dialog_overlay[0] )
		{
			$(`<div class="window-dialog-overlay js_window_dialog_overlay"></div>`).insertAfter(MAIN_CONTENT_CONTAINER)
			js_window_dialog_overlay = $('.js_window_dialog_overlay')
		}
		// visible
		if ( options.visible ) doShow()
		// append html to body
		if ( options.html )
		{
			js_window_dialog_body.html(options.html)
		}
		// set title
		doSetTitle(options.title)
		
		// make draggable
		dialog_container.draggable({
			handle: js_window_dialog_toolbar_middle
		})
		// center
		doCenter()
		// set position
		doSetPosition(options.position)
		// make resizable
		dialog_container.resizable({
			handles: 'n, e, s, w, ne, se, sw, nw',
			resize: function(e, ui)
			{
				// console.log(e, ui)
				// dispatch an event
				var event = new CustomEvent('window-dialog:resize', { 
					detail: {
						ui: ui,
					} 
				})

				dialog_container[0].dispatchEvent(event)
			},
			start: function(e, ui)
			{
				// dispatch an event
				var event = new CustomEvent('window-dialog:resize-start', { 
					detail: {
						ui: ui,
					} 
				})

				dialog_container[0].dispatchEvent(event)
			},
			stop: function(e, ui)
			{
				// dispatch an event
				var event = new CustomEvent('window-dialog:resize-stop', { 
					detail: {
						ui: ui,
					} 
				})

				dialog_container[0].dispatchEvent(event)
			}
		})
		// minimize restore
		doMinimizeRestore()
		// custom position at top
		doSetPosition({
			top: 0,
		})
	}
}

// SetOrderGlobalSettings
SetOrderGlobalSettings = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_supplier_category_dialog',
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.set_order_global_settings)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/set-order-global-settings-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const set_order_global_settings_dialog__form = dialog_container.find('#set_order_global_settings_dialog__form')
	const set_order_global_settings_dialog__form__TVA_input = dialog_container.find('#set_order_global_settings_dialog__form__TVA_input')

	var GlobalSettingsObject = {}

	// submit
	set_order_global_settings_dialog__form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		GlobalSettingsObject.TVA = set_order_global_settings_dialog__form__TVA_input.val()

		set_order_global_settings_dialog__form.find(':submit').addClass('disabled')

		try 
		{
			var res = await ORDER_MODEL.global_settings_set(GlobalSettingsObject)
		} 
		catch (error) 
		{
			set_order_global_settings_dialog__form.find(':submit').removeClass('disabled')

			return
		}

		set_order_global_settings_dialog__form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		set_order_global_settings_dialog__form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('SetOrderGlobalSettings:created', GlobalSettingsObject)
	})
	// display one
	displayOne()
	async function displayOne()
	{
		
		try 
		{
			const res = await ORDER_MODEL.global_settings_first()	

			if ( res.code == 404 ) return

			fillForm(set_order_global_settings_dialog__form, res.data)
		} catch (error) {
			console.log(error)
		}

	}
}

// DeleteShareDocitFolderDialog
DeleteShareDocitFolderDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'delete_share_docit_folder_dialog',
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.delete_share_folder)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/delete-share-docit-folder-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const file = options.folder

	// file info
	const delete_share_docit_folder_dialog__file_info = dialog_container.find('#delete_share_docit_folder_dialog__file_info')

	// Sharing choises tabs
	const delete_share_docit_folder_dialog__sharing_choises_tabs = dialog_container.find('#delete_share_docit_folder_dialog__sharing_choises_tabs')
	const delete_share_docit_folder_dialog__tab__back_button = dialog_container.find('.delete_share_docit_folder_dialog__tab__back_button')
	const delete_share_docit_folder_dialog__sharing_choises_tabs__tab_buttons = dialog_container.find('.delete_share_docit_folder_dialog__sharing_choises_tabs__tab_buttons')

	const delete_share_docit_folder_dialog__tabs = dialog_container.find('.delete_share_docit_folder_dialog__tabs')

	// Tabs
	const delete_share_docit_folder_dialog__share_with_people_tab = dialog_container.find('#delete_share_docit_folder_dialog__share_with_people_tab')
	const delete_share_docit_folder_dialog__share_with_groups_tab = dialog_container.find('#delete_share_docit_folder_dialog__share_with_groups_tab')

	// Go back
	delete_share_docit_folder_dialog__tab__back_button.off('click').on('click', goBack)

	// Navigate tabs
	delete_share_docit_folder_dialog__sharing_choises_tabs__tab_buttons.each((k,v) => {
		const target = $(v)

		target.off('click').on('click', e => {
			showTab(target)
		})

	})

	// delete_share_docit_folder_dialog__share_with_people_tab
	delete_share_docit_folder_dialog__share_with_people_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithPeopleTab()
	})
	// delete_share_docit_folder_dialog__share_with_groups_tab
	delete_share_docit_folder_dialog__share_with_groups_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithGroupsTab()
	})
	
	// show tab
	function showTab(target)
	{
		const title = target.find('.js_tab_button_title').text()
		const tab = dialog_container.find(target.data('tab') )

		// show tab
		tab.removeClass('d-none').siblings().addClass('d-none')
		// Set title
		tab.find('.js_tab_title').text(title)
		// hide tab buttons
		delete_share_docit_folder_dialog__sharing_choises_tabs.addClass('d-none')

		// dispatch event
		dispatchCustomEvent('tab:opened', {}, tab[0])
	}
	// go back
	function goBack()
	{
		// show tab buttons
		delete_share_docit_folder_dialog__sharing_choises_tabs.removeClass('d-none')
		// hide tabs
		delete_share_docit_folder_dialog__tabs.addClass('d-none')
	}
	// displayInfo
	displayInfo()
	function displayInfo()
	{
		// const file_info__copy_url_to_clipboard = delete_share_docit_folder_dialog__file_info.find('.file_info__copy_url_to_clipboard')

		delete_share_docit_folder_dialog__file_info.find('.file_info__name').text( file.name )
		delete_share_docit_folder_dialog__file_info.find('.file_info__files_count')
		.html(`
		<div class="">
			${ (file.children) ? file.children.length : 0 } ${ FUI_DISPLAY_LANG.views.pages.global.attributes.folders },
		</div>

		<div class="width-10px"></div>

		<div class="">
			${ (file.medias) ? file.medias.length : 0 } ${ FUI_DISPLAY_LANG.views.pages.global.attributes.files }
		</div>
		`)
		delete_share_docit_folder_dialog__file_info.find('.file_info__icon').html( fileTypeIcon({
            extension: 'folder',
		}) )
		
		// copy to clipboard
		// file_info__copy_url_to_clipboard.off('click').on('click', e => {

		// 	const copyIcon = '<i class="fas fa-clipboard"></i>'
		// 	const copiedIcon = '<i class="fas fa-clipboard-check"></i>'

		// 	file_info__copy_url_to_clipboard.html(copiedIcon).addClass('text-success').removeClass('text-color-19')

		// 	setTimeout(() => {
		// 		file_info__copy_url_to_clipboard.html(copyIcon).removeClass('text-success').addClass('text-color-19')
		// 	}, 5*1000);

		// 	copyToClipboard(file.url)

		// 	CreateToast('PS', FUI_DISPLAY_LANG.views.pages.global.text114, '')

		// })
	}

	// Share with people
	function setupShareWithPeopleTab()
	{
		const delete_share_docit_folder_dialog__share_with_people_tab__create_form = dialog_container.find('#delete_share_docit_folder_dialog__share_with_people_tab__create_form')
		const delete_share_docit_folder_dialog__share_with_people_tab__create_form__user_select = dialog_container.find('#delete_share_docit_folder_dialog__share_with_people_tab__create_form__user_select')

		const delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement = dialog_container.find('#delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement')
		const delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button = dialog_container.find('#delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button')

		const delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input = dialog_container.find('#delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input')

		var isLoading = false
		var PAGINATION = {
			per_page: 10,
			current_page: 1,
			last_page: 0,
			total: 0,
		}

		const params = {
			searchTerm: '',
			user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
			pagination: PAGINATION,
			pivot: {
				folder_id: file.id,
			}
		}

		// search
		detectTypingEnd(delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input, val => {
			displayPeople({
				clearOld: true,
			})
		})
		// load more
		delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.off('click').on('click', e => {

			if ( getIsLoading() ) return

			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.parent().addClass('d-none')
				return
			}

			setPagination({
				current_page: getPagination().current_page + 1,
			})

			setIsLoading(true)

			displayPeople({
				onData: (data) => {
					setIsLoading(false)
				}
			})

		})

		displayPeople()
		async function displayPeople(options = {})
		{
			const defaultOptions = {
				onData: (e) => {}
			}
		
			options = {...defaultOptions, ...options}
		
			params.searchTerm = delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input.val()
			params.pagination = PAGINATION
		
			showPlaceholder()
		
			var res = null
		
			try 
			{
				res = await DOCIT_USER_MODEL.folders_shared_withUsers_search(params)
			} 
			catch (error) {
				delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.html(`
				<div class="col-lg-12 col-md-12 cursor-pointer">
		
					<div class="overflow-hidden no-pointer">
		
						<p class="fs-17 text-danger">
							${ FUI_DISPLAY_LANG.views.messages.no_data_found }
						</p>
		
					</div>
		
				</div>
				`)
				hidePlaceholder()
				return
			}
		
			// Update PAGINATION
			// PAGINATION.last_page = res.data.last_page
			// PAGINATION.total = res.data.total
			setPagination({
				last_page: res.last_page,
				total: res.total,
				from: res.from,
				to: res.to,
			})
			
			hidePlaceholder()
		
			// clear
			if ( options.clearOld ) 
			{
				delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.html('')
		
				setPagination({
					last_page: 10,
					total: 1,
					from: 0,
					to: 0,
				})
			}
		
			const data = res.data
			var html = ''
		
			data.map((user, k) => {
				appendUser({}, user)
			})
		}
		// append html
		function appendUser(options = {}, user)
		{
			const defaultOptions = {
				append: true,
			}

			options = {...defaultOptions, ...options}

			const id = `user_holder__${uniqid()}__${user.id}`

			const html = `
			<div class="col-md-12" id="${id}" data-id="${user.id}" data-name="${user.name}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								${user.name}
							</h4>
						</div>

						<div class="mb-4">
							<p class="fs-17 fw-300 text-color-17 max-width-500px">
								${ user.phone }
							</p>
						</div>

						<div class="fs-14 text-color-17">
							${ getDatetimeDifference(user.pivot.created_at).auto } 
							( ${ formatDateTime(user.pivot.created_at, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							}) })
						</div>

					</div>

					<div class="">

						<div class="bg-color-hover-ebebeb width-60px height-60px rounded-circle border text-color-6 d-inline-flex align-items-center justify-content-center" id="delete_share_button__${user.id}">
							<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" fill="currentColor">
								<path d="M503.7 189.8L327.7 37.9C312.3 24.5 288 35.3 288 56v80.1C127.4 137.9 0 170.1 0 322.3c0 61.4 39.6 122.3 83.3 154.1 13.7 9.9 33.1-2.5 28.1-18.6C66.1 312.8 132.9 274.3 288 272.1V360c0 20.7 24.3 31.5 39.7 18.2l176-152c11.1-9.6 11.1-26.8 0-36.3z"/>
								<line x1="64" y1="64" x2="448" y2="448" style="stroke:currentColor;stroke-width:30;"/>
							</svg>
						</div>

					</div>

				</div>

			</div>
			`
			//
			if ( options.append ) delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.append(html)
			else delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.prepend(html)

			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()

			const holder = delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`#${id}`)

			const delete_share_button__ = holder.find(`#delete_share_button__${user.id}`)

			// delete_share_button__
			delete_share_button__.on('click', e => {

				PromptConfirmDialog().then(async () => {

					try 
					{
						holder.addClass('disabled')

						await DOCIT_USER_MODEL.folders_shared_delete({
							sharer_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
							shared_with_id: user.id,
							folder_id: file.id,
						})

						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_folder_delete_share, '')
					} catch (error) {
						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
						holder.removeClass('disabled')
					}

					holder.remove()

				})

			})
		}
		// set pagination
		function setPagination(options = {})
		{
			PAGINATION = {...PAGINATION, ...options}
		}
		// get pagination
		function getPagination()
		{
			return PAGINATION
		}
		// set isLoading
		function setIsLoading(value)
		{
			isLoading = value
		}
		// get isLoading
		function getIsLoading()
		{
			return isLoading
		}
		// show placeholder
		function showPlaceholder()
		{
			const id = delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.attr('id')
			const selector = `placeholder__${id}`
			const html = `
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			`

			// check exists
			if ( delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.append(html)

			// disable load more button
			delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.addClass('disabled')
		}
		// hide placeholder
		function hidePlaceholder()
		{
			const id = delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.attr('id')
			const selector = `placeholder__${id}`

			// check exists
			if ( !delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`.${selector}`).remove()
			// enable load more button
			delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.removeClass('disabled')
			
			// check last page
			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_folder_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.parent().addClass('d-none')
				return
			}
		}
	}
	// Share with groups
	function setupShareWithGroupsTab()
	{
		const delete_share_docit_folder_dialog__share_with_groups_tab__create_form = dialog_container.find('#delete_share_docit_folder_dialog__share_with_groups_tab__create_form')
		const delete_share_docit_folder_dialog__share_with_groups_tab__create_form__share_permissions_select = dialog_container.find('#delete_share_docit_folder_dialog__share_with_groups_tab__create_form__share_permissions_select')

		const delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement = dialog_container.find('#delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement')
		const delete_share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button = dialog_container.find('#delete_share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button')

		const delete_share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input = dialog_container.find('#delete_share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input')

		var isLoading = false
		var PAGINATION = {
			per_page: 10,
			current_page: 1,
			last_page: 0,
			total: 0,
		}

		const params = {
			searchTerm: '',
			user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
			pagination: PAGINATION,
			pivot: {
				folder_id: file.id,
			}
		}

		// search
		detectTypingEnd(delete_share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input, val => {
			displayGroups({
				clearOld: true,
			})
		})
		// load more
		delete_share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.off('click').on('click', e => {

			if ( getIsLoading() ) return

			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}

			setPagination({
				current_page: getPagination().current_page + 1,
			})

			setIsLoading(true)

			displayGroups({
				onData: (data) => {
					setIsLoading(false)
				}
			})

		})

		displayGroups()
		async function displayGroups(options = {})
		{
			const defaultOptions = {
				onData: (e) => {}
			}
		
			options = {...defaultOptions, ...options}
		
			params.searchTerm = delete_share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input.val()
			params.pagination = PAGINATION
		
			showPlaceholder()
		
			var res = null
		
			try 
			{
				res = await DOCIT_USER_MODEL.folders_shared_withGroups_search(params)
			} 
			catch (error) {
				delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.html(`
				<div class="col-lg-12 col-md-12 cursor-pointer">
		
					<div class="overflow-hidden no-pointer">
		
						<p class="fs-17 text-danger">
							${ FUI_DISPLAY_LANG.views.messages.no_data_found }
						</p>
		
					</div>
		
				</div>
				`)
				hidePlaceholder()
				return
			}
		
			// Update PAGINATION
			// PAGINATION.last_page = res.data.last_page
			// PAGINATION.total = res.data.total
			setPagination({
				last_page: res.last_page,
				total: res.total,
				from: res.from,
				to: res.to,
			})
			
			hidePlaceholder()
		
			// clear
			if ( options.clearOld ) 
			{
				delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.html('')
		
				setPagination({
					last_page: 10,
					total: 1,
					from: 0,
					to: 0,
				})
			}
		
			const data = res.data

			data.map((group, k) => {
				appendGroup({}, group)
			})
		}
		// append html
		function appendGroup(options = {}, group)
		{
			const defaultOptions = {
				append: true,
			}

			options = {...defaultOptions, ...options}

			const id = `group_holder__${uniqid()}__${group.id}`

			const html = `
			<div class="col-md-12" id="${id}" data-id="${group.id}" data-name="${group.name}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								${group.name}
							</h4>
						</div>

						${
							(!isNull(group.description)) ? `
							<div class="mb-4">
								<p class="fs-17 fw-300 text-color-17 max-width-500px">
									${ summarizeText(group.description, 140) }
								</p>
							</div>
							`
							: ''
						}

						<div class="fs-14 text-color-17">
							${ getDatetimeDifference(group.created_at).auto } 
							( ${ formatDateTime(group.created_at, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							}) })
						</div>

					</div>

					<div class="">

						<div class="bg-color-hover-ebebeb width-60px height-60px rounded-circle border text-color-6 d-inline-flex align-items-center justify-content-center" id="delete_share_group_button__${group.id}">
							<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" fill="currentColor">
								<path d="M503.7 189.8L327.7 37.9C312.3 24.5 288 35.3 288 56v80.1C127.4 137.9 0 170.1 0 322.3c0 61.4 39.6 122.3 83.3 154.1 13.7 9.9 33.1-2.5 28.1-18.6C66.1 312.8 132.9 274.3 288 272.1V360c0 20.7 24.3 31.5 39.7 18.2l176-152c11.1-9.6 11.1-26.8 0-36.3z"/>
								<line x1="64" y1="64" x2="448" y2="448" style="stroke:currentColor;stroke-width:30;"/>
							</svg>
						</div>

					</div>

				</div>

			</div>
			`
			//
			if ( options.append ) delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.append(html)
			else delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.prepend(html)

			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()

			const holder = delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`#${id}`)

			const delete_share_group_button__ = holder.find(`#delete_share_group_button__${group.id}`)

			// delete_share_group_button__
			delete_share_group_button__.on('click', e => {

				PromptConfirmDialog().then(async () => {

					try 
					{
						holder.addClass('disabled')

						await DOCIT_GROUP_MODEL.folders_shared_delete({
							group_id: group.id,
							folder_id: file.id,
						})

						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_folder_delete_share, '')
					} catch (error) {
						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
						holder.removeClass('disabled')
					}

					holder.remove()

				})

			})
		}

		// set pagination
		function setPagination(options = {})
		{
			PAGINATION = {...PAGINATION, ...options}
		}
		// get pagination
		function getPagination()
		{
			return PAGINATION
		}
		// set isLoading
		function setIsLoading(value)
		{
			isLoading = value
		}
		// get isLoading
		function getIsLoading()
		{
			return isLoading
		}
		// show placeholder
		function showPlaceholder()
		{
			const id = delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`
			const html = `
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			`

			// check exists
			if ( delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.append(html)

			// disable load more button
			delete_share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.addClass('disabled')
		}
		// hide placeholder
		function hidePlaceholder()
		{
			const id = delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`

			// check exists
			if ( !delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`).remove()
			// enable load more button
			delete_share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.removeClass('disabled')
			
			// check last page
			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}
		}

	}
}

// ShareDocitFolderDialog
ShareDocitFolderDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'share_docit_folder_dialog',
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.share_folder)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/share-docit-folder-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const file = options.folder

	// file info
	const share_docit_folder_dialog__file_info = dialog_container.find('#share_docit_folder_dialog__file_info')

	// Sharing choises tabs
	const share_docit_folder_dialog__sharing_choises_tabs = dialog_container.find('#share_docit_folder_dialog__sharing_choises_tabs')
	const share_docit_folder_dialog__tab__back_button = dialog_container.find('.share_docit_folder_dialog__tab__back_button')
	const share_docit_folder_dialog__sharing_choises_tabs__tab_buttons = dialog_container.find('.share_docit_folder_dialog__sharing_choises_tabs__tab_buttons')

	const share_docit_folder_dialog__tabs = dialog_container.find('.share_docit_folder_dialog__tabs')

	// Tabs
	const share_docit_folder_dialog__share_with_people_tab = dialog_container.find('#share_docit_folder_dialog__share_with_people_tab')
	const share_docit_folder_dialog__share_with_groups_tab = dialog_container.find('#share_docit_folder_dialog__share_with_groups_tab')

	// Go back
	share_docit_folder_dialog__tab__back_button.off('click').on('click', goBack)

	// Navigate tabs
	share_docit_folder_dialog__sharing_choises_tabs__tab_buttons.each((k,v) => {
		const target = $(v)

		target.off('click').on('click', e => {
			showTab(target)
		})

	})

	// share_docit_folder_dialog__share_with_people_tab
	share_docit_folder_dialog__share_with_people_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithPeopleTab()
	})
	// share_docit_folder_dialog__share_with_groups_tab
	share_docit_folder_dialog__share_with_groups_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithGroupsTab()
	})
	
	// show tab
	function showTab(target)
	{
		const title = target.find('.js_tab_button_title').text()
		const tab = dialog_container.find(target.data('tab') )

		// show tab
		tab.removeClass('d-none').siblings().addClass('d-none')
		// Set title
		tab.find('.js_tab_title').text(title)
		// hide tab buttons
		share_docit_folder_dialog__sharing_choises_tabs.addClass('d-none')

		// dispatch event
		dispatchCustomEvent('tab:opened', {}, tab[0])
	}
	// go back
	function goBack()
	{
		// show tab buttons
		share_docit_folder_dialog__sharing_choises_tabs.removeClass('d-none')
		// hide tabs
		share_docit_folder_dialog__tabs.addClass('d-none')
	}
	// displayInfo
	displayInfo()
	function displayInfo()
	{
		// const file_info__copy_url_to_clipboard = share_docit_folder_dialog__file_info.find('.file_info__copy_url_to_clipboard')

		share_docit_folder_dialog__file_info.find('.file_info__name').text( file.name )
		share_docit_folder_dialog__file_info.find('.file_info__files_count')
		.html(`
		<div class="">
			${ (file.children) ? file.children.length : 0 } ${ FUI_DISPLAY_LANG.views.pages.global.attributes.folders },
		</div>

		<div class="width-10px"></div>

		<div class="">
			${ (file.medias) ? file.medias.length : 0 } ${ FUI_DISPLAY_LANG.views.pages.global.attributes.files }
		</div>
		`)
		share_docit_folder_dialog__file_info.find('.file_info__icon').html( fileTypeIcon({
            extension: 'folder',
		}) )
		
		// copy to clipboard
		// file_info__copy_url_to_clipboard.off('click').on('click', e => {

		// 	const copyIcon = '<i class="fas fa-clipboard"></i>'
		// 	const copiedIcon = '<i class="fas fa-clipboard-check"></i>'

		// 	file_info__copy_url_to_clipboard.html(copiedIcon).addClass('text-success').removeClass('text-color-19')

		// 	setTimeout(() => {
		// 		file_info__copy_url_to_clipboard.html(copyIcon).removeClass('text-success').addClass('text-color-19')
		// 	}, 5*1000);

		// 	copyToClipboard(file.url)

		// 	CreateToast('PS', FUI_DISPLAY_LANG.views.pages.global.text114, '')

		// })
	}

	// Share with people
	function setupShareWithPeopleTab()
	{
		const share_docit_folder_dialog__share_with_people_tab__create_form = dialog_container.find('#share_docit_folder_dialog__share_with_people_tab__create_form')
		const share_docit_folder_dialog__share_with_people_tab__create_form__user_select = dialog_container.find('#share_docit_folder_dialog__share_with_people_tab__create_form__user_select')
		const share_docit_folder_dialog__share_with_people_tab__create_form__share_permissions_select = dialog_container.find('#share_docit_folder_dialog__share_with_people_tab__create_form__share_permissions_select')

		// submit
		share_docit_folder_dialog__share_with_people_tab__create_form.off('submit').on('submit', async e => {
			e.preventDefault()

			var users = checkJSON( decodeURIComponent( atob( share_docit_folder_dialog__share_with_people_tab__create_form__user_select.data('selections') ) ) )
			var permissions = checkJSON( decodeURIComponent( atob( share_docit_folder_dialog__share_with_people_tab__create_form__share_permissions_select.data('selections') ) ) )
			
			// check users
			if ( users.length == 0 )
			{
				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.no_users_selected, '')
				return
			}
			// check permissions
			if ( permissions.length == 0 )
			{
				permissions.push({
					id: 'download',
				})
			}

			// filter permissions
			permissions = permissions.map(v => {
				return v.id
			})

			// delete name from users array
			const collection = users.map((v) => { 
				return v.id
			})

			try 
			{
				share_docit_folder_dialog__share_with_people_tab__create_form.find(':submit').addClass('disabled')

				await DOCIT_USER_MODEL.folders_batchShare({
					sharer_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
					folder_id: file.id,
					permissions,
					collection: collection,
				})

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_folder_share, '')
			} catch (error) {
				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
				share_docit_folder_dialog__share_with_people_tab__create_form.find(':submit').removeClass('disabled')
			}

			share_docit_folder_dialog__share_with_people_tab__create_form.find(':submit').removeClass('disabled')

			// clear selections
			//
			dispatchCustomEvent('clear-selections', {}, share_docit_folder_dialog__share_with_people_tab__create_form__user_select[0])
			//
			dispatchCustomEvent('clear-selections', {}, share_docit_folder_dialog__share_with_people_tab__create_form__share_permissions_select[0])
		})
	}
	// Share with groups
	function setupShareWithGroupsTab()
	{
		const share_docit_folder_dialog__share_with_groups_tab__create_form = dialog_container.find('#share_docit_folder_dialog__share_with_groups_tab__create_form')
		const share_docit_folder_dialog__share_with_groups_tab__create_form__share_permissions_select = dialog_container.find('#share_docit_folder_dialog__share_with_groups_tab__create_form__share_permissions_select')

		const share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement = dialog_container.find('#share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement')
		const share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button = dialog_container.find('#share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button')

		const share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input = dialog_container.find('#share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input')

		var isLoading = false
		var PAGINATION = {
			per_page: 10,
			current_page: 1,
			last_page: 0,
			total: 0,
		}

		const params = {
			searchTerm: '',
			user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
			pagination: PAGINATION,
			orderBy: 'id',
			order: 'desc',
		}

		// search
		detectTypingEnd(share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input, val => {
			displayGroups({
				clearOld: true,
			})
		})
		// load more
		share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.off('click').on('click', e => {

			if ( getIsLoading() ) return

			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}

			setPagination({
				current_page: getPagination().current_page + 1,
			})

			setIsLoading(true)

			displayGroups({
				onData: (data) => {
					setIsLoading(false)
				}
			})

		})

		// submit
		// share_docit_folder_dialog__share_with_groups_tab__create_form.off('submit').on('submit', async e => {
		// 	e.preventDefault()

		// 	var permissions = checkJSON( decodeURIComponent( atob( share_docit_folder_dialog__share_with_groups_tab__create_form__share_permissions_select.data('selections') ) ) )

		// 	// check permissions
		// 	if ( permissions.length == 0 )
		// 	{
		// 		permissions.push({
		// 			id: 'download',
		// 		})
		// 	}

		// 	// filter permissions
		// 	permissions = permissions.map(v => {
		// 		return v.id
		// 	})

		// 	try 
		// 	{
		// 		share_docit_folder_dialog__share_with_groups_tab__create_form.find(':submit').addClass('disabled')

		// 		await DOCIT_GROUP_MODEL.media_batchShare({
		// 			sharer_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
		// 			media_id: file.id,
		// 			permissions,
		// 			collection: collection,
		// 		})

		// 		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_share, '')
		// 	} catch (error) {
		// 		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
		// 		share_docit_folder_dialog__share_with_groups_tab__create_form.find(':submit').removeClass('disabled')
		// 	}

		// 	share_docit_folder_dialog__share_with_groups_tab__create_form.find(':submit').removeClass('disabled')

		// 	// clear selections
		// 	//
		// 	dispatchCustomEvent('clear-selections', {}, share_docit_folder_dialog__share_with_groups_tab__create_form__share_permissions_select[0])
		// })

		// displayGroups
		displayGroups()
		async function displayGroups(options = {})
		{
			const defaultOptions = {
				onData: (e) => {}
			}
		
			options = {...defaultOptions, ...options}
		
			params.searchTerm = share_docit_folder_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input.val()
			params.pagination = PAGINATION
		
			showPlaceholder()
		
			var res = null
		
			try 
			{
				res = await DOCIT_USER_MODEL.groups_search(params)
			} 
			catch (error) {
				share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.html(`
				<div class="col-lg-12 col-md-12 cursor-pointer">
		
					<div class="overflow-hidden no-pointer">
		
						<p class="fs-17 text-danger">
							${ FUI_DISPLAY_LANG.views.messages.no_data_found }
						</p>
		
					</div>
		
				</div>
				`)
				hidePlaceholder()
				return
			}
		
			// Update PAGINATION
			PAGINATION.last_page = res.data.last_page
			PAGINATION.total = res.data.total
			setPagination({
				last_page: res.last_page,
				total: res.total,
				from: res.from,
				to: res.to,
			})
			
			hidePlaceholder()
		
			// clear
			if ( options.clearOld ) 
			{
				console.log(options)
				share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.html('')
		
				setPagination({
					last_page: 10,
					total: 1,
					from: 0,
					to: 0,
				})
			}
		
			const data = res.data
		
			data.map((group, k) => {
				appendGroup({}, group)
			})
		}
		// append html
		function appendGroup(options = {}, group)
		{
			const defaultOptions = {
				append: true,
			}

			options = {...defaultOptions, ...options}

			const id = `group_holder__${uniqid()}__${group.id}`

			const html = `
			<div class="col-md-12" id="${id}" data-id="${group.id}" data-name="${group.name}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								${group.name}
							</h4>
						</div>

						${
							(!isNull(group.description)) ? `
							<div class="mb-4">
								<p class="fs-17 fw-300 text-color-17 max-width-500px">
									${ summarizeText(group.description, 140) }
								</p>
							</div>
							`
							: ''
						}

						<div class="fs-14 text-color-17">
							${ getDatetimeDifference(group.created_at).auto } 
							( ${ formatDateTime(group.created_at, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							}) })
						</div>

					</div>

					<div class="">

						<div class="bg-color-hover-ebebeb width-60px height-60px rounded-circle border text-color-6 d-inline-flex align-items-center justify-content-center" id="share_group_button__${group.id}">
							<i class="fas fa-share"></i>
						</div>

					</div>

				</div>

			</div>
			`
			//
			if ( options.append ) share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.append(html)
			else share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.prepend(html)

			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()

			const holder = share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`#${id}`)

			const share_group_button__ = holder.find(`#share_group_button__${group.id}`)

			// share_group_button__
			share_group_button__.on('click', async e => {

				var permissions = checkJSON( decodeURIComponent( atob( share_docit_folder_dialog__share_with_groups_tab__create_form__share_permissions_select.data('selections') ) ) )

				// check permissions
				if ( permissions.length == 0 )
				{
					permissions.push({
						id: 'download',
					})
				}

				// filter permissions
				permissions = permissions.map(v => {
					return v.id
				})

				try 
				{
					holder.addClass('disabled')

					await DOCIT_GROUP_MODEL.folders_store({
						group_id: group.id,
						user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
						folder_id: file.id,
						permissions,
					})

					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_folder_share, '')
				} catch (error) {
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
					holder.removeClass('disabled')
				}

				holder.removeClass('disabled')

			})
		}

		// set pagination
		function setPagination(options = {})
		{
			PAGINATION = {...PAGINATION, ...options}
		}
		// get pagination
		function getPagination()
		{
			return PAGINATION
		}
		// set isLoading
		function setIsLoading(value)
		{
			isLoading = value
		}
		// get isLoading
		function getIsLoading()
		{
			return isLoading
		}
		// show placeholder
		function showPlaceholder()
		{
			const id = share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`
			const html = `
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			`

			// check exists
			if ( share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.append(html)

			// disable load more button
			share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.addClass('disabled')
		}
		// hide placeholder
		function hidePlaceholder()
		{
			const id = share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`

			// check exists
			if ( !share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			share_docit_folder_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`).remove()
			// enable load more button
			share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.removeClass('disabled')
			
			// check last page
			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				share_docit_folder_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}
		}

	}
}

// DeleteShareDocitFileDialog
DeleteShareDocitFileDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'delete_share_docit_file_dialog',
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.delete_share_file)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/delete-share-docit-file-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const file = options.file

	// file info
	const delete_share_docit_file_dialog__file_info = dialog_container.find('#delete_share_docit_file_dialog__file_info')

	// Sharing choises tabs
	const delete_share_docit_file_dialog__sharing_choises_tabs = dialog_container.find('#delete_share_docit_file_dialog__sharing_choises_tabs')
	const delete_share_docit_file_dialog__tab__back_button = dialog_container.find('.delete_share_docit_file_dialog__tab__back_button')
	const delete_share_docit_file_dialog__sharing_choises_tabs__tab_buttons = dialog_container.find('.delete_share_docit_file_dialog__sharing_choises_tabs__tab_buttons')

	const delete_share_docit_file_dialog__tabs = dialog_container.find('.delete_share_docit_file_dialog__tabs')

	// Tabs
	const delete_share_docit_file_dialog__share_with_people_tab = dialog_container.find('#delete_share_docit_file_dialog__share_with_people_tab')
	const delete_share_docit_file_dialog__share_with_groups_tab = dialog_container.find('#delete_share_docit_file_dialog__share_with_groups_tab')

	// Go back
	delete_share_docit_file_dialog__tab__back_button.off('click').on('click', goBack)

	// Navigate tabs
	delete_share_docit_file_dialog__sharing_choises_tabs__tab_buttons.each((k,v) => {
		const target = $(v)

		target.off('click').on('click', e => {
			showTab(target)
		})

	})

	// delete_share_docit_file_dialog__share_with_people_tab
	delete_share_docit_file_dialog__share_with_people_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithPeopleTab()
	})
	// delete_share_docit_file_dialog__share_with_groups_tab
	delete_share_docit_file_dialog__share_with_groups_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithGroupsTab()
	})
	
	// show tab
	function showTab(target)
	{
		const title = target.find('.js_tab_button_title').text()
		const tab = dialog_container.find(target.data('tab') )

		// show tab
		tab.removeClass('d-none').siblings().addClass('d-none')
		// Set title
		tab.find('.js_tab_title').text(title)
		// hide tab buttons
		delete_share_docit_file_dialog__sharing_choises_tabs.addClass('d-none')

		// dispatch event
		dispatchCustomEvent('tab:opened', {}, tab[0])
	}
	// go back
	function goBack()
	{
		// show tab buttons
		delete_share_docit_file_dialog__sharing_choises_tabs.removeClass('d-none')
		// hide tabs
		delete_share_docit_file_dialog__tabs.addClass('d-none')
	}
	// displayInfo
	displayInfo()
	function displayInfo()
	{
		const file_info__copy_url_to_clipboard = delete_share_docit_file_dialog__file_info.find('.file_info__copy_url_to_clipboard')

		delete_share_docit_file_dialog__file_info.find('.file_info__name').text( (file.title) ?? file.name )
		delete_share_docit_file_dialog__file_info.find('.file_info__size').text( formatBytes(file.size) )
		delete_share_docit_file_dialog__file_info.find('.file_info__icon').html( fileTypeIcon({
			url: file.url,
            extension: file.extension,
			class: 'width-94px height-94px img-thumbnail rounded',
		}) )
		
		// copy to clipboard
		file_info__copy_url_to_clipboard.off('click').on('click', e => {

			const copyIcon = '<i class="fas fa-clipboard"></i>'
			const copiedIcon = '<i class="fas fa-clipboard-check"></i>'

			file_info__copy_url_to_clipboard.html(copiedIcon).addClass('text-success').removeClass('text-color-19')

			setTimeout(() => {
				file_info__copy_url_to_clipboard.html(copyIcon).removeClass('text-success').addClass('text-color-19')
			}, 5*1000);

			copyToClipboard(file.url)

			CreateToast('PS', FUI_DISPLAY_LANG.views.pages.global.text106, '')

		})
	}

	// Share with people
	function setupShareWithPeopleTab()
	{
		const delete_share_docit_file_dialog__share_with_people_tab__create_form = dialog_container.find('#delete_share_docit_file_dialog__share_with_people_tab__create_form')
		const delete_share_docit_file_dialog__share_with_people_tab__create_form__user_select = dialog_container.find('#delete_share_docit_file_dialog__share_with_people_tab__create_form__user_select')

		const delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement = dialog_container.find('#delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement')
		const delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button = dialog_container.find('#delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button')

		const delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input = dialog_container.find('#delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input')

		var isLoading = false
		var PAGINATION = {
			per_page: 10,
			current_page: 1,
			last_page: 0,
			total: 0,
		}

		const params = {
			searchTerm: '',
			user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
			pagination: PAGINATION,
			pivot: {
				media_id: file.id,
			}
		}

		// search
		detectTypingEnd(delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input, val => {
			displayPeople({
				clearOld: true,
			})
		})
		// load more
		delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.off('click').on('click', e => {

			if ( getIsLoading() ) return

			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.parent().addClass('d-none')
				return
			}

			setPagination({
				current_page: getPagination().current_page + 1,
			})

			setIsLoading(true)

			displayPeople({
				onData: (data) => {
					setIsLoading(false)
				}
			})

		})

		displayPeople()
		async function displayPeople(options = {})
		{
			const defaultOptions = {
				onData: (e) => {}
			}
		
			options = {...defaultOptions, ...options}
		
			params.searchTerm = delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__search_input.val()
			params.pagination = PAGINATION
		
			showPlaceholder()
		
			var res = null
		
			try 
			{
				res = await DOCIT_USER_MODEL.media_shared_withUsers_search(params)
			} 
			catch (error) {
				delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.html(`
				<div class="col-lg-12 col-md-12 cursor-pointer">
		
					<div class="overflow-hidden no-pointer">
		
						<p class="fs-17 text-danger">
							${ FUI_DISPLAY_LANG.views.messages.no_data_found }
						</p>
		
					</div>
		
				</div>
				`)
				hidePlaceholder()
				return
			}
		
			// Update PAGINATION
			PAGINATION.last_page = res.data.last_page
			PAGINATION.total = res.data.total
			setPagination({
				last_page: res.last_page,
				total: res.total,
				from: res.from,
				to: res.to,
			})
			
			hidePlaceholder()
		
			// clear
			if ( options.clearOld ) 
			{
				delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.html('')
		
				setPagination({
					last_page: 10,
					total: 1,
					from: 0,
					to: 0,
				})
			}
		
			const data = res.data
			var html = ''
		
			data.map((user, k) => {
				appendUser({}, user)
			})
		}
		// append html
		function appendUser(options = {}, user)
		{
			const defaultOptions = {
				append: true,
			}

			options = {...defaultOptions, ...options}

			const id = `user_holder__${uniqid()}__${user.id}`

			const html = `
			<div class="col-md-12" id="${id}" data-id="${user.id}" data-name="${user.name}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								${user.name}
							</h4>
						</div>

						<div class="mb-4">
							<p class="fs-17 fw-300 text-color-17 max-width-500px">
								${ user.phone }
							</p>
						</div>

						<div class="fs-14 text-color-17">
							${ getDatetimeDifference(user.pivot.created_at).auto } 
							( ${ formatDateTime(user.pivot.created_at, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							}) })
						</div>

					</div>

					<div class="">

						<div class="bg-color-hover-ebebeb width-60px height-60px rounded-circle border text-color-6 d-inline-flex align-items-center justify-content-center" id="delete_share_button__${user.id}">
							<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" fill="currentColor">
								<path d="M503.7 189.8L327.7 37.9C312.3 24.5 288 35.3 288 56v80.1C127.4 137.9 0 170.1 0 322.3c0 61.4 39.6 122.3 83.3 154.1 13.7 9.9 33.1-2.5 28.1-18.6C66.1 312.8 132.9 274.3 288 272.1V360c0 20.7 24.3 31.5 39.7 18.2l176-152c11.1-9.6 11.1-26.8 0-36.3z"/>
								<line x1="64" y1="64" x2="448" y2="448" style="stroke:currentColor;stroke-width:30;"/>
							</svg>
						</div>

					</div>

				</div>

			</div>
			`
			//
			if ( options.append ) delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.append(html)
			else delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.prepend(html)

			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()

			const holder = delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`#${id}`)

			const delete_share_button__ = holder.find(`#delete_share_button__${user.id}`)

			// delete_share_button__
			delete_share_button__.on('click', e => {

				PromptConfirmDialog().then(async () => {

					try 
					{
						holder.addClass('disabled')

						await DOCIT_USER_MODEL.media_shared_delete({
							sharer_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
							shared_with_id: user.id,
							media_id: file.id,
						})

						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_delete_share, '')
					} catch (error) {
						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
						holder.removeClass('disabled')
					}

					holder.remove()

				})

			})
		}
		// set pagination
		function setPagination(options = {})
		{
			PAGINATION = {...PAGINATION, ...options}
		}
		// get pagination
		function getPagination()
		{
			return PAGINATION
		}
		// set isLoading
		function setIsLoading(value)
		{
			isLoading = value
		}
		// get isLoading
		function getIsLoading()
		{
			return isLoading
		}
		// show placeholder
		function showPlaceholder()
		{
			const id = delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.attr('id')
			const selector = `placeholder__${id}`
			const html = `
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			`

			// check exists
			if ( delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.append(html)

			// disable load more button
			delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.addClass('disabled')
		}
		// hide placeholder
		function hidePlaceholder()
		{
			const id = delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.attr('id')
			const selector = `placeholder__${id}`

			// check exists
			if ( !delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__tableElement.find(`.${selector}`).remove()
			// enable load more button
			delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.removeClass('disabled')
			
			// check last page
			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_file_dialog__share_with_people_tab__create_form__people_shared_with_panel__load_more_button.parent().addClass('d-none')
				return
			}
		}
	}
	// Share with groups
	function setupShareWithGroupsTab()
	{
		const delete_share_docit_file_dialog__share_with_groups_tab__create_form = dialog_container.find('#delete_share_docit_file_dialog__share_with_groups_tab__create_form')
		const delete_share_docit_file_dialog__share_with_groups_tab__create_form__share_permissions_select = dialog_container.find('#delete_share_docit_file_dialog__share_with_groups_tab__create_form__share_permissions_select')

		const delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement = dialog_container.find('#delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement')
		const delete_share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button = dialog_container.find('#delete_share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button')

		const delete_share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input = dialog_container.find('#delete_share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input')

		var isLoading = false
		var PAGINATION = {
			per_page: 10,
			current_page: 1,
			last_page: 0,
			total: 0,
		}

		const params = {
			searchTerm: '',
			user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
			pagination: PAGINATION,
			pivot: {
				media_id: file.id,
			}
		}

		// search
		detectTypingEnd(delete_share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input, val => {
			displayGroups({
				clearOld: true,
			})
		})
		// load more
		delete_share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.off('click').on('click', e => {

			if ( getIsLoading() ) return

			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}

			setPagination({
				current_page: getPagination().current_page + 1,
			})

			setIsLoading(true)

			displayGroups({
				onData: (data) => {
					setIsLoading(false)
				}
			})

		})

		displayGroups()
		async function displayGroups()
		{
			const defaultOptions = {
				onData: (e) => {}
			}
		
			options = {...defaultOptions, ...options}
		
			params.searchTerm = delete_share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input.val()
			params.pagination = PAGINATION
		
			showPlaceholder()
		
			var res = null
		
			try 
			{
				res = await DOCIT_USER_MODEL.media_shared_withGroups_search(params)
			} 
			catch (error) {
				delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.html(`
				<div class="col-lg-12 col-md-12 cursor-pointer">
		
					<div class="overflow-hidden no-pointer">
		
						<p class="fs-17 text-danger">
							${ FUI_DISPLAY_LANG.views.messages.no_data_found }
						</p>
		
					</div>
		
				</div>
				`)
				hidePlaceholder()
				return
			}
		
			// Update PAGINATION
			PAGINATION.last_page = res.data.last_page
			PAGINATION.total = res.data.total
			setPagination({
				last_page: res.last_page,
				total: res.total,
				from: res.from,
				to: res.to,
			})
			
			hidePlaceholder()
		
			// clear
			if ( options.clearOld ) 
			{
				delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.html('')
		
				setPagination({
					last_page: 10,
					total: 1,
					from: 0,
					to: 0,
				})
			}
		
			const data = res.data

			data.map((group, k) => {
				appendGroup({}, group)
			})
		}
		// append html
		function appendGroup(options = {}, group)
		{
			const defaultOptions = {
				append: true,
			}

			options = {...defaultOptions, ...options}

			const id = `group_holder__${uniqid()}__${group.id}`

			const html = `
			<div class="col-md-12" id="${id}" data-id="${group.id}" data-name="${group.name}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								${group.name}
							</h4>
						</div>

						${
							(!isNull(group.description)) ? `
							<div class="mb-4">
								<p class="fs-17 fw-300 text-color-17 max-width-500px">
									${ summarizeText(group.description, 140) }
								</p>
							</div>
							`
							: ''
						}

						<div class="fs-14 text-color-17">
							${ getDatetimeDifference(group.created_at).auto } 
							( ${ formatDateTime(group.created_at, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							}) })
						</div>

					</div>

					<div class="">

						<div class="bg-color-hover-ebebeb width-60px height-60px rounded-circle border text-color-6 d-inline-flex align-items-center justify-content-center" id="delete_share_group_button__${group.id}">
							<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" fill="currentColor">
								<path d="M503.7 189.8L327.7 37.9C312.3 24.5 288 35.3 288 56v80.1C127.4 137.9 0 170.1 0 322.3c0 61.4 39.6 122.3 83.3 154.1 13.7 9.9 33.1-2.5 28.1-18.6C66.1 312.8 132.9 274.3 288 272.1V360c0 20.7 24.3 31.5 39.7 18.2l176-152c11.1-9.6 11.1-26.8 0-36.3z"/>
								<line x1="64" y1="64" x2="448" y2="448" style="stroke:currentColor;stroke-width:30;"/>
							</svg>
						</div>

					</div>

				</div>

			</div>
			`
			//
			if ( options.append ) delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.append(html)
			else delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.prepend(html)

			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()

			const holder = delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`#${id}`)

			const delete_share_group_button__ = holder.find(`#delete_share_group_button__${group.id}`)

			// delete_share_group_button__
			delete_share_group_button__.on('click', e => {

				PromptConfirmDialog().then(async () => {

					try 
					{
						holder.addClass('disabled')

						await DOCIT_GROUP_MODEL.media_delete({
							group_id: group.id,
							media_id: file.id,
						})

						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_delete_share, '')
					} catch (error) {
						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
						holder.removeClass('disabled')
					}

					holder.remove()

				})

			})
		}

		// set pagination
		function setPagination(options = {})
		{
			PAGINATION = {...PAGINATION, ...options}
		}
		// get pagination
		function getPagination()
		{
			return PAGINATION
		}
		// set isLoading
		function setIsLoading(value)
		{
			isLoading = value
		}
		// get isLoading
		function getIsLoading()
		{
			return isLoading
		}
		// show placeholder
		function showPlaceholder()
		{
			const id = delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`
			const html = `
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			`

			// check exists
			if ( delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.append(html)

			// disable load more button
			delete_share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.addClass('disabled')
		}
		// hide placeholder
		function hidePlaceholder()
		{
			const id = delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`

			// check exists
			if ( !delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			delete_share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`).remove()
			// enable load more button
			delete_share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.removeClass('disabled')
			
			// check last page
			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				delete_share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}
		}

	}
}

// ShareDocitFileDialog
ShareDocitFileDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'share_docit_file_dialog',
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.share_file)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/share-docit-file-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const file = options.file

	// file info
	const share_docit_file_dialog__file_info = dialog_container.find('#share_docit_file_dialog__file_info')

	// Sharing choises tabs
	const share_docit_file_dialog__sharing_choises_tabs = dialog_container.find('#share_docit_file_dialog__sharing_choises_tabs')
	const share_docit_file_dialog__tab__back_button = dialog_container.find('.share_docit_file_dialog__tab__back_button')
	const share_docit_file_dialog__sharing_choises_tabs__tab_buttons = dialog_container.find('.share_docit_file_dialog__sharing_choises_tabs__tab_buttons')

	const share_docit_file_dialog__tabs = dialog_container.find('.share_docit_file_dialog__tabs')

	// Tabs
	const share_docit_file_dialog__share_with_people_tab = dialog_container.find('#share_docit_file_dialog__share_with_people_tab')
	const share_docit_file_dialog__share_with_groups_tab = dialog_container.find('#share_docit_file_dialog__share_with_groups_tab')

	// Go back
	share_docit_file_dialog__tab__back_button.off('click').on('click', goBack)

	// Navigate tabs
	share_docit_file_dialog__sharing_choises_tabs__tab_buttons.each((k,v) => {
		const target = $(v)

		target.off('click').on('click', e => {
			showTab(target)
		})

	})

	// share_docit_file_dialog__share_with_people_tab
	share_docit_file_dialog__share_with_people_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithPeopleTab()
	})
	// share_docit_file_dialog__share_with_groups_tab
	share_docit_file_dialog__share_with_groups_tab.off('tab:opened').on('tab:opened', e => {
		setupShareWithGroupsTab()
	})
	
	// show tab
	function showTab(target)
	{
		const title = target.find('.js_tab_button_title').text()
		const tab = dialog_container.find(target.data('tab') )

		// show tab
		tab.removeClass('d-none').siblings().addClass('d-none')
		// Set title
		tab.find('.js_tab_title').text(title)
		// hide tab buttons
		share_docit_file_dialog__sharing_choises_tabs.addClass('d-none')

		// dispatch event
		dispatchCustomEvent('tab:opened', {}, tab[0])
	}
	// go back
	function goBack()
	{
		// show tab buttons
		share_docit_file_dialog__sharing_choises_tabs.removeClass('d-none')
		// hide tabs
		share_docit_file_dialog__tabs.addClass('d-none')
	}
	// displayInfo
	displayInfo()
	function displayInfo()
	{
		const file_info__copy_url_to_clipboard = share_docit_file_dialog__file_info.find('.file_info__copy_url_to_clipboard')

		share_docit_file_dialog__file_info.find('.file_info__name').text( (file.title) ?? file.name )
		share_docit_file_dialog__file_info.find('.file_info__size').text( formatBytes(file.size) )
		share_docit_file_dialog__file_info.find('.file_info__icon').html( fileTypeIcon({
			url: file.url,
            extension: file.extension,
			class: 'width-94px height-94px img-thumbnail rounded',
		}) )
		
		// copy to clipboard
		file_info__copy_url_to_clipboard.off('click').on('click', e => {

			const copyIcon = '<i class="fas fa-clipboard"></i>'
			const copiedIcon = '<i class="fas fa-clipboard-check"></i>'

			file_info__copy_url_to_clipboard.html(copiedIcon).addClass('text-success').removeClass('text-color-19')

			setTimeout(() => {
				file_info__copy_url_to_clipboard.html(copyIcon).removeClass('text-success').addClass('text-color-19')
			}, 5*1000);

			copyToClipboard(file.url)

			CreateToast('PS', FUI_DISPLAY_LANG.views.pages.global.text106, '')

		})
	}

	// Share with people
	function setupShareWithPeopleTab()
	{
		const share_docit_file_dialog__share_with_people_tab__create_form = dialog_container.find('#share_docit_file_dialog__share_with_people_tab__create_form')
		const share_docit_file_dialog__share_with_people_tab__create_form__user_select = dialog_container.find('#share_docit_file_dialog__share_with_people_tab__create_form__user_select')
		const share_docit_file_dialog__share_with_people_tab__create_form__share_permissions_select = dialog_container.find('#share_docit_file_dialog__share_with_people_tab__create_form__share_permissions_select')

		// submit
		share_docit_file_dialog__share_with_people_tab__create_form.off('submit').on('submit', async e => {
			e.preventDefault()

			var users = checkJSON( decodeURIComponent( atob( share_docit_file_dialog__share_with_people_tab__create_form__user_select.data('selections') ) ) )
			var permissions = checkJSON( decodeURIComponent( atob( share_docit_file_dialog__share_with_people_tab__create_form__share_permissions_select.data('selections') ) ) )
			
			// check users
			if ( users.length == 0 )
			{
				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.no_users_selected, '')
				return
			}
			// check permissions
			if ( permissions.length == 0 )
			{
				permissions.push({
					id: 'download',
				})
			}

			// filter permissions
			permissions = permissions.map(v => {
				return v.id
			})

			// delete name from users array
			const collection = users.map((v) => { 
				return v.id
			})

			try 
			{
				share_docit_file_dialog__share_with_people_tab__create_form.find(':submit').addClass('disabled')

				await DOCIT_USER_MODEL.media_batchShare({
					sharer_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
					media_id: file.id,
					permissions,
					collection: collection,
				})

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_share, '')
			} catch (error) {
				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
				share_docit_file_dialog__share_with_people_tab__create_form.find(':submit').removeClass('disabled')
			}

			share_docit_file_dialog__share_with_people_tab__create_form.find(':submit').removeClass('disabled')

			// clear selections
			//
			dispatchCustomEvent('clear-selections', {}, share_docit_file_dialog__share_with_people_tab__create_form__user_select[0])
			//
			dispatchCustomEvent('clear-selections', {}, share_docit_file_dialog__share_with_people_tab__create_form__share_permissions_select[0])
		})
	}
	// Share with groups
	function setupShareWithGroupsTab()
	{
		const share_docit_file_dialog__share_with_groups_tab__create_form = dialog_container.find('#share_docit_file_dialog__share_with_groups_tab__create_form')
		const share_docit_file_dialog__share_with_groups_tab__create_form__share_permissions_select = dialog_container.find('#share_docit_file_dialog__share_with_groups_tab__create_form__share_permissions_select')

		const share_docit_file_dialog__share_with_groups_tab__create_form__tableElement = dialog_container.find('#share_docit_file_dialog__share_with_groups_tab__create_form__tableElement')
		const share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button = dialog_container.find('#share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button')

		const share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input = dialog_container.find('#share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input')

		var isLoading = false
		var PAGINATION = {
			per_page: 10,
			current_page: 1,
			last_page: 0,
			total: 0,
		}

		const params = {
			searchTerm: '',
			user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
			pagination: PAGINATION,
			orderBy: 'id',
			order: 'desc',
		}

		// search
		detectTypingEnd(share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input, val => {
			displayGroups({
				clearOld: true,
			})
		})
		// load more
		share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.off('click').on('click', e => {

			if ( getIsLoading() ) return

			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}

			setPagination({
				current_page: getPagination().current_page + 1,
			})

			setIsLoading(true)

			displayGroups({
				onData: (data) => {
					setIsLoading(false)
				}
			})

		})

		// submit
		// share_docit_file_dialog__share_with_groups_tab__create_form.off('submit').on('submit', async e => {
		// 	e.preventDefault()

		// 	var permissions = checkJSON( decodeURIComponent( atob( share_docit_file_dialog__share_with_groups_tab__create_form__share_permissions_select.data('selections') ) ) )

		// 	// check permissions
		// 	if ( permissions.length == 0 )
		// 	{
		// 		permissions.push({
		// 			id: 'download',
		// 		})
		// 	}

		// 	// filter permissions
		// 	permissions = permissions.map(v => {
		// 		return v.id
		// 	})

		// 	try 
		// 	{
		// 		share_docit_file_dialog__share_with_groups_tab__create_form.find(':submit').addClass('disabled')

		// 		await DOCIT_GROUP_MODEL.media_batchShare({
		// 			sharer_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
		// 			media_id: file.id,
		// 			permissions,
		// 			collection: collection,
		// 		})

		// 		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_share, '')
		// 	} catch (error) {
		// 		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
		// 		share_docit_file_dialog__share_with_groups_tab__create_form.find(':submit').removeClass('disabled')
		// 	}

		// 	share_docit_file_dialog__share_with_groups_tab__create_form.find(':submit').removeClass('disabled')

		// 	// clear selections
		// 	//
		// 	dispatchCustomEvent('clear-selections', {}, share_docit_file_dialog__share_with_groups_tab__create_form__share_permissions_select[0])
		// })

		// displayGroups
		displayGroups()
		async function displayGroups()
		{
			const defaultOptions = {
				onData: (e) => {}
			}
		
			options = {...defaultOptions, ...options}
		
			params.searchTerm = share_docit_file_dialog__share_with_groups_tab__create_form__add_people_to_docit_group_dialog__search_input.val()
			params.pagination = PAGINATION
		
			showPlaceholder()
		
			var res = null
		
			try 
			{
				res = await DOCIT_GROUP_MODEL.search(params)
			} 
			catch (error) {
				share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.html(`
				<div class="col-lg-12 col-md-12 cursor-pointer">
		
					<div class="overflow-hidden no-pointer">
		
						<p class="fs-17 text-danger">
							${ FUI_DISPLAY_LANG.views.messages.no_data_found }
						</p>
		
					</div>
		
				</div>
				`)
				hidePlaceholder()
				return
			}
		
			// Update PAGINATION
			PAGINATION.last_page = res.data.last_page
			PAGINATION.total = res.data.total
			setPagination({
				last_page: res.last_page,
				total: res.total,
				from: res.from,
				to: res.to,
			})
			
			hidePlaceholder()
		
			// clear
			if ( options.clearOld ) 
			{
				share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.html('')
		
				setPagination({
					last_page: 10,
					total: 1,
					from: 0,
					to: 0,
				})
			}
		
			const data = res.data
			var html = ''
		
			data.map((group, k) => {
				appendGroup({}, group)
			})
		}
		// append html
		function appendGroup(options = {}, group)
		{
			const defaultOptions = {
				append: true,
			}

			options = {...defaultOptions, ...options}

			const id = `group_holder__${uniqid()}__${group.id}`

			const html = `
			<div class="col-md-12" id="${id}" data-id="${group.id}" data-name="${group.name}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								${group.name}
							</h4>
						</div>

						${
							(!isNull(group.description)) ? `
							<div class="mb-4">
								<p class="fs-17 fw-300 text-color-17 max-width-500px">
									${ summarizeText(group.description, 140) }
								</p>
							</div>
							`
							: ''
						}

						<div class="fs-14 text-color-17">
							${ getDatetimeDifference(group.created_at).auto } 
							( ${ formatDateTime(group.created_at, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							}) })
						</div>

					</div>

					<div class="">

						<div class="bg-color-hover-ebebeb width-60px height-60px rounded-circle border text-color-6 d-inline-flex align-items-center justify-content-center" id="share_group_button__${group.id}">
							<i class="fas fa-share"></i>
						</div>

					</div>

				</div>

			</div>
			`
			//
			if ( options.append ) share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.append(html)
			else share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.prepend(html)

			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()

			const holder = share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`#${id}`)

			const share_group_button__ = holder.find(`#share_group_button__${group.id}`)

			// share_group_button__
			share_group_button__.on('click', async e => {

				var permissions = checkJSON( decodeURIComponent( atob( share_docit_file_dialog__share_with_groups_tab__create_form__share_permissions_select.data('selections') ) ) )

				// check permissions
				if ( permissions.length == 0 )
				{
					permissions.push({
						id: 'download',
					})
				}

				// filter permissions
				permissions = permissions.map(v => {
					return v.id
				})

				try 
				{
					holder.addClass('disabled')

					await DOCIT_GROUP_MODEL.media_store({
						group_id: group.id,
						user_id: DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID,
						media_id: file.id,
						permissions,
					})

					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_share, '')
				} catch (error) {
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
					holder.removeClass('disabled')
				}

				holder.removeClass('disabled')

			})
		}

		// set pagination
		function setPagination(options = {})
		{
			PAGINATION = {...PAGINATION, ...options}
		}
		// get pagination
		function getPagination()
		{
			return PAGINATION
		}
		// set isLoading
		function setIsLoading(value)
		{
			isLoading = value
		}
		// get isLoading
		function getIsLoading()
		{
			return isLoading
		}
		// show placeholder
		function showPlaceholder()
		{
			const id = share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`
			const html = `
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

				<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

					<div class="w-100">
						
						<div class="mb-2">
							<h4 class="h4 mb-0">
								<div class="content-placeholder max-width-260px height-18px d-block"></div>
							</h4>
						</div>

						<div class="mb-4">
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
							<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						</div>

						<div class="fs-14 text-color-17">
							<div class="content-placeholder max-width-94px height-5px d-block"></div>
						</div>

					</div>

				</div>

			</div>
			`

			// check exists
			if ( share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.append(html)

			// disable load more button
			share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.addClass('disabled')
		}
		// hide placeholder
		function hidePlaceholder()
		{
			const id = share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.attr('id')
			const selector = `placeholder__${id}`

			// check exists
			if ( !share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`)[0] ) return

			share_docit_file_dialog__share_with_groups_tab__create_form__tableElement.find(`.${selector}`).remove()
			// enable load more button
			share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.removeClass('disabled')
			
			// check last page
			if ( getPagination().current_page == getPagination().last_page ) 
			{
				// hide button
				share_docit_file_dialog__share_with_groups_tab__create_form__load_more_button.parent().addClass('d-none')
				return
			}
		}

	}
}


// CreateDocitFolderDialog
CreateDocitFolderDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_docit_folder_dialog',
		html: '',
		sharingPermissions: false,
		onCreated: (e) => {},
		onUpdated: (e) => {},
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_docit_folder)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/create-docit-folder-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_docit_folder_dialog__create_form = dialog_container.find('#create_docit_folder_dialog__create_form')

	const create_docit_folder_dialog__create_form__name_input = dialog_container.find('#create_docit_folder_dialog__create_form__name_input')
	const create_docit_folder_dialog__create_form__description_input = dialog_container.find('#create_docit_folder_dialog__create_form__description_input')
	const create_docit_folder_dialog__create_form__folder_select = dialog_container.find('#create_docit_folder_dialog__create_form__folder_select')

	const create_docit_folder_dialog__create_form__select_share_permissions_template__wrapper = dialog_container.find('#create_docit_folder_dialog__create_form__select_share_permissions_template__wrapper')
	const create_docit_folder_dialog__create_form__share_permissions_select = dialog_container.find('#create_docit_folder_dialog__create_form__share_permissions_select')

	init()

	const FolderObject = {}
	// submit
	create_docit_folder_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check name
		if ( isNull(create_docit_folder_dialog__create_form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		FolderObject.user_id = DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID
		FolderObject.user_name = DEFAULT_INI_SETTINGS.DOCIT_USER.USER_NAME
		FolderObject.parent_id = create_docit_folder_dialog__create_form__folder_select.find(':selected').val()
		FolderObject.name = create_docit_folder_dialog__create_form__name_input.val().trim()
		FolderObject.description = create_docit_folder_dialog__create_form__description_input.val()

		create_docit_folder_dialog__create_form.find(':submit').addClass('disabled')
		// update
		if ( !isNull(options.id) )
		{
			// FolderObject.id = options.id
			try 
			{
				await FOLDER_MODEL.update(options.id, FolderObject)
			} 
			catch (error) 
			{
				console.error(error)
				create_docit_folder_dialog__create_form.find(':submit').removeClass('disabled')
				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
				return
			}
			create_docit_folder_dialog__create_form.find(':submit').removeClass('disabled')

			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_update, '')
			// reset
			options.id = null
			create_docit_folder_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateDocitFolderDialog:updated')
			

			return
		}
		// create
		try 
		{
			var res = await FOLDER_MODEL.create(FolderObject)

			const data = res.data

			// permissions
			var permissions = checkJSON( decodeURIComponent( atob( create_docit_folder_dialog__create_form__share_permissions_select.data('selections') ) ) )

			// check permissions
			if ( permissions.length == 0 )
			{
				permissions.push({
					id: 'download',
				})
			}

			// filter permissions
			data.permissions = permissions.map(v => {
				return v.id
			})

			options.onCreated(data)
		} 
		catch (error) 
		{
			console.error(error)
			create_docit_folder_dialog__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
			return
		}

		create_docit_folder_dialog__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_uploaded, '')

		// reset
		create_docit_folder_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateDocitFolderDialog:created')
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.id) ) return

		observeElement( create_docit_folder_dialog__create_form__folder_select[0], mutation =>
		{
			setOptionSelected(create_docit_folder_dialog__create_form__folder_select, options.parent_id)
		})

		fillForm(create_docit_folder_dialog__create_form, options)

	}
	// init
	function init()
	{
		// check sharing permissions
		if ( options.sharingPermissions )
		{
			create_docit_folder_dialog__create_form__select_share_permissions_template__wrapper.removeClass('d-none')
		}
	}
}

// AddPeopleToDocitGroupDialog
AddPeopleToDocitGroupDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'add_people_to_docit_group_dialog',
		html: '',
		onCreated: (e) => {},
		onUpdated: (e) => {},
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.add_people_to_group)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/add-people-to-docit-group-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const add_people_to_docit_group_dialog__group_name = dialog_container.find('#add_people_to_docit_group_dialog__group_name')

	const add_people_to_docit_group_dialog__create_form = dialog_container.find('#add_people_to_docit_group_dialog__create_form')
	const add_people_to_docit_group_dialog__create_form__user_select = dialog_container.find('#add_people_to_docit_group_dialog__create_form__user_select')


	// display name
	add_people_to_docit_group_dialog__group_name.text(options.group_name)

	// const add_people_to_docit_group_dialog__search_btn = dialog_container.find('#add_people_to_docit_group_dialog__search_btn')
	const add_people_to_docit_group_dialog__search_input = dialog_container.find('#add_people_to_docit_group_dialog__search_input')

	const add_people_to_docit_group_dialog__tableElement = dialog_container.find('#add_people_to_docit_group_dialog__tableElement')
	const add_people_to_docit_group_dialog__load_more_button = dialog_container.find('#add_people_to_docit_group_dialog__load_more_button')

	var isLoading = false
	var PAGINATION = {
		per_page: 10,
		current_page: 1,
		last_page: 0,
		total: 0,
	}

	const params = {
		searchTerm: '',
		group_id: options.group_id,
		pagination: PAGINATION,
		orderBy: 'id',
		order: 'desc',
	}

	// submit
	add_people_to_docit_group_dialog__create_form.off('submit').on('submit', async e => {
		e.preventDefault()

		var users = checkJSON( decodeURIComponent( atob( add_people_to_docit_group_dialog__create_form__user_select.data('selections') ) ) )

		// check users
		if ( users.length == 0 )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.no_items_selected, '')
			return
		}

		// delete name from users array
		users = users.map((v) => { return { user_id: v.id }  })

		try 
		{
			add_people_to_docit_group_dialog__create_form.find(':submit').addClass('disabled')

			await DOCIT_GROUP_MODEL.users_batchStore({
				group_id: options.group_id,
				collection: users,
			})

			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_create, '')
		} catch (error) {
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
			add_people_to_docit_group_dialog__create_form.find(':submit').removeClass('disabled')
		}

		add_people_to_docit_group_dialog__create_form.find(':submit').removeClass('disabled')
		displayAll({
			clearOld: true,
		})
		// clear selections
		//
		dispatchCustomEvent('clear-selections', {}, add_people_to_docit_group_dialog__create_form__user_select[0])

	})

	// search
	detectTypingEnd(add_people_to_docit_group_dialog__search_input, val => {
		displayAll()
	})

	// load more
	add_people_to_docit_group_dialog__load_more_button.off('click').on('click', e => {

		if ( getIsLoading() ) return

		if ( getPagination().current_page == getPagination().last_page ) 
		{
			// hide button
			add_people_to_docit_group_dialog__load_more_button.parent().addClass('d-none')
			return
		}

		setPagination({
			current_page: getPagination().current_page + 1,
		})

		setIsLoading(true)

		displayAll({
			onData: (data) => {
				setIsLoading(false)
			}
		})

	})

	// display all
	displayAll()
	async function displayAll(options = {})
	{
		const defaultOptions = {
			onData: (e) => {}
		}

		options = {...defaultOptions, ...options}

		params.searchTerm = add_people_to_docit_group_dialog__search_input.val()
		params.pagination = PAGINATION

		showPlaceholder()

		var res = null

		try 
		{
			res = await DOCIT_GROUP_MODEL.users_search(params)
		} 
		catch (error) {
			add_people_to_docit_group_dialog__tableElement.html(`
			<div class="col-lg-12 col-md-12 cursor-pointer">

				<div class="overflow-hidden no-pointer">

					<p class="fs-17 text-danger">
						${ FUI_DISPLAY_LANG.views.messages.no_data_found }
					</p>

				</div>

			</div>
			`)
			hidePlaceholder()
			return
		}

		// Update PAGINATION
		PAGINATION.last_page = res.data.last_page
		PAGINATION.total = res.data.total
		setPagination({
			last_page: res.last_page,
			total: res.total,
			from: res.from,
			to: res.to,
		})
		
		hidePlaceholder()

		// clear
		if ( options.clearOld ) 
		{
			add_people_to_docit_group_dialog__tableElement.html('')

			setPagination({
				last_page: 10,
				total: 1,
				from: 0,
				to: 0,
			})
		}

		const data = res.data
		// var html = ''

		data.map((group, k) => {
			appendUser({}, group)
		})

	}
	// append html
	function appendUser(options = {}, user)
	{
		const defaultOptions = {
			append: true,
		}

		options = {...defaultOptions, ...options}

		const id = `user_holder__${uniqid()}__${user.id}`

		const html = `
		<div class="col-md-12" id="${id}" data-id="${user.id}" data-name="${user.name}">

			<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

				<div class="w-100">
					
					<div class="mb-2">
						<h4 class="h4 mb-0">
							${user.name}
						</h4>
					</div>

					<div class="mb-4">
						<p class="fs-17 fw-300 text-color-17 max-width-500px">
							${ user.phone }
						</p>
					</div>

					<div class="fs-14 text-color-17">
						${ getDatetimeDifference(user.created_at).auto } 
						( ${ formatDateTime(user.created_at, {
							month: 'short',
							day: 'numeric',
							year: 'numeric'
						}) })
					</div>

				</div>

				<div class="">

					<div class="d-flex align-items-center mb-3">
					
						<div class="dropdown">
							<div class="bg-white d-inline-flex justify-content-center align-items-center border-radius-10 cursor-pointer text-color-17 px-2 py-1" type="button" id="user_more_actions_menu__${user.id}" data-bs-toggle="dropdown" aria-expanded="false">
								<i class="fas fa-ellipsis-v"></i>
							</div>
		
							<ul class="dropdown-menu" id="user_more_actions__menu__${user.id}" aria-labelledby="user_more_actions_menu__${user.id}">
								<li data-perm="delete_people_from_docit_groups">
									<a class="dropdown-item fs-14" href="#" data-role="DELETE" >
										${ FUI_DISPLAY_LANG.views.pages.global.actions.delete }
									</a>
								</li>
							</ul>
						</div>
		
					</div>

				</div>

			</div>

		</div>
		`
		//
		if ( options.append ) add_people_to_docit_group_dialog__tableElement.append(html)
		else add_people_to_docit_group_dialog__tableElement.prepend(html)

		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()

		const holder = add_people_to_docit_group_dialog__tableElement.find(`#${id}`)

		const user_more_actions__menu__ = holder.find(`#user_more_actions__menu__${user.id}`)

		user_more_actions__menu__.on('click', async e => {
			const target = $(e.target)

			if ( target.data('role') == 'DELETE' )
			{
				PromptConfirmDialog().then(async () => {

					holder.addClass('disabled')

					var res = null
					try 
					{
						res = await DOCIT_GROUP_MODEL.users_delete({
							group_id: user.pivot.group_id,
							user_id: user.id,
						})
					} 
					catch (error) 
					{
						CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
						holder.removeClass('disabled')
					}

					holder.removeClass('disabled')

					holder.remove()
				})
			}
		
		})
	}

	// set pagination
	function setPagination(options = {})
	{
		PAGINATION = {...PAGINATION, ...options}
	}
	// get pagination
	function getPagination()
	{
		return PAGINATION
	}
	// set isLoading
	function setIsLoading(value)
	{
		isLoading = value
	}
	// get isLoading
	function getIsLoading()
	{
		return isLoading
	}
	// show placeholder
	function showPlaceholder()
	{
		const id = add_people_to_docit_group_dialog__tableElement.attr('id')
		const selector = `placeholder__${id}`
		const html = `
		<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

			<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

				<div class="w-100">
					
					<div class="mb-2">
						<h4 class="h4 mb-0">
							<div class="content-placeholder max-width-260px height-18px d-block"></div>
						</h4>
					</div>

					<div class="mb-4">
						<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
					</div>

					<div class="fs-14 text-color-17">
						<div class="content-placeholder max-width-94px height-5px d-block"></div>
					</div>

				</div>

				<div class="">

					<div class="d-flex align-items-center mb-3">
					
						<div class="dropdown">
							<div class="bg-white d-inline-flex justify-content-center align-items-center border-radius-10 cursor-pointer text-color-17 px-2 py-1" type="button" id="patient_card_more_actions_menu" data-bs-toggle="dropdown" aria-expanded="false">
								<i class="fas fa-ellipsis-v"></i>
							</div>

							<ul class="dropdown-menu" id="patient_card_more_actions__menu" aria-labelledby="patient_card_more_actions_menu">
								<li data-perm="update_patient">
									<a class="dropdown-item fs-14" href="#" data-role="UPDATE" >
										<%= UI_DISPLAY_LANG.views.pages.global.edit_profile %>
									</a>
								</li>
								<li>
									<a class="dropdown-item fs-14" href="#" data-role="show_patient_profile" >
										<%= UI_DISPLAY_LANG.views.pages.global.show_profile %>
									</a>
								</li>
							</ul>
						</div>

					</div>

				</div>

			</div>

		</div>
		<div class="col-lg-12 col-md-12 js_checkable_box_row no-pointer ${selector}">

			<div class="d-flex align-items-center cursor-pointer bg-color-hover-ebebeb px-3 py-4 border-bottom">

				<div class="w-100">
					
					<div class="mb-2">
						<h4 class="h4 mb-0">
							<div class="content-placeholder max-width-260px height-18px d-block"></div>
						</h4>
					</div>

					<div class="mb-4">
						<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
						<div class="content-placeholder max-width-500px height-5px d-block mb-2"></div>
					</div>

					<div class="fs-14 text-color-17">
						<div class="content-placeholder max-width-94px height-5px d-block"></div>
					</div>

				</div>

				<div class="">

					<div class="d-flex align-items-center mb-3">
					
						<div class="dropdown">
							<div class="bg-white d-inline-flex justify-content-center align-items-center border-radius-10 cursor-pointer text-color-17 px-2 py-1" type="button" id="patient_card_more_actions_menu" data-bs-toggle="dropdown" aria-expanded="false">
								<i class="fas fa-ellipsis-v"></i>
							</div>

							<ul class="dropdown-menu" id="patient_card_more_actions__menu" aria-labelledby="patient_card_more_actions_menu">
								<li data-perm="update_patient">
									<a class="dropdown-item fs-14" href="#" data-role="UPDATE" >
										<%= UI_DISPLAY_LANG.views.pages.global.edit_profile %>
									</a>
								</li>
								<li>
									<a class="dropdown-item fs-14" href="#" data-role="show_patient_profile" >
										<%= UI_DISPLAY_LANG.views.pages.global.show_profile %>
									</a>
								</li>
							</ul>
						</div>

					</div>

				</div>

			</div>

		</div>
		`

		// check exists
		if ( add_people_to_docit_group_dialog__tableElement.find(`.${selector}`)[0] ) return

		add_people_to_docit_group_dialog__tableElement.append(html)

		// disable load more button
		add_people_to_docit_group_dialog__load_more_button.addClass('disabled')
	}
	// hide placeholder
	function hidePlaceholder()
	{
		const id = add_people_to_docit_group_dialog__tableElement.attr('id')
		const selector = `placeholder__${id}`

		// check exists
		if ( !add_people_to_docit_group_dialog__tableElement.find(`.${selector}`)[0] ) return

		add_people_to_docit_group_dialog__tableElement.find(`.${selector}`).remove()
		// enable load more button
		add_people_to_docit_group_dialog__load_more_button.removeClass('disabled')
		
		// check last page
		if ( getPagination().current_page == getPagination().last_page ) 
		{
			// hide button
			add_people_to_docit_group_dialog__load_more_button.parent().addClass('d-none')
			return
		}
	}


}

// CreateDocitGroupDialog
CreateDocitGroupDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_docit_group_dialog',
		html: '',
		onCreated: (e) => {},
		onUpdated: (e) => {},
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_docit_group)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/create-docit-group-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_docit_group_dialog__create_form = dialog_container.find('#create_docit_group_dialog__create_form')

	const create_docit_group_dialog__create_form__name_input = dialog_container.find('#create_docit_group_dialog__create_form__name_input')
	const create_docit_group_dialog__create_form__description_input = dialog_container.find('#create_docit_group_dialog__create_form__description_input')

	const GroupObject = {}
	// submit
	create_docit_group_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check name
		if ( isNull(create_docit_group_dialog__create_form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		GroupObject.user_id = DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID
		GroupObject.user_name = DEFAULT_INI_SETTINGS.DOCIT_USER.USER_NAME
		GroupObject.name = create_docit_group_dialog__create_form__name_input.val().trim()
		GroupObject.description = create_docit_group_dialog__create_form__description_input.val()

		create_docit_group_dialog__create_form.find(':submit').addClass('disabled')
		// update
		if ( !isNull(options.id) )
		{
			// GroupObject.id = options.id
			try 
			{
				await DOCIT_GROUP_MODEL.update(options.id, GroupObject)
			} 
			catch (error) 
			{
				console.error(error)
				create_docit_group_dialog__create_form.find(':submit').removeClass('disabled')
				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
				return
			}
			create_docit_group_dialog__create_form.find(':submit').removeClass('disabled')

			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_create, '')
			// reset
			options.id = null
			create_docit_group_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateDocitGroupDialog:updated')
			

			return
		}
		// create
		try 
		{
			var res = await DOCIT_GROUP_MODEL.create(GroupObject)

			options.onCreated(res.data)
		} 
		catch (error) 
		{
			console.error(error)
			create_docit_group_dialog__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
			return
		}

		create_docit_group_dialog__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_create, '')

		// reset
		create_docit_group_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateDocitGroupDialog:created', res.data)
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.id) ) return

		fillForm(create_docit_group_dialog__create_form, options)

	}
}


// CreateDocitMediaDialog
CreateDocitMediaDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_docit_media_dialog',
		html: '',
		sharingPermissions: false,
		onCreated: (e) => {},
		onUpdated: (e) => {},
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_docit_media)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/create-docit-media-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_docit_media_dialog__create_form = dialog_container.find('#create_docit_media_dialog__create_form')

	const create_docit_media_dialog__create_form__title_input = dialog_container.find('#create_docit_media_dialog__create_form__title_input')
	const create_docit_media_dialog__create_form__description_input = dialog_container.find('#create_docit_media_dialog__create_form__description_input')
	const create_docit_media_dialog__create_form__folder_select = dialog_container.find('#create_docit_media_dialog__create_form__folder_select')
	const create_docit_media_dialog__create_form__file_input = dialog_container.find('#create_docit_media_dialog__create_form__file_input')

	const create_docit_media_dialog__create_form__select_share_permissions_template__wrapper = dialog_container.find('#create_docit_media_dialog__create_form__select_share_permissions_template__wrapper')
	const create_docit_media_dialog__create_form__share_permissions_select = dialog_container.find('#create_docit_media_dialog__create_form__share_permissions_select')

	init()

	// submit
	create_docit_media_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check file
		if ( create_docit_media_dialog__create_form__file_input[0].files.length == 0 )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_no_selected_files, '')
			return
		}

		var formdata = new FormData

		formdata.append('user_id', DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID)
		formdata.append('user_name', DEFAULT_INI_SETTINGS.DOCIT_USER.USER_NAME)
		formdata.append('folder_id', create_docit_media_dialog__create_form__folder_select.find(':selected').val() )
		formdata.append('file', create_docit_media_dialog__create_form__file_input[0].files[0])
		formdata.append('name', create_docit_media_dialog__create_form__title_input.val())
		formdata.append('title', create_docit_media_dialog__create_form__title_input.val())
		formdata.append('caption', create_docit_media_dialog__create_form__title_input.val())
		formdata.append('description', create_docit_media_dialog__create_form__description_input.val())

		// update
		if ( !isNull(options.id) )
		{
			formdata.append('id', options.id)
			try 
			{
				create_docit_media_dialog__create_form__file_input.next().removeClass('d-none')
				
				var res = await MEDIA_MODEL.create(formdata, progress =>
				{
					var percent = progress.percentComplete.toFixed(2)
		
					create_docit_media_dialog__create_form__file_input.next().find('.progress-bar').css('width', percent+'%').text(percent+'%')
				})
				create_docit_media_dialog__create_form__file_input.next().addClass('d-none')
				
				options.onUpdated(res.data)
			} 
			catch (error) 
			{
				console.error(error)
				create_docit_media_dialog__create_form.find(':submit').removeClass('disabled')
				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
				return
			}
			create_docit_media_dialog__create_form.find(':submit').removeClass('disabled')

			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_update, '')
			// reset
			options.aptId = null
			create_docit_media_dialog__create_form[0].reset()
			formdata = new FormData
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateDocitMediaDialog:updated')
			

			return
		}
		// create
		try 
		{
			create_docit_media_dialog__create_form__file_input.next().removeClass('d-none')

			var res = await MEDIA_MODEL.create(formdata, progress =>
			{
				var percent = progress.percentComplete.toFixed(2)
	
				create_docit_media_dialog__create_form__file_input.next().find('.progress-bar').css('width', percent+'%').text(percent+'%')
			})
			create_docit_media_dialog__create_form__file_input.next().addClass('d-none')
			
			const data = res.data

			// permissions
			var permissions = checkJSON( decodeURIComponent( atob( create_docit_media_dialog__create_form__share_permissions_select.data('selections') ) ) )

			// check permissions
			if ( permissions.length == 0 )
			{
				permissions.push({
					id: 'download',
				})
			}

			// filter permissions
			data.permissions = permissions.map(v => {
				return v.id
			})

			options.onCreated(data)

		} catch (error) 
		{
			console.error(error)
			create_docit_media_dialog__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
			return
		}

		create_docit_media_dialog__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.success_file_uploaded, '')

		// reset
		create_docit_media_dialog__create_form[0].reset()
		formdata = new FormData
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateDocitMediaDialog:created')
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.id) ) return

		observeElement( create_docit_media_dialog__create_form__folder_select[0], mutation =>
		{
			setOptionSelected(create_docit_media_dialog__create_form__folder_select, options.folder_id)
		})

		fillForm(create_docit_media_dialog__create_form, options)

	}
	// init
	function init()
	{
		// check sharing permissions
		if ( options.sharingPermissions )
		{
			create_docit_media_dialog__create_form__select_share_permissions_template__wrapper.removeClass('d-none')
		}
	}
}

// CreateSupplierCategory__Centers
CreateSupplierCategory__Centers = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_supplier_category_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_category)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/centers/create-supplier-category-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const create_supplier_category_dialog__form = dialog_container.find('#create_supplier_category_dialog__form')
	const create_supplier_category_dialog__form__name_input = dialog_container.find('#create_supplier_category_dialog__form__name_input')
	const create_supplier_category_dialog__form__description_input = dialog_container.find('#create_supplier_category_dialog__form__description_input')

	var CategoryObject = {}

	// submit
	create_supplier_category_dialog__form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check required inputs
		if ( isNull(create_supplier_category_dialog__form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		CategoryObject.administration_id = USER_CONFIG.administration.clinicId
		CategoryObject.administration_name = USER_CONFIG.administration.clinicName
		CategoryObject.name = create_supplier_category_dialog__form__name_input.val();
		CategoryObject.description  = create_supplier_category_dialog__form__description_input.val();

		create_supplier_category_dialog__form.find(':submit').addClass('disabled')
		// update
		if ( !isNull(options.id) )
		{
			CategoryObject.id = options.id
			try 
			{
				var res = await SUPPLIER_MODEL.category_update(CategoryObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_supplier_category_dialog__form.find(':submit').removeClass('disabled')
				return
			}
			create_supplier_category_dialog__form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.id = null
			create_supplier_category_dialog__form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateSupplierCategory__Centers:updated', CategoryObject)

			return
		}
		// create
		try 
		{
			var res = await SUPPLIER_MODEL.category_store(CategoryObject)
		} 
		catch (error) 
		{
			create_supplier_category_dialog__form.find(':submit').removeClass('disabled')

			return
		}

		create_supplier_category_dialog__form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_supplier_category_dialog__form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateSupplierCategory__Centers:created', CategoryObject)
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.id) ) return

		fillForm(create_supplier_category_dialog__form, options)

	}
}
// CopyInvoiceDialog__CentralAdmin
CopyInvoiceDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'copy_invoice_dialog__central_admin',
		html: '',
	}

	options = {...defaultOptions, ...options}

	// check order_id
	if ( isNull(options.order_id) )
	{
		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.no_data_found, '')
		return
	}

	try {
		var res = await ORDER_MODEL.show({
			order_id: options.order_id
		})
	} catch (error) {
		console.error(error.message)
		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
		return
	}

	if ( res.code == 404 )
	{
		CreateToast('PS', res.message, '')
		return
	}

	const ORDER_DATA = res.data

	console.log(ORDER_DATA)
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.copy_invoice)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/copy-invoice-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const copy_invoice_dialog__create_div = dialog_container.find('#copy_invoice_dialog__create_div')

	// Items table
	const copy_invoice_dialog__create_div__items_table = dialog_container.find('.copy_invoice_dialog__create_div__items_table')

	// Tabs
	const copy_invoice_dialog__create_div__tab_buttons = dialog_container.find('#copy_invoice_dialog__create_div__tab_buttons')
	const copy_invoice_dialog__create_div__tabs = dialog_container.find('#copy_invoice_dialog__create_div__tabs')
	const copy_invoice_dialog__create_div__tabs__back_button = dialog_container.find('.copy_invoice_dialog__create_div__tabs__back_button')

	const js_invoice_items_count = dialog_container.find('.js_invoice_items_count')
	
	// Click tab
	copy_invoice_dialog__create_div__tab_buttons.off('click').on('click', e =>
	{
		const target = $(e.target)

		if ( target.data('role') == 'tab-button' )
		{
			const tab = dialog_container.find(target.data('target'))

			showTab(tab, target)
		}
	})
	// back
	copy_invoice_dialog__create_div__tabs__back_button.off('click').on('click', e =>
	{
		copy_invoice_dialog__create_div__tab_buttons.removeClass('d-none')

		copy_invoice_dialog__create_div__tabs.children().addClass('d-none')
	})

	// show tab
	function showTab(tab, target)
	{
		const title = target.find('.js_tab_button_title').text()
		// show tab
		tab.removeClass('d-none').siblings().addClass('d-none')
		// Set title
		tab.find('.js_tab_title').text(title)
		// hide tab buttons
		copy_invoice_dialog__create_div__tab_buttons.addClass('d-none')

		// dispatch event
		dispatchCustomEvent('tab:opened', {}, tab[0])
	}
	// items table
	copy_invoice_dialog__create_div__items_table.off('deletable_list_item:item-deleted').on('deletable_list_item:item-deleted', e =>
	{
		const detail = e.originalEvent.detail
		const order_item_id = detail.value

		var items = ORDER_DATA.order_items
		ORDER_DATA.order_items = items.filter((v,i) =>
		{
			if ( v.order_item_id == order_item_id )
			{
				items.splice(i,1)
			}
		})
		
		displayItems(ORDER_DATA.order_items)
	})
	// display items in table
	displayItems(ORDER_DATA.order_items)
	function displayItems(items)
	{
		var html = ''

		js_invoice_items_count.text('0')
		copy_invoice_dialog__create_div__items_table.find('tbody').html('')

		items.forEach((v) =>
		{
			html += `
			<tr class="js_deletable_list_item" data-value="${v.order_item_id}" data-name="${v.item_name}">
				<td>
					<button class="btn-close js_deletable_list_item__delete_button"></button>
				</td>
				<td>${v.item_code}</td>
				<td>${v.item_name}</td>
				<td>${v.order_item_quantity}</td>
				<td class="text-success">${ moneyFormat(v.order_item_price) }</td>
				<td class="text-success">${ moneyFormat(v.order_item_final_amount) }</td>
			</tr>
			`
		})

		copy_invoice_dialog__create_div__items_table.find('tbody').html(html)
		// display order items count
		js_invoice_items_count.text(`(${ORDER_DATA.order_items.length})`)
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
	}
	// Tabs
	const copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks = dialog_container.find('#copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks')
	const copy_invoice_dialog__create_div__tabs__selling_invoices = dialog_container.find('#copy_invoice_dialog__create_div__tabs__selling_invoices')
	const copy_invoice_dialog__create_div__tabs__buying_invoices = dialog_container.find('#copy_invoice_dialog__create_div__tabs__buying_invoices')

	// copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks
	copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks.on('tab:opened', e =>
	{
		setup__copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks__tab()
	})
	// copy_invoice_dialog__create_div__tabs__selling_invoices
	copy_invoice_dialog__create_div__tabs__selling_invoices.on('tab:opened', e =>
	{
		setup__copy_invoice_dialog__create_div__tabs__selling_invoices__tab()
	})
	// copy_invoice_dialog__create_div__tabs__buying_invoices
	copy_invoice_dialog__create_div__tabs__buying_invoices.on('tab:opened', e =>
	{
		setup__copy_invoice_dialog__create_div__tabs__buying_invoices__tab()
	})

	// set copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks tab
	function setup__copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks__tab()
	{
		// setup__central_administration_to_center_panel
		setup__central_administration_to_center_panel()
		function setup__central_administration_to_center_panel()
		{
			const copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form__center_select = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form__center_select')

			// submit
			copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form__center_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__central_administration_to_center_transfer_invoices_panel__create_form__center_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_central_administration_to_center_unconfirmed_transfer_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
	}

	// set copy_invoice_dialog__create_div__tabs__selling_invoices tab
	function setup__copy_invoice_dialog__create_div__tabs__selling_invoices__tab()
	{
		// setup__central_administration_to_contractor_panel
		setup__central_administration_to_contractor_panel()
		function setup__central_administration_to_contractor_panel()
		{
			const copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form__contractor_select = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form__contractor_select')

			// submit
			copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form__contractor_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__central_administration_to_contractor_selling_invoices_panel__create_form__contractor_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_central_administration_to_contractor_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
		// setup__central_administration_to_customer_panel
		setup__central_administration_to_customer_panel()
		function setup__central_administration_to_customer_panel()
		{
			const copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form__customer_select = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form__customer_select')

			// submit
			copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form__customer_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__central_administration_to_customer_selling_invoices_panel__create_form__customer_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_central_administration_to_customer_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
		// setup__central_administration_to_distributor_panel
		setup__central_administration_to_distributor_panel()
		function setup__central_administration_to_distributor_panel()
		{
			const copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form__distributor_select = dialog_container.find('#copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form__distributor_select')

			// submit
			copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form__distributor_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__central_administration_to_distributor_selling_invoices_panel__create_form__distributor_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_central_administration_to_distributor_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
	}

	// set copy_invoice_dialog__create_div__tabs__buying_invoices tab
	function setup__copy_invoice_dialog__create_div__tabs__buying_invoices__tab()
	{
		// setup__supplier_to_center_panel
		setup__supplier_to_center_panel()
		function setup__supplier_to_center_panel()
		{
			const copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select = dialog_container.find('#copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select')

			// submit
			copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_supplier_selected, '')
					return
				}

				const supplier = copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select.find(':selected')

				const params = {
					user_id: USER_CONFIG.administration.clinicId,
					order_receiver_name: USER_CONFIG.administration.clinicName,
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					supplier_id: supplier.val(), 
					supplier_name: supplier.text(), 
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_supplier_to_central_administration_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}

	}
}
// CopyInvoiceDialog__Centers
CopyInvoiceDialog__Centers = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'copy_invoice_dialog__centers',
		html: '',
	}

	options = {...defaultOptions, ...options}

	// check order_id
	if ( isNull(options.order_id) )
	{
		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.no_data_found, '')
		return
	}

	try {
		var res = await ORDER_MODEL.show({
			order_id: options.order_id
		})
	} catch (error) {
		console.error(error.message)
		CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')
		return
	}

	if ( res.code == 404 )
	{
		CreateToast('PS', res.message, '')
		return
	}

	const ORDER_DATA = res.data

	console.log(ORDER_DATA)
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.copy_invoice)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/centers/copy-invoice-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const copy_invoice_dialog__create_div = dialog_container.find('#copy_invoice_dialog__create_div')
	// Items table
	const copy_invoice_dialog__create_div__items_table = dialog_container.find('.copy_invoice_dialog__create_div__items_table')

	// Tabs
	const copy_invoice_dialog__create_div__tab_buttons = dialog_container.find('#copy_invoice_dialog__create_div__tab_buttons')
	const copy_invoice_dialog__create_div__tabs = dialog_container.find('#copy_invoice_dialog__create_div__tabs')
	const copy_invoice_dialog__create_div__tabs__back_button = dialog_container.find('.copy_invoice_dialog__create_div__tabs__back_button')

	const js_invoice_items_count = dialog_container.find('.js_invoice_items_count')
	
	// Click tab
	copy_invoice_dialog__create_div__tab_buttons.off('click').on('click', e =>
	{
		const target = $(e.target)

		if ( target.data('role') == 'tab-button' )
		{
			const tab = dialog_container.find(target.data('target'))

			showTab(tab, target)
		}
	})
	// back
	copy_invoice_dialog__create_div__tabs__back_button.off('click').on('click', e =>
	{
		copy_invoice_dialog__create_div__tab_buttons.removeClass('d-none')

		copy_invoice_dialog__create_div__tabs.children().addClass('d-none')
	})

	// items table
	copy_invoice_dialog__create_div__items_table.off('deletable_list_item:item-deleted').on('deletable_list_item:item-deleted', e =>
	{
		const detail = e.originalEvent.detail
		const order_item_id = detail.value

		var items = ORDER_DATA.order_items
		ORDER_DATA.order_items = items.filter((v,i) =>
		{
			if ( v.order_item_id == order_item_id )
			{
				items.splice(i,1)
			}
		})
		
		displayItems(ORDER_DATA.order_items)
	})
	// display items in table
	displayItems(ORDER_DATA.order_items)
	function displayItems(items)
	{
		var html = ''

		js_invoice_items_count.text('0')
		copy_invoice_dialog__create_div__items_table.find('tbody').html('')

		items.forEach((v) =>
		{
			html += `
			<tr class="js_deletable_list_item" data-value="${v.order_item_id}" data-name="${v.item_name}">
				<td>
					<button class="btn-close js_deletable_list_item__delete_button"></button>
				</td>
				<td>${v.item_code}</td>
				<td>${v.item_name}</td>
				<td>${v.order_item_quantity}</td>
				<td class="text-success">${ moneyFormat(v.order_item_price) }</td>
				<td class="text-success">${ moneyFormat(v.order_item_final_amount) }</td>
			</tr>
			`
		})

		copy_invoice_dialog__create_div__items_table.find('tbody').html(html)
		// display order items count
		js_invoice_items_count.text(`(${ORDER_DATA.order_items.length})`)
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
	}
	// show tab
	function showTab(tab, target)
	{
		const title = target.find('.js_tab_button_title').text()
		// show tab
		tab.removeClass('d-none').siblings().addClass('d-none')
		// Set title
		tab.find('.js_tab_title').text(title)
		// hide tab buttons
		copy_invoice_dialog__create_div__tab_buttons.addClass('d-none')

		// dispatch event
		dispatchCustomEvent('tab:opened', {}, tab[0])
	}

	// Tabs
	const copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks = dialog_container.find('#copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks')
	const copy_invoice_dialog__create_div__tabs__selling_invoices = dialog_container.find('#copy_invoice_dialog__create_div__tabs__selling_invoices')
	const copy_invoice_dialog__create_div__tabs__buying_invoices = dialog_container.find('#copy_invoice_dialog__create_div__tabs__buying_invoices')

	// copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks
	copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks.on('tab:opened', e =>
	{
		setup__copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks__tab()
	})
	// copy_invoice_dialog__create_div__tabs__selling_invoices
	copy_invoice_dialog__create_div__tabs__selling_invoices.on('tab:opened', e =>
	{
		
		setup__copy_invoice_dialog__create_div__tabs__selling_invoices__tab()
	})
	// copy_invoice_dialog__create_div__tabs__buying_invoices
	copy_invoice_dialog__create_div__tabs__buying_invoices.on('tab:opened', e =>
	{
		setup__copy_invoice_dialog__create_div__tabs__buying_invoices__tab()
	})

	// set copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks tab
	function setup__copy_invoice_dialog__create_div__tabs__transfer_invoices_between_stocks__tab()
	{
		// setup__center_to_center_panel
		setup__center_to_center_panel()
		function setup__center_to_center_panel()
		{
			const copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form__center_select = dialog_container.find('#copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form__center_select')

			// submit
			copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form__center_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__center_to_center_transfer_invoices_panel__create_form__center_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					supplier_id: USER_CONFIG.administration.clinicId,
					supplier_name: USER_CONFIG.administration.clinicName,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_center_to_center_unconfirmed_transfer_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
		// setup__center_to_central_administration_panel
		setup__center_to_central_administration_panel()
		function setup__center_to_central_administration_panel()
		{
			const copy_invoice_dialog__create_div__center_to_central_administration_transfer_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__center_to_central_administration_transfer_invoices_panel__create_form')

			// submit
			copy_invoice_dialog__create_div__center_to_central_administration_transfer_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__center_to_central_administration_transfer_invoices_panel__create_form

				const params = {
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					supplier_id: USER_CONFIG.administration.clinicId,
					supplier_name: USER_CONFIG.administration.clinicName,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_center_to_central_administration_unconfirmed_transfer_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
	}

	// set copy_invoice_dialog__create_div__tabs__selling_invoices tab
	function setup__copy_invoice_dialog__create_div__tabs__selling_invoices__tab()
	{
		// setup__center_to_contractor_panel
		setup__center_to_contractor_panel()
		function setup__center_to_contractor_panel()
		{
			const copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form__contractor_select = dialog_container.find('#copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form__contractor_select')

			// submit
			copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form__contractor_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__center_to_contractor_selling_invoices_panel__create_form__contractor_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					supplier_id: USER_CONFIG.administration.clinicId,
					supplier_name: USER_CONFIG.administration.clinicName,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_center_to_contractor_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
		// setup__center_to_customer_panel
		setup__center_to_customer_panel()
		function setup__center_to_customer_panel()
		{
			const copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form__customer_select = dialog_container.find('#copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form__customer_select')

			// submit
			copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form__customer_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__center_to_customer_selling_invoices_panel__create_form__customer_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					supplier_id: USER_CONFIG.administration.clinicId,
					supplier_name: USER_CONFIG.administration.clinicName,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_center_to_customer_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
		// setup__center_to_distributor_panel
		setup__center_to_distributor_panel()
		function setup__center_to_distributor_panel()
		{
			const copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form__distributor_select = dialog_container.find('#copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form__distributor_select')

			// submit
			copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form__distributor_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_receiver_selected, '')
					return
				}

				const receiver = copy_invoice_dialog__create_div__center_to_distributor_selling_invoices_panel__create_form__distributor_select.find(':selected')

				const params = {
					user_id: receiver.val(),
					order_receiver_name: receiver.text(),
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					supplier_id: USER_CONFIG.administration.clinicId,
					supplier_name: USER_CONFIG.administration.clinicName,
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_center_to_distributor_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}
	}

	// set copy_invoice_dialog__create_div__tabs__buying_invoices tab
	function setup__copy_invoice_dialog__create_div__tabs__buying_invoices__tab()
	{
		// setup__supplier_to_center_panel
		setup__supplier_to_center_panel()
		function setup__supplier_to_center_panel()
		{
			const copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form = dialog_container.find('#copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form')
			const copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select = dialog_container.find('#copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select')

			console.log(copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form[0])
			// submit
			copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form.off('submit').on('submit', async e =>
			{
				e.preventDefault()

				const target = copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form

				// check user id
				if ( isNull(copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select.find(':selected').val()) )
				{
					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_supplier_selected, '')
					return
				}

				const supplier = copy_invoice_dialog__create_div__supplier_to_center_buying_invoices_panel__create_form__supplier_select.find(':selected')

				const params = {
					user_id: USER_CONFIG.administration.clinicId,
					order_receiver_name: USER_CONFIG.administration.clinicName, 
					order_amount_paid: ORDER_DATA.order_amount_paid,
					order_total_amount: ORDER_DATA.order_total_amount,
					order_dept_amount: ORDER_DATA.order_dept_amount,
					supplier_id: supplier.val(),
					supplier_name: supplier.text(),
					items: ORDER_DATA.order_items,
				}

				target.find(':submit').addClass('disabled')

				try 
				{
					var res = await ORDER_MODEL.direction_supplier_to_center_unconfirmed_selling_store(params)	
				} 
				catch (error) 
				{
					console.error(error)
					target.find(':submit').removeClass('disabled')
					return
				}

				target.find(':submit').removeClass('disabled')

				CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

			})
		}

	}
}
// CreateProductDialog__Centers
CreateProductDialog__Centers = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_product_dialog__centers',
		html: '',
	}

	options = {...defaultOptions, ...options}
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_product)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/centers/create-product-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_product_dialog__create_form = dialog_container.find('#create_product_dialog__create_form')

	const create_product_dialog__create_form__inventory_select = dialog_container.find('#create_product_dialog__create_form__inventory_select')

	const create_product_dialog__create_form__productCode_input = dialog_container.find('#create_product_dialog__create_form__productCode_input')
	const create_product_dialog__create_form__productName_input = dialog_container.find('#create_product_dialog__create_form__productName_input')
	const create_product_dialog__create_form__productDesc_input = dialog_container.find('#create_product_dialog__create_form__productDesc_input')
	const create_product_dialog__create_form__productBuyPrice_input = dialog_container.find('#create_product_dialog__create_form__productBuyPrice_input') 
	const create_product_dialog__create_form__productPrice_input = dialog_container.find('#create_product_dialog__create_form__productPrice_input') 
	const create_product_dialog__create_form__productWholesalePrice_input = dialog_container.find('#create_product_dialog__create_form__productWholesalePrice_input') 
	const create_product_dialog__create_form__productHalfWholesalePrice_input = dialog_container.find('#create_product_dialog__create_form__productHalfWholesalePrice_input') 
	const create_product_dialog__create_form__cost_price_input = dialog_container.find('#create_product_dialog__create_form__cost_price_input')
	const create_product_dialog__create_form__productQuantity_input = dialog_container.find('#create_product_dialog__create_form__productQuantity_input') 
	const create_product_dialog__create_form__unit_select = dialog_container.find('#create_product_dialog__create_form__unit_select') 
	const create_product_dialog__create_form__category_select = dialog_container.find('#create_product_dialog__create_form__category_select') 
	const create_product_dialog__create_form__family_select = dialog_container.find('#create_product_dialog__create_form__family_select') 
	const create_product_dialog__create_form__low_stock_threshold_input = dialog_container.find('#create_product_dialog__create_form__low_stock_threshold_input') 
	const create_product_dialog__create_form__average_low_stock_threshold_input = dialog_container.find('#create_product_dialog__create_form__average_low_stock_threshold_input') 

	const create_product_dialog__create_form__package_input = dialog_container.find('#create_product_dialog__create_form__package_input') 
	const create_product_dialog__create_form__units_in_package_input = dialog_container.find('#create_product_dialog__create_form__units_in_package_input') 

	const create_product_dialog__create_form__file_input = dialog_container.find('#create_product_dialog__create_form__file_input')

	const create_product_dialog__create_form__image_preview = dialog_container.find('#create_product_dialog__create_form__image_preview')
	
	var ProductObject = new FormData()
	// submit
	create_product_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_product_dialog__create_form__productCode_input.val())
			|| isNull(create_product_dialog__create_form__productCode_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		create_product_dialog__create_form.find(':submit').addClass('disabled')

		// check stock
		if ( isNull(create_product_dialog__create_form__inventory_select.find(':selected').val()) )
		{
			ProductObject.append('administration_id', USER_CONFIG.administration.clinicId)
			ProductObject.append('administration_name', USER_CONFIG.administration.clinicName)
		}
		else
		{
			ProductObject.append('administration_id', create_product_dialog__create_form__inventory_select.find(':selected').val())
			ProductObject.append('administration_name', create_product_dialog__create_form__inventory_select.find(':selected').text())
		}

		ProductObject.append('productCode', create_product_dialog__create_form__productCode_input.val())
		ProductObject.append('productName', create_product_dialog__create_form__productName_input.val())
		ProductObject.append('productDesc', create_product_dialog__create_form__productDesc_input.val())
		ProductObject.append('productBuyPrice', create_product_dialog__create_form__productBuyPrice_input.val())
		ProductObject.append('productPrice', create_product_dialog__create_form__productPrice_input.val())
		ProductObject.append('productWholesalePrice', create_product_dialog__create_form__productWholesalePrice_input.val())
		ProductObject.append('productHalfWholesalePrice', create_product_dialog__create_form__productHalfWholesalePrice_input.val())
		ProductObject.append('cost_price', create_product_dialog__create_form__cost_price_input.val() )
		ProductObject.append('productQuantity', create_product_dialog__create_form__productQuantity_input.val())
		ProductObject.append('category_id', create_product_dialog__create_form__category_select.find(':selected').val())
		ProductObject.append('category_name', create_product_dialog__create_form__category_select.find(':selected').text())
		ProductObject.append('family_id', create_product_dialog__create_form__family_select.find(':selected').val())
		ProductObject.append('family_name', create_product_dialog__create_form__family_select.find(':selected').text())
		ProductObject.append('unit', create_product_dialog__create_form__unit_select.find(':selected').val())
		ProductObject.append('low_stock_threshold', create_product_dialog__create_form__low_stock_threshold_input.val())
		ProductObject.append('average_low_stock_threshold', create_product_dialog__create_form__average_low_stock_threshold_input.val())
		ProductObject.append('package', create_product_dialog__create_form__package_input.val())
		ProductObject.append('units_in_package', create_product_dialog__create_form__units_in_package_input.val())

		if ( create_product_dialog__create_form__file_input[0].files.length > 0 )
		{
			ProductObject.append('productImage', create_product_dialog__create_form__file_input[0].files[0] )
		}

		// update
		if ( !isNull(options.productId) )
		{
			ProductObject.append('productId', options.productId)
			ProductObject.append('id', options.id)

			try 
			{
				create_product_dialog__create_form__file_input.next().removeClass('d-none')
				var res = await PRODUCT_MODEL.center_update(ProductObject, progress =>
				{
				
					const percent = progress.percentComplete.toFixed(2)
	
					create_product_dialog__create_form__file_input.next().find('.progress-bar').css('width', percent + '%')
				}) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_product_dialog__create_form.find(':submit').removeClass('disabled')
				create_product_dialog__create_form__file_input.next().addClass('d-none')
				return
			}
			create_product_dialog__create_form.find(':submit').removeClass('disabled')
			create_product_dialog__create_form__file_input.next().addClass('d-none')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.productId = null
			create_product_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateProductDialog__Centers:updated', ProductObject)

			return
		}
		// create
		try 
		{
			create_product_dialog__create_form__file_input.next().removeClass('d-none')
			var res = await PRODUCT_MODEL.center_store(ProductObject, progress =>
			{

				const percent = progress.percentComplete.toFixed(2)

				create_product_dialog__create_form__file_input.next().find('.progress-bar').css('width', percent + '%')
			}) 	
			
		} catch (error) 
		{
			console.error(error)
			create_product_dialog__create_form.find(':submit').removeClass('disabled')
			create_product_dialog__create_form__file_input.next().addClass('d-none')
			return
		}

		create_product_dialog__create_form.find(':submit').removeClass('disabled')
		create_product_dialog__create_form__file_input.next().addClass('d-none')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_product_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateProductDialog__Centers:created', ProductObject)
	})
	//
	
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.productId) ) return

		observeElement(create_product_dialog__create_form__category_select[0], mutation =>
		{
			setOptionSelected(create_product_dialog__create_form__category_select, options.category_id)
		})

		observeElement(create_product_dialog__create_form__family_select[0], mutation =>
		{
			setOptionSelected(create_product_dialog__create_form__family_select, options.family_id)
		})

		fillForm(create_product_dialog__create_form, options)
	
		if ( options.image )
		{
			create_product_dialog__create_form__image_preview.attr('src', options.image.url)
		}

	}
}
// CreateProductDialog__CentralAdmin
CreateProductDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_product_dialog__central_admin',
		html: '',
	}

	options = {...defaultOptions, ...options}
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_product)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-product-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_product_dialog__create_form = dialog_container.find('#create_product_dialog__create_form')

	const create_product_dialog__create_form__productCode_input = dialog_container.find('#create_product_dialog__create_form__productCode_input')
	const create_product_dialog__create_form__productName_input = dialog_container.find('#create_product_dialog__create_form__productName_input')
	const create_product_dialog__create_form__productDesc_input = dialog_container.find('#create_product_dialog__create_form__productDesc_input')
	const create_product_dialog__create_form__productBuyPrice_input = dialog_container.find('#create_product_dialog__create_form__productBuyPrice_input') 
	const create_product_dialog__create_form__productPrice_input = dialog_container.find('#create_product_dialog__create_form__productPrice_input') 
	const create_product_dialog__create_form__productWholesalePrice_input = dialog_container.find('#create_product_dialog__create_form__productWholesalePrice_input') 
	const create_product_dialog__create_form__productHalfWholesalePrice_input = dialog_container.find('#create_product_dialog__create_form__productHalfWholesalePrice_input') 
	const create_product_dialog__create_form__cost_price_input = dialog_container.find('#create_product_dialog__create_form__cost_price_input')
	const create_product_dialog__create_form__productQuantity_input = dialog_container.find('#create_product_dialog__create_form__productQuantity_input') 
	const create_product_dialog__create_form__unit_select = dialog_container.find('#create_product_dialog__create_form__unit_select') 
	const create_product_dialog__create_form__category_select = dialog_container.find('#create_product_dialog__create_form__category_select') 
	const create_product_dialog__create_form__family_select = dialog_container.find('#create_product_dialog__create_form__family_select') 
	const create_product_dialog__create_form__low_stock_threshold_input = dialog_container.find('#create_product_dialog__create_form__low_stock_threshold_input') 
	const create_product_dialog__create_form__average_low_stock_threshold_input = dialog_container.find('#create_product_dialog__create_form__average_low_stock_threshold_input') 

	const create_product_dialog__create_form__package_input = dialog_container.find('#create_product_dialog__create_form__package_input') 
	const create_product_dialog__create_form__units_in_package_input = dialog_container.find('#create_product_dialog__create_form__units_in_package_input') 

	const create_product_dialog__create_form__file_input = dialog_container.find('#create_product_dialog__create_form__file_input')

	const create_product_dialog__create_form__image_preview = dialog_container.find('#create_product_dialog__create_form__image_preview')
	
	var ProductObject = new FormData()
	// submit
	create_product_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_product_dialog__create_form__productCode_input.val())
			|| isNull(create_product_dialog__create_form__productCode_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		create_product_dialog__create_form.find(':submit').addClass('disabled')

		ProductObject.append('productCode', create_product_dialog__create_form__productCode_input.val())
		ProductObject.append('productName', create_product_dialog__create_form__productName_input.val())
		ProductObject.append('productDesc', create_product_dialog__create_form__productDesc_input.val())
		ProductObject.append('productBuyPrice', create_product_dialog__create_form__productBuyPrice_input.val())
		ProductObject.append('productPrice', create_product_dialog__create_form__productPrice_input.val())
		ProductObject.append('productWholesalePrice', create_product_dialog__create_form__productWholesalePrice_input.val())
		ProductObject.append('productHalfWholesalePrice', create_product_dialog__create_form__productHalfWholesalePrice_input.val())
		ProductObject.append('cost_price', create_product_dialog__create_form__cost_price_input.val() )
		ProductObject.append('productQuantity', create_product_dialog__create_form__productQuantity_input.val())
		ProductObject.append('category_id', create_product_dialog__create_form__category_select.find(':selected').val())
		ProductObject.append('category_name', create_product_dialog__create_form__category_select.find(':selected').text())
		ProductObject.append('family_id', create_product_dialog__create_form__family_select.find(':selected').val())
		ProductObject.append('family_name', create_product_dialog__create_form__family_select.find(':selected').text())
		ProductObject.append('unit', create_product_dialog__create_form__unit_select.find(':selected').val())
		ProductObject.append('low_stock_threshold', create_product_dialog__create_form__low_stock_threshold_input.val())
		ProductObject.append('average_low_stock_threshold', create_product_dialog__create_form__average_low_stock_threshold_input.val())
		ProductObject.append('package', create_product_dialog__create_form__package_input.val())
		ProductObject.append('units_in_package', create_product_dialog__create_form__units_in_package_input.val())

		if ( create_product_dialog__create_form__file_input[0].files.length > 0 )
		{
			ProductObject.append('productImage', create_product_dialog__create_form__file_input[0].files[0] )
		}

		// update
		if ( !isNull(options.productId) )
		{
			ProductObject.append('productId', options.productId)

			try 
			{
				create_product_dialog__create_form__file_input.next().removeClass('d-none')
				var res = await PRODUCT_MODEL.central_administration_update(ProductObject, progress =>
				{
				
					const percent = progress.percentComplete.toFixed(2)
	
					create_product_dialog__create_form__file_input.next().find('.progress-bar').css('width', percent + '%')
				}) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_product_dialog__create_form.find(':submit').removeClass('disabled')
				create_product_dialog__create_form__file_input.next().addClass('d-none')
				return
			}
			create_product_dialog__create_form.find(':submit').removeClass('disabled')
			create_product_dialog__create_form__file_input.next().addClass('d-none')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.productId = null
			create_product_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateProductDialog__CentralAdmin:updated', ProductObject)

			return
		}
		// create
		try 
		{
			create_product_dialog__create_form__file_input.next().removeClass('d-none')
			var res = await PRODUCT_MODEL.central_administration_store(ProductObject, progress =>
			{

				const percent = progress.percentComplete.toFixed(2)

				create_product_dialog__create_form__file_input.next().find('.progress-bar').css('width', percent + '%')
			}) 	
			
		} catch (error) 
		{
			console.error(error)
			create_product_dialog__create_form.find(':submit').removeClass('disabled')
			create_product_dialog__create_form__file_input.next().addClass('d-none')
			return
		}

		create_product_dialog__create_form.find(':submit').removeClass('disabled')
		create_product_dialog__create_form__file_input.next().addClass('d-none')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_product_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateProductDialog__CentralAdmin:created', ProductObject)
	})
	//
	
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.productId) ) return

		observeElement(create_product_dialog__create_form__category_select[0], mutation =>
		{
			setOptionSelected(create_product_dialog__create_form__category_select, options.category_id)
		})

		observeElement(create_product_dialog__create_form__family_select[0], mutation =>
		{
			setOptionSelected(create_product_dialog__create_form__family_select, options.family_id)
		})

		fillForm(create_product_dialog__create_form, options)
	
		if ( options.image )
		{
			create_product_dialog__create_form__image_preview.attr('src', options.image.url)
		}

	}
}
// CreateEmployeeTypeDialog__CentralAdmin
CreateEmployeeTypeDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_employee_type_dialog__central_admin',
		html: '',
	}

	options = {...defaultOptions, ...options}
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_employee_type)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-employee-type-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_employee_type_dialog__create_form = dialog_container.find('#create_employee_type_dialog__create_form')

	const create_employee_type_dialog__create_form__employee_type_name_fr_input = dialog_container.find('#create_employee_type_dialog__create_form__employee_type_name_fr_input')
	const create_employee_type_dialog__create_form__employee_type_name_ar_input = dialog_container.find('#create_employee_type_dialog__create_form__employee_type_name_ar_input')
	const create_employee_type_dialog__create_form__target_center_select = dialog_container.find('#create_employee_type_dialog__create_form__target_center_select')

	var EmployeeTypeObject = {}
	// submit
	create_employee_type_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_employee_type_dialog__create_form__employee_type_name_fr_input.val()) 
			|| isNull(create_employee_type_dialog__create_form__employee_type_name_ar_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}
		// check type
		if ( isNull(create_employee_type_dialog__create_form__target_center_select.find(':selected').val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_type_selected, '')
			return
		}

		create_employee_type_dialog__create_form.find(':submit').addClass('disabled')

		EmployeeTypeObject.employee_type_name_fr = create_employee_type_dialog__create_form__employee_type_name_fr_input.val()
		EmployeeTypeObject.employee_type_name_ar = create_employee_type_dialog__create_form__employee_type_name_ar_input.val()
		EmployeeTypeObject.employee_type_target_center = create_employee_type_dialog__create_form__target_center_select.find(':selected').val()

		// update
		if ( !isNull(options.employee_type_id) )
		{
			EmployeeTypeObject.employee_type_id = options.employee_type_id

			try 
			{
				var res = await EMPLOYEE_MODEL.type_update(EmployeeTypeObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_employee_type_dialog__create_form.find(':submit').removeClass('disabled')
				return
			}
			create_employee_type_dialog__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.employee_type_id = null
			create_employee_type_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateEmployeeTypeDialog__CentralAdmin:updated', EmployeeTypeObject)

			return
		}
		// create
		try 
		{
			var res = await EMPLOYEE_MODEL.type_store(EmployeeTypeObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_employee_type_dialog__create_form.find(':submit').removeClass('disabled')
			return
		}

		create_employee_type_dialog__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_employee_type_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateEmployeeTypeDialog__CentralAdmin:created', EmployeeTypeObject)
	})
	//
	
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.employee_type_id) ) return

		fillForm(create_employee_type_dialog__create_form, options)

	}
}
// CreateCustomerDialog__CentralAdmin
CreateCustomerDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_customer_dialog__central_admin',
		html: '',
	}

	options = {...defaultOptions, ...options}
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_customer)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-customer-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_customer_dialog__create_form = dialog_container.find('#create_customer_dialog__create_form')

	const create_customer_dialog__create_form__name_input = dialog_container.find('#create_customer_dialog__create_form__name_input')
	const create_customer_dialog__create_form__phone_input = dialog_container.find('#create_customer_dialog__create_form__phone_input')
	const create_customer_dialog__create_form__email_input = dialog_container.find('#create_customer_dialog__create_form__email_input') 

	const create_customer_dialog__create_form__address_input = dialog_container.find('#create_customer_dialog__create_form__address_input') 
	const create_customer_dialog__create_form__NIF_input = dialog_container.find('#create_customer_dialog__create_form__NIF_input') 
	const create_customer_dialog__create_form__NIS_input = dialog_container.find('#create_customer_dialog__create_form__NIS_input') 
	const create_customer_dialog__create_form__ART_input = dialog_container.find('#create_customer_dialog__create_form__ART_input') 
	const create_customer_dialog__create_form__RC_input = dialog_container.find('#create_customer_dialog__create_form__RC_input') 

	var CustomerObject = {}
	// submit
	create_customer_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_customer_dialog__create_form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		create_customer_dialog__create_form.find(':submit').addClass('disabled')

		CustomerObject.name = create_customer_dialog__create_form__name_input.val()
		CustomerObject.phone = create_customer_dialog__create_form__phone_input.val()
		CustomerObject.email = create_customer_dialog__create_form__email_input.val()

		CustomerObject.address = create_customer_dialog__create_form__address_input.val()
		CustomerObject.NIF = create_customer_dialog__create_form__NIF_input.val()
		CustomerObject.NIS = create_customer_dialog__create_form__NIS_input.val()
		CustomerObject.ART = create_customer_dialog__create_form__ART_input.val()
		CustomerObject.RC = create_customer_dialog__create_form__RC_input.val()

		// update
		if ( !isNull(options.id) )
		{
			CustomerObject.id = options.id

			try 
			{
				var res = await CUSTOMER_MODEL.update(CustomerObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_customer_dialog__create_form.find(':submit').removeClass('disabled')
				return
			}
			create_customer_dialog__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.id = null
			create_customer_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateCustomerDialog__CentralAdmin:updated', CustomerObject)

			return
		}
		// create
		try 
		{
			var res = await CUSTOMER_MODEL.store(CustomerObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_customer_dialog__create_form.find(':submit').removeClass('disabled')
			return
		}

		create_customer_dialog__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_customer_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateCustomerDialog__CentralAdmin:created', CustomerObject)
	})
	//
	
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.id) ) return

		fillForm(create_customer_dialog__create_form, options)

	}
}
// CreateCustomerDialog__Centers
CreateCustomerDialog__Centers = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_customer_dialog__centers',
		html: '',
	}

	options = {...defaultOptions, ...options}
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_customer)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/centers/create-customer-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_customer_dialog__create_form = dialog_container.find('#create_customer_dialog__create_form')

	const create_customer_dialog__create_form__name_input = dialog_container.find('#create_customer_dialog__create_form__name_input')
	const create_customer_dialog__create_form__phone_input = dialog_container.find('#create_customer_dialog__create_form__phone_input')
	const create_customer_dialog__create_form__email_input = dialog_container.find('#create_customer_dialog__create_form__email_input') 

	const create_customer_dialog__create_form__address_input = dialog_container.find('#create_customer_dialog__create_form__address_input') 
	const create_customer_dialog__create_form__NIF_input = dialog_container.find('#create_customer_dialog__create_form__NIF_input') 
	const create_customer_dialog__create_form__NIS_input = dialog_container.find('#create_customer_dialog__create_form__NIS_input') 
	const create_customer_dialog__create_form__ART_input = dialog_container.find('#create_customer_dialog__create_form__ART_input') 
	const create_customer_dialog__create_form__RC_input = dialog_container.find('#create_customer_dialog__create_form__RC_input') 

	var CustomerObject = {}
	// submit
	create_customer_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_customer_dialog__create_form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		create_customer_dialog__create_form.find(':submit').addClass('disabled')

		CustomerObject.administration_id = USER_CONFIG.administration.clinicId
		CustomerObject.administration_name = USER_CONFIG.administration.clinicName
		CustomerObject.name = create_customer_dialog__create_form__name_input.val()
		CustomerObject.phone = create_customer_dialog__create_form__phone_input.val()
		CustomerObject.email = create_customer_dialog__create_form__email_input.val()

		CustomerObject.address = create_customer_dialog__create_form__address_input.val()
		CustomerObject.NIF = create_customer_dialog__create_form__NIF_input.val()
		CustomerObject.NIS = create_customer_dialog__create_form__NIS_input.val()
		CustomerObject.ART = create_customer_dialog__create_form__ART_input.val()
		CustomerObject.RC = create_customer_dialog__create_form__RC_input.val()

		// update
		if ( !isNull(options.id) )
		{
			CustomerObject.id = options.id

			try 
			{
				var res = await CUSTOMER_MODEL.update(CustomerObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_customer_dialog__create_form.find(':submit').removeClass('disabled')
				return
			}
			create_customer_dialog__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.id = null
			create_customer_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateCustomerDialog__Centers:updated', CustomerObject)

			return
		}
		// create
		try 
		{
			var res = await CUSTOMER_MODEL.store(CustomerObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_customer_dialog__create_form.find(':submit').removeClass('disabled')
			return
		}

		create_customer_dialog__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_customer_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateCustomerDialog__Centers:created', CustomerObject)
	})
	//
	
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.id) ) return

		fillForm(create_customer_dialog__create_form, options)

	}
}
// TextDialog
TextDialog = async (options = {}) =>
{

	const defaultOptions = {
		rootId: 'text_dialog',
		title: "Text Dialog",
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)

	// var html = await getPage('../views/dialogs/test-dialog.ejs')
	dialog.setHTML( options.html )
}
// CreateAppointmentDialog__CentralAdmin
CreateAppointmentDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_appointment_dialog__central_admin',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_appointment)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-appointment-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_appointment_dialog__central_admin__create_form = dialog_container.find('#create_appointment_dialog__central_admin__create_form')

	const create_appointment_dialog__central_admin__center_select_with_clients__center_select = dialog_container.find('#create_appointment_dialog__central_admin__center_select_with_clients__center_select')
	const create_appointment_dialog__central_admin__center_select_with_clients__client_select = dialog_container.find('#create_appointment_dialog__central_admin__center_select_with_clients__client_select')
	const create_appointment_dialog__central_admin__department_select = dialog_container.find('#create_appointment_dialog__central_admin__department_select')

	const create_appointment_dialog__central_admin__date_input = dialog_container.find('#create_appointment_dialog__central_admin__date_input')
	const create_appointment_dialog__central_admin__time_input = dialog_container.find('#create_appointment_dialog__central_admin__time_input')

	const create_appointment_dialog__central_admin__name_input = dialog_container.find('#create_appointment_dialog__central_admin__name_input')
	const create_appointment_dialog__central_admin__price_input = dialog_container.find('#create_appointment_dialog__central_admin__price_input')
	const create_appointment_dialog__central_admin__note_input = dialog_container.find('#create_appointment_dialog__central_admin__note_input')

	var AppointementObject = {}
	// submit
	create_appointment_dialog__central_admin__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check center
		if ( isNull(create_appointment_dialog__central_admin__center_select_with_clients__center_select.find(':selected').val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_center_not_selected, '')
			return
		}
		// check client
		if ( isNull(create_appointment_dialog__central_admin__center_select_with_clients__client_select.find(':selected').val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_client_not_selected, '')
			return
		}

		create_appointment_dialog__central_admin__create_form.find(':submit').addClass('disabled')

		AppointementObject.clinicId = create_appointment_dialog__central_admin__center_select_with_clients__center_select.find(':selected').val()
		AppointementObject.clinicName = create_appointment_dialog__central_admin__center_select_with_clients__center_select.find(':selected').text()
		AppointementObject.classId = create_appointment_dialog__central_admin__department_select.find(':selected').val()
		AppointementObject.className = create_appointment_dialog__central_admin__department_select.find(':selected').text()
		AppointementObject.patientId = create_appointment_dialog__central_admin__center_select_with_clients__client_select.find(':selected').val()
		AppointementObject.aptNote = create_appointment_dialog__central_admin__note_input.val()
		AppointementObject.aptDate = create_appointment_dialog__central_admin__date_input.val()
		AppointementObject.aptTime = create_appointment_dialog__central_admin__time_input.val()
		AppointementObject.aptName = create_appointment_dialog__central_admin__name_input.val()
		AppointementObject.aptPrice = create_appointment_dialog__central_admin__price_input.val()
		// AppointementObject.type = 'online_followup'
		// AppointementObject.aptTime_interval = 1

		// update
		if ( !isNull(options.aptId) )
		{
			AppointementObject.aptId = options.aptId
			try 
			{
				var res = await APPOINTMENT_MODEL.update(AppointementObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_appointment_dialog__central_admin__create_form.find(':submit').removeClass('disabled')
				return
			}
			create_appointment_dialog__central_admin__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.aptId = null
			create_appointment_dialog__central_admin__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateAppointmentDialog:appointment-updated', AppointementObject)

			return
		}
		// create
		try 
		{
			var res = await APPOINTMENT_MODEL.store(AppointementObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_appointment_dialog__central_admin__create_form.find(':submit').removeClass('disabled')
			return
		}

		create_appointment_dialog__central_admin__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_appointment_dialog__central_admin__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateAppointmentDialog:appointment-created', AppointementObject)
	})
	// select client
	create_appointment_dialog__central_admin__center_select_with_clients__client_select.off('change').on('change', e =>
	{
		data = checkJSON( decodeURIComponent( atob( create_appointment_dialog__central_admin__center_select_with_clients__client_select.find(':selected').data('object') ) ) )
		
		if ( isNull(data.classId) ) return
		
		setOptionSelected(create_appointment_dialog__central_admin__department_select, data.classId, true)
	})
	// select department
	create_appointment_dialog__central_admin__department_select.off('change').on('change', e =>
	{
		data = checkJSON( decodeURIComponent( atob( create_appointment_dialog__central_admin__department_select.find(':selected').data('object') ) ) )
		
		if ( isNull(data.classId) ) return
		
		create_appointment_dialog__central_admin__name_input.val(`موعد ${data.className}`)
		create_appointment_dialog__central_admin__price_input.val( data.classPrice )
	})
	//
	
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.patientId) ) return

		observeElement( create_appointment_dialog__central_admin__center_select_with_clients__center_select[0], mutation =>
		{
			setOptionSelected(create_appointment_dialog__central_admin__center_select_with_clients__center_select, options.clinicId, true)
		})

		observeElement( create_appointment_dialog__central_admin__center_select_with_clients__client_select[0], mutation =>
		{
			setOptionSelected(create_appointment_dialog__central_admin__center_select_with_clients__client_select, options.patientId)
		})

		observeElement( create_appointment_dialog__central_admin__department_select[0], mutation =>
		{
			setOptionSelected(create_appointment_dialog__central_admin__department_select, options.classId, true)
		})

		// create_appointment_dialog__central_admin__name_input.val(options.aptName)
		// create_appointment_dialog__central_admin__price_input.val(options.aptPrice)
		create_appointment_dialog__central_admin__note_input.val(options.aptNote)
		if (!isNull(options.aptDate)) create_appointment_dialog__central_admin__date_input.val(options.aptDate)
		create_appointment_dialog__central_admin__time_input.val(options.aptTime)

	}
}
// CreateAppointmentDialog__Centers
CreateAppointmentDialog__Centers = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_appointment_dialog__centers',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}
	
	const dialog = new WindowDialog(options)

	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_appointment)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/centers/create-appointment-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_appointment_dialog__centers__create_form = dialog_container.find('#create_appointment_dialog__centers__create_form')

	const create_appointment_dialog__centers__center_clients__client_select = dialog_container.find('#create_appointment_dialog__centers__center_clients__client_select')
	const create_appointment_dialog__centers__department_select = dialog_container.find('#create_appointment_dialog__centers__department_select')

	const create_appointment_dialog__centers__date_input = dialog_container.find('#create_appointment_dialog__centers__date_input')
	const create_appointment_dialog__centers__time_input = dialog_container.find('#create_appointment_dialog__centers__time_input')

	const create_appointment_dialog__centers__name_input = dialog_container.find('#create_appointment_dialog__centers__name_input')
	const create_appointment_dialog__centers__price_input = dialog_container.find('#create_appointment_dialog__centers__price_input')
	const create_appointment_dialog__centers__note_input = dialog_container.find('#create_appointment_dialog__centers__note_input')

	var AppointementObject = {}
	// submit
	create_appointment_dialog__centers__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_appointment_dialog__centers__center_clients__client_select.find(':selected').val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_client_not_selected, '')
			return
		}

		create_appointment_dialog__centers__create_form.find(':submit').addClass('disabled')

		AppointementObject.clinicId = USER_CONFIG.administration.clinicId
		AppointementObject.clinicName = USER_CONFIG.administration.clinicName
		AppointementObject.classId = create_appointment_dialog__centers__department_select.find(':selected').val()
		AppointementObject.className = create_appointment_dialog__centers__department_select.find(':selected').text()
		AppointementObject.patientId = create_appointment_dialog__centers__center_clients__client_select.find(':selected').val()
		AppointementObject.aptNote = create_appointment_dialog__centers__note_input.val()
		AppointementObject.aptDate = create_appointment_dialog__centers__date_input.val()
		AppointementObject.aptTime = create_appointment_dialog__centers__time_input.val()
		AppointementObject.aptName = create_appointment_dialog__centers__name_input.val()
		AppointementObject.aptPrice = create_appointment_dialog__centers__price_input.val()

		// update
		if ( !isNull(options.aptId) )
		{
			AppointementObject.aptId = options.aptId
			try 
			{
				var res = await APPOINTMENT_MODEL.update(AppointementObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_appointment_dialog__centers__create_form.find(':submit').removeClass('disabled')
				return
			}
			create_appointment_dialog__centers__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.aptId = null
			create_appointment_dialog__centers__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateAppointmentDialog:appointment-updated', AppointementObject)

			return
		}
		// create
		try 
		{
			var res = await APPOINTMENT_MODEL.store(AppointementObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_appointment_dialog__centers__create_form.find(':submit').removeClass('disabled')
			return
		}

		create_appointment_dialog__centers__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_appointment_dialog__centers__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateAppointmentDialog:appointment-created', AppointementObject)
	})
	// select client
	create_appointment_dialog__centers__center_clients__client_select.off('change').on('change', e =>
	{
		data = checkJSON( decodeURIComponent( atob( create_appointment_dialog__centers__center_clients__client_select.find(':selected').data('object') ) ) )
		
		if ( isNull(data.classId) ) return
		
		setOptionSelected(create_appointment_dialog__centers__department_select, data.classId, true)
	})
	// select department
	create_appointment_dialog__centers__department_select.off('change').on('change', e =>
	{
		data = checkJSON( decodeURIComponent( atob( create_appointment_dialog__centers__department_select.find(':selected').data('object') ) ) )
		
		if ( isNull(data.classId) ) return

		create_appointment_dialog__centers__name_input.val(`موعد ${data.className}`)
		create_appointment_dialog__centers__price_input.val( data.classPrice )
	})
	//
	
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.patientId) ) return

		observeElement( create_appointment_dialog__centers__center_clients__client_select[0], mutation =>
		{
			setOptionSelected(create_appointment_dialog__centers__center_clients__client_select, options.patientId)
		})	
		
		observeElement( create_appointment_dialog__centers__department_select[0], mutation =>
		{
			setOptionSelected(create_appointment_dialog__centers__department_select, options.classId, true)
		})
		
		// create_appointment_dialog__centers__name_input.val(options.aptName)
		// create_appointment_dialog__centers__price_input.val(options.aptPrice)
		create_appointment_dialog__centers__note_input.val(options.aptNote)
		if (!isNull(options.aptDate)) create_appointment_dialog__centers__date_input.val(options.aptDate)
		create_appointment_dialog__centers__time_input.val(options.aptTime)

	}
}
// CreatePrescriptionDialog__CentralAdmin
CreatePrescriptionDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_prescription_dialog__central_admin',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_prescription_button)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-prescription-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	const create_prescription_dialog__central_admin__create_form = dialog_container.find('#create_prescription_dialog__central_admin__create_form')

	const create_prescription_dialog__central_admin__center_select_with_clients__center_select = dialog_container.find('#create_prescription_dialog__central_admin__center_select_with_clients__center_select')
	const create_prescription_dialog__central_admin__center_select_with_clients__client_select = dialog_container.find('#create_prescription_dialog__central_admin__center_select_with_clients__client_select')

	const create_prescription_dialog__central_admin__create_form__qrcode_image = dialog_container.find('#create_prescription_dialog__central_admin__create_form__qrcode_image')

	// Tabs
	const create_prescription_dialog__central_admin__internal_prescription_tab_trigger = dialog_container.find('#create_prescription_dialog__central_admin__internal_prescription_tab_trigger')
	const create_prescription_dialog__central_admin__external_prescription_tab_trigger = dialog_container.find('#create_prescription_dialog__central_admin__external_prescription_tab_trigger')

	// Internal tab
	const create_prescription_dialog__central_admin__internal__product_select = dialog_container.find('#create_prescription_dialog__central_admin__internal__product_select')
	const create_prescription_dialog__central_admin__internal_prescription_tab__medicines_list = dialog_container.find('#create_prescription_dialog__central_admin__internal_prescription_tab__medicines_list')

	// External tab
	const create_prescription_dialog__central_admin__external__product_select = dialog_container.find('#create_prescription_dialog__central_admin__external__product_select')
	const create_prescription_dialog__central_admin__external_prescription_tab__medicines_list = dialog_container.find('#create_prescription_dialog__central_admin__external_prescription_tab__medicines_list')


	const create_prescription_dialog__central_admin__note_input = dialog_container.find('#create_prescription_dialog__central_admin__note_input')

	const create_prescription_dialog__central_admin__submit_button = dialog_container.find('#create_prescription_dialog__central_admin__submit_button')

	var PrescObject = {
		prescriptionHashId: uniqid()
	}

	// preview qrcode
	generateNewQrcode( PrescObject.prescriptionHashId )
	// submit
	create_prescription_dialog__central_admin__submit_button.off('click').on('click', async e =>
	{
		e.preventDefault()

		// check center
		if ( isNull(create_prescription_dialog__central_admin__center_select_with_clients__center_select.find(':selected').val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_center_not_selected, '')
			return
		}
		// check client
		if ( isNull(create_prescription_dialog__central_admin__center_select_with_clients__client_select.find(':selected').val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_client_not_selected, '')
			return
		}

		
		create_prescription_dialog__central_admin__submit_button.addClass('disabled')

		PrescObject.patientId = create_prescription_dialog__central_admin__center_select_with_clients__client_select.find(':selected').val()
		PrescObject.prescriptionNote = create_prescription_dialog__central_admin__note_input.val()
		PrescObject.medicines = selectedMedicines()
		PrescObject.employee_id = USER_CONFIG.employee_id
		PrescObject.clinicId = create_prescription_dialog__central_admin__center_select_with_clients__center_select.find(':selected').val()
		PrescObject.prescriptionQRCode = create_prescription_dialog__central_admin__create_form__qrcode_image.attr('src')

		// Set if INSIDE | OUTSIDE
		if ( create_prescription_dialog__central_admin__internal_prescription_tab_trigger.hasClass('active') ) PrescObject.prescriptionDirection = ST_DIRECTION_INSIDE
		else if ( create_prescription_dialog__central_admin__external_prescription_tab_trigger.hasClass('active') ) PrescObject.prescriptionDirection = ST_DIRECTION_OUTSIDE

		// update
		if ( !isNull(options.prescriptionId) )
		{
			PrescObject.prescriptionId = options.prescriptionId
			try 
			{
				var res = await PRESCRIPTION_MODEL.update(PrescObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_prescription_dialog__central_admin__submit_button.removeClass('disabled')
				return
			}
			create_prescription_dialog__central_admin__submit_button.removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			resetFields()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreatePrescriptionDialog:prescription-updated', PrescObject)

			return
		}
		// create
		try 
		{

			var res = await PRESCRIPTION_MODEL.store(PrescObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_prescription_dialog__central_admin__submit_button.removeClass('disabled')
			return
		}

		create_prescription_dialog__central_admin__submit_button.removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		resetFields()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreatePrescriptionDialog:prescription-created', PrescObject)
	})

	// add medicine
	create_prescription_dialog__central_admin__internal__product_select.off('create_prescription_dialog__central_admin__internal:product-selected').on('create_prescription_dialog__central_admin__internal:product-selected', e =>
	{
		var detail = e.originalEvent.detail
		var suggestion = detail.suggestion
		var data = suggestion.data

		internal_addMedicine({
			id: data.productId,
            name: data.productName,
            dose: data.productDesc,
            duration: '',
            quantity: 1,
            price: data.productPrice,
		})
		create_prescription_dialog__central_admin__internal__product_select.val(null)
	})
	//
	create_prescription_dialog__central_admin__external__product_select.off('create_prescription_dialog__central_admin__external:product-selected').on('create_prescription_dialog__central_admin__external:product-selected', e =>
	{
		var detail = e.originalEvent.detail
		var suggestion = detail.suggestion
		var data = suggestion.data

		external_addMedicine({
			id: data.id,
            name: data.name,
            dose: data.description,
            duration: '',
            quantity: 1,
            price: '',
		})
		create_prescription_dialog__central_admin__external__product_select.val(null)
	})

	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.patientId) ) return

		observeElement( create_prescription_dialog__central_admin__center_select_with_clients__center_select[0], mutation =>
		{
			setOptionSelected(create_prescription_dialog__central_admin__center_select_with_clients__center_select, options.clinicId, true)
		})

		observeElement( create_prescription_dialog__central_admin__center_select_with_clients__client_select[0], mutation =>
		{
			setOptionSelected(create_prescription_dialog__central_admin__center_select_with_clients__client_select, options.patientId)
		})

		// Check if INSIDE | OUTSIDE
		if ( options.prescriptionDirection == ST_DIRECTION_INSIDE )
		{
			create_prescription_dialog__central_admin__internal_prescription_tab_trigger.trigger('click')

			// Display products
			if ( options.medicines )
			{
				$.each(options.medicines, (k,v) =>
				{
					internal_addMedicine({
						id: v.productId,
						name: v.medName,
						dose: v.medDose,
						duration: v.medDuration,
						quantity: v.medQuantity,
						price: ''
					})
				})
			}
		}
		else if ( options.prescriptionDirection == ST_DIRECTION_OUTSIDE )
		{
			create_prescription_dialog__central_admin__external_prescription_tab_trigger.trigger('click')

			// Display products
			if ( options.medicines )
			{
				$.each(options.medicines, (k,v) =>
				{
					external_addMedicine({
						id: v.productId,
						name: v.medName,
						dose: v.medDose,
						duration: v.medDuration,
						quantity: v.medQuantity,
						price: ''
					})
				})
			}
		}

		create_prescription_dialog__central_admin__note_input.val(options.prescriptionNote)

		generateNewQrcode(PrescObject.prescriptionHashId)

	}
	// generate qrcode
	async function generateNewQrcode(uuid)
	{
		create_prescription_dialog__central_admin__create_form__qrcode_image.attr('src', await generateQRCode( `${PROJECT_URL}view/prescription/${FUI_DISPLAY_LANG.lang}/?phash=${uuid}` ) )
	}
	// add medicine
	function internal_addMedicine(options = {})
	{
		var html = '';

		html += `<div class="form-field-01 js_deletable_list_item mb-2" data-role="row" data-productid="${options.id}">
					<div class="form-field-icon-holder text-color-27 width-50px">
						<i class="fas fa-medkit"></i>
					</div>
					<div class="form-field-input-holder">
						<input type="text" class="form-field-input" data-role="MED_NAME" placeholder="${FUI_DISPLAY_LANG.views.pages.global.medicine_name}" value="${options.name}">
						<input type="text" class="form-field-input" data-role="MED_DOSE" placeholder="${FUI_DISPLAY_LANG.views.pages.global.dose}" value="${options.dose}">
						<input type="text" class="form-field-input" data-role="MED_DURATION" placeholder="${FUI_DISPLAY_LANG.views.pages.global.note}" value="${options.duration}">
						<input type="number" step="any" min="1" class="form-field-input width-50px" data-role="MED_QUANTITY" placeholder="${FUI_DISPLAY_LANG.views.pages.global.text10}" value="${options.quantity}">
						<input type="hidden" step="any" class="input-text input-text-outline border-bottom-forced" data-role="MED_PRICE" value="${options.price}">
						<div class="d-flex flex-shrink-0 justify-content-center align-items-center width-50px h-100 js_deletable_list_item__delete_button cursor-pointer rounded">
							<span class="no-pointer"><i class="fas fa-times"></i></span>
						</div>
					</div>
				</div>`;
		//
		create_prescription_dialog__central_admin__internal_prescription_tab__medicines_list.append(html)
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
	}
	// add medicine
	function external_addMedicine(options = {})
	{
		var html = '';

		html += `<div class="form-field-01 js_deletable_list_item mb-2" data-role="row" data-productid="${options.id}">
					<div class="form-field-icon-holder text-color-27 width-50px">
						<i class="fas fa-medkit"></i>
					</div>
					<div class="form-field-input-holder">
						<input type="text" class="form-field-input" data-role="MED_NAME" placeholder="${FUI_DISPLAY_LANG.views.pages.global.medicine_name}" value="${options.name}">
						<input type="text" class="form-field-input" data-role="MED_DOSE" placeholder="${FUI_DISPLAY_LANG.views.pages.global.dose}" value="${options.dose}">
						<input type="text" class="form-field-input" data-role="MED_DURATION" placeholder="${FUI_DISPLAY_LANG.views.pages.global.note}" value="${options.duration}">
						<input type="number" step="any" min="1" class="form-field-input width-50px" data-role="MED_QUANTITY" placeholder="${FUI_DISPLAY_LANG.views.pages.global.text10}" value="${options.quantity}">
						<div class="d-flex flex-shrink-0 justify-content-center align-items-center width-50px h-100 js_deletable_list_item__delete_button cursor-pointer rounded">
							<span class="no-pointer"><i class="fas fa-times"></i></span>
						</div>
					</div>
				</div>`;
		//
		create_prescription_dialog__central_admin__external_prescription_tab__medicines_list.append(html)
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
	}
	// selected medicines
	function selectedMedicines()
	{
		var list = [];

		if ( create_prescription_dialog__central_admin__internal_prescription_tab_trigger.hasClass('active') )
			var items = create_prescription_dialog__central_admin__internal_prescription_tab__medicines_list.find('[data-role="row"]')
		else if ( create_prescription_dialog__central_admin__external_prescription_tab_trigger.hasClass('active') )
			var items = create_prescription_dialog__central_admin__external_prescription_tab__medicines_list.find('[data-role="row"]')

		for (var i = 0; i < items.length; i++) 
		{
			var item = $(items[i]);
			var id = item.data('productid');
			var name = item.find('[data-role="MED_NAME"]').val();
			var dose = item.find('[data-role="MED_DOSE"]').val();
			var duration = item.find('[data-role="MED_DURATION"]').val();
			var quantity = item.find('[data-role="MED_QUANTITY"]').val();
			var price = item.find('[data-role="MED_PRICE"]').val();
			list.push({
				productId: id,
				medName: name,
				medDose: dose,
				medDuration: duration,
				medQuantity: quantity,
				medPrice: price,
			});
		}

		return list;
	}
	// reset fields
	function resetFields()
	{
		create_prescription_dialog__central_admin__internal_prescription_tab__medicines_list.html('')
		create_prescription_dialog__central_admin__internal__product_select.val(null)

		create_prescription_dialog__central_admin__external_prescription_tab__medicines_list.html('')
		create_prescription_dialog__central_admin__external__product_select.val(null)

		create_prescription_dialog__central_admin__note_input.val(null)

		options.prescriptionId = null
		PrescObject.prescriptionHashId = uniqid()
		generateNewQrcode( PrescObject.prescriptionHashId )
	}
}
// CreatePrescriptionDialog__Centers
CreatePrescriptionDialog__Centers = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_prescription_dialog__centers',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_prescription_button)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/centers/create-prescription-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	//
	// const create_prescription_dialog__centers__create_form = dialog_container.find('#create_prescription_dialog__centers__create_form')

	const create_prescription_dialog__centers__center_clients__client_select = dialog_container.find('#create_prescription_dialog__centers__center_clients__client_select')

	const create_prescription_dialog__centers__create_form__qrcode_image = dialog_container.find('#create_prescription_dialog__centers__create_form__qrcode_image')

	// Tabs
	const create_prescription_dialog__centers__internal_prescription_tab_trigger = dialog_container.find('#create_prescription_dialog__centers__internal_prescription_tab_trigger')
	const create_prescription_dialog__centers__external_prescription_tab_trigger = dialog_container.find('#create_prescription_dialog__centers__external_prescription_tab_trigger')

	// Internal tab
	const create_prescription_dialog__centers__internal__product_select = dialog_container.find('#create_prescription_dialog__centers__internal__product_select')
	const create_prescription_dialog__centers__internal_prescription_tab__medicines_list = dialog_container.find('#create_prescription_dialog__centers__internal_prescription_tab__medicines_list')

	// External tab
	const create_prescription_dialog__centers__external__product_select = dialog_container.find('#create_prescription_dialog__centers__external__product_select')
	const create_prescription_dialog__centers__external_prescription_tab__medicines_list = dialog_container.find('#create_prescription_dialog__centers__external_prescription_tab__medicines_list')


	const create_prescription_dialog__centers__note_input = dialog_container.find('#create_prescription_dialog__centers__note_input')

	const create_prescription_dialog__centers__submit_button = dialog_container.find('#create_prescription_dialog__centers__submit_button')

	var PrescObject = {
		prescriptionHashId: uniqid()
	}

	// preview qrcode
	generateNewQrcode( PrescObject.prescriptionHashId )
	// submit
	create_prescription_dialog__centers__submit_button.off('click').on('click', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_prescription_dialog__centers__center_clients__client_select.find(':selected').val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_client_not_selected, '')
			return
		}

		create_prescription_dialog__centers__submit_button.addClass('disabled')

		PrescObject.patientId = create_prescription_dialog__centers__center_clients__client_select.find(':selected').val()
		PrescObject.prescriptionNote = create_prescription_dialog__centers__note_input.val()
		PrescObject.medicines = selectedMedicines()
		PrescObject.employee_id = USER_CONFIG.employee_id
		PrescObject.clinicId = USER_CONFIG.administration.clinicId
		PrescObject.prescriptionQRCode = create_prescription_dialog__centers__create_form__qrcode_image.attr('src')

		// Set if INSIDE | OUTSIDE
		if ( create_prescription_dialog__centers__internal_prescription_tab_trigger.hasClass('active') ) PrescObject.prescriptionDirection = ST_DIRECTION_INSIDE
		else if ( create_prescription_dialog__centers__external_prescription_tab_trigger.hasClass('active') ) PrescObject.prescriptionDirection = ST_DIRECTION_OUTSIDE

		// update
		if ( !isNull(options.prescriptionId) )
		{
			PrescObject.prescriptionId = options.prescriptionId
			try 
			{
				var res = await PRESCRIPTION_MODEL.update(PrescObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_prescription_dialog__centers__submit_button.removeClass('disabled')
				return
			}
			create_prescription_dialog__centers__submit_button.removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			resetFields()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreatePrescriptionDialog:prescription-updated', PrescObject)

			return
		}
		// create
		try 
		{
			var res = await PRESCRIPTION_MODEL.store(PrescObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_prescription_dialog__centers__submit_button.removeClass('disabled')
			return
		}

		create_prescription_dialog__centers__submit_button.removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		resetFields()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreatePrescriptionDialog:prescription-created', PrescObject)
	})

	// add medicine
	create_prescription_dialog__centers__internal__product_select.off('create_prescription_dialog__centers__internal:product-selected').on('create_prescription_dialog__centers__internal:product-selected', e =>
	{
		var detail = e.originalEvent.detail
		var suggestion = detail.suggestion
		var data = suggestion.data

		internal_addMedicine({
			id: data.productId,
            name: data.productName,
            dose: data.productDesc,
            duration: '',
            quantity: 1,
            price: data.productPrice,
		})
		create_prescription_dialog__centers__internal__product_select.val(null)
	})
	//
	create_prescription_dialog__centers__external__product_select.off('create_prescription_dialog__centers__external:product-selected').on('create_prescription_dialog__centers__external:product-selected', e =>
	{
		var detail = e.originalEvent.detail
		var suggestion = detail.suggestion
		var data = suggestion.data

		external_addMedicine({
			id: data.id,
            name: data.name,
            dose: data.description,
            duration: '',
            quantity: 1,
            price: '',
		})
		create_prescription_dialog__centers__external__product_select.val(null)
	})

	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.patientId) ) return

		observeElement( create_prescription_dialog__centers__center_clients__client_select[0], mutation =>
		{
			setOptionSelected(create_prescription_dialog__centers__center_clients__client_select, options.patientId)
		})

		// Check if INSIDE | OUTSIDE
		if ( options.prescriptionDirection == ST_DIRECTION_INSIDE )
		{
			create_prescription_dialog__centers__internal_prescription_tab_trigger.trigger('click')

			// Display products
			if ( options.medicines )
			{
				$.each(options.medicines, (k,v) =>
				{
					internal_addMedicine({
						id: v.productId,
						name: v.medName,
						dose: v.medDose,
						duration: v.medDuration,
						quantity: v.medQuantity,
						price: ''
					})
				})
			}
		}
		else if ( options.prescriptionDirection == ST_DIRECTION_OUTSIDE )
		{
			create_prescription_dialog__centers__external_prescription_tab_trigger.trigger('click')

			// Display products
			if ( options.medicines )
			{
				$.each(options.medicines, (k,v) =>
				{
					external_addMedicine({
						id: v.productId,
						name: v.medName,
						dose: v.medDose,
						duration: v.medDuration,
						quantity: v.medQuantity,
						price: ''
					})
				})
			}
		}

		create_prescription_dialog__centers__note_input.val(options.prescriptionNote)

		generateNewQrcode(PrescObject.prescriptionHashId)

	}
	// generate qrcode
	async function generateNewQrcode(uuid)
	{
		create_prescription_dialog__centers__create_form__qrcode_image.attr('src', await generateQRCode( `${PROJECT_URL}view/prescription/${FUI_DISPLAY_LANG.lang}/?phash=${uuid}` ) )
	}
	// add medicine
	function internal_addMedicine(options = {})
	{
		var html = '';

		html += `<div class="form-field-01 js_deletable_list_item mb-2" data-role="row" data-productid="${options.id}">
					<div class="form-field-icon-holder text-color-27 width-50px">
						<i class="fas fa-medkit"></i>
					</div>
					<div class="form-field-input-holder">
						<input type="text" class="form-field-input" data-role="MED_NAME" placeholder="${FUI_DISPLAY_LANG.views.pages.global.medicine_name}" value="${options.name}">
						<input type="text" class="form-field-input" data-role="MED_DOSE" placeholder="${FUI_DISPLAY_LANG.views.pages.global.dose}" value="${options.dose}">
						<input type="text" class="form-field-input" data-role="MED_DURATION" placeholder="${FUI_DISPLAY_LANG.views.pages.global.note}" value="${options.duration}">
						<input type="number" step="any" min="1" class="form-field-input width-50px" data-role="MED_QUANTITY" placeholder="${FUI_DISPLAY_LANG.views.pages.global.text10}" value="${options.quantity}">
						<input type="hidden" step="any" class="input-text input-text-outline border-bottom-forced" data-role="MED_PRICE" value="${options.price}">
						<div class="d-flex flex-shrink-0 justify-content-center align-items-center width-50px h-100 js_deletable_list_item__delete_button cursor-pointer rounded">
							<span class="no-pointer"><i class="fas fa-times"></i></span>
						</div>
					</div>
				</div>`;
		//
		create_prescription_dialog__centers__internal_prescription_tab__medicines_list.append(html)
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
	}
	// add medicine
	function external_addMedicine(options = {})
	{
		var html = '';

		html += `<div class="form-field-01 js_deletable_list_item mb-2" data-role="row" data-productid="${options.id}">
					<div class="form-field-icon-holder text-color-27 width-50px">
						<i class="fas fa-medkit"></i>
					</div>
					<div class="form-field-input-holder">
						<input type="text" class="form-field-input" data-role="MED_NAME" placeholder="${FUI_DISPLAY_LANG.views.pages.global.medicine_name}" value="${options.name}">
						<input type="text" class="form-field-input" data-role="MED_DOSE" placeholder="${FUI_DISPLAY_LANG.views.pages.global.dose}" value="${options.dose}">
						<input type="text" class="form-field-input" data-role="MED_DURATION" placeholder="${FUI_DISPLAY_LANG.views.pages.global.note}" value="${options.duration}">
						<input type="number" step="any" min="1" class="form-field-input width-50px" data-role="MED_QUANTITY" placeholder="${FUI_DISPLAY_LANG.views.pages.global.text10}" value="${options.quantity}">
						<div class="d-flex flex-shrink-0 justify-content-center align-items-center width-50px h-100 js_deletable_list_item__delete_button cursor-pointer rounded">
							<span class="no-pointer"><i class="fas fa-times"></i></span>
						</div>
					</div>
				</div>`;
		//
		create_prescription_dialog__centers__external_prescription_tab__medicines_list.append(html)
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
	}
	// selected medicines
	function selectedMedicines()
	{
		var list = [];

		if ( create_prescription_dialog__centers__internal_prescription_tab_trigger.hasClass('active') )
			var items = create_prescription_dialog__centers__internal_prescription_tab__medicines_list.find('[data-role="row"]')
		else if ( create_prescription_dialog__centers__external_prescription_tab_trigger.hasClass('active') )
			var items = create_prescription_dialog__centers__external_prescription_tab__medicines_list.find('[data-role="row"]')

		for (var i = 0; i < items.length; i++) 
		{
			var item = $(items[i]);
			var id = item.data('productid');
			var name = item.find('[data-role="MED_NAME"]').val();
			var dose = item.find('[data-role="MED_DOSE"]').val();
			var duration = item.find('[data-role="MED_DURATION"]').val();
			var quantity = item.find('[data-role="MED_QUANTITY"]').val();
			var price = item.find('[data-role="MED_PRICE"]').val();
			list.push({
				productId: id,
				medName: name,
				medDose: dose,
				medDuration: duration,
				medQuantity: quantity,
				medPrice: price
			});
		}

		return list;
	}
	// reset fields
	function resetFields()
	{
		create_prescription_dialog__centers__internal_prescription_tab__medicines_list.html('')
		create_prescription_dialog__centers__internal__product_select.val(null)

		create_prescription_dialog__centers__external_prescription_tab__medicines_list.html('')
		create_prescription_dialog__centers__external__product_select.val(null)

		create_prescription_dialog__centers__note_input.val(null)

		options.prescriptionId = null
		PrescObject.prescriptionHashId = uniqid()
		generateNewQrcode( PrescObject.prescriptionHashId )
	}
}
// CreatePrescriptionProductDialog
CreatePrescriptionProductDialog = async (options = {}) =>
{

	const defaultOptions = {
		rootId: 'create_prescription_product_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_product_button)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/create-prescription-product-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const create_prescription_product_dialog__create_form = dialog_container.find('#create_prescription_product_dialog__create_form')
	const create_prescription_product_dialog__create_form__name_input = dialog_container.find('#create_prescription_product_dialog__create_form__name_input')
	const create_prescription_product_dialog__create_form__description_input = dialog_container.find('#create_prescription_product_dialog__create_form__description_input')

	var ProductObject = {}

	create_prescription_product_dialog__create_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check client
		if ( isNull(create_prescription_product_dialog__create_form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		create_prescription_product_dialog__create_form.find(':submit').addClass('disabled')

		ProductObject.name = create_prescription_product_dialog__create_form__name_input.val()
		ProductObject.description = create_prescription_product_dialog__create_form__description_input.val()

		// update
		if ( !isNull(options.id) )
		{
			ProductObject.id = options.id
			try 
			{
				var res = await PRESCRIPTION_MODEL.product_update(ProductObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_prescription_product_dialog__create_form.find(':submit').removeClass('disabled')
				return
			}
			create_prescription_product_dialog__create_form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.id = null
			create_prescription_product_dialog__create_form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreatePrescriptionProductDialog:product-updated', ProductObject)

			return
		}
		// create
		try 
		{
			var res = await PRESCRIPTION_MODEL.product_store(ProductObject) 	
			
		} catch (error) 
		{
			console.error(error)
			create_prescription_product_dialog__create_form.find(':submit').removeClass('disabled')
			return
		}

		create_prescription_product_dialog__create_form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_prescription_product_dialog__create_form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreatePrescriptionProductDialog:product-created', ProductObject)
	})

	// display one
	displayOne()
	function displayOne()
	{

		if ( isNull(options.id) ) return

		create_prescription_product_dialog__create_form__name_input.val(options.name)
		create_prescription_product_dialog__create_form__description_input.val(options.description)

	}
}
// CreateDepartmentDialog__CentralAdmin
CreateDepartmentDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_department_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_department_button)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-department-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const create_department_dialog__form = dialog_container.find('#create_department_dialog__form')
	const create_department_dialog__form__name_input = dialog_container.find('#create_department_dialog__form__name_input')
	const create_department_dialog__form__description_input = dialog_container.find('#create_department_dialog__form__description_input')
	const create_department_dialog__form__price_input = dialog_container.find('#create_department_dialog__form__price_input')

	var ClassObject = {}
	// submit
	create_department_dialog__form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check required inputs
		if ( isNull(create_department_dialog__form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		ClassObject.className = create_department_dialog__form__name_input.val()
		ClassObject.classDesc = create_department_dialog__form__description_input.val()
		ClassObject.classPrice = create_department_dialog__form__price_input.val()

		create_department_dialog__form.find(':submit').addClass('disabled')
		// update
		if ( !isNull(options.classId) )
		{
			ClassObject.classId = options.classId
			try 
			{
				var res = await TREATMENT_CLASS_MODEL.update(ClassObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_department_dialog__form.find(':submit').removeClass('disabled')
				return
			}
			create_department_dialog__form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.classId = null
			create_department_dialog__form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateDepartmentDialog:department-updated', AppointementObject)

			return
		}
		// create
		try 
		{
			var res = await TREATMENT_CLASS_MODEL.store(ClassObject)
		} 
		catch (error) 
		{
			create_department_dialog__form.find(':submit').removeClass('disabled')

			return
		}

		create_department_dialog__form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_department_dialog__form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateDepartmentDialog:department-created', ClassObject)
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.classId) ) return

		create_department_dialog__form__name_input.val(options.className)
		create_department_dialog__form__description_input.val(options.classDesc)
		create_department_dialog__form__price_input.val(options.classPrice)

	}
}
// PreviewImageDialog
PreviewImageDialog = async (options = {}, callback = null) =>
{
	const defaultOptions = {
		rootId: 'preview_image_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
		action: 'preview',
		cropper: {
			dragMode: 'crop',
			cropBoxMovable: true,
			cropBoxResizable: true,
			ready: function(e)
			{
				console.log(this.cropper)
				// set crop box data
				if ( options.cropper.cropBoxData )
				{
					this.cropper.setCropBoxData(options.cropper.cropBoxData)	
				}
				
			}
		}
	}

	options = {...defaultOptions, ...options}

	const ORIGINAL_URL = options.url

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.preview_image)

	dialog.setSize({
		width: '800px',
		height: '600px',
	})

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/preview-image-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	let CROPPER

	// Image tools
	const preview_image_dialog__image_tools = dialog_container.find('#preview_image_dialog__image_tools')
	const preview_image_dialog__image_tools__reset_button = dialog_container.find('#preview_image_dialog__image_tools__reset_button')
	const preview_image_dialog__image_tools__rotate_button = dialog_container.find('#preview_image_dialog__image_tools__rotate_button')
	const preview_image_dialog__image_tools__crop_button = dialog_container.find('#preview_image_dialog__image_tools__crop_button')
	const preview_image_dialog__image_tools__save_button = dialog_container.find('#preview_image_dialog__image_tools__save_button')

	// Image
	const preview_image_dialog__image = dialog_container.find('#preview_image_dialog__image')

	var ROTATE_DEGREES = 90

	// Make image wrapper scrollable
	draggableScroll(preview_image_dialog__image.parent())
	// Set src
	doSetImageSrc(options.url)
	// window-dialog:resize-stop
	dialog_container.off('window-dialog:resize-stop').on('window-dialog:resize-stop', e =>
	{
		// Crop
		if ( options.action == 'crop' )
		{
			doClearCropper()
			preview_image_dialog__image_tools__crop_button.trigger('click')
		}
	})
	// window-dialog:maximize
	dialog_container.off('window-dialog:maximize').on('window-dialog:maximize', e =>
	{
		// Crop
		if ( options.action == 'crop' )
		{
			doClearCropper()
			preview_image_dialog__image_tools__crop_button.trigger('click')
		}
	})
	// window-dialog:maximize-restore
	dialog_container.off('window-dialog:maximize-restore').on('window-dialog:maximize-restore', e =>
	{
		// Crop
		if ( options.action == 'crop' )
		{
			doClearCropper()
			preview_image_dialog__image_tools__crop_button.trigger('click')
		}
	})
	// wait for image to load
	preview_image_dialog__image.off('load').on('load', e =>
	{
		// Crop
		if ( options.action == 'crop' )
		{
			preview_image_dialog__image_tools__crop_button.trigger('click')
		}
	})
	// reset
	preview_image_dialog__image_tools__reset_button.off('click').on('click', e =>
	{
		doReset()
	})
	// Save changes
	preview_image_dialog__image_tools__save_button.off('click').on('click', async e =>
	{
		doSave()
	})
	// Rotate
	preview_image_dialog__image_tools__rotate_button.off('click').on('click', e =>
	{
		doRotateImage()
	})
	// Crop
	preview_image_dialog__image_tools__crop_button.off('click').on('click', e =>
	{
		doCreateCropper()
	})

	// set image
	function doSetImageSrc(src)
	{
		preview_image_dialog__image.attr('src', src)
	}
	// get image src
	function doGetImageSrc()
	{
		return preview_image_dialog__image.attr('src')
	}
	// reset
	function doReset()
	{
		// action
		doSetAction('preview')
		// set original url
		doSetImageSrc(ORIGINAL_URL)
		// clear cropper
		doClearCropper()
		//
		preview_image_dialog__image_tools__reset_button.addClass('disabled')
	}
	// save
	async function doSave()
	{
		dialog.hide()
		
		if ( typeof callback != 'function' ) return
		
		if ( options.action == 'preview' )
		{
			callback({
				url: doGetImageSrc(),
			})
		}
		else if ( options.action == 'rotate' )
		{
			callback({
				url: doGetImageSrc(),
			})
		}
		else if ( options.action == 'crop' )
		{
			var dataURL = CROPPER.getCroppedCanvas().toDataURL()

			var file = await urlToFile(dataURL, {
				file: {
					name: (options.file) ? options.file.name : '',
				}
			})

			callback({
				cropper: CROPPER,
				url: dataURL,
				file: file,
			})

			doClearCropper()
		}
	}
	// set action
	function doSetAction(value)
	{
		options.action = value
		preview_image_dialog__image_tools__reset_button.removeClass('disabled')
	}
	// rotate image
	function doRotateImage()
	{
		doSetAction('rotate')

		rotateImage(doGetImageSrc(), ROTATE_DEGREES, rotatedImgUrl =>
		{
			doSetImageSrc(rotatedImgUrl)

			ROTATE_DEGREES += 90
		})	
	}
	// crop image
	function doCreateCropper()
	{
		doSetAction('crop')
		preview_image_dialog__image.removeClass('cropper-hidden')
		CROPPER = new Cropper(preview_image_dialog__image[0], options)
	}
	// do clear cropper
	function doClearCropper()
	{
		if ( CROPPER )
		{
			CROPPER.destroy()
			CROPPER = null
		}
	}
}
// PreviewPDFDialog
PreviewPDFDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'preview_pdf_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.preview_document)

	dialog.setSize({
		width: '800px',
		height: '600px',
	})

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/preview-pdf-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	// Iframe
	const preview_pdf_dialog__iframe = dialog_container.find('#preview_pdf_dialog__iframe')

	// Set src
	doSetIframeSrc(options.url)
	// set image
	function doSetIframeSrc(src)
	{
		preview_pdf_dialog__iframe.attr('src', src)
	}
}
// PreviewVideoDialog
PreviewVideoDialog = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'preview_video_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.preview_video)

	dialog.setSize({
		width: '800px',
		height: '600px',
	})

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/preview-video-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	// Iframe
	const preview_video_dialog__video = dialog_container.find('#preview_video_dialog__video')

	// stop video on close
	dialog.getContainer().off('window-dialog:closed').on('window-dialog:closed', e =>
	{
		console.log(e)

		preview_video_dialog__video[0].pause()
	})

	// Set src
	doSetVideoSrc(options.url)
	// set image
	function doSetVideoSrc(src)
	{
		preview_video_dialog__video.attr('src', src)
	}
}
// CreateCenterDialog__Centers
CreateCenterDialog__Centers = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_center_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_center)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/centers/create-center-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const create_center_dialog__form = dialog_container.find('#create_center_dialog__form')
	const create_center_dialog__form__name_input = dialog_container.find('#create_center_dialog__form__name_input')
	const create_center_dialog__form__phone_input = dialog_container.find('#create_center_dialog__form__phone_input')
	const create_center_dialog__form__email_input = dialog_container.find('#create_center_dialog__form__email_input')
	const create_center_dialog__form__wilaya_select = dialog_container.find('#create_center_dialog__form__wilaya_select')
	const create_center_dialog__form__baladia_input = dialog_container.find('#create_center_dialog__form__baladia_input')
	const create_center_dialog__form__address_input = dialog_container.find('#create_center_dialog__form__address_input')

	var ClinicObject = {}

	// submit
	create_center_dialog__form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check required inputs
		if ( isNull(create_center_dialog__form__name_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		ClinicObject.parent_id = USER_CONFIG.administration.clinicId
		ClinicObject.clinicName = create_center_dialog__form__name_input.val();
		ClinicObject.clinicPhone  = create_center_dialog__form__phone_input.val();
		ClinicObject.clinicState  = create_center_dialog__form__wilaya_select.find(':selected').val();
		ClinicObject.clinicBaladia = create_center_dialog__form__baladia_input.val();
		ClinicObject.clinicAddress = create_center_dialog__form__address_input.val();
		ClinicObject.clinicEmail = create_center_dialog__form__email_input.val();

		create_center_dialog__form.find(':submit').addClass('disabled')
		// update
		if ( !isNull(options.clinicId) )
		{
			ClinicObject.clinicId = options.clinicId
			try 
			{
				var res = await CLINIC_MODEL.update(ClinicObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_center_dialog__form.find(':submit').removeClass('disabled')
				return
			}
			create_center_dialog__form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.clinicId = null
			create_center_dialog__form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateCenterDialog__Centers:updated', ClinicObject)

			return
		}
		// create
		try 
		{
			var res = await CLINIC_MODEL.store(ClinicObject)
		} 
		catch (error) 
		{
			create_center_dialog__form.find(':submit').removeClass('disabled')

			return
		}

		create_center_dialog__form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_center_dialog__form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateCenterDialog__Centers:created', ClinicObject)
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.clinicId) ) return

		observeElement( create_center_dialog__form__wilaya_select[0], mutation =>
		{
			setOptionSelected(create_center_dialog__form__wilaya_select, options.clinicState, true)
		})

		observeElement( create_center_dialog__form__baladia_input[0], mutation =>
		{
			setOptionSelected(create_center_dialog__form__baladia_input, options.clinicBaladia)
		})

		create_center_dialog__form__address_input.val(options.clinicAddress)
		create_center_dialog__form__name_input.val(options.clinicName)
		create_center_dialog__form__phone_input.val(options.clinicPhone)
		create_center_dialog__form__email_input.val(options.clinicEmail)

	}
}
// CreateCenterDialog__CentralAdmin
CreateCenterDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_center_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_center)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-center-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const create_center_dialog__form = dialog_container.find('#create_center_dialog__form')
	const create_center_dialog__form__name_input = dialog_container.find('#create_center_dialog__form__name_input')
	const create_center_dialog__form__phone_input = dialog_container.find('#create_center_dialog__form__phone_input')
	const create_center_dialog__form__email_input = dialog_container.find('#create_center_dialog__form__email_input')
	const create_center_dialog__form__wilaya_select = dialog_container.find('#create_center_dialog__form__wilaya_select')
	const create_center_dialog__form__baladia_input = dialog_container.find('#create_center_dialog__form__baladia_input')
	const create_center_dialog__form__address_input = dialog_container.find('#create_center_dialog__form__address_input')

	var ClinicObject = {}

	// submit
	create_center_dialog__form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check required inputs
		if ( isNull(create_center_dialog__form__name_input.val()) || isNull(create_center_dialog__form__phone_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		ClinicObject.clinicName = create_center_dialog__form__name_input.val();
		ClinicObject.clinicPhone  = create_center_dialog__form__phone_input.val();
		ClinicObject.clinicState  = create_center_dialog__form__wilaya_select.find(':selected').val();
		ClinicObject.clinicBaladia = create_center_dialog__form__baladia_input.val();
		ClinicObject.clinicAddress = create_center_dialog__form__address_input.val();
		ClinicObject.clinicEmail = create_center_dialog__form__email_input.val();

		create_center_dialog__form.find(':submit').addClass('disabled')
		// update
		if ( !isNull(options.clinicId) )
		{
			ClinicObject.clinicId = options.clinicId
			try 
			{
				var res = await CLINIC_MODEL.update(ClinicObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_center_dialog__form.find(':submit').removeClass('disabled')
				return
			}
			create_center_dialog__form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.clinicId = null
			create_center_dialog__form[0].reset()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateCenterDialog__CentralAdmin:updated', ClinicObject)

			return
		}
		// create
		try 
		{
			var res = await CLINIC_MODEL.store(ClinicObject)
		} 
		catch (error) 
		{
			create_center_dialog__form.find(':submit').removeClass('disabled')

			return
		}

		create_center_dialog__form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_center_dialog__form[0].reset()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateCenterDialog__CentralAdmin:created', ClinicObject)
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.clinicId) ) return

		observeElement( create_center_dialog__form__wilaya_select[0], mutation =>
		{
			setOptionSelected(create_center_dialog__form__wilaya_select, options.clinicState, true)
		})

		observeElement( create_center_dialog__form__baladia_input[0], mutation =>
		{
			setOptionSelected(create_center_dialog__form__baladia_input, options.clinicBaladia)
		})

		create_center_dialog__form__address_input.val(options.clinicAddress)
		create_center_dialog__form__name_input.val(options.clinicName)
		create_center_dialog__form__phone_input.val(options.clinicPhone)
		create_center_dialog__form__email_input.val(options.clinicEmail)

	}
}
// CreateVideoDialog__CentralAdmin
CreateVideoDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_video_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_video)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-video-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const create_video_dialog__form = dialog_container.find('#create_video_dialog__form')
	const create_video_dialog__form__title_input = dialog_container.find('#create_video_dialog__form__title_input')
	const create_video_dialog__form__description_input = dialog_container.find('#create_video_dialog__form__description_input')
	const create_video_dialog__form__url_input = dialog_container.find('#create_video_dialog__form__url_input')
	const create_video_dialog__form__preview_iframe = dialog_container.find('#create_video_dialog__form__preview_iframe')

	var VideoObject = {}

	// submit
	create_video_dialog__form.off('submit').on('submit', async e =>
	{
		e.preventDefault()

		// check required inputs
		if ( isNull(create_video_dialog__form__title_input.val()) || isNull(create_video_dialog__form__url_input.val()) )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		VideoObject.employee_id = USER_CONFIG.employee_id
		VideoObject.video_url = create_video_dialog__form__url_input.val()
		VideoObject.video_title = create_video_dialog__form__title_input.val()
		VideoObject.video_desc = create_video_dialog__form__description_input.val()

		create_video_dialog__form.find(':submit').addClass('disabled')
		// update
		if ( !isNull(options.video_id) )
		{
			VideoObject.video_id = options.video_id
			try 
			{
				var res = await VIDEO_MODEL.update(VideoObject) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_video_dialog__form.find(':submit').removeClass('disabled')
				return
			}
			create_video_dialog__form.find(':submit').removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			options.video_id = null
			create_video_dialog__form[0].reset()
			clearPreview()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateVideoDialog:video-updated', VideoObject)

			return
		}
		// create
		try 
		{
			var res = await VIDEO_MODEL.store(VideoObject)
		} 
		catch (error) 
		{
			create_video_dialog__form.find(':submit').removeClass('disabled')

			return
		}

		create_video_dialog__form.find(':submit').removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		create_video_dialog__form[0].reset()
		clearPreview()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateVideoDialog:video-created', VideoObject)
	})
	// Video url
	create_video_dialog__form__url_input.off('input').on('input', e =>
	{
		previewVideo()
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.video_id) ) return

		create_video_dialog__form__url_input.val( createYoutubeVideoURLFromId( extractYouTubeVideoId(options.video_url) ) ).trigger('input')
		create_video_dialog__form__title_input.val(options.video_title)
		create_video_dialog__form__description_input.val(options.video_desc)

	}
	// preview video
	function previewVideo()
	{
		// check if valid youtube video url
		if ( !isValidYouTubeURL( create_video_dialog__form__url_input.val() ) )
		{
			create_video_dialog__form__url_input.val(null)
			clearPreview()
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.invalid_youtube_video_url, '')
			return
		}

		var url = 'https://www.youtube.com/embed/'+extractYTVideoId( create_video_dialog__form__url_input.val() )+'?rel=0'

		create_video_dialog__form__url_input.val(url)

		SectionLoader(create_video_dialog__form__preview_iframe.parent())
		
		create_video_dialog__form__preview_iframe.attr('src', url)
		.off('load').on('load', e =>
		{
			SectionLoader(create_video_dialog__form__preview_iframe.parent(), '')
		})
	}
	// clear preview
	function clearPreview()
	{
		create_video_dialog__form__preview_iframe.attr('src', '')
	}
}
// CreateHealthyKitchenPostDialog__CentralAdmin
CreateHealthyKitchenPostDialog__CentralAdmin = async (options = {}) =>
{
	const defaultOptions = {
		rootId: 'create_healthy_kitchen_post_dialog',
		// title: FUI_DISPLAY_LANG.views.pages.global.create_appointment,
		html: '',
	}

	options = {...defaultOptions, ...options}

	const dialog = new WindowDialog(options)
	dialog.setTitle(FUI_DISPLAY_LANG.views.pages.global.create_post)

	const dialog_container = dialog.getContainer()

	var html = await getPage('../views/dialogs/central_admin/create-healthy-kitchen-post-dialog.ejs')
	dialog.setHTML(html)
	// dispatch_onNewAjaxContentLoaded()
	dispatch_onNewAjaxContentLoaded()

	const create_healthy_kitchen_post_dialog__form = dialog_container.find('#create_healthy_kitchen_post_dialog__form')
	const create_healthy_kitchen_post_dialog__form__submit = dialog_container.find('#create_healthy_kitchen_post_dialog__form__submit')
	const create_healthy_kitchen_post_dialog__form__name_input = dialog_container.find('#create_healthy_kitchen_post_dialog__form__name_input')
	const create_healthy_kitchen_post_dialog__form__description_input = dialog_container.find('#create_healthy_kitchen_post_dialog__form__description_input')
	const create_healthy_kitchen_post_dialog__form__file_input = dialog_container.find('#create_healthy_kitchen_post_dialog__form__file_input')
	const create_healthy_kitchen_post_dialog__form__image_preview = dialog_container.find('#create_healthy_kitchen_post_dialog__form__image_preview')
	const create_healthy_kitchen_post_dialog__form__ingredients_list = dialog_container.find('#create_healthy_kitchen_post_dialog__form__ingredients_list')
	const create_healthy_kitchen_post_dialog__form__ingredient_input = dialog_container.find('#create_healthy_kitchen_post_dialog__form__ingredient_input')
	const create_healthy_kitchen_post_dialog__form__preparation_steps_list = dialog_container.find('#create_healthy_kitchen_post_dialog__form__preparation_steps_list')
	const create_healthy_kitchen_post_dialog__form__preparation_step_input = dialog_container.find('#create_healthy_kitchen_post_dialog__form__preparation_step_input')

	var PostObject = new FormData

	// submit
	create_healthy_kitchen_post_dialog__form__submit.off('click').on('click', async e =>
	{
		e.preventDefault()

		// check required inputs
		if ( isNull(create_healthy_kitchen_post_dialog__form__name_input.val()) 
			|| ingredients().length == 0 || preparationSteps().length == 0 )
		{
			CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error_empty_input, '')
			return
		}

		PostObject.append('RequestObject', JSON.stringify({
			id: options.id,
			name: create_healthy_kitchen_post_dialog__form__name_input.val(),
			description: create_healthy_kitchen_post_dialog__form__description_input.val(),
			ingredients: ingredients(),
			preparation_steps: preparationSteps()
		}) )

		if ( create_healthy_kitchen_post_dialog__form__file_input[0].files.length > 0 ) 
		{
			PostObject.append('image', create_healthy_kitchen_post_dialog__form__file_input[0].files[0] )
		}

		create_healthy_kitchen_post_dialog__form__submit.addClass('disabled')
		create_healthy_kitchen_post_dialog__form__file_input.next().removeClass('d-none')
		// update
		if ( !isNull(options.id) )
		{
			try 
			{
				var res = await HEALTHY_KITCHEN_POST_MODEL.update(PostObject, progress => {
					var percent = progress.percentComplete.toFixed(2)
					// 
					create_healthy_kitchen_post_dialog__form__file_input.next().find('.progress-bar').css('width', percent+'%').text(percent+'%')
				}) 	
				
			} 
			catch (error) 
			{
				console.error(error)
				create_healthy_kitchen_post_dialog__form__submit.removeClass('disabled')
				return
			}
			create_healthy_kitchen_post_dialog__form__submit.removeClass('disabled')
			CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

			// reset
			resetFields()
			// dispatch_onNewAjaxContentLoaded()
			dispatch_onNewAjaxContentLoaded()
			//
			dispatchCustomEvent('CreateHealthyKitchenPostDialog:post-updated', PostObject)

			return
		}
		// create
		try 
		{
			var res = await HEALTHY_KITCHEN_POST_MODEL.store(PostObject, progress => {
				var percent = progress.percentComplete.toFixed(2)
				// 
				create_healthy_kitchen_post_dialog__form__file_input.next().find('.progress-bar').css('width', percent+'%').text(percent+'%')
			})
		} 
		catch (error) 
		{
			create_healthy_kitchen_post_dialog__form__submit.removeClass('disabled')

			return
		}

		create_healthy_kitchen_post_dialog__form__submit.removeClass('disabled')
		CreateToast('PS', res.message, '')

		if ( res.code == 404 ) return
		// reset
		resetFields()
		// dispatch_onNewAjaxContentLoaded()
		dispatch_onNewAjaxContentLoaded()
		//
		dispatchCustomEvent('CreateHealthyKitchenPostDialog:post-created', PostObject)
	})
	// select file
	create_healthy_kitchen_post_dialog__form__file_input.off('select-file-component:file-selected').on('select-file-component:file-selected', e =>
	{
		const detail = e.originalEvent.detail
		const files = detail.files

		previewImage(files[0].path)
	})
	// add ingredients
	create_healthy_kitchen_post_dialog__form__ingredient_input.off('keydown').on('keydown', e =>
	{
		if ( e.key == 'Enter' )
		{
			addIngredient({
				name: create_healthy_kitchen_post_dialog__form__ingredient_input.val().trim()
			})
			
			create_healthy_kitchen_post_dialog__form__ingredient_input.val(null)
		}
	})
	// add preparation step
	create_healthy_kitchen_post_dialog__form__preparation_step_input.off('keydown').on('keydown', e =>
	{
		if ( e.key == 'Enter' )
		{
			addPreparationStep({
				name: create_healthy_kitchen_post_dialog__form__preparation_step_input.val().trim()
			})
			
			create_healthy_kitchen_post_dialog__form__preparation_step_input.val(null)
		}
	})
	// display one
	displayOne()
	function displayOne()
	{
		if ( isNull(options.id) ) return

		create_healthy_kitchen_post_dialog__form__name_input.val( options.name )
		create_healthy_kitchen_post_dialog__form__description_input.val(options.description)
		
		if ( options.image )
		{
			previewImage(options.image.url)
		}
		// append ingredients
		if ( options.ingredients )
		{
			for (let i = 0; i < options.ingredients.length; i++) 
			{
				const ingredient = options.ingredients[i]
				
				addIngredient(ingredient)
			}
		}
		// append preparation steps
		if ( options.preparation_steps )
		{
			for (let i = 0; i < options.preparation_steps.length; i++) 
			{
				const step = options.preparation_steps[i]
				
				addPreparationStep(step)
			}
		}
	}
	// preview image
	function previewImage(url)
	{
		create_healthy_kitchen_post_dialog__form__image_preview.attr('src', url )
	}
	// clear preview
	function clearPreview()
	{
		create_healthy_kitchen_post_dialog__form__image_preview.attr('src', '')
		dispatch_onNewAjaxContentLoaded()
	}
	// add Ingredient
	function addIngredient(ingredient = {})
	{
		const html = `<div class="form-field-01 js_deletable_list_item mb-2" data-role="item" data-name="${ingredient.name}">
						<div class="form-field-icon-holder text-color-27 width-50px">
							<i class="fas fa-utensil-spoon"></i>
						</div>
						<div class="form-field-input-holder">
							<div class="form-field-input d-flex align-items-center">${ingredient.name}</div>
							<div class="d-flex flex-shrink-0 justify-content-center align-items-center width-50px h-100 js_deletable_list_item__delete_button cursor-pointer rounded">
								<span class="no-pointer"><i class="fas fa-times"></i></span>
							</div>
						</div>
					</div>`

		create_healthy_kitchen_post_dialog__form__ingredients_list.append(html)
		dispatch_onNewAjaxContentLoaded()
	}
	// add preparation step
	function addPreparationStep(step = {})
	{
		const html = `<div class="form-field-01 js_deletable_list_item mb-2" data-role="item" data-name="${step.name}">
						<div class="form-field-icon-holder text-color-27 width-50px">
							<i class="fas fa-walking"></i>
						</div>
						<div class="form-field-input-holder">
							<div class="form-field-input d-flex align-items-center">${step.name}</div>
							<div class="d-flex flex-shrink-0 justify-content-center align-items-center width-50px h-100 js_deletable_list_item__delete_button cursor-pointer rounded">
								<span class="no-pointer"><i class="fas fa-times"></i></span>
							</div>
						</div>
					</div>`

		create_healthy_kitchen_post_dialog__form__preparation_steps_list.append(html)
		dispatch_onNewAjaxContentLoaded()
	}
	// ingredient items
	function ingredients()
	{
		var list = []

		var items = create_healthy_kitchen_post_dialog__form__ingredients_list.find('[data-role="item"]')
		for (let i = 0; i < items.length; i++) 
		{
			const item = $(items[i])
			list.push({
				name: item.data('name')
			})
		}

		return list
	}
	// clear ingredients
	function clearIngredients()
	{
		create_healthy_kitchen_post_dialog__form__ingredients_list.html('')
	}
	// preparation step
	function preparationSteps()
	{
		var list = []

		var items = create_healthy_kitchen_post_dialog__form__preparation_steps_list.find('[data-role="item"]')
		for (let i = 0; i < items.length; i++) 
		{
			const item = $(items[i])
			list.push({
				name: item.data('name')
			})
		}

		return list
	}
	// clear ingredients
	function clearPreparationSteps()
	{
		create_healthy_kitchen_post_dialog__form__preparation_steps_list.html('')
	}
	// reset fields
	function resetFields()
	{
		options.id = null
		PostObject = new FormData()

		clearIngredients()
		clearPreparationSteps()
		clearPreview()
		create_healthy_kitchen_post_dialog__form__name_input.val( null )
		create_healthy_kitchen_post_dialog__form__description_input.val(null)
		create_healthy_kitchen_post_dialog__form__file_input.val(null)
		create_healthy_kitchen_post_dialog__form__file_input.next().addClass('d-none')
	}
}

//
// CreateChatGroupConversationDialog
CreateChatGroupConversationDialog = async (options = {}) =>
{
	var selector = 'chat_group_conversation_container_'+options.conversationUuid
	var dialog_container = $('#'+selector);
	var parentHTML = `<div class="no-pointer d-flex justify-content-center align-items-center position-fixed bottom-0 start-0 w-100 overflow-x-auto" id="chat_private_conversation_containers_parent" style="z-index:1000; max-width:100%;"></div>`
	var chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	var html = await getPage('../views/dialogs/chat-private-conversation-dialog.ejs')

	var ChatGroupConversationWorker = null

	var ChatObject = {
		receiver: options,
		media: [],
		body: '',
	}

	var isScrolledToBottom = true
	
	if ( !chat_private_conversation_containers_parent[0] )
	{
		$('body').prepend(parentHTML)
		chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	}
	
	if ( !dialog_container[0] )
	{
		var element = createFakeElement('chat_private_conversation_container_FAKE_CONTAINER', html)
		.find('.chat-private-conversation-dialog')
		element.attr('id', selector).css('margin-left', '10px')
		removeFakeElement('chat_private_conversation_container_FAKE_CONTAINER')
		chat_private_conversation_containers_parent.append(element[0].outerHTML)
		dialog_container = $('#'+selector);
		// dispatch event for new content on page
		dispatch_onNewAjaxContentLoaded()
	}
	
	show()
	
	const dialog_close_button = dialog_container.find('.dialog_close_button')
	const chat_private_conversation_avatar = dialog_container.find('.chat_private_conversation_avatar')
	const chat_private_conversation_user_name = dialog_container.find('.chat_private_conversation_user_name')

	const chat_private_conversation_dialog_body = dialog_container.find('.chat_private_conversation_dialog_body')
	const chat_private_conversation_dialog_body_contents = dialog_container.find('.chat_private_conversation_dialog_body_contents')
	const chat_private_conversation_dialog_body_empty_message  = dialog_container.find('.chat_private_conversation_dialog_body_empty_message')
	const chat_private_conversation_dialog_emojy_button = dialog_container.find('.chat_private_conversation_dialog_emojy_button')
	const chat_private_conversation_dialog_input = dialog_container.find('.chat_private_conversation_dialog_input')
	const chat_private_conversation_dialog_add_image_button = dialog_container.find('.chat_private_conversation_dialog_add_image_button')
	const chat_private_conversation_dialog_media_preview_gallery = dialog_container.find('.chat_private_conversation_dialog_media_preview_gallery')
	const chat_private_conversation_dialog_emoji_picker_container = dialog_container.find('.chat_private_conversation_dialog_emoji_picker_container')
	
	chat_private_conversation_avatar.attr('src', imgFallback(options.cover, '../assets/img/utils/placeholder.png') )
	chat_private_conversation_user_name.text(options.name)

	const pickmePicker = new PickmePicker({
		rootElement: chat_private_conversation_dialog_emoji_picker_container,
		trigger: chat_private_conversation_dialog_emojy_button
	})

	// send message
	chat_private_conversation_dialog_input.trigger('focus')
	chat_private_conversation_dialog_input.off('keyup').on('keyup', e =>
	{
		if ( e.key == 'Enter' && !e.shiftKey )
		{
			sendMessage()
		}
	})
	// on message
	if ( ChatGroupConversationWorker )
	{
		ChatGroupConversationWorker.onmessage = (e) =>
		{
			const messageData = e.data.data
			
			displayMessages(messageData, () =>
			{
				if ( isScrolledToBottom )
				{
					chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
					// isScrolledToBottom = false
				}
			})
			// ChatGroupConversationWorker.terminate()
		}	
	}
	// emojy-selected
	chat_private_conversation_dialog_emoji_picker_container.off('emojy-selected')
	.on('emojy-selected', e =>
	{
		var emojy = e.originalEvent.detail.emojy

		chat_private_conversation_dialog_input.append(emojy.img)
		setCursorAtEnd(chat_private_conversation_dialog_input)
	})
	// add media
	chat_private_conversation_dialog_add_image_button.off('click').on('click', e =>
	{
		chat_private_conversation_dialog_add_image_button.next().trigger('click')
	})
	// select media
	chat_private_conversation_dialog_add_image_button.next().off('change').on('change', async e =>
	{
		var target = chat_private_conversation_dialog_add_image_button.next()
		if ( target[0].files.length == 0 ) return

		const files = target[0].files

		for (let i = 0; i < files.length; i++) 
		{
			const file = files[i]
			const dataURL = await imageToDataURL(file)
			
			ChatObject.media.push({
				url: dataURL
			})
		}
		previewMediaGallery()
	})
	// close
	dialog_close_button.off('click').on('click', e =>
	{
		clear()
	})
	// chat_private_conversation_dialog_body_contents
	chat_private_conversation_dialog_body_contents.off('scroll').on('scroll', e =>
	{
		isScrolledToBottom = isMessageAreaScrollHeightReached()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
		launchWorker()

		ChatGroupConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: '',
			chat: ChatObject,
		})
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}

	function clear()
	{
		terminateWorker()
		dialog_container.remove();
	}

	// launch worker
	function launchWorker()
	{
		ChatGroupConversationWorker = new Worker('../assets/js/workers/ChatGroupConversationWorker.js')
	}
	// terminate worker
	function terminateWorker()
	{
		if ( !ChatGroupConversationWorker ) return

		ChatGroupConversationWorker.terminate()
		ChatGroupConversationWorker = null
	}
	// reset form
	function resetFields()
	{
		chat_private_conversation_dialog_input.html('').trigger('focus')
		ChatObject.media = []
		ChatObject.body = ''
		clearMediaGallery()
	}
	// append message
	function sendMessage()
	{	
		ChatObject.body = chat_private_conversation_dialog_input.html()

		ChatGroupConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: 'send',
			chat: ChatObject,
		})

		chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
		resetFields()
	}
	// display messages
	function displayMessages(data, callback)
	{
		if ( chat_private_conversation_dialog_body_empty_message[0] )
		{
			chat_private_conversation_dialog_body_empty_message.remove()
			chat_private_conversation_dialog_body.removeClass('align-items-center')
			.css('flex-direction', 'column-inverse')
			chat_private_conversation_dialog_body_contents.removeClass('d-none')
			.addClass('d-flex')
		}
		var dataHTML = ''

		$.each(data, (k,v) =>
		{
			var message_media_html = ''

			if ( v.sender_id == USER_CONFIG.employee_id && v.sender_type == 'employees' )
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-sent">
								<div class="row">
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${v.body}
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
			else
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-received">
								<div class="row">
									<div class="col-2" style="max-width: 11%;">
										<img src="${ imgFallback(v.patientAvatar) }" class="width-28px height-28px rounded-circle" alt="">
									</div>
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${ imgFallback(v.receiver_name) }
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
		})

		chat_private_conversation_dialog_body_contents.html(dataHTML)
		// dispatch_onNewAjaxContentLoaded
        dispatch_onNewAjaxContentLoaded()

		if ( typeof callback == 'function' )
		{
			callback(data)
		}
	}
	// clear media gallery
	function clearMediaGallery()
	{
		chat_private_conversation_dialog_media_preview_gallery.html('').addClass('d-none')
		chat_private_conversation_dialog_add_image_button.next().val(null)
		ChatObject.media = []
	}
	// preview media gallery
	function previewMediaGallery()
	{
		var html = ''

		chat_private_conversation_dialog_media_preview_gallery.html(`
			<div class="has-text-left">
				<button class="close-button-sm chat_private_conversation_dialog_media_preview_gallery_close_button">
					<i class="xfb xfb-close-sm-thin"></i>    
				</button>
			</div>
		`)
		.removeClass('d-none')

		for (let i = 0; i < ChatObject.media.length; i++) 
		{
			const media = ChatObject.media[i]
			
			html += `<figure class="gallery-grid-item m-0" style="flex: 25%;">
						<img src="${media.url}" class="gallery-grid-img js_img_previewable">
					</figure>`
		}

		chat_private_conversation_dialog_media_preview_gallery.append(html)

		const chat_private_conversation_dialog_media_preview_gallery_close_button = chat_private_conversation_dialog_media_preview_gallery.find('.chat_private_conversation_dialog_media_preview_gallery_close_button')

		chat_private_conversation_dialog_media_preview_gallery_close_button.off('click').on('click', e =>
		{
			clearMediaGallery()
		})
	}
	// check content area scroll height reached
	function isMessageAreaScrollHeightReached()
	{
		return chat_private_conversation_dialog_body_contents[0].scrollTop + chat_private_conversation_dialog_body_contents[0].clientHeight >= chat_private_conversation_dialog_body_contents[0].scrollHeight
	}
}
// CreateChatPrivateConversationDialog
CreateChatPrivateConversationDialog = async (options = {}) =>
{
	var selector = 'chat_private_conversation_container_'+options.conversationUuid
	var dialog_container = $('#'+selector);
	var parentHTML = `<div class="no-pointer d-flex justify-content-center align-items-center position-fixed bottom-0 start-0 w-100 overflow-x-auto" id="chat_private_conversation_containers_parent" style="z-index:1000; max-width:100%;"></div>`
	var chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	var html = await getPage('../views/dialogs/chat-private-conversation-dialog.ejs')

	var ChatPrivateConversationWorker = null

	var ChatObject = {
		receiver: options,
		media: [],
		body: '',
	}

	var isScrolledToBottom = true
	
	if ( !chat_private_conversation_containers_parent[0] )
	{
		$('body').prepend(parentHTML)
		chat_private_conversation_containers_parent = $('#chat_private_conversation_containers_parent')
	}
	
	if ( !dialog_container[0] )
	{
		var element = createFakeElement('chat_private_conversation_container_FAKE_CONTAINER', html)
		.find('.chat-private-conversation-dialog')
		element.attr('id', selector).css('margin-left', '10px')
		removeFakeElement('chat_private_conversation_container_FAKE_CONTAINER')
		chat_private_conversation_containers_parent.append(element[0].outerHTML)
		dialog_container = $('#'+selector);
		// dispatch event for new content on page
		dispatch_onNewAjaxContentLoaded()
	}
	
	show()
	
	const dialog_close_button = dialog_container.find('.dialog_close_button')
	const chat_private_conversation_avatar = dialog_container.find('.chat_private_conversation_avatar')
	const chat_private_conversation_user_name = dialog_container.find('.chat_private_conversation_user_name')

	const chat_private_conversation_dialog_body = dialog_container.find('.chat_private_conversation_dialog_body')
	const chat_private_conversation_dialog_body_contents = dialog_container.find('.chat_private_conversation_dialog_body_contents')
	const chat_private_conversation_dialog_body_empty_message  = dialog_container.find('.chat_private_conversation_dialog_body_empty_message')
	const chat_private_conversation_dialog_emojy_button = dialog_container.find('.chat_private_conversation_dialog_emojy_button')
	const chat_private_conversation_dialog_input = dialog_container.find('.chat_private_conversation_dialog_input')
	const chat_private_conversation_dialog_add_image_button = dialog_container.find('.chat_private_conversation_dialog_add_image_button')
	const chat_private_conversation_dialog_media_preview_gallery = dialog_container.find('.chat_private_conversation_dialog_media_preview_gallery')
	const chat_private_conversation_dialog_emoji_picker_container = dialog_container.find('.chat_private_conversation_dialog_emoji_picker_container')
	
	chat_private_conversation_avatar.attr('src', imgFallback(options.patientAvatar, '../assets/img/utils/user.png') )
	chat_private_conversation_user_name.text(options.patientName)

	const pickmePicker = new PickmePicker({
		rootElement: chat_private_conversation_dialog_emoji_picker_container,
		trigger: chat_private_conversation_dialog_emojy_button
	})

	// send message
	chat_private_conversation_dialog_input.trigger('focus')
	chat_private_conversation_dialog_input.off('keyup').on('keyup', e =>
	{
		if ( e.key == 'Enter' && !e.shiftKey )
		{
			sendMessage()
		}
	})
	// on message
	if ( ChatPrivateConversationWorker )
	{
		ChatPrivateConversationWorker.onmessage = (e) =>
		{
			const messageData = e.data.data
			
			displayMessages(messageData, () =>
			{
				if ( isScrolledToBottom )
				{
					chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
					// isScrolledToBottom = false
				}
			})
			// ChatPrivateConversationWorker.terminate()
		}	
	}
	// emojy-selected
	chat_private_conversation_dialog_emoji_picker_container.off('emojy-selected')
	.on('emojy-selected', e =>
	{
		var emojy = e.originalEvent.detail.emojy

		chat_private_conversation_dialog_input.append(emojy.img)
		setCursorAtEnd(chat_private_conversation_dialog_input)
	})
	// add media
	chat_private_conversation_dialog_add_image_button.off('click').on('click', e =>
	{
		chat_private_conversation_dialog_add_image_button.next().trigger('click')
	})
	// select media
	chat_private_conversation_dialog_add_image_button.next().off('change').on('change', async e =>
	{
		var target = chat_private_conversation_dialog_add_image_button.next()
		if ( target[0].files.length == 0 ) return

		const files = target[0].files

		for (let i = 0; i < files.length; i++) 
		{
			const file = files[i]
			const dataURL = await imageToDataURL(file)
			
			ChatObject.media.push({
				url: dataURL
			})
		}

		previewMediaGallery()
	})
	// close
	dialog_close_button.off('click').on('click', e =>
	{
		clear()
	})
	// chat_private_conversation_dialog_body_contents
	chat_private_conversation_dialog_body_contents.off('scroll').on('scroll', e =>
	{
		isScrolledToBottom = isMessageAreaScrollHeightReached()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
		launchWorker()

		ChatPrivateConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: '',
			chat: ChatObject,
		})
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}

	function clear()
	{
		terminateWorker()
		dialog_container.remove();
	}

	// launch worker
	function launchWorker()
	{
		ChatPrivateConversationWorker = new Worker('../assets/js/workers/ChatPrivateConversationWorker.js')
	}
	// terminate worker
	function terminateWorker()
	{
		if ( !ChatPrivateConversationWorker ) return

		ChatPrivateConversationWorker.terminate()
		ChatPrivateConversationWorker = null
	}
	// reset form
	function resetFields()
	{
		chat_private_conversation_dialog_input.html('').trigger('focus')
		ChatObject.media = []
		ChatObject.body = ''
		clearMediaGallery()
	}
	// append message
	function sendMessage()
	{	
		ChatObject.body = chat_private_conversation_dialog_input.html()

		ChatPrivateConversationWorker.postMessage({
			USER_CONFIG: USER_CONFIG,
			DEFAULT_INI_SETTINGS: DEFAULT_INI_SETTINGS,
			operation: 'send',
			chat: ChatObject,
		})

		chat_private_conversation_dialog_body_contents.scrollTop( chat_private_conversation_dialog_body_contents[0].scrollHeight )
		resetFields()
	}
	// display messages
	function displayMessages(data, callback)
	{
		if ( chat_private_conversation_dialog_body_empty_message[0] )
		{
			chat_private_conversation_dialog_body_empty_message.remove()
			chat_private_conversation_dialog_body.removeClass('align-items-center')
			.css('flex-direction', 'column-inverse')
			chat_private_conversation_dialog_body_contents.removeClass('d-none')
			.addClass('d-flex')
		}
		var dataHTML = ''

		$.each(data, (k,v) =>
		{
			var message_media_html = ''

			if ( v.sender_id == USER_CONFIG.employee_id && v.sender_type == 'employees' )
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-sent">
								<div class="row">
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${v.body}
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
			else
			{
				if ( v.media )
				{
					message_media_html = '<div class="gallery-grid mt-2">'
					for (let i = 0; i < v.media.length; i++) 
					{
						const media = v.media[i]
						
						message_media_html += ` <figure class="gallery-grid-item m-0" style="flex: 35%;">
													<img src="${media.url}" class="gallery-grid-img js_img_previewable">
												</figure>`
					}
					message_media_html+= '</div>'
				}

				dataHTML += `<div class="chat-private-conversation-message message-received">
								<div class="row">
									<div class="col-2" style="max-width: 11%;">
										<img src="${ imgFallback(v.patientAvatar) }" class="width-28px height-28px rounded-circle" alt="">
									</div>
									<div class="col">
										<div class="chat-private-conversation-message-content">
											${ imgFallback(v.receiver_name) }
										</div>
									</div>
								</div>
								${message_media_html}
							</div>`
				// dataHTML += message_media_html
			}
		})

		chat_private_conversation_dialog_body_contents.html(dataHTML)
		// dispatch_onNewAjaxContentLoaded
        dispatch_onNewAjaxContentLoaded()

		if ( typeof callback == 'function' )
		{
			callback(data)
		}
	}
	// clear media gallery
	function clearMediaGallery()
	{
		chat_private_conversation_dialog_media_preview_gallery.html('').addClass('d-none')
		chat_private_conversation_dialog_add_image_button.next().val(null)
		ChatObject.media = []
	}
	// preview media gallery
	function previewMediaGallery()
	{
		var html = ''

		chat_private_conversation_dialog_media_preview_gallery.html(`
			<div class="has-text-left">
				<button class="close-button-sm chat_private_conversation_dialog_media_preview_gallery_close_button">
					<i class="xfb xfb-close-sm-thin"></i>    
				</button>
			</div>
		`)
		.removeClass('d-none')

		for (let i = 0; i < ChatObject.media.length; i++) 
		{
			const media = ChatObject.media[i]
			
			html += `<figure class="gallery-grid-item m-0" style="flex: 25%;">
						<img src="${media.url}" class="gallery-grid-img js_img_previewable">
					</figure>`
		}

		chat_private_conversation_dialog_media_preview_gallery.append(html)

		const chat_private_conversation_dialog_media_preview_gallery_close_button = chat_private_conversation_dialog_media_preview_gallery.find('.chat_private_conversation_dialog_media_preview_gallery_close_button')

		chat_private_conversation_dialog_media_preview_gallery_close_button.off('click').on('click', e =>
		{
			clearMediaGallery()
		})
	}
	// check content area scroll height reached
	function isMessageAreaScrollHeightReached()
	{
		return chat_private_conversation_dialog_body_contents[0].scrollTop + chat_private_conversation_dialog_body_contents[0].clientHeight >= chat_private_conversation_dialog_body_contents[0].scrollHeight
	}
}
// CreateGroupPostDialog
CreateChatGroupPostDialog = async (options = {}, callback = null) =>
{
	var selector = 'create_chat_group_post_dialog_container'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/create-chat-group-post-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
		// dispatch event for new content on page
		dispatch_onNewAjaxContentLoaded()
	}
	show()

	var dialog_close_button = dialog_container.find('.dialog_close_button')
	
	var user_name = dialog_container.find('#user_name')
	var user_phone = dialog_container.find('#user_phone')
	var group_status = dialog_container.find('#group_status')

	var chat_group_post_area_title_input = dialog_container.find('#chat_group_post_area_title_input')
	var chat_group_post_area_input = dialog_container.find('#chat_group_post_area_input')
	var chat_group_post_submit_button = dialog_container.find('#chat_group_post_submit_button')

	var chat_group_post_content_area = dialog_container.find('#chat_group_post_content_area')
	var fb_post_image_backgrounds_trigger_open = dialog_container.find('#fb_post_image_backgrounds_trigger_open')
	var fb_post_image_backgrounds_trigger_close = dialog_container.find('#fb_post_image_backgrounds_trigger_close')
	var fb_post_image_backgrounds_wrapper = dialog_container.find('#fb_post_image_backgrounds_wrapper')
	var fb_post_image_backgrounds_list = dialog_container.find('#fb_post_image_backgrounds_list')

	var emoji_picker_container_trigger_button = dialog_container.find('#emoji_picker_container_trigger_button')
	var emoji_picker_container = dialog_container.find('#emoji_picker_container')

	const pickmePicker = new PickmePicker({
		rootElement: emoji_picker_container,
		trigger: emoji_picker_container_trigger_button
	})

	const chat_group_post_select_media_component_ = dialog_container.find('#chat_group_post_select_media_component_')

	const chat_group_post_add_to_your_post_ = dialog_container.find('#chat_group_post_add_to_your_post_')
	// const js_add_to_your_post_control_action__add_media = chat_group_post_add_to_your_post_.find('.js_add_to_your_post_control_action__add_media')

	var ChatGroupPostObject = new FormData()

	// display info
	user_name.text(USER_CONFIG.employee_name)
	user_phone.text(USER_CONFIG.employee_phone)
	
	group_status.find('#group_status_icon').html( (options.group_type == 'public') ? `<i class="xfb xfb-globe pointer" title="${ FUI_DISPLAY_LANG.views.pages.global.chat_group_types[options.group_type] }"></i>` : `<i class="xfb xfb-lock pointer" title="${ FUI_DISPLAY_LANG.views.pages.global.chat_group_types[options.group_type] }"></i>` )
	group_status.find('#group_status_text').text( FUI_DISPLAY_LANG.views.pages.global.chat_group_types[options.group_type] )

	var groupPostMedia = []

	// Fill fields if it is a post editing
	fillFields()
	// close
	dialog_close_button.off('click').on('click', e =>
	{
		clear()
	})

	// chat_group_post_area_input
	chat_group_post_area_input.off('keyup').on('keyup', e =>
	{
		removeBackground()
		if ( checkContentEditableEmpty(chat_group_post_area_input) ) chat_group_post_submit_button.addClass('disabled')
		else chat_group_post_submit_button.removeClass('disabled')
	})

	// submit
	chat_group_post_submit_button.off('click').on('click', async e => 
	{

		chat_group_post_submit_button.addClass('disabled')
		ChatGroupPostObject.append('name', chat_group_post_area_title_input.val())
		ChatGroupPostObject.append('body', chat_group_post_area_input.html())
		if ( options.css ) ChatGroupPostObject.append('css', JSON.stringify(options.css) )
		ChatGroupPostObject.append('group_id', options.group_id)
		ChatGroupPostObject.append('group_name', options.group_name)
		ChatGroupPostObject.append('employee_id', USER_CONFIG.employee_id)
		ChatGroupPostObject.append('employee_name', USER_CONFIG.employee_name)
		ChatGroupPostObject.append('employee_phone', USER_CONFIG.employee_phone)
		ChatGroupPostObject.append('employee_type_id', USER_CONFIG.employee_type_id)
		ChatGroupPostObject.append('employee_type_code', USER_CONFIG.employee_type_code)

		if ( groupPostMedia.length > 0 )
		{
			groupPostMedia.forEach((v) =>
			{
				ChatGroupPostObject.append('media[]', v)
			})
		}
		// update
		if ( options.id )
		{
			ChatGroupPostObject.append('id', options.id)
			try {
				var res = await CHAT_MODEL.group_post_update(ChatGroupPostObject, progress =>
				{
					dispatchCustomEvent('select-media-component:on-upload-progress', {progress: progress}, chat_group_post_select_media_component_[0])
				})
			} catch (error) {
				console.error(error)
				chat_group_post_submit_button.removeClass('disabled')
				return
			}
	
			dispatchCustomEvent('select-media-component:on-upload-complete', {}, chat_group_post_select_media_component_[0])
	
			if ( res.code == 404 )
			{
				chat_group_post_submit_button.removeClass('disabled')
				return
			}
	
			chat_group_post_area_title_input.val(null)
			chat_group_post_area_input.html('').trigger('blur')
			ChatGroupPostObject = new FormData()
	
			if ( typeof callback == 'function' )
			{
				callback(res)
			}
	
			clear()
			return
		}

		// store
		try {
			var res = await CHAT_MODEL.group_post_store(ChatGroupPostObject, progress =>
			{
				dispatchCustomEvent('select-media-component:on-upload-progress', {progress: progress}, chat_group_post_select_media_component_[0])
			})
		} catch (error) {
			console.error(error)
			chat_group_post_submit_button.removeClass('disabled')
			return
		}

		dispatchCustomEvent('select-media-component:on-upload-complete', {}, chat_group_post_select_media_component_[0])

		if ( res.code == 404 )
		{
			chat_group_post_submit_button.removeClass('disabled')
			return
		}

		chat_group_post_area_title_input.val(null)
		chat_group_post_area_input.html('').trigger('blur')
		ChatGroupPostObject = new FormData()

		if ( typeof callback == 'function' )
		{
			callback(res)
		}

		clear()
	})

	// trigger open backgrounds
	fb_post_image_backgrounds_trigger_open.off('click').on('click', e =>
	{
		fb_post_image_backgrounds_wrapper.removeClass('d-none')
		fb_post_image_backgrounds_trigger_open.addClass('d-none')
	})
	// trigger close backgrounds
	fb_post_image_backgrounds_trigger_close.off('click').on('click', e =>
	{
		fb_post_image_backgrounds_wrapper.addClass('d-none')
		fb_post_image_backgrounds_trigger_open.removeClass('d-none')
	})
	// select background
	fb_post_image_backgrounds_list.off('click').on('click', e =>
	{
		var target = $(e.target)

		if ( target.data('role') == 'background' )
		{
			addBackground(target)
		}
	})

	// emojy-selected
	pickmePicker.off('emojy-selected')
	.on('emojy-selected', e =>
	{
		var emojy = e.originalEvent.detail.emojy


		// chat_group_post_area_input.append(emojy.img)
		chat_group_post_area_input.append(emojy.span)
		setCursorAtEnd(chat_group_post_area_input)
		chat_group_post_submit_button.removeClass('disabled')
	})

	// add-to-your-post:action
	$(document).off('add-to-your-post:action').on('add-to-your-post:action',async  e =>
	{
		var detail = e.originalEvent.detail
		
		if ( detail.id != chat_group_post_add_to_your_post_.attr('id') ) return

		if ( detail.action == 'add-media' )
		{
			chat_group_post_select_media_component_.removeClass('d-none')
		}
	})
	// media selected
	$(document).off('group-post-media-selected').on('group-post-media-selected',async  e =>
	{
		var detail = e.originalEvent.detail
		
		if ( detail.id != chat_group_post_select_media_component_.attr('id') ) return
		
		groupPostMedia = detail.files
		console.log(groupPostMedia)
		chat_group_post_submit_button.removeClass('disabled')
	})

	// media cleared
	$(document).off('group-post-media-cleared').on('group-post-media-cleared',async  e =>
	{
		var detail = e.originalEvent.detail
		
		if ( detail.id != chat_group_post_select_media_component_.attr('id') ) return

		groupPostMedia = []
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}

	function clear()
	{
		dialog_container.remove();
	}

	function addBackground(target)
	{
		if ( chat_group_post_area_input.text().trim().length > 140 ) return

		const BG_CLASSES = $.map( fb_post_image_backgrounds_list.children('li'), (element, k) =>
		{
			const li = $(element)
			const background = li.find('[data-role="background"]')
			if ( background[0] )
				return background.data('class')
		})

		// chat_group_post_content_area.css('background', target.css('background'))
		// .data('background-class', target.attr('class')).attr('data-background-class', target.attr('class'))
		// chat_group_post_content_area.removeClass(BG_CLASSES).addClass(target.data('class'))
		target.parent().addClass('active').siblings().removeClass('active')
		chat_group_post_area_input.removeClass(BG_CLASSES).removeClass('fs-16')
		.addClass(target.data('class')).addClass('fs-30 has-text-centered')

		chat_group_post_area_input.css('color', '#ffffff')

		if ( chat_group_post_area_input.hasClass('fb-post-bg-1') )
		{
			chat_group_post_area_input.css('color', '#000000')
			chat_group_post_area_input.removeClass('fs-30 has-text-centered').addClass('fs-16')
		}

		options.css = {
			classes: [target.data('class')],
		}
	}

	function removeBackground()
	{
		if ( chat_group_post_area_input.text().trim().length <= 140 ) return

		const BG_CLASSES = $.map( fb_post_image_backgrounds_list.children('li'), (element, k) =>
		{
			const li = $(element)
			const background = li.find('[data-role="background"]')
			if ( background[0] )
				return background.data('class')
		})

		var target = fb_post_image_backgrounds_list.find('[data-role="background"] .active')

		chat_group_post_area_input.removeClass(BG_CLASSES).removeClass('fs-30 has-text-centered')
		.addClass(target.data('class')).addClass('fs-16')
		.css('color', '#000000')
		target.parent().addClass('active').siblings().removeClass('active')

		options.css = {
			classes: [],
		}
	}

	function fillFields()
	{
		if ( !options.id ) return

		chat_group_post_submit_button.removeClass('disabled')

		chat_group_post_area_title_input.val( options.name )
		chat_group_post_area_input.html( options.body )

		const css = options.css

		if ( css )
		{
			const BG_CLASSES = $.map( fb_post_image_backgrounds_list.children('li'), (element, k) =>
			{
				const li = $(element)
				const background = li.find('[data-role="background"]')
				if ( background[0] )
					return background.data('class')
			})

			chat_group_post_area_input.removeClass(BG_CLASSES).removeClass('fs-16')
			.addClass( css.classes.join(' ') ).addClass('fs-30 has-text-centered')
			.css('color', '#ffffff')
		}
	}
}

// CreateImageSliderDialog
CreateImageSliderDialog = async (options = {}) =>
{
	var selector = 'create_image_slider_dialog'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/create-image-slider-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}
	show()

	var closeBTN = dialog_container.find('#closeBTN')
	var current_image_element = dialog_container.find('#current_image_element')
	var image_slider_nav_next = dialog_container.find('#image_slider_nav_next')
	var image_slider_nav_previous = dialog_container.find('#image_slider_nav_previous')

	var currentSlide = 0
	// show first image
	current_image_element.attr('src', options.images[currentSlide])

	// close
	closeBTN.off('click').on('click', e =>
	{
		hide()
	})
	// next
	image_slider_nav_next.off('click').on('click', e =>
	{
		nextSlide()
	})
	// previous
	image_slider_nav_previous.off('click').on('click', e =>
	{
		previousSlide()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}
	// next
	function nextSlide()
	{
		currentSlide++
		if ( currentSlide > options.images.length - 1 ) currentSlide = 0
		
		current_image_element.attr('src', options.images[currentSlide])
	}
	// previous
	function previousSlide()
	{
		currentSlide--
		if ( currentSlide < 0 ) currentSlide = options.images.length - 1

		current_image_element.attr('src', options.images[currentSlide])
	}
}
// MapDialog
MapDialog = async (options = {}) =>
{
	var selector = 'map_dialog'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/map-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}
	show()

	var closeBTN = dialog_container.find('#closeBTN')
	var mapElement = dialog_container.find('#mapElement')

	showInMap(mapElement[0], options)
	// close
	closeBTN.off('click').on('click', e =>
	{
		hide()
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}

	function hide()
	{
		dialog_container.addClass('d-none');
	}
}
// RequestDriverDialog
RequestDriverDialog = async () =>
{
	var selector = 'driver_job_dialog'
	var dialog_container = $('#'+selector);
	var html = await getPage('../views/dialogs/request-driver-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}
	// make draggable
	// dialog_container.draggable()
	show()

	var closeBTN = dialog_container.find('#closeBTN');

	var ERROR_BOX = dialog_container.find('#ERROR_BOX');

	var settings_form = dialog_container.find('#settings_form');
	var submit_button = settings_form.find(':submit')
	var from_place_input = settings_form.find('#from_place_input');
	var from_place_coords_input = settings_form.find('#from_place_coords_input');
	var from_place_phone_input = settings_form.find('#from_place_phone_input');
	var to_place_input = settings_form.find('#to_place_input');
	var to_place_coords_input = settings_form.find('#to_place_coords_input');
	var to_place_phone_input = settings_form.find('#to_place_phone_input');
	var description_input = settings_form.find('#description_input');
	var selected_date_input = settings_form.find('#selected_date_input');
	var selected_time_input = settings_form.find('#selected_time_input');

	// close
	closeBTN.off('click').on('click', e =>
	{
		hide()
	});

	// submit
	settings_form.off('submit').on('submit', async e =>
	{
		e.preventDefault()
		submit_button.addClass('disabled')
		var res = await DRIVER_JOB_MODEL.store({
			from_place: from_place_input.val(),
			from_place_coords: from_place_coords_input.val(),
			from_place_phone: from_place_phone_input.val(),
			to_place: to_place_input.val(),
			to_place_coords: to_place_coords_input.val(),
			to_place_phone: to_place_phone_input.val(),
			employee_id: USER_CONFIG.employee_id,
			employee_name: USER_CONFIG.employee_name,
			employee_type_id: USER_CONFIG.type.employee_type_id,
			employee_type_code: USER_CONFIG.type.employee_type_code,
			description: description_input.val(),
			selected_date: selected_date_input.val(),
			selected_time: selected_time_input.val(),
		})
		submit_button.removeClass('disabled')

		// ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(res.message)
		CreateToast('PS', res.message, '')
		if ( res.code == 404 ) return

		settings_form[0].reset()
	})

	// from-place-location-selected
	$(document).off('from-place-location-selected').on('from-place-location-selected', e =>
	{
		var detail = e.originalEvent.detail
		var location = detail.location

		if ( detail.eventsReceiverId != selector ) return
		
		from_place_coords_input.val( convertCoordinates(location.coordinates, 'string') )
	})
	// to-place-location-selected
	$(document).off('to-place-location-selected').on('to-place-location-selected', e =>
	{
		var detail = e.originalEvent.detail
		var location = detail.location

		if ( detail.eventsReceiverId != selector ) return
		
		to_place_coords_input.val( convertCoordinates(location.coordinates, 'string') )
	})

	function show()
	{
		dialog_container.removeClass('d-none');
	}
	function hide()
	{
		dialog_container.addClass('d-none');
	}

}
// Select directory dialog
SelectDirDialog = () =>
{
	return new Promise((resolve, reject) =>
	{
		ipcIndexRenderer.send('show-select-dir-dialog');
		ipcIndexRenderer.removeAllListeners('dialog-dir-selected');
		ipcIndexRenderer.on('dialog-dir-selected', (e, arg) =>
		{
			if ( arg.canceled )
			{
				reject(arg);
				return;
			}
			resolve(arg);
		});
	});
}
//RingingBellDialog
RingingBellDialog = async (options = {}) =>
{
	var selector = 'ringing_bell_dialog'
	var dialog_container = $('#'+selector);
	var html = ''

	const BELL_BUTTON_PUSHED_ICON = '../assets/img/utils/bell-ringing.png'
	const BELL_BUTTON_DEFAULT_ICON = '../assets/img/utils/bell.png'
	const CENTER_TYPE_CENTER = 'CENTER'
	const CENTER_TYPE_CENTRAL_ADMIN = 'CENTRAL_ADMINISTRATION'

	if ( options.center_type == CENTER_TYPE_CENTER )
		html = await getPage('../views/dialogs/centers/ringing-bell-dialog.ejs')
	else if ( options.center_type == CENTER_TYPE_CENTRAL_ADMIN )
		html = await getPage('../views/dialogs/central_admin/ringing-bell-dialog.ejs')

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#'+selector);
	}

	var closeBTN = dialog_container.find('#closeBTN');

	var settings_form = dialog_container.find('#settings_form');
	var center_type_select = dialog_container.find('#center_type_select')
	var clinic_select = dialog_container.find('#clinic_select')
	var employee_type_select = dialog_container.find('#employee_type_select')
	var delay_timeout_input = settings_form.find('#delay_timeout_input');
	var message_input = settings_form.find('#message_input');

	var push_bell_button = dialog_container.find('#push_bell_button')

	var BellObject = {
		triggered_by_employee_type_id: USER_CONFIG.employee_type_id,
		triggered_by_id: USER_CONFIG.employee_id,
		triggered_by_name: USER_CONFIG.employee_name,
		administration_id : clinic_select.find(':selected').val(),
		employee_type_id: 0,
		settings: null
	}

	// show
	if ( options.visible )
		show()

	// make draggable
	dialog_container.draggable()
	// select center type
	center_type_select.off('change').on('change', e =>
	{
		var target = $(e.target)
		var selected = center_type_select.find(':selected')

		if ( selected.val() == CENTER_TYPE_CENTER )
		{
			target.parent().next().removeClass('d-none')
			BellObject.administration_id = clinic_select.find(':selected').val()
			displayEmployeeTypes('')
		}
		else if ( selected.val() == CENTER_TYPE_CENTRAL_ADMIN )
		{
			target.parent().next().addClass('d-none')
			BellObject.administration_id = 0
			displayEmployeeTypes('.')
		}
	})
	center_type_select.trigger('change')
	// select clinic
	clinic_select.off('change').on('change', e =>
	{
		var target = $(e.target)
		BellObject.administration_id = clinic_select.find(':selected').val()
	})
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// save settings
	settings_form.off('submit').on('submit', e =>
	{
		e.preventDefault()

		setSettings()

		if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', "تم حفظ اعدادت الجرس", 'الآن');
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			CreateToast('Notification', "Les paramètres de la cloche ont été enregistrés", 'maintenant');
	})
	// delay timeout
	delay_timeout_input.off('input').on('input', e =>
	{
		var target = $(e.target)
		var val = target.val()+'s'
		target.data('tooltip-top', val).attr('data-tooltip-top', val)
	})
	// ring the bell
	push_bell_button.off('click').on('click', async e =>
	{
		if ( !DEFAULT_INI_SETTINGS.Bell_Settings )
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
				CreateToast('اشعار', "الرجاء التعديل في اعدادات الجرس اولا", 'الآن');
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
				CreateToast('Notification', "Veuillez d'abord modifier les paramètres de la cloche", 'maintenant');
			return
		}
		push_bell_button.addClass('no-pointer').find('img').attr('src', BELL_BUTTON_PUSHED_ICON)
		setTimeout(() => {
			push_bell_button.removeClass('no-pointer')
			.find('img').attr('src', BELL_BUTTON_DEFAULT_ICON)
		}, 3*1000);

		// BellObject.settings = JSON.stringify(DEFAULT_INI_SETTINGS.Bell_Settings)
		BellObject.settings = DEFAULT_INI_SETTINGS.Bell_Settings
		BellObject.employee_type_id = employee_type_select.find(':selected').val()
		BellObject.administration_id = USER_CONFIG.administration.clinicId

		RINGING_BELL_MODEL.notify({
			to: {
				employee_type_id: BellObject.employee_type_id,
				administration_id: BellObject.administration_id,
			},
			from: {
				triggered_by_employee_type_id: BellObject.triggered_by_employee_type_id,
				triggered_by_id: BellObject.triggered_by_id,
				triggered_by_name: BellObject.triggered_by_name,
				data: BellObject.settings,
			},
			notification: {
				title: USER_CONFIG.employee_name,
				body: BellObject.settings.TEXT_MESSAGE,
			}
		})

		// console.log(clinic_select.find(':selected').val())
		// var res = await RINGING_BELL_MODEL.store(BellObject)
		// if ( res.code == 404 )
		// {
		// 	if ( FUI_DISPLAY_LANG.lang == 'ar' )
		// 		CreateToast('اشعار', res.message, 'الآن');
		// 	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
		// 		CreateToast('Notification', res.message, 'maintenant');
		// }
	})
	//
	function show()
	{
		dialog_container.removeClass('d-none');
	}
	function hide()
	{
		dialog_container.addClass('d-none');
	}
	// set bell settings
	function setSettings()
	{
		var fini = new IniFile(APP_TMP_DIR+'/');

		var settings = {
			DELAY_TIMEOUT: delay_timeout_input.val(),
			TEXT_MESSAGE: message_input.val()
		};

		fini.writeSync(SETTINGS_FILE, settings, 'Bell_Settings');
		// reload ini settings
		loadIniSettingsSync();
	}
	// load settings
	loadSettings()
	function loadSettings()
	{
		if ( !DEFAULT_INI_SETTINGS.Bell_Settings ) return
		delay_timeout_input.val(DEFAULT_INI_SETTINGS.Bell_Settings.DELAY_TIMEOUT)
		.data('tooltip-top', DEFAULT_INI_SETTINGS.Bell_Settings.DELAY_TIMEOUT+'s')
		.attr('data-tooltip-top', DEFAULT_INI_SETTINGS.Bell_Settings.DELAY_TIMEOUT+'s')
		message_input.val(DEFAULT_INI_SETTINGS.Bell_Settings.TEXT_MESSAGE)
	}
	// display clinics
	displayClinics()
	async function displayClinics()
	{
		if ( !clinic_select[0] ) return
		clinic_select.html('')
		var res = await CLINIC_MODEL.search('')
		if ( res.code == 404 ) return

		var data = res.data
		$.each(data, (k,v) =>
		{
			clinic_select.append(`<option value="${v.clinicId}">${v.clinicName}</option>`)
		})
	}
	if ( options.center_type == CENTER_TYPE_CENTER )
	{
		displayEmployeeTypes(CENTER_TYPE_CENTER)
		BellObject.administration_id = USER_CONFIG.administration.clinicId
	}
	else if ( options.center_type == CENTER_TYPE_CENTRAL_ADMIN )
		displayEmployeeTypes(CENTER_TYPE_CENTRAL_ADMIN)
	// display employee types
	async function displayEmployeeTypes(target_administration)
	{
		var res = await EMPLOYEE_MODEL.type_advancedSearch({
			query: '',
			advanced: {
				employee_type_target_center: target_administration
			}
		})
		var data = res.data
		console.log(res)
		var html = ''
		$.each(data, (k,v) =>
		{
			var employee_type_name = (FUI_DISPLAY_LANG.lang == 'ar') ? v.employee_type_name_ar : v.employee_type_name_fr
			html += `<option value="${v.employee_type_id}">${employee_type_name}</option>`
		})

		employee_type_select.html(html)
	}
}
// FullpageDialog
FullpageDialog = function (options = {})
{
	var dialog_container = $('#'+options.container)
	var closeBTN = null
	var html = `<div class="overlay d-flex align-items-center justify-content-center" id="${options.container}" style="transition: none; z-index: 2000;">
					<div class="wrapper border rounded bg-white overflow-hidden shadow overlay-content container-fluid h-100  pb-3 d-flex flex-column block rounded-0 dialog_container">
						<div class="block-header px-2 py-4">
							<button class="btn-close block-btn-close" id="closeBTN"></button>
							<h4 class="h3 dialog_title"></h4>
						</div>
						<div class="block-body position-relative h-100 dialog_body" style="max-height: 93vh; overflow-x:hidden;overflow-y:auto;">
							
						</div>
					</div>
				</div>`

	if ( !dialog_container[0] )
	{
		$(html).insertBefore(MAIN_CONTENT_CONTAINER)

		dialog_container = $('#'+options.container)
	}

	// show
	show()
	init()

	closeBTN = dialog_container.find('#closeBTN')

	closeBTN.off('click')
	.on('click', e =>
	{
		hide()
	})

	// element
	this.getElement = () =>
	{
		return dialog_container
	}
	//
	this.hide = () =>
	{
		hide()
		return this
	}

	// show
	function show()
	{
		dialog_container.addClass('active')
	}
	// hide
	function hide()
	{
		dialog_container.removeClass('active')
	}
	// set title
	function setTitle()
	{
		if ( options.title )
			dialog_container.find('.dialog_title').html(options.title)
	}
	// set html
	function setHtml()
	{
		dialog_container.find('.block-body').html(options.html)
	}
	// set size
	function setSize()
	{
		if ( options.size )
		{
			dialog_container.find('.dialog_container').css('max-width', options.size.maxWidth)
			dialog_container.find('.dialog_container').css('max-height', options.size.maxHeight)
		}
	}
	// init
	function init()
	{
		setTitle()
		setHtml()
		setSize()
	}
}
// SelectEmployeeDialog
SelectEmployeeDialog = async (callback = null) =>
{
	var dialog_container = $('#selectEmployeeDialog');

	if ( !dialog_container[0] )
	{
		$(await (getPage('../views/dialogs/select-employee-dialog.ejs'))).insertBefore(MAIN_CONTENT_CONTAINER)
		dialog_container = $('#selectEmployeeDialog');
	}

	var closeBTN = dialog_container.find('#closeBTN');
	var okBTN = dialog_container.find('#okBTN');
	var cancelBTN = dialog_container.find('#cancelBTN');

	var central_admin_btn = dialog_container.find('#central_admin_btn');
	var center_btn = dialog_container.find('#center_btn');
	var my_contacts_btn = dialog_container.find('#my_contacts_btn');

	var main_wrapper = dialog_container.find('#main_wrapper');

	var central_admin_employees_wrapper = dialog_container.find('#central_admin_employees_wrapper');
	var central_admin_emp_types_select = dialog_container.find('#central_admin_emp_types_select');
	var searchInput1 = dialog_container.find('#searchInput1');
	var pagination1 = dialog_container.find('#pagination1');
	var employeesList1 = dialog_container.find('#employeesList1');

	var center_employees_wrapper = dialog_container.find('#center_employees_wrapper');
	var center_emp_types_select = dialog_container.find('#center_emp_types_select');
	var clinicSelect = dialog_container.find('#clinicSelect');
	var searchInput2 = dialog_container.find('#searchInput2');
	var pagination2 = dialog_container.find('#pagination2');
	var employeesList2 = dialog_container.find('#employeesList2');

	var my_contacts_employees_wrapper = dialog_container.find('#my_contacts_employees_wrapper');
	var select_employee_dialog_my_contacts_employee_job_select = dialog_container.find('#select_employee_dialog_my_contacts_employee_job_select');
	var select_employee_dialog_my_contacts_center_select = dialog_container.find('#select_employee_dialog_my_contacts_center_select');
	var select_employee_dialog_my_contacts_search_btn = dialog_container.find('#select_employee_dialog_my_contacts_search_btn');
	var select_employee_dialog_my_contacts_search_input = dialog_container.find('#select_employee_dialog_my_contacts_search_input');
	var pagination3 = dialog_container.find('#pagination3');
	var employeesList3 = dialog_container.find('#employeesList3');

	var back_btn = dialog_container.find('.back-btn');

	show();

	// closeBTN
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		close();
	});
	// cancelBTN
	cancelBTN.off('click');
	cancelBTN.on('click', e =>
	{
		close();
	});
	// central_admin_btn
	central_admin_btn.off('click');
	central_admin_btn.on('click', e =>
	{
		central_admin_employees_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// center_btn
	center_btn.off('click');
	center_btn.on('click', e =>
	{
		center_employees_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// my_contacts_btn
	my_contacts_btn.off('click');
	my_contacts_btn.on('click', e =>
	{
		my_contacts_employees_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// back_btn
	back_btn.off('click');
	back_btn.on('click', e =>
	{
		main_wrapper.slideDown(200).siblings('.WRAPPER').slideUp(200);
	});
	// okBTN
	okBTN.off('click');
	okBTN.on('click', e =>
	{
		
	});
	// searchInput1
	searchInput1.off('keyup');
	searchInput1.on('keyup', e =>
	{
		setTimeout(() => {
			displayCentralAdminEmployees();
		}, 500);
	});
	// searchInput2
	searchInput2.off('keyup');
	searchInput2.on('keyup', e =>
	{
		setTimeout(() => {
			displayClinicEmployees();
		}, 500);
	});
	// dialog_container
	dialog_container.off('click');
	dialog_container.on('click', async e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'employee' )
		{
			if ( typeof callback == 'function' )
			{

				callback( (await EMPLOYEE_MODEL.show(target.data('id'))).data );
				close();
			}
		}
	});
	// select clininc
	clinicSelect.off('change');
	clinicSelect.on('change', e =>
	{
		displayClinicEmployees();
	});
	// select employee type
	central_admin_emp_types_select.off('change');
	central_admin_emp_types_select.on('change', e =>
	{
		displayCentralAdminEmployeesByType();
	});
	center_emp_types_select.off('change');
	center_emp_types_select.on('change', e =>
	{
		displayClinicEmployeesByType();
	});

	// my contacts
	select_employee_dialog_my_contacts_search_btn.off('click').on('click', e =>
	{
		displayMyContactsEmployees({
			method_type: 'employee_group_for_messaging_search',
			query: select_employee_dialog_my_contacts_search_input.val(),
			advanced: {
				employee_id: USER_CONFIG.employee_id,
				target_administration_id: select_employee_dialog_my_contacts_center_select.find(':selected').val(),
				target_employee_type_id: select_employee_dialog_my_contacts_employee_job_select.find(':selected').val(),
			}
		})
	})
	// display central admin employees
	displayCentralAdminEmployees();
	async function displayCentralAdminEmployees()
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#central_admin_total_emp').text(` فيها حوالي (0) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#central_admin_total_emp').text(`Elle compte environ (0) employés.`);
		var response = await EMPLOYEE_MODEL.searchLocal({
			query: searchInput1.val(),
			administration_id: 0,
			employee_administration: '.'
		});
		employeesList1.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#central_admin_total_emp').text(` فيها حوالي (${data.length}) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#central_admin_total_emp').text(`Elle compte environ (${data.length}) employés.`);

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination1, employeesList1, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display clinincs
	displayClinics();
	async function displayClinics()
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#centers_total').text(` فيها حوالي (0) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#centers_total').text(`Elle compte environ (0) employés.`);
		var response = await CLINIC_MODEL.search('');
		
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			dialog_container.find('#centers_total').text(` حوالي (${data.length}) مراكز فرعية.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			dialog_container.find('#centers_total').text(`Environ (${data.length}) sous-centres`);

		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.clinicId}">${v.clinicName}</option>`;
		});

		clinicSelect.html(html);
		clinicSelect.trigger('change');
	}
	// display clinic eployees
	async function displayClinicEmployees()
	{
		var response = await EMPLOYEE_MODEL.searchLocal({
			query: searchInput2.val(),
			administration_id: clinicSelect.find(':selected').val(),
		});
		employeesList2.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination2, employeesList2, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display central admin employees by type
	async function displayCentralAdminEmployeesByType()
	{
		var response = await filterEmployeeByTypeLocal({
			employee_type_code: central_admin_emp_types_select.find(':selected').val(),
			administration_id: 0,
			employee_administration: '.'
		});
		employeesList1.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination1, employeesList1, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display clinic eployees by type
	async function displayClinicEmployeesByType()
	{
		var response = await filterEmployeeByTypeLocal({
			employee_type_code: center_emp_types_select.find(':selected').val(),
			administration_id: clinicSelect.find(':selected').val(),
		});
		employeesList2.html('');
		if ( response.code == 404 )
		{
			return;
		}

		var data = response.data;
		var html = '';

		$.each(data, (k,v) =>
		{
			if (FUI_DISPLAY_LANG.lang == 'ar'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_ar}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
			else if (FUI_DISPLAY_LANG.lang == 'fr'  )
			{
				html += `<div class="col-12">

							<div class="card" data-role="employee" data-id="${v.employee_id}" data-name="${v.employee_name}" data-phone="${v.employee_phone}" style="cursor:pointer;">
								<div class="card-body no-pointer">
									<h4 class="card-title text-01">${v.employee_name}</h4>
									<p class="card-text"><small>${v.employee_phone}</small></p>
									<hr>
									<p class="card-text">${v.type.employee_type_name_fr}</p>
								</div>
							</div>

						</div>PAG_SEP `;
			}
		});

		new SmoothPagination(pagination2, employeesList2, {
			data: html.split('PAG_SEP'),
			
		})

	}
	// display my contacts employees
	displayMyContactsEmployees({
		method_type: 'employee_group_for_messaging_search',
		query: select_employee_dialog_my_contacts_search_input.val(),
		advanced: {
			employee_id: USER_CONFIG.employee_id
		}
	})
	async function displayMyContactsEmployees(params)
	{
		employeesList3.html('')

		if ( FUI_DISPLAY_LANG.lang == 'ar' ) dialog_container.find('#my_contacts_total').text(` يوجد حوالي (0) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' ) dialog_container.find('#my_contacts_total').text(`Il y a environ (0) employés.`);

		if ( params.method_type == 'employee_group_for_messaging_search' ) var res = await EMPLOYEE_MODEL.employee_group_for_messaging_search(params)

		if ( res.code == 404 ) return
		var data = res.data
		var html = ''

		if ( FUI_DISPLAY_LANG.lang == 'ar' ) dialog_container.find('#my_contacts_total').text(` يوجد حوالي (${data.length}) موظف.`);
		else if ( FUI_DISPLAY_LANG.lang == 'fr' ) dialog_container.find('#my_contacts_total').text(`Il y a environ (${data.length}) employés.`);

		$.each(data, (k,v) =>
		{
			html += `<div class="col-12">

						<div class="card" data-role="employee" data-id="${v.target_employee_id}" data-name="${v.target_employee_name}" data-phone="${v.target_employee_phone}" style="cursor:pointer;">
							<div class="card-body no-pointer">
								<h4 class="card-title text-01">${v.target_employee_name}</h4>
								<p class="card-text"><small>${v.target_employee_phone}</small></p>
								<hr>
								<p class="card-text">${FUI_DISPLAY_LANG.views.pages.global.employee_type_codes[v.target_employee_type_code]}</p>
							</div>
						</div>

					</div>PAG_SEP `;
		});

		new SmoothPagination(pagination3, employeesList3, {
			data: html.split('PAG_SEP'),
			
		})
	}
	// display employee types
	displayEmployeeTypes();
	async function displayEmployeeTypes()
	{
		central_admin_emp_types_select.html('');
		center_emp_types_select.html('');
		var response = await EMPLOYEE_MODEL.types_index('all');
		if ( response.code == 404 )
			return;

		var data = response.data;
		$.each(data, (k,v) =>
		{
			if ( FUI_DISPLAY_LANG.lang == 'ar' )
			{
				if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CENTRAL_ADMINISTRATION )
				{
					central_admin_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_ar}</option>`);
				}
				else if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CLINIC )
				{
					center_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_ar}</option>`);
				}
			}
			else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			{
				if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CENTRAL_ADMINISTRATION )
				{
					central_admin_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_fr}</option>`);
				}
				else if ( v.employee_type_target_center == EMP_TYPE_TARGET_CENTER_CLINIC )
				{
					center_emp_types_select.append(`<option value="${v.employee_type_code}">${v.employee_type_name_fr}</option>`);
				}
			}
		});

		// central_admin_emp_types_select.trigger('change');
		// center_emp_types_select.trigger('change');
	}
	// Display dialog
	function show()
	{
		dialog_container.addClass('active');
		MAIN_CONTENT_CONTAINER.addClass('blur');
		SIDE_NAV_CONTAINER.addClass('blur');
		TOP_NAV_BAR.addClass('blur');
	}
	// Close dialog
	function close()
	{
		dialog_container.removeClass('active');
		MAIN_CONTENT_CONTAINER.removeClass('blur');
		SIDE_NAV_CONTAINER.removeClass('blur');
		TOP_NAV_BAR.removeClass('blur');
	}
}
// Add Consommables To Patient Dialog
AddConsommablesToPatientDialog = (options, CALLBACK = undefined) =>
{
	var promptDialogContainer = $('#addConsommablesToPatientDialog');
	var ERROR_BOX = promptDialogContainer.find('#ERROR_BOX');
	var closeBTN = promptDialogContainer.find('#closeBTN');
	var submitBTN = promptDialogContainer.find('#submitBTN');
	var patientName = promptDialogContainer.find('#patientName');

	var searchBTN = promptDialogContainer.find('#searchBTN');
	var searchInput = promptDialogContainer.find('#searchInput');
	var tableElement = promptDialogContainer.find('#tableElement');

	var wrapper01 = promptDialogContainer.find('#wrapper01');

	show();
	patientName.text('('+options.patientName+')');
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// submit
	submitBTN.off('click');
	submitBTN.on('click', async e =>
	{
		// check length
		if ( selectedConsommables().length == 0 ) return

		// display loader
		SectionLoader(wrapper01);

		var response = await CONSOMMABLE_MODEL.patient_batchStore({
			patientId: options.patientId,
			patientName: options.patientName,
			administration_id: options.administration_id,
			administration_name: options.administration_name,
			ConsommableObjects: selectedConsommables()
		});
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
		searchBTN.trigger('click');
		if ( typeof CALLBACK == 'function' )
			CALLBACK(response);
	});
	// search
	searchBTN.off('click');
	searchBTN.on('click', async e =>
	{
		var SearchObject = {
			administration_id: options.administration_id,
			query: searchInput.val()
		};
		// display loader
		SectionLoader(tableElement);
		var response = await CONSOMMABLE_MODEL.center_local_search(SearchObject);
		// hide loader
		SectionLoader(tableElement, '');
		// clear html
		tableElement.html('');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<div class="py-3 border-bottom">
						<div class="d-flex is-justify-content-space-between is-align-items-center" data-role="CONSOMMABLE" data-consommable-id="${v.consommable_id}" data-consommable-name="${v.consommable_name}" data-center-quantity="${v.consommable_quantity}">
							<div>
								<div class="">
									<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-consommable_id="${v.consommable_id}">
									<span class="text-02">
										${v.consommable_name}
										<span class="display-inline-block mx-2 text-04 text-muted">
											(${v.consommable_quantity})
										</span>
									</span>
								</div>
							</div>
							<div>
								<span>
									<input type="number" style="width: 101px;" class="input-text input-text-outline pointer" data-role="QUANTITY" data-consommable_id="${v.consommable_id}" value="1" min="1" max="${v.consommable_quantity}">
								</span>
							</div>
						</div>
					</div>`;
		});
		// add html
		tableElement.html(html);
	});
	searchBTN.trigger('click');
	// show
	function show()
	{
		promptDialogContainer.addClass('active');
		MAIN_CONTENT_CONTAINER.addClass('blur');
		SIDE_NAV_CONTAINER.addClass('blur');
		TOP_NAV_BAR.addClass('blur');
	}
	// hide
	function hide()
	{
		promptDialogContainer.removeClass('active');
		MAIN_CONTENT_CONTAINER.removeClass('blur');
		SIDE_NAV_CONTAINER.removeClass('blur');
		TOP_NAV_BAR.removeClass('blur');
	}
	// selected Consommables
	function selectedConsommables()
	{
		var list = [];
		var items = tableElement.find('[data-role="CONSOMMABLE"]');
		for (var i = 0; i < items.length; i++) 
		{
			var item = $(items[i]);
			var check = item.find('[data-role="CHECK"]');
			var quantity_input = item.find('[data-role="QUANTITY"]')
			var quantity = parseInt(quantity_input.val());
			var center_quantity = parseInt(item.data('center-quantity'))
			// check center stock quantity
			if ( quantity > center_quantity )
			{
				quantity_input.addClass('input-danger')
				continue
			}
			else
				quantity_input.removeClass('input-danger')

			if ( check.is(':checked') )
			{
				list.push({ 
					administration_id: options.administration_id,
					administration_name: options.administration_name,
					consommable_id: item.data('consommable-id'),
					consommable_name: item.data('consommable-name'),
					consommable_quantity: quantity
				});
			}
		}

		return list;
	}
}
// Preview File Dialog
PreviewFileDialog = (options, callback) =>
{
	var previewFileDialog = $('#previewFileDialog');
	var closeBTN = previewFileDialog.find('#closeBTN');

	var bodyDiv = previewFileDialog.find('#bodyDiv');
	const file_div = previewFileDialog.find('#file_div');

	const js_image_editing_options = previewFileDialog.find('.js_image_editing_options')
	const rotate_button = previewFileDialog.find('#rotate_button')

	const confirm_button = previewFileDialog.find('#confirm_button')

	show();
	// check file type
	if ( isImageFile(options.url) )
	{
		file_div.html(`<img src="${options.url}" class="" alt="">`)
		.css('height', 'auto');
		js_image_editing_options.removeClass('d-none')
	}
	if ( isVideoFile(options.url) )
	{
		file_div.html(`<video src="${options.url}" class="w-100 h-100" alt="" controls></video>`);
		js_image_editing_options.addClass('d-none')
	}
	else js_image_editing_options.addClass('d-none')

	if ( isPDFFile(options.url) )
	{
		file_div.html(`<iframe src="${options.url}" class="iframe-fit" frameborder="0" scrolling="true"></iframe>`);
		file_div.css('height', '100%')
	}
	draggableScroll(file_div);
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// Image editing options
	// Rotate
	var rotateDegrees = 90
	rotate_button.off('click');
	rotate_button.on('click', e =>
	{
		rotateImage(options.url, rotateDegrees, rotatedImgUrl =>
		{
			file_div.find('img').attr('src', rotatedImgUrl)
		})

		rotateDegrees += 90
	})
	// confirm
	confirm_button.off('click');
	confirm_button.on('click', e =>
	{

		if ( typeof callback == 'function' )
		{
			callback({
				url: file_div.find('img').attr('src')
			})
			hide()
		}
		
	})
	//
	function show()
	{
		previewFileDialog.addClass('active');
	}
	function hide()
	{
		previewFileDialog.removeClass('active');

		if ( isVideoFile(options.url) )
		{
			file_div.find('video')[0].pause()
		}
	}
}
// Orders Cart Dialog
OrdersCartDialog = (options = {}, callback = null) =>
{
	var ordersCartDialog = $('#ordersCartDialog');
	var ERROR_BOX = ordersCartDialog.find('#ERROR_BOX');
	var CLOSE_BTN = ordersCartDialog.find('#CLOSE_BTN');
	var MINIMIZE_BTN = ordersCartDialog.find('#MINIMIZE_BTN');
	var RESTORE_BTN = ordersCartDialog.find('#RESTORE_BTN');
	var VIEW_ORDERS_BTN = ordersCartDialog.find('#VIEW_ORDERS_BTN');
	var ORDERS_LIST = ordersCartDialog.find('#ORDERS_LIST');
	var SEND_CART_ORDER_BTN = ordersCartDialog.find('#SEND_CART_ORDER_BTN');
	var SEND_CART_ORDER_BTN2 = ordersCartDialog.find('#SEND_CART_ORDER_BTN2');
	var TOTAL = ordersCartDialog.find('#TOTAL');
	var TOTAL_MINIMIZED = ordersCartDialog.find('#TOTAL_MINIMIZED');
	var AMOUNT_PAID_INPUT = ordersCartDialog.find('#AMOUNT_PAID_INPUT');
	var DEPT_AMOUNT = ordersCartDialog.find('#DEPT_AMOUNT');

	var TABS_LIST = ordersCartDialog.find('#TABS_LIST');

	var patientsSearchInput = ordersCartDialog.find('#patientsSearchInput');
	var patientSelect = ordersCartDialog.find('#patientSelect');
	var loader01 = ordersCartDialog.find('#loader01');

	var patientNameInput = ordersCartDialog.find('#patientNameInput');
	var patientPhoneInput = ordersCartDialog.find('#patientPhoneInput');

	// convert to int
	if ( !isNull(options.quantity) ) options.quantity = parseInt(options.quantity)
	
	// show
	show();
	// add order to list
	append();
	// switch tabs
	TABS_LIST.off('click');
	TABS_LIST.on('click', e =>
	{
		var target = $(e.target);
		if ( target.data('role') == 'TAB' )
		{
			var tab = ordersCartDialog.find( target.data('tab') );
			tab.show(0).siblings('.TAB').hide(0);
			target.addClass('active').siblings().removeClass('active');

			if ( target.data('tab') == '#OUTSIDE_ORDER_TAB' )
				AMOUNT_PAID_INPUT.attr('readonly', true)
			else
				AMOUNT_PAID_INPUT.attr('readonly', false)
		}
	});
	// ORDERS_LIST click
	ORDERS_LIST.off('click');
	ORDERS_LIST.on('click', e =>
	{
		var target = $(e.target);

		if ( target.data('role') == 'REMOVE' )
		{
			PromptConfirmDialog().then(c =>
			{
				var parent = target.closest('.order');
				parent.remove();
				calculateTotal();
			})
		}
	});
	// display orders list 
	VIEW_ORDERS_BTN.off('click');
	VIEW_ORDERS_BTN.on('click', e =>
	{
		var visible = ORDERS_LIST.data('visible');

		if ( visible )
		{
			ORDERS_LIST.slideUp(200).data('visible', false)
			VIEW_ORDERS_BTN.text( FUI_DISPLAY_LANG.views.pages.global.text7 )
		}
		else
		{
			ORDERS_LIST.slideDown(200).data('visible', true)
			VIEW_ORDERS_BTN.text( FUI_DISPLAY_LANG.views.pages.global.text8 )
		}

	});
	// close
	CLOSE_BTN.off('click');
	CLOSE_BTN.on('click', e =>
	{
		hide();
	});
	// minimize
	MINIMIZE_BTN.off('click');
	MINIMIZE_BTN.on('click', e =>
	{
		minimize();
	});
	// restore
	RESTORE_BTN.off('click');
	RESTORE_BTN.on('click', e =>
	{
		restore();
	});
	// SEND_CART_ORDER_BTN click
	SEND_CART_ORDER_BTN.off('click');
	SEND_CART_ORDER_BTN.on('click', async e =>
	{
		var user_id = patientSelect.find(':selected').val();
		var order_receiver_name = patientSelect.find(':selected').text();
		var order_amount_paid = parseFloat(AMOUNT_PAID_INPUT.val())
		var order_total_amount = calculateTotal()
		var order_dept_amount = 0

		if ( order_amount_paid > 0 )
		{
			order_dept_amount = order_total_amount - order_amount_paid
		}

		SEND_CART_ORDER_BTN.addClass('disabled')
		var response = await ORDER_MODEL.direction_center_to_client_selling_store({
			items: selectedItems(),
			supplier_id: USER_CONFIG.administration.clinicId,
        	supplier_name: USER_CONFIG.administration.clinicName,
			user_id: user_id,
			order_receiver_name: order_receiver_name,
			prescriptionId: options.prescriptionId,
			order_amount_paid: order_amount_paid,
			order_total_amount: order_total_amount,
			order_dept_amount: order_dept_amount,
			isAccepted: 1
		});
		SEND_CART_ORDER_BTN.removeClass('disabled')
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
		if ( response.code == 404 ) return

		if ( typeof callback == 'function' )
			callback(response)
		//hide();
		clearItems();
		options.prescriptionId = null
		// send low stock threshold notifications
		PRODUCT_MODEL.center_low_stock_threshold_notify({
			administration_id: USER_CONFIG.administration.clinicId,
		})
	});
	// SEND_CART_ORDER_BTN2 click
	SEND_CART_ORDER_BTN2.off('click');
	SEND_CART_ORDER_BTN2.on('click', async e =>
	{
		var order_receiver_name = patientNameInput.val()
		var order_receiver_phone = patientPhoneInput.val()
		var order_amount_paid = parseFloat(AMOUNT_PAID_INPUT.val())
		var order_total_amount = calculateTotal()

		// no depts allowed
		AMOUNT_PAID_INPUT.val(order_total_amount)
		order_amount_paid = order_total_amount

		SEND_CART_ORDER_BTN2.addClass('disabled')
		var response = await ORDER_MODEL.direction_center_to_external_client_selling_store({
			items: selectedItems(),
			supplier_id: USER_CONFIG.administration.clinicId,
        	supplier_name: USER_CONFIG.administration.clinicName,
			order_receiver_name: order_receiver_name,
			order_receiver_phone: order_receiver_phone,
			order_amount_paid: order_amount_paid,
			order_total_amount: order_total_amount,
			isAccepted: 1
		});
		SEND_CART_ORDER_BTN2.removeClass('disabled')
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);

		if ( response.code == 404 ) return

		if ( typeof callback == 'function' )
			callback(response)
		//hide();
		clearItems();
		// options.prescriptionId = null
		// send low stock threshold notifications
		PRODUCT_MODEL.center_low_stock_threshold_notify({
			administration_id: USER_CONFIG.administration.clinicId,
		})
	});
	// search patients
	patientsSearchInput.off('keyup');
	patientsSearchInput.on('keyup', async e =>
	{
		var query = patientsSearchInput.val();
		var SearchObject = {
			clinicId: USER_CONFIG.administration.clinicId,
			query: query
		};
		// display loader
		loader01.show(0);
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			loader01.text("جاري البحث...");
		else if ( FUI_DISPLAY_LANG.lang == 'fr' )
			loader01.text("En train de rechercher...");

		var response = await searchPatientsLocal(SearchObject);
		// hide loader
		loader01.hide(0);
		if ( response.code == 404 )
			return;

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<option value="${v.patientId}">${v.patientName}</option>`;
		});
		// add html
		patientSelect.html(html);
		if ( options.user_id != null )
		{
			setOptionSelected(patientSelect, options.user_id);
		}	
		patientSelect.trigger('change');
	});
	// trigger patients search
	patientsSearchInput.trigger('keyup');
	// show
	function show()
	{
		ordersCartDialog.addClass('active');	
	}
	// hide
	function hide()
	{
		ordersCartDialog.removeClass('active');
		ORDERS_LIST.slideUp(200).data('visible', false);
		VIEW_ORDERS_BTN.text(FUI_DISPLAY_LANG.views.pages.global.text7);
		clearItems()
		calculateTotal()
	}
	// minimize
	function minimize()
	{
		ordersCartDialog.addClass('minimized');	
	}
	// restore
	function restore()
	{
		ordersCartDialog.removeClass('minimized');	
	}
	// append
	function append()
	{
		// check item exists
		var order_item_final_amount = parseFloat(options.price * options.quantity).toFixed(2)
		var order_item_quantity = options.quantity
		var item = checkItemExists(options.id)
		if ( item )
		{
			order_item_quantity = (options.quantity + item.order_item_quantity)
			order_item_final_amount = parseFloat(options.price * order_item_quantity ).toFixed(2)
			ORDERS_LIST.find(`[data-itemid="${options.id}"]`).remove()
		}

		// compare stock quantity with cart
		if ( options.stock_quantity < order_item_quantity )
		{
			CreateToast('PS', 
				`${FUI_DISPLAY_LANG.views.messages.invalid_inventory_quantity}, ${FUI_DISPLAY_LANG.views.pages.global.text12} [<span class="text-success">(${options.stock_quantity})</span>]`
				, '')
			calculateTotal();
			return
		}
		
		var html = `<div class="order" data-role="ORDER_ITEM" data-itemid="${options.id}">
						<div class="close-button-sm cursor-pointer" data-role="REMOVE">
							<i class="xfb xfb-close-sm-thin"></i>
						</div>
						
						<div class="text-center row gx-0 gy-0">
							<div class="col-md-2 d-flex align-items-center">
								<img src="${options.image}" alt="" class="order-img">
							</div>
							<div class="col-md d-flex align-items-center">
								<div class="order-name fw-300">${ strSnippet(options.name) }</div>
							</div>
							<div class="col-md-3">
								<div class="text-muted fw-200 mb-1 order-price" data-role="ITEM_PRICE" data-price="${options.price}">
									<span class="text-success">${options.price}</span>
								</div>
								<div class="text-muted fw-200 order-quantity has-direction-ltr" data-role="ITEM_QUANTITY" data-quantity="${order_item_quantity}">
									<div class="mb-2">${options.price} x ${order_item_quantity}</div>
									<div>= <span class="text-success">${order_item_final_amount}</span></div>
								</div>
							</div>
						</div>
					</div>`;
		ORDERS_LIST.append(html);
		calculateTotal();
	}
	// selected items
	function selectedItems()
	{
		var list = [];
		var items = ORDERS_LIST.find('[data-role="ORDER_ITEM"]');
		for (var i = 0; i < items.length; i++) 
		{
			var item = $(items[i]);
			list.push({
				order_item_id: item.data('itemid'),
				order_item_quantity: parseInt(item.find('[data-role="ITEM_QUANTITY"]').data('quantity')),
				order_item_price: parseFloat(item.find('[data-role="ITEM_PRICE"]').data('price')),
				order_note: ''
			});
		}

		return list;
	}
	// clear items
	function clearItems()
	{
		ORDERS_LIST.html('');
		ORDERS_LIST.slideUp(200).data('visible', false);
		VIEW_ORDERS_BTN.text(FUI_DISPLAY_LANG.views.pages.global.text7);
		TOTAL.html(`${FUI_DISPLAY_LANG.views.pages.global.text13} <span class="text-success">${0.00} ${CURRENCY.dzd}</span>`);
		TOTAL_MINIMIZED.html( TOTAL.html() )
		AMOUNT_PAID_INPUT.val(0)
	}
	// calculate total
	function calculateTotal()
	{
		var items = selectedItems();
		var total = 0;
		for (var i = 0; i < items.length; i++) 
		{
			var item = items[i];
			total += item.order_item_price * item.order_item_quantity;
		}

		TOTAL.html(`${FUI_DISPLAY_LANG.views.pages.global.text13} <span class="text-success">${total.toFixed(2)} ${CURRENCY.dzd}</span>`);
		TOTAL_MINIMIZED.html( TOTAL.html() )

		AMOUNT_PAID_INPUT.val(total)

		return total
	}
	// check item exists
	function checkItemExists(id)
	{
		var result = false
		var items = selectedItems()
		for (let i = 0; i < items.length; i++) 
		{
			const item = items[i];
			if ( item.order_item_id == id )
			{
				result = item
				break
			}
		}

		return result;
	}
}
// Order Cart Dialog
OrderCartDialog = (options, callback) =>
{
	var orderCartDialog = $('#orderCartDialog');
	var PRODUCT_IMAGE = orderCartDialog.find('#PRODUCT_IMAGE');
	var PRODUCT_NAME = orderCartDialog.find('#PRODUCT_NAME');
	var PRODUCT_PRICE = orderCartDialog.find('#PRODUCT_PRICE');
	var GO_BACK_BTN = orderCartDialog.find('#GO_BACK_BTN');
	var ADD_TO_CART_BTN = orderCartDialog.find('#ADD_TO_CART_BTN');

	var MINUS_QUANTITY_BTN = orderCartDialog.find('#MINUS_QUANTITY_BTN');
	var QUANTITY_INPUT = orderCartDialog.find('#QUANTITY_INPUT');
	var PLUS_QUANTITY_BTN = orderCartDialog.find('#PLUS_QUANTITY_BTN');

	// show
	show();
	PRODUCT_IMAGE.attr('src', options.image);
	PRODUCT_NAME.text(options.name);
	PRODUCT_PRICE.text(options.price+' '+CURRENCY.dzd);

	QUANTITY_INPUT.val(1);
	// close
	GO_BACK_BTN.off('click');
	GO_BACK_BTN.on('click', e =>
	{
		hide();
	});
	// add to cart
	ADD_TO_CART_BTN.off('click');
	ADD_TO_CART_BTN.on('click', async e =>
	{

		ADD_TO_CART_BTN.addClass('disabled')
		// check product quantity
		var res = await PRODUCT_MODEL.center_show({
			productId: options.id,
			administration_id: options.administration_id,
		})
		ADD_TO_CART_BTN.removeClass('disabled')
		var itemData = res.data
		var quantity = parseInt(QUANTITY_INPUT.val())
		var stock_quantity = parseInt(itemData.productQuantity)

		if ( stock_quantity == 0 || stock_quantity < quantity )
		{
			CreateToast('PS', 
				`${FUI_DISPLAY_LANG.views.messages.invalid_inventory_quantity}, ${FUI_DISPLAY_LANG.views.pages.global.text12} [<span class="text-success">(${itemData.productQuantity})</span>]`
				, '')
			return
		}

		hide();
		var sellPrice = options.price;
		OrdersCartDialog({
			id: options.id,
			image: options.image,
			name: options.name,
			price: sellPrice,
			quantity: quantity,
			stock_quantity: stock_quantity,
			itemData: itemData,
			prescriptionId: (options.prescriptionId) ? options.prescriptionId : 0
		}, cartRes =>
		{
			callback(cartRes)
		});
	});
	// plus
	PLUS_QUANTITY_BTN.off('click');
	PLUS_QUANTITY_BTN.on('click', e =>
	{
		var q = QUANTITY_INPUT.val();
		q++;
		QUANTITY_INPUT.val(q);
		if ( q > 0 )
			MINUS_QUANTITY_BTN.removeClass('disabled');
	});
	// minus
	MINUS_QUANTITY_BTN.off('click');
	MINUS_QUANTITY_BTN.on('click', e =>
	{
		var q = QUANTITY_INPUT.val();
		q--;
		QUANTITY_INPUT.val(q);
		if ( q == 1 )
			MINUS_QUANTITY_BTN.addClass('disabled');
	});

	// show
	function show()
	{
		orderCartDialog.addClass('active');
		SIDE_NAV_CONTAINER.addClass('blur-5');
		TOP_NAV_BAR.addClass('blur-5');
		MAIN_CONTENT_CONTAINER.addClass('blur-5');
	}
	// hide
	function hide()
	{
		orderCartDialog.removeClass('active');
		SIDE_NAV_CONTAINER.removeClass('blur-5');
		TOP_NAV_BAR.removeClass('blur-5');
		MAIN_CONTENT_CONTAINER.removeClass('blur-5');
	}
}
// Add Appointement Patients Dialog
AddAppointementPatientsDialog = (options, CALLBACK) =>
{
	var promptDialogContainer = $('#addSessionPatientsDialog');
	var ERROR_BOX = promptDialogContainer.find('#ERROR_BOX');
	var closeBTN = promptDialogContainer.find('#closeBTN');
	var submitBTN = promptDialogContainer.find('#submitBTN');
	var sessionName = promptDialogContainer.find('#sessionName');

	var searchBTN = promptDialogContainer.find('#searchBTN');
	var searchInput = promptDialogContainer.find('#searchInput');
	var tableElement = promptDialogContainer.find('#tableElement');

	var wrapper01 = promptDialogContainer.find('#wrapper01');

	show();
	sessionName.text('('+options.aptName+')');
	// close
	closeBTN.off('click');
	closeBTN.on('click', e =>
	{
		hide();
	});
	// submit
	submitBTN.off('click');
	submitBTN.on('click', async e =>
	{
		var AppointementObject = {
			aptId: options.aptId,
			patients: selectedPatients()
		};
		// display loader
		SectionLoader(wrapper01);
		var response = await APPOINTMENT_MODEL.followup_session_patient_batchStore(AppointementObject);
		// hide loader
		SectionLoader(wrapper01, '');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}
		ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);

		if ( typeof CALLBACK == 'function' )
			CALLBACK(response);
	});
	// search
	searchBTN.off('click');
	searchBTN.on('click', async e =>
	{
		// display loader
		SectionLoader(tableElement);
		if ( options.clinicId == 'all' )
		{
			var response = await searchPatients(searchInput.val());
		}
		else
		{
			var response = await searchPatientsLocal({
				clinicId: options.clinicId,
				query: searchInput.val()
			});
		}
		// hide loader
		SectionLoader(tableElement, '');
		// clear html
		tableElement.html('');
		if ( response.code == 404 )
		{
			ERROR_BOX.show(0).delay(7*1000).hide(0).find('#text').text(response.message);
			return;
		}

		var data = response.data;
		var html = '';
		$.each(data, (k,v) =>
		{
			html += `<div class="list-item d-flex flex-align-center">
						<div class="mx-2">
							<input type="checkbox" class="form-check-input pointer" data-role="CHECK" data-patientid="${v.patientId}">
						</div>
						<div class="text-02 mx-4" style="flex-grow: 1;">
							${v.patientName}
						</div>
					</div>`;
		});
		// add html
		tableElement.html(html);
	});
	searchBTN.trigger('click');
	// show
	function show()
	{
		promptDialogContainer.addClass('active');
		MAIN_CONTENT_CONTAINER.addClass('blur');
		SIDE_NAV_CONTAINER.addClass('blur');
		TOP_NAV_BAR.addClass('blur');
	}
	// hide
	function hide()
	{
		promptDialogContainer.removeClass('active');
		MAIN_CONTENT_CONTAINER.removeClass('blur');
		SIDE_NAV_CONTAINER.removeClass('blur');
		TOP_NAV_BAR.removeClass('blur');
	}
	// selected patients
	function selectedPatients()
	{
		var list = [];
		var items = tableElement.find('[data-role="CHECK"]');
		for (var i = 0; i < items.length; i++) 
		{
			var check = $(items[i]);
			if ( check.is(':checked') )
				list.push({ patientId: check.data('patientid') });
		}

		return list;
	}
}
// Dialog Box
DialogBox = (title = '', html) =>
{
	var modalDialogBoxTogglerBTN = $('#modalDialogBoxTogglerBTN');
	var modalDialogBox = $('#modalDialogBox');
	var mbdTitle = modalDialogBox.find('#mbdTitle');
	var mdbBody = modalDialogBox.find('#mdbBody');
	// Display
	modalDialogBoxTogglerBTN.trigger('click');
	// Set Title
	mbdTitle.html(title);
	// Set HTML
	mdbBody.html(html);
	// change text direction
	if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		mdbBody.closest('.modal').removeClass('text-align-r');
	}
}
// Prompt Input dialog
PromptInputDialog = (title, placeholder = 'Enter text here...') =>
{
	var promptDialogContainer = $('#promptInputDialog');
	var promptDialogTitle = promptDialogContainer.find('.block-title');
	var promptDialogCloseBTN = promptDialogContainer.find('#closeBTN');
	var promptDialogTextInput = promptDialogContainer.find('#promptDialogTextInput');
	var promptDialogOK = promptDialogContainer.find('#okBTN');
	var promptDialogCancel = promptDialogContainer.find('#cancelBTN');

	// change text direction
	if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		promptDialogContainer.removeClass('text-align-r');
	}
	var promise = new Promise((resolve, reject) =>
	{
		// Display dialog
		show();
		// Set title
		promptDialogTitle.text(title);
		// Set input placeholder
		promptDialogTextInput.attr('placeholder', placeholder);
		//CLose dialog
		promptDialogCloseBTN.off('click');
		promptDialogCloseBTN.on('click', e =>
		{
			e.preventDefault();
			close();
		});

		// Click OK
		promptDialogOK.off('click');
		promptDialogOK.on('click', () =>
		{
			// Close dialog
			close();
			resolve(promptDialogTextInput.val());
		});	
		// Click CANCEL
		promptDialogCancel.off('click');
		promptDialogCancel.on('click', () =>
		{
			// Close dialog
			close();
			reject(null);
		});
	});

	// Display dialog
	function show()
	{
		promptDialogContainer.addClass('active');
	}
	// Close dialog
	function close()
	{
		promptDialogContainer.removeClass('active');
	}

	return promise;
}
// Prompt confirm dialog
PromptConfirmDialog = (title = '', html = '') =>
{
	var promptDialogContainer = $('#promptConfirmDialog');
	var promptDialogTitle = promptDialogContainer.find('.block-title');
	var promptDialogCloseBTN = promptDialogContainer.find('#closeBTN');
	var promptDialogBody = promptDialogContainer.find('.block-body');
	var promptDialogOK = promptDialogContainer.find('#okBTN');
	var promptDialogCancel = promptDialogContainer.find('#cancelBTN');

	// change text direction
	if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		promptDialogContainer.removeClass('text-align-r');
	}
	if ( title.length == 0 )
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			title = "تأكيد العمل";
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			title = "Confirmer";
	}

	if ( html.length == 0 )
	{
		if ( FUI_DISPLAY_LANG.lang == 'ar' )
			html = "هل أنت متأكد؟";
		if ( FUI_DISPLAY_LANG.lang == 'fr' )
			html = "Êtes-vous sûr?";
	}
	var promise = new Promise((resolve, reject) =>
	{
		// Display dialog
		show();
		// Set title
		promptDialogTitle.text(title);
		// Set body html
		promptDialogBody.html(html);
		//CLose dialog
		promptDialogCloseBTN.off('click');
		promptDialogCloseBTN.on('click', e =>
		{
			e.preventDefault();
			close();
		});

		// Click OK
		promptDialogOK.off('click');
		promptDialogOK.on('click', () =>
		{
			// Close dialog
			close();
			resolve(true);
		});	
		// Click CANCEL
		promptDialogCancel.off('click');
		promptDialogCancel.on('click', () =>
		{
			// Close dialog
			close();
			reject(false);
		});
	});

	// Display dialog
	function show()
	{
		promptDialogContainer.addClass('active');
	}
	// Close dialog
	function close()
	{
		promptDialogContainer.removeClass('active');
	}

	return promise;
}


});
