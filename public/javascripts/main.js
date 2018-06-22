$(() => {

  $('#upload').click(uploadFile);

  function uploadFile() {
    var formData = new FormData();

    var file = $('#file')[0].files[0];
    formData.append('file', file, file.name);

    $.ajax({
        url: '/api/files',  
        type: 'POST',
        data: formData,
        success:(data) => {
            $('#result').text(data);
        },
        cache: false,
        contentType: false,
        processData: false
    });
  }
});
