$( document ).ready( function () {
  let baseUrl = "http://localhost:63342";

  let $mainSection = $('#mainSection');
  let $messagesBox = $('#question-box');

  let $answerInput = $('#answer-input');
  let $tagsInput = $('#tags-input');
  let $answerBtn = $('#answer-btn');

  // generate current date with format "YYYY-MM-DD HH:mm"
  const getDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth().toString().padStart(2, '0');
    let day = date.getDay().toString().padStart(2, '0');
    let hour = date.getHours().toString().padStart(2, '0');
    let min = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${min}`;
  };

// function to create message box
  const createBox = (message, date = getDate(), error = '') => {
    let $box = $(`<div>`);
    $box.addClass(`question-message box ${error}`);
    $(`<p>${message}</p>`).appendTo($box);
    $(`<small>${date}</small>`).appendTo($box);

    $box.appendTo($messagesBox);
  };

  // function to create error message
  const createErrorBox = (message) => {
    $(`<div class="error-box" id="error-box">
          <p>${message}</p>
        </div>`).appendTo($mainSection);
  };

  // function to fetch data of request response
  const successFunction = function (data) {
    let success = data.success;
    if (success === 1) {
      let questionEl = data.questionEl;
      let question = questionEl.question;
      let date = question.date;

      createBox(question, date);
    } else
      createErrorBox();
  };

  // function to create message error if response failed
  const errorFunction = function () {
    createErrorBox("Couldn't save your answer");
  };

  // bring the question from database
  $.ajax(
    {
      url: baseUrl + '/JSON/givAnsewer.json',
      type: 'GET',
      dataType: 'JSON',
      success: successFunction,
      error: errorFunction,
    }
  );

  $answerBtn.click( function ( event ) {
    event.preventDefault( false );

    let $answer = $answerInput.val();
    let $tags = $tagsInput.val();
    if ( $answer === '' || $tags === '' ) return;

    let date = getDate();

    $answerInput.val( '' );
    $tagsInput.val( '' );

    let data = {
      answer: $answer,
      tags: $tags,
      date: date
    };

    // send answer to database
    $.ajax(
      {
        url: baseUrl + '/JSON/givAnsewer.json',
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: successFunction,
        error: errorFunction,
      }
    );
  } );

  $( '#error-box' ).click( function () {
    $( '#error-box' ).remove();
  } );
} );
