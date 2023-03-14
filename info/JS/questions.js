$( document ).ready( function () {
  let baseUrl = "http://localhost:63342";

  let $messagesBox = $('#questions-box');
  let $error_message = 'error message';

  // generate current date with format "YYYY-MM-DD HH:mm"
  let getDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth().toString().padStart(2, '0');
    let day = date.getDay().toString().padStart(2, '0');
    let hour = date.getHours().toString().padStart(2, '0');
    let min = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${min}`;
  };

  // function to create message box
  let createBox = (id, message, date = getDate(), error = '') => {
    let $box = $(`<a href="answerQusetion.html?id=${id}"></a>`);
    console.log($box);
    $box.addClass(`question-message box ${error}`);
    $(`<p>${message}</p>`).appendTo($box);
    $(`<small>${date}</small>`).appendTo($box);

    $box.appendTo($messagesBox);
  };

  // function to create error message
  let createErrorBox = (message = $error_message) => {
    $(`<div class="bot-message box error">
          <p>${message}</p>
        </div>`).appendTo($messagesBox);
  };

  // function to fetch data of request response
  let successFunction = function (data) {
    let success = data.success;
    if (success === 1)
      for (const message of data.questions) {
        let id = message.id;
        let question = message.question;
        let date = message.date;
        console.log(question);

        createBox(id, question, date);
      }
    else
      createErrorBox();
  };

  // function to create message error if response failed
  let errorFunction = function () {
    createErrorBox("couldn't connect");
  };

  // get all questions from database
  $.ajax(
    {
      url:  baseUrl + '/JSON/questions.json',
      type: 'GET',
      dataType: 'JSON',
      success: successFunction,
      error: errorFunction,
    }
  );
} );
