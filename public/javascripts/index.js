var dataTableObj;


$(document).ready(function() {
    $.ajax({
      url: "/users/showAll",
      success: function (data) {
        if (data.success) {
            renderDataTable(data.users);
            dataTableObj = $('#table-data').DataTable( {   
                'aoColumnDefs': [{
                    'bSortable': false,
                    'aTargets': ['nosort']
                }],
                "columns": [
                    null,
                    { "orderDataType": "dom-text", type: 'string' },
                    { "orderDataType": "dom-text-numeric" },
                    null,
                    null
                ]
            }); 
        } else {
            alert("Something went wrong, please go back after few minutes");
        }
      },
      error: function(err) {
        alert(err);
      }
    });


    function renderDataTable(data) {
        if (data.length > 0) {
            var html = ''; 
            data.forEach(element => {
                html += '<tr>';
                html += '<td>';
                html += '<img id="" class="rowImage" src="/images/'+ element.imageSource +'" class="">';
                html += '</td>';
                html += '<td>';
                html += '<input data-id=' + element._id + ' type="text" class="nameText form-control" readonly value=' + element.name + '>';
                html += '</td>';
                html += '<td>';
                html += '<input type="number" class="phoneText form-control" readonly value=' + element.phone + ' >';
                html += '</td>';
                html += '<td>'+ formatDateTime(element.dateTime)  +'</td>';
                html += '<td>';
                html += '<div>';
                html += '<button class="btnUpdate btn btn-success">Edit</button>';
                html += '<button class="btnDelete btn btn-danger">Delete</button>';
                html += '</div>';
                html += '</td>';               
                html += '</tr>';
            });
            $('#table-data tbody').append(html);
        }
        
    }
});

/* Create an array with the values of all the input boxes in a column */
$.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
{
    return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
        return $('input', td).val();
    } );
}
 
/* Create an array with the values of all the input boxes in a column, parsed as numbers */
$.fn.dataTable.ext.order['dom-text-numeric'] = function  ( settings, col )
{
    return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
        return $('input', td).val() * 1;
    } );
}