$(() => {

  loadFileList();

  /* When a file is selected, update the filename in the input control */
  $('#file').change(function() {
    if ($(this)[0].files.length > 0) {
      $('.file-name').text($(this)[0].files[0].name);
      $('#form-message').text('');
    }
  });

  /* Handle a click to the upload button */
  $('#upload').click(function(e) {
    e.preventDefault();

    var message = $('#form-message');

    var files = $('#file')[0].files;
    if (files.length < 1) {
      setErrorMessage(message, 'No files selected');
      return;
    }

    var file = files[0];
    var formData = new FormData();
    formData.append('file', file, file.name);
    
    $(this).addClass('is-loading');
    
    $.ajax({
      url: '/api/files',  
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    })
    .done((file) => {
      setSuccessMessage(message, 'File uploaded successfully');
      $('tbody').append(generateFileRowHtml(file));
    })
    .fail(() => {
      setErrorMessage(message, 'Error uploading file');
    })
    .always(() => {
      $(this).removeClass('is-loading');
    })
  });

  function setErrorMessage(messageElement, text) {
    messageElement.addClass('is-danger');
    messageElement.removeClass('is-success');
    messageElement.text(text);
  }

  function setSuccessMessage(messageElement, text) {
    messageElement.removeClass('is-danger');
    messageElement.addClass('is-success');
    messageElement.text(text);
  }

  function loadFileList() {
    $.get('api/files')
    .done((files) => {
      files.forEach(file => {
        $('tbody').append(generateFileRowHtml(file));
      });
    })
    .fail(() => {
      setErrorMessage($('#table-message', 'Error fetching files'));
    })
    .always(() => {
      
    })
  }

  function generateFileRowHtml(file) {
    return `
    <tr>
      <td>
        <a class="download-link" href="api/files/${file.Id}/download">
          <i class="fas fa-download"></i>
          ${file.Filename}
        </a>
      </td>
      <td>${file.ByteSize}</td>
      <td>${moment(file.DateUploaded).fromNow()}</td>
    </tr>
    `;
  }
});
