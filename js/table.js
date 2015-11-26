(function() {
	'use strict';

	var SMALL_DATA_LINK = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
	var BIG_DATA_LINK = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
	var PAGE_SIZE = 50;
	var TBL_FIELDS = ['id', 'firstName', 'lastName', 'email', 'phone'];

	var btnSmall = document.getElementsByClassName('js-load-small')[0],
		btnBig = document.getElementsByClassName('js-load-big')[0],
		tbl = document.getElementsByClassName('table')[0],
		info = document.getElementsByClassName('js-user-info')[0],
		btnFilter = document.getElementsByClassName('js-btn-filter')[0],
		inputFilter = document.getElementsByClassName('js-input-filter')[0],
		currentPage = document.getElementsByClassName('js-current-page')[0],
		prevPageBtn = document.getElementsByClassName('js-prev-page')[0],
		nextPageBtn = document.getElementsByClassName('js-next-page')[0],
		currentUserName = document.getElementsByClassName('js-current-user')[0],
		currentUserDescription = document.getElementsByClassName('js-user-description')[0],
		currentUserAddress = document.getElementsByClassName('js-user-adress')[0],
		currentUserCity = document.getElementsByClassName('js-user-city')[0],
		currentUserState = document.getElementsByClassName('js-user-state')[0],
		currentUserZip = document.getElementsByClassName('js-user-zip')[0],
		paging = document.getElementsByClassName('js-paging')[0],
		progress = document.getElementsByClassName('progress')[0],
		sOrder, filtered = false,
		sortedBy, index, usersDataArray, currentUser;

	btnSmall.onclick = loadSmallData;
	btnBig.onclick = loadBigData;
	btnFilter.onclick = doFilter;
	prevPageBtn.onclick = loadPreviousPage;
	nextPageBtn.onclick = loadNextPage;
	tbl.onclick = tblClickListener;

	function loadSmallData() {
		loadUsersData(SMALL_DATA_LINK);
	}

	function loadBigData() {
		loadUsersData(BIG_DATA_LINK);
	}

	function loadUsersData(link) {
		showProgress();
		index = 0;
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			usersDataArray = JSON.parse(xhr.responseText);
			sOrder = 'asc';
			createTable(usersDataArray, sOrder);
			paging.classList.remove('hidden');
			hideProgress();
		};
		xhr.onerror = function() {
			alert('Не удалось загрузить данные!');
			return;
		};
		xhr.open("GET", link);
		xhr.send();
	}

	function createTable(array, sortOrder) {
		inputFilter.value = '';
		tbl.innerHTML = '';
		createTableHeaders();
		createTableData(array, sortOrder);
	}

	function createTableHeaders() {
		var tr = document.createElement('tr');
		TBL_FIELDS.forEach(function(el) {
			var th = document.createElement('th');
			th.textContent = el;
			th.classList.add(el === sortedBy ? 'sort-asc' : 'sort-desc');
			tr.appendChild(th);
		});
		tbl.appendChild(tr);
	}

	function createTableData(array, sortOrder) {
		if (sortOrder === 'asc') {
			sortAsc(array);
		} else if (sortOrder === 'desc') {
			sortDesc(array);
		}
		currentPage.textContent = index + 1;
		info.classList.add('hidden');
	}

	function createTableRow(row) {
		var tr = document.createElement('tr');
		TBL_FIELDS.forEach(function(el) {
			var td = document.createElement('td');
			td.textContent = row[el];
			tr.appendChild(td);
		});
		tbl.appendChild(tr);
	}

	function sortAsc(array) {
		var i;
		if (array.length <= PAGE_SIZE) {
			for (i = 0; i < array.length; i++) {
				createTableRow(array[i]);
			}
		} else {
			for (i = index * PAGE_SIZE; i < (index + 1) * PAGE_SIZE; i++) {
				createTableRow(array[i]);
			}
		}
	}

	function sortDesc(array) {
		var i;
		if (array.length <= PAGE_SIZE) {
			for (i = array.length - 1; i >= 0; i--) {
				createTableRow(array[i]);
			}
		} else {
			for (i = array.length - index * PAGE_SIZE - 1; i >= array.length - (index + 1) * PAGE_SIZE; i--) {
				createTableRow(array[i]);
			}
		}
	}

	function tblClickListener(event) {
		if (event.target.tagName == 'TD') {
			showUserInfo();
		} else if (event.target.tagName == 'TH') {
			sortTable(event.target);
		}
	}

	function showUserInfo() {
		info.classList.remove('hidden');
		if (currentUser) {
			currentUser.classList.remove('clicked');
		}
		currentUser = event.target.parentNode;
		currentUser.classList.add('clicked');
		var id = event.target.parentNode.children[0].textContent,
			firstName = event.target.parentNode.children[1].textContent,
			lastName = event.target.parentNode.children[2].textContent;
		var row = findUser(id, firstName, lastName);
		currentUserName.textContent = row.firstName + ' ' + row.lastName;
		currentUserDescription.textContent = row.description;
		currentUserAddress.textContent = row.adress.streetAddress;
		currentUserCity.textContent = row.adress.city;
		currentUserState.textContent = row.adress.state;
		currentUserZip.textContent = row.adress.zip;
	}

	function findUser(id, firstName, lastName) {
		var row;
		for (var i = 0; i < usersDataArray.length; i++) {
			if (usersDataArray[i].id == id &&
				usersDataArray[i].firstName == firstName &&
				usersDataArray[i].lastName == lastName) {
				return usersDataArray[i];
			}
		}
	}

	function sortTable(propField) {
		if (sortedBy && sortedBy == propField.textContent) {
			sortedBy = '';
			sOrder = 'desc';
			createTable(usersDataArray, sOrder);
		} else {
			sOrder = 'asc';
			sortedBy = propField.textContent;
			usersDataArray = usersDataArray.sort(function compare(a, b) {
				if (a === b) {
					return 0;
				}
				return a[sortedBy] < b[sortedBy] ? -1 : 1;
			});
			createTable(usersDataArray, sOrder);
		}
	}

	function doFilter() {
		var val = inputFilter.value;
		var trs = tbl.children;
		var invisibleElems = [];
		for (var i = trs.length - 1; i >= 1; i--) {
			var tr = trs[i];
			var tds = tr.children;
			var hidden = true;
			for (var j = tds.length - 1; j >= 1; j--) {
				var td = tds[j];
				if (td.textContent.indexOf(val) !== -1) {
					hidden = false;
				}
			}
			if (hidden) {
				invisibleElems[invisibleElems.length] = tr;
			}
		}
		changeElementsVisibility(trs, invisibleElems);
	}

	function changeElementsVisibility(allElems, invisibleElems) {
		for (var i = allElems.length - 1; i >= 0; i--) {
			allElems[i].classList.remove('hidden');
		}
		for (i = invisibleElems.length - 1; i >= 0; i--) {
			invisibleElems[i].classList.add('hidden');
		}
	}

	function loadPreviousPage() {
		if (index > 0) {
			index--;
			createTable(usersDataArray, sOrder);
		}
	}

	function loadNextPage() {
		if (!usersDataArray) return;
		if (index < parseInt(usersDataArray.length / PAGE_SIZE) - 1) {
			index++;
			createTable(usersDataArray, sOrder);
		}
	}

	function showProgress() {
		progress.classList.remove('hidden');
	}

	function hideProgress() {
		progress.classList.add('hidden');
	}
})();