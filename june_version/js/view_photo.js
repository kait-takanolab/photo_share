//POSTメソッドで送るデータを定義する
let data = {
    request : 'ALL'
};

let photoname;
//Ajax通信メソッド
//type : HTTP通信の種類(POSTとかGETとか)
//url  : リクエスト送信先のURL
//data : サーバに送信する値
$.ajax({
  type: "POST",
  url: "php/return_photo.php",//写真名を取得するphp
  data: data,
  dataType: "json",
  //Ajax通信が成功した場合に呼び出されるメソッド
  success: function(json){
    console.log(json);
    for(let i in json){
      var name = json[i]['photo_name'];
      if (name != null) {
        $('#main-window').prepend("<div class='sp-slide'><a href='images/"+name+"'><img class='sp-image' src='images/"+name+"'/></a></div>");
        $('#sub-window').prepend('<img class="sp-thumbnail" src="images/'+name+'"/>'); 
      }
    }
    slide_show();
    //成功した場合はjson構造体の配列に格納される
  },
  //Ajax通信が失敗した場合に呼び出されるメソッド
  error: function(XMLHttpRequest, textStatus, errorThrown){
    alert('Error : ' + errorThrown);
    $("#XMLHttpRequest").html("XMLHttpRequest : " + XMLHttpRequest.status);
    $("#textStatus").html("textStatus : " + textStatus);
    $("#errorThrown").html("errorThrown : " + errorThrown);
  }
  
});