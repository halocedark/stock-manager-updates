$(async function()
{

checker_2_sec()
// 2 sec checker
function checker_2_sec()
{
	setInterval(() => 
	{
		
		// add table-element class to all tables
		$('table').addClass('table-element')
		$('.utable').addClass('table-element')
		// initialize select all on checkboxes
		$('.table-element').each((k,element) =>
		{
			var table_element = $(element)
			// add select-all-trigger data to all tables first col in thdead
			table_element.find('thead tr th').first().data('role', 'select-all-trigger').attr('data-role', 'select-all-trigger').css('cursor', 'pointer')
			table_element.find('.thead .td').first().data('role', 'select-all-trigger').attr('data-role', 'select-all-trigger').css('cursor', 'pointer')
			var thead = (table_element.find('thead').length > 0) ? table_element.find('thead') : table_element.find('.thead')

			thead.off('click').on('click', e =>
			{
				var target = $(e.target)

				if ( target.data('role') == 'select-all-trigger' )
				{
					// find first tbody tr col checkboxes
					var checkboxes = table_element.find('tbody tr td input[type="checkbox"]')
					if ( checkboxes.length == 0 ) checkboxes = table_element.find('.tbody .tr .td input[type="checkbox"]')

					toggleCheck(checkboxes)
				}
			})
		})

		// panel toggler button
		$('.panel_toggler_button').each((k,element) =>
		{
			var toggler_button = $(element)

			toggler_button.off('click').on('click', e =>
			{
				e.preventDefault()

				var target = $(toggler_button.data('target'))

				target.toggleClass('d-none')
			})
		})
		// panel close button
		$('.panel_toggler_button_panel_close').each((k,element) =>
		{
			var toggler_button = $(element)

			toggler_button.off('click').on('click', e =>
			{
				e.preventDefault()

				var target = $(toggler_button.data('target'))

				target.addClass('d-none')
			})
		})

		// close notifications
		$('.notification-close').each((k,element) =>
		{
			var $parent = element.closest('.notification');
			
			$(element).off('click').on('click', e =>
			{ 
				$parent.remove();
			});
		});

	}, 2*1000);
}
checker_5_mins()
// Setup auto checker
function checker_5_mins()
{

	if ( !USER_CONFIG ) return
	if ( Object.keys(USER_CONFIG).length == 0 ) return
	// messages 
	var delay = 60 * 5;
	setInterval(async () => 
	{
		// notifications
		var NotificationParams = {
			query: '',
			advanced: {
				is_read: ST_NO,
				receiver_id: USER_CONFIG.employee_id,
				receiver_type_code: 'employees',
				select: {
					search: 'SELECT * FROM',
					replace: 'SELECT COUNT(id) as total FROM',
				}
			}
		}

		NOTIFICATION_MODEL.search(NotificationParams).then(res =>
		{
			// dispatch new-notifications-found
			var onNewNotificationsFound = new CustomEvent('new-notifications-found', { 
				detail: { 
					data: res.data[0].total,
					USER_CONFIG: USER_CONFIG,
				} 
			});
			document.dispatchEvent(onNewNotificationsFound)
		})

	}, delay * 1000);
	
}
localizationUI()
// localisation
function localizationUI()
{
	if ( !FUI_DISPLAY_LANG ) return
	if ( Object.keys(FUI_DISPLAY_LANG).length == 0 ) return
	// replace with files that has proper interface
	if ( FUI_DISPLAY_LANG.lang == 'ar' )
	{
		// change style sheet
		$('head').append('<link rel="stylesheet" type="text/css" class="MAIN_STYLESHEET" href="../assets/css/main_ar.css">');
		setTimeout(() => {
			$($('.MAIN_STYLESHEET')[0]).remove();
		}, 0);
		// change pagination scripts
		// $('#PAGINATION').remove();
		// $('body').append('<script type="text/javascript" id="PAGINATION" src="../assets/js/pagination_ar.js"></script>');
	}
	else if ( FUI_DISPLAY_LANG.lang == 'fr' )
	{
		// change style sheet
		$('head').append('<link rel="stylesheet" type="text/css" class="MAIN_STYLESHEET" href="../assets/css/main_fr.css">');
		setTimeout(() => {
			$($('.MAIN_STYLESHEET')[0]).remove();
		}, 0);
		// change pagination scripts
		// $('#PAGINATION').remove();
		// $('body').append('<script type="text/javascript" id="PAGINATION" src="../assets/js/pagination_fr.js"></script>');
	}
}

// Register docit user
if ( !DEFAULT_INI_SETTINGS.DOCIT_USER.USER_ID )
{
	DocitUserWorker.postMessage({
		USER_CONFIG,
		DEFAULT_INI_SETTINGS,
		employee_types: {
			EMP_TYPE_GENERAL_MANAGER,
		}
	})

	DocitUserWorker.onmessage = (e) => {
		const data = e.data

		SETTINGS_MODEL.update({
			DOCIT_USER: {
				USER_ID: data.id,
				USER_NAME: data.name,
			}
		}).then(data => {
			loadIniSettingsSync()
		})
	}	
}

// new-messages-found
$(document).off('new-messages-found').on('new-messages-found', e =>
{
	var detail = e.originalEvent.detail

	var MESSAGES_BADGE = SIDE_NAV_CONTAINER.find('#MESSAGES_BADGE')
	MESSAGES_BADGE.text( trimNumber(detail.data.length) )
	CreateToast('PS', FUI_DISPLAY_LANG.views.messages.you_have_new_unread_messages)
})
// new-message-replies-found
$(document).off('new-message-replies-found').on('new-message-replies-found', e =>
{
	var detail = e.originalEvent.detail

	var MESSAGES_BADGE = SIDE_NAV_CONTAINER.find('#MESSAGES_BADGE')
	MESSAGES_BADGE.text( trimNumber(detail.data.length) )
	CreateToast('PS', FUI_DISPLAY_LANG.views.messages.you_have_new_unread_message_replies)
})
// ringing-bell-found
$(document).off('ringing-bell-found').on('ringing-bell-found', async e =>
{
	var detail = e.originalEvent.detail
	
	console.log(detail)
	const DataURI = require('../assets/js/include/DataURI');
	var ringin_bell_data = {
		triggered_by_employee_type_id: detail.data.from.triggered_by_employee_type_id,
		triggered_by_id: detail.data.from.triggered_by_id,
		triggered_by_name: detail.data.from.triggered_by_name,
		administration_id : detail.data.to.administration_id,
		employee_type_id: detail.data.to.employee_type_id,
		settings: detail.data.from.data,
	}

	var ringing_bell_id = "ringing_bell_audio_element_be298c6490c13d98294f84a3e52a42f8"
	var ringing_bell_audio_element = $('#'+ringing_bell_id)
	var ringing_bell_audio_html = `<audio src="" id="${ringing_bell_id}"></audio>`

	var stop_bell_button_id = 'stop_ringing_bell_button_be298c6490c13d98294f84a3e52a42f8'
	var stop_bell_button_element = $('#'+stop_bell_button_id)
	var stop_bell_button_html = `<a class="stop-bell-button d-none" id="${stop_bell_button_id}">
									<img src="../assets/img/utils/stop-bell-ringing.png" class="img-fluid" alt="">
								</a>`

	// show toast
	CreateToast('PS', ringin_bell_data.settings.TEXT_MESSAGE, ringin_bell_data.triggered_by_name, 3500*1000);

	// append stop bell button
	if ( !stop_bell_button_element[0] )
	{
		$(stop_bell_button_html).insertBefore(MAIN_CONTENT_CONTAINER)
		stop_bell_button_element = $('#'+stop_bell_button_id)
	}
	// show stop bell button
	stop_bell_button_element.removeClass('d-none')
	//
	stop_bell_button_element.off('click').on('click', e =>
	{
		e.preventDefault()

		// Send notification back
		RINGING_BELL_PUSH_NOTIFICATIONS_SOCKET_MODEL_SENDER.mcast().send({
			to: {
				employee_type_id: ringin_bell_data.triggered_by_employee_type_id,
				administration_id: ringin_bell_data.administration_id,
			},
			notificationBack: {
				title: USER_CONFIG.employee_name,
				body: FUI_DISPLAY_LANG.views.pages.global.text105,
			}
		})

		if ( !ringing_bell_audio_element[0] ) return

		//check if still playing
		if ( !ringing_bell_audio_element[0].paused )
		{
			ringing_bell_audio_element[0].pause()
			ringing_bell_audio_element[0].currentTime = 0
			ringin_bell_data = null
		}
		stop_bell_button_element.addClass('d-none')
	})

	// hide stop bell button
	if ( ringin_bell_data ) 
	{
		// stop_bell_button_element.addClass('d-none')

		// check it is current target employee type
		if ( USER_CONFIG.employee_type_id == ringin_bell_data.employee_type_id )
		{
			if ( !ringing_bell_audio_element[0] )
			{
				$(ringing_bell_audio_html).insertBefore(MAIN_CONTENT_CONTAINER)
				ringing_bell_audio_element = $('#'+ringing_bell_id)
			}
			// set loop
			ringing_bell_audio_element[0].loop = true
			// check if source empty
			if ( ringing_bell_audio_element.attr('src') == '' )
				ringing_bell_audio_element.attr('src', DataURI.RINGING_BELL_AUDIO)

			//check if still playing
			if ( ringing_bell_audio_element[0].paused )
			{
				ringing_bell_audio_element[0].play()	
			}
			// set timeout end
			setTimeout(() => 
			{
				
				ringing_bell_audio_element[0].pause()
				ringing_bell_audio_element[0].currentTime = 0
				ringin_bell_data = null

			}, parseInt(ringin_bell_data.settings.DELAY_TIMEOUT)*1000);
		}

	}
})
// new-ajax-content-loaded
$(document).off('new-ajax-content-loaded').on('new-ajax-content-loaded', e =>
{
	var detail = e.originalEvent.detail
	
	setupPermissions();

	// switch to center dashboard
	$('.js_switch_to_center_dashboard').each((k,v) =>
	{
		const button = $(v)

		button.off('click').on('click', e=>
		{
			e.preventDefault()

			PromptConfirmDialog().then(() =>
			{

				const centerId = button.data('center-id')
				const centerName = button.data('center-name')

				saveDashboardSwitcherUserConfig(USER_CONFIG)

				USER_CONFIG.administration.clinicId = centerId
				USER_CONFIG.administration.clinicName = centerName
				USER_CONFIG.hasAllPermissions = true

				deleteFileSync(USER_CONFIG_FILE)
				saveUserConfigSync(USER_CONFIG)
				createWindow({
					page: 'CenterEmployeeWindow/index.ejs',
					name: 'WIN_'+USER_CONFIG.LOGIN_TYPE,
					maximized: true,
				});
				// close current window
				closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);

			})
		})
	})
	// switch to central administration dashboard
	$('.js_switch_to_central_administration_dashboard').each((k,v) =>
	{
		const button = $(v)

		button.off('click').on('click', e=>
		{
			e.stopPropagation()
			e.preventDefault()

			PromptConfirmDialog().then(() =>
			{
				const DASHBOARD_SWITCHER_USER_CONFIG = dashboardSwitcherUserConfig()
				deleteFileSync(USER_CONFIG_FILE)
				saveUserConfigSync(DASHBOARD_SWITCHER_USER_CONFIG)
				createWindow({
					page: 'CentralAdministrationEmployeeWindow/index.ejs',
					name: 'WIN_'+DASHBOARD_SWITCHER_USER_CONFIG.LOGIN_TYPE,
					maximized: true,
				});
				// close current window
				closeWindow('WIN_'+USER_CONFIG.LOGIN_TYPE);
				deleteDashboardSwitcherUserConfig()
			})
		})
	})
	// print private appointment
	$('.js_print_private_appointment_list').each((k,v) =>
	{
		const list = $(v)

		list.off('click').on('click', async e =>
		{
			var target = $(e.target)
			
			if ( target.data('role') == 'print_invoice' )
			{
				const aptId = target.data('aptId')

				target.addClass('disabled')

				try 
				{
					var res = await APPOINTMENT_MODEL.show({
						aptId: aptId
					})
				} catch (error) 
				{
					target.removeClass('disabled')

					CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')

					return
				}

				target.removeClass('disabled')
				if ( !isNull(res.message) ) CreateToast('PS', res.message, '')

				if ( res.code == 404 ) return

				printPrivateAppointmentInvoice({
					data: res.data,
					class: target.data('print-class'),
				})
				
			}
		})
	})
	// go to create-patient-medical-data
	$('.js_go_to_create_patient_medical_data').each((k,v) =>
	{
		const button = $(v)

		button.addClass('cursor-pointer pointer')

		button.off('click').on('click', async e =>
		{
			e.preventDefault()

			const patientId = button.data('patient-id')
	
			button.addClass('disabled')

			try 
			{
				var res = await PATIENT_MODEL.show(patientId)
			} catch (error) 
			{
				button.removeClass('disabled')

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')

				return
			}

			button.removeClass('disabled')
			if ( !isNull(res.message) ) CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

        	goToPage('create-patient-medical-data', res.data)
		})
	})
	// go to patient profile
	$('.js_go_to_patient_profile').each((k,v) =>
	{
		const button = $(v)

		button.addClass('cursor-pointer pointer')

		button.off('click').on('click', async e =>
		{
			e.preventDefault()

			const patientId = button.data('patient-id')
	
			button.addClass('disabled')

			try 
			{
				var res = await PATIENT_MODEL.show(patientId)
			} catch (error) 
			{
				button.removeClass('disabled')

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')

				return
			}

			button.removeClass('disabled')
			if ( !isNull(res.message) ) CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

        	goToPage('show-patient-profile', res.data)
		})
	})
	// go to customer profile
	$('.js_go_to_customer_profile').each((k,v) =>
	{
		const button = $(v)

		button.addClass('cursor-pointer pointer')

		button.off('click').on('click', async e =>
		{
			e.preventDefault()

			const customerId = button.data('customer-id')
	
			button.addClass('disabled')

			try 
			{
				var res = await CUSTOMER_MODEL.show({
					id: customerId
				})
			} catch (error) 
			{
				button.removeClass('disabled')

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')

				return
			}

			button.removeClass('disabled')
			if ( !isNull(res.message) ) CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

        	goToPage('show-customer-profile', res.data)
		})
	})
	// go to contractor profile
	$('.js_go_to_contractor_profile').each((k,v) =>
	{
		const button = $(v)

		button.addClass('cursor-pointer pointer')

		button.off('click').on('click', async e =>
		{
			e.preventDefault()

			const contractorId = button.data('contractor-id')
	
			button.addClass('disabled')

			try 
			{
				var res = await CONTRACTOR_MODEL.show({
					id: contractorId
				})
			} catch (error) 
			{
				button.removeClass('disabled')

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')

				return
			}

			button.removeClass('disabled')
			if ( !isNull(res.message) ) CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

        	goToPage('show-contractor-profile', res.data)
		})
	})
	// go to distributor profile
	$('.js_go_to_distributor_profile').each((k,v) =>
	{
		const button = $(v)

		button.addClass('cursor-pointer pointer')

		button.off('click').on('click', async e =>
		{
			e.preventDefault()

			const distributorId = button.data('distributor-id')
	
			button.addClass('disabled')

			try 
			{
				var res = await EMPLOYEE_MODEL.show(distributorId)
			} catch (error) 
			{
				button.removeClass('disabled')

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')

				return
			}

			button.removeClass('disabled')
			if ( !isNull(res.message) ) CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

        	goToPage('show-distributor-profile', res.data)
		})
	})
	// go to center_product_page
	$('.js_go_to_center_product_page').each((k,v) =>
	{
		const button = $(v)

		button.addClass('cursor-pointer pointer')

		button.off('click').on('click', async e =>
		{
			e.preventDefault()

			const productId = button.data('product-id')
			const administration_id = button.data('administration-id')
	
			button.addClass('disabled')

			try 
			{
				var res = await PRODUCT_MODEL.center_show({
					productId: productId,
					administration_id: administration_id,
				})
			} catch (error) 
			{
				button.removeClass('disabled')

				CreateToast('PS', FUI_DISPLAY_LANG.views.messages.error, '')

				return
			}

			button.removeClass('disabled')
			if ( !isNull(res.message) ) CreateToast('PS', res.message, '')

			if ( res.code == 404 ) return

        	goToPage('show-center-product-page', res.data)
		})
	})
	// copy invoice
	$('.js_copy_invoice_button').each((k,v) =>
	{
		const button = $(v)

		button.addClass('cursor-pointer pointer')

		button.off('click').on('click', async e =>
		{
			e.preventDefault()

			const orderId = button.data('order-id')

			if ( USER_CONFIG.administration.clinicId != 0 )
			{
				CopyInvoiceDialog__Centers({
					order_id: orderId
				})
			}
			else
			{
				CopyInvoiceDialog__CentralAdmin({
					order_id: orderId
				})
			}
		})
	})
	// add input placeholders for empty placeholders
	$('input[type="text"], input[type="email"], input[type="number"], textarea').each((k,v) =>
	{
		const input = $(v)

		if ( isNull(input.attr('placeholder')) )
		{
			const label = input.prev()
			if ( !label[0] ) return
		
			if ( label[0].nodeName == 'LABEL' ) input.attr('placeholder', label.text() + '....')
		}
	})

	// deletable list items
	$('.js_deletable_list_item').each((k,v) =>
	{
		const item = $(v)

		item.find('.js_deletable_list_item__delete_button').off('click').on('click', e =>
		{
			const parent = item.closest('.js_deletable_list')
			item.remove()

			dispatchCustomEvent('deletable_list_item:item-deleted', {
				item: item,
				value: item.data('value'),
				name: item.data('name'),
			}, parent[0])
		})
	})

	// generatable qrcode images
	// $('.js_generatable_qrcode').each((k, element) =>
	// {
	// 	var image = $(element)

	// 	// generate a "Generate new qrcode" button or link after
	// 	var generate_qrcode_button_class = 'js_generate_qrcode_button_'
	// 	var generate_qrcode_button = image.next()
	// 	if ( !generate_qrcode_button[0] )
	// 	{
	// 		if ( !image.hasClass('d-none') )
	// 			$(`<a href="#" class="${generate_qrcode_button_class} d-block">${FUI_DISPLAY_LANG.views.pages.global.generate_qrcode_button}<a>`).insertAfter(image)
	// 	}

	// 	generate_qrcode_button = image.next()

	// 	generate_qrcode_button.off('click').on('click', async e =>
	// 	{
	// 		e.preventDefault()

	// 		var page = `${PROJECT_URL}view/prescription/${FUI_DISPLAY_LANG.lang}/?phash=${PrescObject.prescriptionHashId}`;
    // 		var qrcode = await generateQRCode( page );
	// 	})
	// })

	// checkable box
	$('.js_checkable_box').each((k,v) =>
	{
		const box = $(v)

		box.addClass('cursor-pointer')

		box.off('click').on('click', e =>
		{
			const checkbox = box.find('.js_row_checkbox')

			toggleCheck(checkbox)
           
            box.toggleClass('selected-box')
		})
	})
    // checkable box radio
    $('.js_checkable_radio_box').each((k,v) =>
    {
        const box = $(v)
		
		box.addClass('cursor-pointer')

        box.off('click').on('click', e =>
        {
            const parent = box.closest('.js_checkable_box_row')
            const checkbox = box.find('.js_row_checkbox')

            parent.siblings().find('.js_row_checkbox').prop('checked', false)
            parent.siblings().find('.js_checkable_radio_box').removeClass('selected-box')
            checkbox.prop('checked', true)

            box.addClass('selected-box')
        })
    })
    // select all checkboxes
	$('.js_select_all_rows_button').each((k,v) =>
	{
		const button = $(v)

		button.off('click').on('click', e =>
		{
			const target = $(button.data('target'))
            const boxes = target.find('.js_checkable_box')
            const radioboxes = target.find('.js_checkable_radio_box')

            boxes.trigger('click')
		})
	})

	// select all checkboxes in table
	$('.js_table_element_select_all_button').each((k,v) =>
	{
		const button = $(v)

		button.off('click').on('click', e =>
		{
			const table = button.closest('.js_table_element')
			const checkboxes = table.find('[data-role="CHECK"]')

			// toggle checkboxes
			toggleCheck(checkboxes)
		})
	})

	// update input[type="time"]
	$('input[type="time"]').each((k,element) =>
	{
		const input = $(element)
		
		var currentTime = date_time.format(new Date(), 'HH:mm:ss')
		
		input.val(currentTime)
	})
	// update input[type="date"]

	$('input[type="date"]').each((k,element) =>
	{
		const input = $(element)

		if ( input.data('ignore-value-autorefresh') ) return

		input.val(CURRENT_DATE)
	})

	// js_list_tabs_navs
	$('.js_list_tabs_navs').each((k, element) =>
	{
		var list = $(element)

		list.off('click').on('click', e =>
		{
			var target = $(e.target)

			if ( target[0].nodeName == 'LI' || target.hasClass('js_list_tab_nav') )
			{
				var tab = $(target.data('target'))

				target.closest('.js_list_tabs_navs').find('.js_list_tab_nav').removeClass('active')
				target.addClass('active')
				
				if ( !tab[0] ) return;
				tab.slideDown(200).siblings('[data-role="tab_content"]').slideUp(200)
				
				// dispatch tab changed event
				var onTabChanged = new CustomEvent('tab-changed', { 
					detail: { 
						tab: {
							id: tab.attr('id'),
							trigger: target
							// classes: tab.attr('class').split(' ')
						},
						USER_CONFIG: USER_CONFIG,
					} 
				});
				list[0].dispatchEvent(onTabChanged)

				dispatchCustomEvent('tab:opened', {}, tab[0])
			}
		})
	})

	// croppable images
	$('[data-croppable="true"]').each((k, element) =>
	{
		var image = $(element)

		// append a "crop image" button or link after
		var crop_image_button_class = 'js_crop_image_button_'
		var crop_image_button = image.next()
		if ( !crop_image_button[0] )
		{
			if ( !image.hasClass('d-none') )
				$(`<a href="#" class="${crop_image_button_class} d-block">${FUI_DISPLAY_LANG.views.pages.global.crop_image_button}<a>`).insertAfter(image)
		}

		crop_image_button = image.next()

		crop_image_button.off('click').on('click', e =>
		{
			e.preventDefault()

			var testImg = new Image()

			testImg.src = image.attr('src')

			testImg.addEventListener('load', e =>
			{
				PreviewImageDialog({
					url: image.attr('src'),
					action: 'crop',
				}, data =>
				{
					image.attr('src', data.url)
				})

				// ImageCropperDialog({
				// 	url: image.attr('src'),
				// 	// maxSize : [testImg.width, testImg.height],
				// }, data =>
				// {
				// 	image.attr('src', data.url)
					
				// })
			})
		})
	})

	// set custom area-placeholder
	$('.js_has_area_placeholder').each((k,v) =>
	{
		const element = $(v)
		var placeholder = `<p class="js_content_editable_placeholder fw-300 no-pointer" style="color: #767676;">${element.attr('area-placeholder')}</p>`

		if ( !element.is(':focus') )
		{
			if ( checkContentEditableEmpty(element) ) element.html(placeholder)
		}

		element.on('focus',e =>
		{
			var js_content_editable_placeholder = element.find('.js_content_editable_placeholder')

			if ( !js_content_editable_placeholder[0] ) return

			js_content_editable_placeholder.remove()

			element[0].focus()
		})
		.on('blur',e =>
		{
			if ( checkContentEditableEmpty(element) )
			{
				element.html(placeholder)
				return
			}
		})
	})

	// preview selected files in file input
	$('.js_file_input_previewable').each((k,v) =>
	{
		const element = $(v)

		element.on('change', async e =>
		{
			if ( element[0].files.length == 0 ) return

			var previewTarget = $(element.data('preview-target'))
			var dataURL = await imageToDataURL(element[0].files[0])

			previewTarget.attr('src', dataURL).removeClass('d-none')
			dispatch_onNewAjaxContentLoaded()
			dispatchCustomEvent('file-selected', {
				id: element.attr('id'),
				files: element[0].files,
				dataURLs: [dataURL],
			}, element[0])
		})
	})

	// preview images
	$('.js_img_previewable').each((k,v) =>
	{
		const img = $(v)
		img.addClass('cursor-pointer pointer')

		img.on('click', async e =>
		{
			PreviewImageDialog({
				url: img.attr('src'),
			}, edited =>
			{
				img.attr('src', edited.url)
			})
		})
	})
	// preview videos
	$('.js_video_previewable').each((k,v) =>
	{
		const video = $(v)
		video.addClass('cursor-pointer pointer').attr('controls', false)

		video.on('click', async e =>
		{
			video.addClass('no-pointer')

			setTimeout(() => {
				video.removeClass('no-pointer')
			}, 3*1000);

			PreviewVideoDialog({
				url: video.attr('src'),
			})
		})
	})

	// preview links
	$('.js_link_previewable').each((k,v) =>
	{
		const link = $(v)
		link.addClass('cursor-pointer pointer')

		link.on('click', async e =>
		{
			e.preventDefault()

			if ( isImageFile(link.attr('href')) )
			{
				PreviewImageDialog({
					url: link.attr('href'),
				})
			}
			
			if ( isPDFFile(link.attr('href')) )
			{
				PreviewPDFDialog({
					url: link.attr('href')
				})
			}


			if ( isVideoFile(link.attr('href')) )
			{
				PreviewVideoDialog({
					url: link.attr('href')
				})
			}
		})
	})

	// set image alt src
	$('.js_image_src_placeholder').each((k,v) =>
	{
		const element = $(v)

		if ( isNull(element.attr('src')) )
		{
			var img = new Image

			img.src = element.data('placeholder')
			img.addEventListener('load', e =>
			{
				var canvas = document.createElement('canvas')
				var ctx = canvas.getContext('2d')

				canvas.width = img.width
				canvas.height = img.height

				ctx.drawImage(img, 0,0)
				// second check
				if ( isNull(element.attr('src')) ) element.attr('src', canvas.toDataURL() )
			})
			
		}
	})

	// print source url
	$('.js_trigger_print_source_url_dialog').each((k,v) =>
	{
		const element = $(v)

		element.off('click').on('click', e =>
		{
			e.preventDefault()
			if ( element[0].nodeName == 'A' )
			{
				const url = element.attr('href')

				if ( isImageFile(url) )
				{
					var style = `
								display: block;
								-webkit-user-select: none;
								margin: auto;
								background-color: hsl(0, 0%, 90%);
								transition: background-color 300ms;
								overflow-clip-margin: content-box;
								overflow: clip;
								max-width: 100%;
								max-height: 100%;`
					var html = `<img src="${url}" style="${style}">`

					printHTMLToPdf(html, {
						width: 0,
						height: 0,
						top: 10000,
						left: 10000,
					})
				}	
			}
		})
	})

	// add progress bar after each file input
	$('.js_file_input_has_progress').each((k,v) =>
	{
		const input = $(v)

		var html = `<div class="progress d-none">
						<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>
					</div>`
		//
		if ( input.next().hasClass('progress') ) return
		$(html).insertAfter(input)
	})

	// panel toggler
	$('.js_panel_toggler_button').each((k,v) =>
	{
		const button = $(v)

		button.off('click').on('click', e =>
		{
			const target = $(button.data('target'))
	
			target.removeClass('d-none')
			// dispatch open event
			var onPanelOpened = new CustomEvent('panel:opened', { 
				detail: { 
					panel: target,
					trigger: button,
				} 
			});
			document.dispatchEvent(onPanelOpened)
			dispatchCustomEvent('panel:opened', {
				panel: target,
				trigger: button,
			}, target[0])
		})
	})
	// panel close
	$('.js_panel_close_button').each((k,v) =>
	{
		const button = $(v)

		button.on('click', e =>
		{
			const target = $(button.data('target'))

			target.addClass('d-none')
		})
	})

})


// try {
// 	var res = await ORDER_MODEL.direction_center_to_center_unconfirmed_transfer_confirm({
// 		order_id: 497
// 	})

// 	console.log(res)
// } catch (error) {
// 	console.error(error)
// }

// try {
// 	var res = await ORDER_MODEL.external_dr_aoun__direction_central_administration_to_center_unconfirmed_selling_store({
// 		user_id: 4, 
// 		order_receiver_name: 'ALGER', 
// 		supplier_id: 0,
// 		supplier_name: "Administration Centrale",
// 		order_amount_paid: 0,
// 		order_total_amount: 600,
// 		order_dept_amount: 0,

// 		items: [
// 			{
// 				order_item_id: 156, // product id
// 				order_item_quantity: 5,
// 				order_item_price: 0,
// 				order_item_unit: '',
// 			},
// 			{
// 				order_item_id: 157, // product id
// 				order_item_quantity: 5,
// 				order_item_price: 0,
// 				order_item_unit: '',
// 			},
// 		]
// 	})

// 	console.log(res)
// } catch (error) {
// 	console.error(error)
// }

// const res = await CLINIC_MODEL.advancedSearch({
// 	query: '',
// 	advanced: {
// 		parent_id: 4,
// 		has_parent: false,
// 	}
// })

// console.log(res.data)


// $.ajax({
// 	url: 'https://docteur-aoun.com/api/Prescriptions/advancedSearch',
// 	type: 'POST',
// 	data: {
// 		query: '',
// 		advanced: {
// 			clinicId: 4
// 		}
// 	},
// 	success: function(res)
// 	{
// 		console.log(res)
// 	}
// })


})