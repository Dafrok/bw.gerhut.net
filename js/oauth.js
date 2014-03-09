(function () {
    var clientId = '3GMv3CfMcLTSOuHyffkwieIx';
  var oAuthUrl = [
    ' ',
    'client_id=' + clientId,
    'redirect_uri=' + location.protocol + '//' + location.host
  ].join('&');
  if (location.hash.indexOf('access_token=') === -1)
    return location.href = oAuthUrl;

  var accessToken = location.hash.substr(
    location.hash.indexOf('access_token='));
  accessToken = accessToken.substr(0, accessToken.indexOf('&'));
  
  var restUrl = 'https://openapi.baidu.com/rest/2.0/passport/users/getLoggedInUser?' + accessToken + '&callback=?'
  $.getJSON(restUrl).done(function (data) {
    if ('error_msg' in data)
      return document.write(data.error_msg);
    window.run(data);
  });
}());
