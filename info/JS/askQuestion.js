
$( document ).ready( function () {
  let baseUrl = "http://localhost:8000";
  let $messageInput = $('#message-input');
  let $sendBtn = $('#sendMessage-btn');

  let $messagesBox = $('#messages-box');

    // generate current date with format "YYYY-MM-DD HH:mm"
    const getDate = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hour = date.getHours().toString().padStart(2, '0');
        let min = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${min}`;
    };

    // function to create message box
    const createBox = (author, message, date = getDate(), error = '') => {
        let $box = $(`<div>`);
        $box.addClass(`${author}-message box ${error}`);
        $(`<p>${message}</p>`).appendTo($box);
        $(`<small>${date}</small>`).appendTo($box);

        $box.appendTo($messagesBox);
    };

    // function to create error message
    const createErrorBox = (message = "couldn't connect") => {
        $(`<div class="bot-message box error">
          <p>${message}</p>
        </div>`).appendTo($messagesBox);
    };

    // function to fetch data of request response
    const successFunction = function (data) {
        for (let message of data) {
            let author =
                message.author === 1 ? 'user' : 'bot';
            let msg = message.message;
            let date = message.date;
            createBox(author, msg, date);
        }
    };

    // function to create message error if response failed
    const errorFunction = function () {
        createErrorBox("couldn't connect");
    };

    // get the history
  $.ajax(
    {
      url: baseUrl + '/get_history',
      type: 'GET',
      dataType: 'JSON',
      success: successFunction,
    }
  );

  // send message
  $sendBtn.click( function ( event ) {
    event.preventDefault( false );
    let $sendedMessage = $messageInput.val();
    if ( $sendedMessage === '' ) return -1;
      let date;
      let data;
      if ($sendedMessage === 'clean') {
          // send request to clone the history
          $.ajax(
              {
                  url: baseUrl + '/clean_history',
                  type: 'GET',
              }
          );
          location.reload();
      } else {
          date = getDate();
          console.log(date)
          createBox('user', $sendedMessage, date);
          $messageInput.val('');

          // date to send
          data = {
              author: 1,
              message: $sendedMessage,
              date: date
          };

          // get response
          $.ajax(
              {
                  url: baseUrl + '/get_answer',
                  type: 'GET',
                  dataType: 'JSON',
                  data: data,
                  success: successFunction,
                  error: errorFunction,
              }
          );
      }
  } );
} );
