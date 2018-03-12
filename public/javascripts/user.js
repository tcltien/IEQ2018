$(document).ready(function() {
	var video = $('#video')[0];  
	// Get access to the camera!
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		});
	}
  
	var imageCapture = $('#imageCapture')[0];
	var context = imageCapture.getContext('2d');
  
	// Trigger photo take
	$("#snap").on("click", function() {
		context.drawImage(video, 0, 0, 200, 150);
		var dataUrl = imageCapture.toDataURL();
		$('#canvasImage').attr('src', dataUrl);
	});
  
	$('#showAllNav').on('click', function(e){
	  e.preventDefault();
	  checkVisibleDiv("list");
	});
  
	$('#registerNav').on('click', function(e){
	  e.preventDefault();
	  checkVisibleDiv("register");
  

	});

	/*
	 *  Handle click event of register button
	 *
	 */
	$('#btnRegister').on('click', function(){	
		var nameText = $('.txtName').val();
		var phoneText = $('.txtPhone').val();
		var imageCaptureSource = $('#canvasImage').attr('src');
		var dateTime = moment().toDate();
		if (validate(nameText, phoneText, imageCaptureSource, "register")) {
			show('loading', true);
			$.ajax({
				url: "/users/register",
				type: "POST",
				data: {
					name: nameText,
					phone: phoneText,
					dateTime: formatDateTimeYMD(),
					imageCaptureSource: imageCaptureSource
				},
				success: function (data) {
					if (data.success) {
						toastr.success("Register Successfully");
						show('loading', false);
						dataTableObj.row.add([
							'<img id="" class="rowImage" src="' + imageCaptureSource + '" class="">', 
							'<input data-id=' + data.users.insertedIds[0] + ' type="text" class="nameText" readonly value="'+ nameText +'">',
							'<input type="text" class="phoneText" readonly value="'+ phoneText + '">',
							'"' + formatDateTime(dateTime) +'"',
							'<button class="btnUpdate btn btn-success">Edit</button><button class="btnDelete btn btn-danger">Delete</button>'
						]).draw(false);
						// move to last page
						dataTableObj.page('last').draw(false);
						clearRegisterForm();
					} else {
						toastr.error("Something went wrong, register error!");
					}
				},
				error: function(e) {
					toastr.error("Something went wrong, please try again later");
				}
			});
		}
	});

	/*
	 *  Handle click event of edit/update button
	 *
	 */
	$(document).on('click', '.btnUpdate', function() {
		var _id = $(this).closest('tr').find('.nameText').data('id');
		var nameEl = $(this).closest('tr').find('.nameText');
		var phoneEl = $(this).closest('tr').find('.phoneText');
		var btnName = $(this);
		
		if (btnName.text().toLocaleLowerCase() === 'edit') {			
			nameEl.focus();
			nameEl.removeAttr('readonly');
			phoneEl.removeAttr('readonly');
			moveCursorToEnd(nameEl[0]);
			btnName.text('Update');
		} else {
			var name = nameEl.val();
			var phone = phoneEl.val();
			show('loading', true);
			if (validate(name , phone, "" , "update")) {
				// send request to server
				$.ajax({
					// TODO: Using url: register for test - change after write server side to: deleteUser 
					url: "/users/update",
					type: "POST",
					data: {
						_id: _id,
						name: name,
						phone: phone
					},
					success: function (data) {
						if (data.success) {
							toastr.success('Update Successfully');
							nameEl.attr('readonly', 'readonly');
							phoneEl.attr('readonly', 'readonly');
							btnName.text('Edit');
							show('loading', false);
						} else {
							toastr.error("Something went wrong, update error!")
						}
						
					},
					error: function(e) {
						toastr.error("omething went wrong, please try again later");
					}
				});
			}
		}
	});
	
	/*
	 *  Handle click event of delete button
	 *
	 */
	$(document).on('click', '.btnDelete', function() {
		var _id = $(this).closest('tr').find('.nameText').data('id');
		var name = $(this).closest('tr').find('.nameText').val();
		var phone = $(this).closest('tr').find('.phoneText').val();
		if (validate(name, phone, "" , "delete")) {
			$('#confirmModal').modal('show');
			$('.modal-name').text(name);
			$('.modal-name').data('id', _id);
			$('.modal-phone').text(phone);
			// mark row deleted
			$(this).closest('tr').addClass('selected');
		}
	});

	/*
	 *  Handle deletion when user confirm
	 *
	 */
	$(document).on('click', '#btnConfirmNo', function() {		
		$('#table-data tbody').find('tr.selected').removeClass('selected');
	});

	$(document).on('click', '#btnConfirmYes', function(){
		$('#confirmModal').modal('hide');
		show('loading', true);
		// send request to server
		$.ajax({			
			url: "/users/delete",
			data: {
				_id: $('.modal-name').data('id')
			},
			success: function (data) {
				if (data.success) {
					toastr.success("Delete user successfully");
					show('loading', false);
					dataTableObj.row('.selected').remove().draw( false );	
				} else {
					toastr.error("Something went wrong, delete error!");
				}
			},
			error: function(e) {
				toastr.error("Something went wrong, delete error!");
			}
		});
	});

	/*
	 *  checking state of div
	 *
	 */
	function checkVisibleDiv(type) {
	  if (type === "list") {
		$('#listAll-div').removeClass("hidden");
		$('#register-div').addClass("hidden");
	  } else if (type === "register") {
		$('#listAll-div').addClass("hidden");
		$('#register-div').removeClass("hidden");
	  }
	}

	/*
	 *  Moving cursor to end 
	 *
	 */
	function moveCursorToEnd(el) {
		if (typeof el.selectionStart == "number") {
			el.selectionStart = el.selectionEnd = el.value.length;
		} else if (typeof el.createTextRange != "undefined") {
			el.focus();
			var range = el.createTextRange();
			range.collapse(false);
			range.select();
		}
	}

	

	function formatDateTimeYMD(dateTime) {
		return moment().format("YYYYMMDDHHmmssSS");
	}

	/*
	 *  Validate Input
	 *
	 */
	function validate(name, phone, imageCaptureSource, type) {
		if (name == "") {
			toastr.error('Vui lòng nhập tên!')
			return false;
		} else if (phone == "") {
			toastr.error('Vui lòng nhập số điện thoại!')
			return false;
		} 
		if (type == "register") {
			if (imageCaptureSource == "") {
				toastr.error('Vui lòng chụp ảnh!')
				return false;
			}
		}
		return true;
	}

	function clearRegisterForm() {
		$('.txtName').val("");
		$('.txtPhone').val("");
		$('#canvasImage').attr("src", "");
		context.clearRect(0, 0, 200, 150);
	}

	function show(id, value) {
		document.getElementById(id).style.display = value ? 'block' : 'none';
	}
	
	toastr.options = {
		"closeButton": true,
		"debug": false,
		"newestOnTop": true,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "500",
		"timeOut": "3000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	  }
});

/*
 *  Format Date time
 *
 */
function formatDateTime(dateTime) {
	return moment(dateTime, "YYYYMMDDHHmmssSS").fromNow();
}