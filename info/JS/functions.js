export let $messagesBox = $('#messages-box');

// generate current date with format "YYYY-MM-DD HH:mm"
export let getDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth().toString().padStart(2, '0');
    let day = date.getDay().toString().padStart(2, '0');
    let hour = date.getHours().toString().padStart(2, '0');
    let min = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${min}`;
};

// function to create message box
export let createBox = (author, message, date = getDate(), error = '') => {
    let $box = $(`<div>`);
    $box.addClass(`${author}-message box ${error}`);
    $(`<p>${message}</p>`).appendTo($box);
    $(`<small>${date}</small>`).appendTo($box);

    $box.appendTo($messagesBox);
};

// function to create error message
export let createErrorBox = (message = "couldn't connect") => {
    $(`<div class="bot-message box error">
          <p>${message}</p>
        </div>`).appendTo($messagesBox);
};

// function to fetch data of request response
export let successFunction = function (data) {
    for(let message of data){
        let author =
            message.author === 1 ? 'user' : 'bot';
        let msg = message.message;
        let date = message.date;
        createBox(author, msg, date);
    }
};

// function to create message error if response failed
export let errorFunction = function () {
    createErrorBox("couldn't connect");
};