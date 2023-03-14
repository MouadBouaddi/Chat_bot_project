$( document ).ready( function () {
    let baseUrl = "http://localhost:8000/get_answer";

    let $sendBtn = $("#test")
    $sendBtn.click( function ( event ) {
        

        let data = {
            message: "hello",
            author: 1,
            date: "2002-06-04"
        };
        //data = JSON.stringify( data );

        $.ajax(
            {
                url: baseUrl,
                type: 'GET',
                dataType: 'JSON',
                data: data,
                success: function (response){
                    console.log(response);
                }
            }
        );
    } );

} );