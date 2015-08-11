$(document).ready(function(){
  var authServer = "http://localhost:8880",
      documentServer = "http://localhost:8881",
      accessKey;

  $("#register").on('click', function(event){
    $.ajax({
      url: authServer + "/register",
      method: "POST",
      data: JSON.stringify({
        credentials: {
          email: $("#email").val(),
          password: $("#password").val()
        }
      })
    }).done(function(data){
      console.log(data)
    }).fail(function(data, testStatus, jqxhr){
      console.error(data);
      console.error(testStatus);
      console.error(jqxhr);
    });
  });

  $("#login").on('click', function(event){
    $.ajax({
      url: authServer + "/login",
      method: "POST",
      data: JSON.stringify({
        credentials: {
          email: $("#email").val(),
          password: $("#password").val()
        }
      })
    }).done(function(data){
      console.log("Successfully logged in.")
      accessKey = data.accessKey;
    }).fail(function(data, testStatus, jqxhr){
      console.error(data);
      console.error(testStatus);
      console.error(jqxhr);
    });
  });

  $("#documents").on('click', function(event){
    $.ajax({
      url: documentServer + "/documents",
      method: "GET",
      beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization',"Basic " + btoa(accessKey)); } //encoded in Base 64
    }).done(function(data){
      console.log(data);
      $("#results").html('');
      data.documents.forEach(function(document){
        $("#results").append("<p>" + document.content + "</p>");
      });
    }).fail(function(data){
      console.error(data);
    });
  });

});
