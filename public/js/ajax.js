"use strict";

$(document).ready(function () {

    // New to do Item
    $("#new-todo-form").submit(function (e) {
        e.preventDefault();

        var toDoItem = $(this).serialize();

        $.post("/todos", toDoItem, function (data) {
            $("#todo-list").append("\n                    <li class=\"list-group-item\">\n    \t\t\t\t\t<span class=\"lead\">\n    \t\t\t\t\t\t" + data.text + "\n    \t\t\t\t\t</span>\n    \t\t\t\t\t<div class=\"pull-right\">\n    \t\t\t\t\t\t<button class=\"btn btn-sm btn-warning\">Edit</button>\n    \t\t\t\t\t\t<form style=\"display: inline\" method=\"POST\" action=\"/todos/" + data._id + "\" class=\"delete-item-form\">\n    \t\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-sm btn-danger\">Delete</button>\n    \t\t\t\t\t\t</form>\n    \t\t\t\t\t</div>\n    \t\t\t\t\t<form action=\"/todos/" + data._id + "\" method=\"POST\" class=\"edit-item-form\">\n    \t\t\t\t\t\t<hr>\n    \t\t\t\t\t\t<div class=\"form-group\">\n    \t\t\t\t\t\t\t<label for=\"" + data._id + "\">Item Text</label>\n    \t\t\t\t\t\t\t<input type=\"text\" value=\"" + data.text + "\" name=\"todo[text]\" class=\"form-control\" id=\"" + data._id + "\">\n    \t\t\t\t\t\t</div>\n    \t\t\t\t\t\t<button class=\"btn btn-primary\">Update Item</button>\n    \t\t\t\t\t</form>\n    \t\t\t\t\t<div class=\"clearfix\"></div>\n\t\t\t\t    </li>\n                ");
            $("#new-todo-form").find(".form-control").val("");
        });
    });

    // Edit to do Item
    $("#todo-list").on("click", ".edit-button", function () {
        $(this).parent().siblings(".edit-item-form").toggle();
    });

    // Put the Edit data to the DB
    $("#todo-list").on("submit", ".edit-item-form", function (e) {
        e.preventDefault();
        var toDoItem = $(this).serialize();
        var actionURL = $(this).attr("action");
        var $originalItem = $(this).parent(".list-group-item");
        $.ajax({
            url: actionURL,
            data: toDoItem,
            type: "PUT",
            originalItem: $originalItem,
            success: function success(data) {
                this.originalItem.html("\n                        <span class=\"lead\">\n\t\t\t\t\t\t" + data.text + "\n    \t\t\t\t\t</span>\n    \t\t\t\t\t<div class=\"pull-right\">\n    \t\t\t\t\t\t<button class=\"btn btn-sm btn-warning edit-button\">Edit</button>\n    \t\t\t\t\t\t<form style=\"display: inline\" method=\"POST\" action=\"/todos/" + data._id + "\" class=\"delete-item-form\">\n    \t\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-sm btn-danger\">Delete</button>\n    \t\t\t\t\t\t</form>\n    \t\t\t\t\t</div>\n    \t\t\t\t\t<form action=\"/todos/" + data._id + "\" method=\"POST\" class=\"edit-item-form\">\n    \t\t\t\t\t\t<hr>\n    \t\t\t\t\t\t<div class=\"form-group\">\n    \t\t\t\t\t\t\t<label for=\"" + data._id + "\">Item Text</label>\n    \t\t\t\t\t\t\t<input type=\"text\" value=\"" + data.text + "\" name=\"todo[text]\" class=\"form-control\" id=\"" + data._id + "\">\n    \t\t\t\t\t\t</div>\n    \t\t\t\t\t\t<button class=\"btn btn-primary\">Update Item</button>\n    \t\t\t\t\t</form>\n    \t\t\t\t\t<div class=\"clearfix\"></div>\n                    ");
            }
        });
    });

    // Delete the Item
    $("#todo-list").on("submit", ".delete-item-form", function (e) {
        e.preventDefault();
        var confirmResponse = confirm("Are you sure?");
        if (confirmResponse) {
            var actionURL = $(this).attr("action");
            var $itemToDelete = $(this).closest(".list-group-item");
            $.ajax({
                url: actionURL,
                type: "DELETE",
                itemToDelete: $itemToDelete,
                success: function success(data) {
                    this.itemToDelete.remove();
                }
            });
        } else {
            $(this).find("button").blur();
        }
    });
});