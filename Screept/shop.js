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
    }
});

function readAll() {
    $("#tbl tbody").empty();
    var tx = db.transaction(["AB Shoping"], "readonly");
    var req = tx.objectStore("AB Shoping").openCursor();
    req.onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) return;
        $("#productContainer").append(
            `<div class="pro">
                            <img src="Images/${cursor.value.ProductPhoto}" />
                            <div class="description">
                                <span>${cursor.value.Brand}</span>
                                <h5>${cursor.value.Model}</h5>
                                <h4>Price: ${cursor.value.Price}/-</h4>
                            </div>
                            <button href="#"><img class="cartPic" src="Images/shopping-cart.jpg" /></button>
                            <button href="#" class="btnView">View Details</button>
                        </div>`
        )
        cursor.continue();
    }
    req.onerror = function (err) {
        console.log(err);
    }
}
$("#btnSearch").on('click', function () {
    var searchText = $("#searchbox").val();

    $("#productContainer").empty();
    var tx = db.transaction(["AB Shoping"], "readonly");
    var req = tx.objectStore("AB Shoping").openCursor();
    req.onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) return;
        if (cursor.value.Model.includes(searchText)) {
            $("#productContainer").append(
                `<div class="pro">
                            <img src="Images/${cursor.value.ProductPhoto}" />
                            <div class="description">
                                <span>${cursor.value.Brand}</span>
                                <h5>${cursor.value.Model}</h5>
                                <h4>Price: ${cursor.value.Price}/-</h4>
                            </div>
                            <button href="#"><img class="cartPic" src="Images/shopping-cart.jpg" /></button>
                            <button href="#" class="btnView">View Details</button>
                        </div>`
            );
        }
        cursor.continue();
    }
    req.onerror = function (err) {
        console.log(err);
    }

});