var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

var db;
var currentEdit = null;

$(document).ready(function () {
    var openReq = indexedDB.open("Store", 1);
    openReq.onupgradeneeded = function (e) {
        db = e.target.result;

        var store = db.createObjectStore("AB Shoping", { keyPath: "id", autoIncrement: true });
        console.log(store);
    }

    openReq.onsuccess = function (e) {
        db = e.target.result;
        console.log(db);
        readAll();

        //Add Data
        $("#add").click(function () {
            if ($("#brand").val() != "" && $("#model").val() != "" && $("#price").val() != "" && $("#productPhoto").val() != "") {
                var tx = db.transaction(["AB Shoping"], "readwrite");
                if (currentEdit == null) {
                    var store = tx.objectStore("AB Shoping");
                    var req = store.add({
                        ProductPhoto: $("#productPhoto").val(),
                        Brand: $("#brand").val(),
                        Model: $("#model").val(),
                        Price: $("#price").val()
                    });
                    req.onsuccess = function (e) {
                        console.log("Added data...");
                        readAll();
                    }
                }
                else {
                    var store = tx.objectStore("AB Shoping");
                    var req = store.put({
                        ProductPhoto: $("#productPhoto").val(),
                        Brand: $("#brand").val(),
                        Model: $("#model").val(),
                        Price: $("#price").val(),
                        id: currentEdit.id
                    });
                    req.onsuccess = function (e) {
                        console.log("Updated data...");
                        readAll();
                    }
                }
                $("#add").val("Add New");
                currentEdit = null;
            }
            else {
                alert("Please fill up the all fields!!!");
            }
        });
    }
});

function readAll() {
    $("#tbl tbody").empty();
    var tx = db.transaction(["AB Shoping"], "readonly");
    var req = tx.objectStore("AB Shoping").openCursor();
    req.onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) return;
        $("#tbl tbody").append(
            "<tr>" +
            "<td>" + cursor.value.ProductPhoto + "</td>" +
            "<td>" + cursor.value.Brand + "</td>" +
            "<td>" + cursor.value.Model + "</td>" +
            "<td>" + cursor.value.Price + "</td>" +
            "<td>" + "<button type='button' class='edit' data-key='" + cursor.key + "'>Edit</button>|<button type = 'button' class='delete' data-key='" + cursor.key + "'>Delete</button>" + "</td>" +
            "</tr>"
        )
        cursor.continue();
    }
    req.onerror = function (err) {
        console.log(err);
    }
    //for delete
    tx.oncomplete = function () {
        $(".delete").click(function () {
            var id = $(this).attr('data-key');
            var row = $(this).parent().parent();
            var tx = db.transaction(["AB Shoping"], "readwrite");
            var store = tx.objectStore("AB Shoping");
            var req = store.delete(parseInt(id));
            req.onsuccess = function (e) {
                console.log("Data deleted successfullly!!!!");
                row.remove();
            }
        })

        //For edit
        $(".edit").click(function (evt) {
            evt.preventDefault();
            fillForm($(this).attr('data-key'));
        })
    }
}

function fillForm(id) {
    var t = db.transaction(["AB Shoping"], "readwrite");
    var objStore = t.objectStore("AB Shoping");
    var request = objStore.get(parseInt(id));
    request.onsuccess = function (evt) {
        currentEdit = request.result;
        console.log(currentEdit);
        $("#productPhoto").val(currentEdit.ProductPhoto);
        $("#brand").val(currentEdit.Brand);
        $("#model").val(currentEdit.Model);
        $("#price").val(currentEdit.Price);
        $("#add").val("Update");
    }
}


