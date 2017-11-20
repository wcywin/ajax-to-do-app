$(document).ready(function(){
    
    // New to do Item
    $("#new-todo-form").submit(function(e){
        e.preventDefault();
        
        var toDoItem = $(this).serialize();
        
        $.post("/todos", toDoItem, function(data){
            $("#todo-list").append(
                `
                    <li class="list-group-item">
    					<span class="lead">
    						${data.text}
    					</span>
    					<div class="pull-right">
    						<button class="btn btn-sm btn-warning">Edit</button>
    						<form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
    							<button type="submit" class="btn btn-sm btn-danger">Delete</button>
    						</form>
    					</div>
    					<form action="/todos/${data._id}" method="POST" class="edit-item-form">
    						<hr>
    						<div class="form-group">
    							<label for="${data._id}">Item Text</label>
    							<input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
    						</div>
    						<button class="btn btn-primary">Update Item</button>
    					</form>
    					<div class="clearfix"></div>
				    </li>
                `
                )
            $("#new-todo-form").find(".form-control").val("");
        });
    });
    
    // Edit to do Item
    $("#todo-list").on("click", ".edit-button", function(){
        $(this).parent().siblings(".edit-item-form").toggle(); 
    });
    
    // Put the Edit data to the DB
    $("#todo-list").on("submit", ".edit-item-form", function(e){
        e.preventDefault();
        var toDoItem = $(this).serialize();
        var actionURL = $(this).attr("action");
        var $originalItem = $(this).parent(".list-group-item");
        $.ajax({
            url: actionURL,
            data: toDoItem,
            type: "PUT",
            originalItem: $originalItem,
            success: function(data){
                this.originalItem.html(
                    `
                        <span class="lead">
						${data.text}
    					</span>
    					<div class="pull-right">
    						<button class="btn btn-sm btn-warning edit-button">Edit</button>
    						<form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
    							<button type="submit" class="btn btn-sm btn-danger">Delete</button>
    						</form>
    					</div>
    					<form action="/todos/${data._id}" method="POST" class="edit-item-form">
    						<hr>
    						<div class="form-group">
    							<label for="${data._id}">Item Text</label>
    							<input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
    						</div>
    						<button class="btn btn-primary">Update Item</button>
    					</form>
    					<div class="clearfix"></div>
                    `
                    )     
            }
        });
    });
    
    // Delete the Item
    $("#todo-list").on("submit", ".delete-item-form", function(e){
        e.preventDefault();
        var confirmResponse = confirm("Are you sure?");
        if(confirmResponse){
            var actionURL = $(this).attr("action");
            var $itemToDelete = $(this).closest(".list-group-item");
            $.ajax({
                url: actionURL,
                type: "DELETE",
                itemToDelete: $itemToDelete,
                success: function(data){
                    this.itemToDelete.remove();
                }
            });
        } else {
            $(this).find("button").blur();
        }
    });
    
});