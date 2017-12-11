var ApiUrl  = 'http://local.api.tamtam.pro/';
var homeUrl = 'http://local.tamtam.pro';
var cookies = null;
var cookiesFromMessag = null;
var token;


function getCookiesFromMessage(incMsg) {
    cookies = incMsg.message;
    cookiesFromMessag = cookies;
}


function checkExistsCookies()
{
      ttp_auth = decodeURIComponent(cookiesFromMessag);

      if (ttp_auth.indexOf("ttp_auth={") ===-1) {
          createNewTab();
      }

      eval('var ttp_auth='+ttp_auth.split(";")[1]);

      if (ttp_auth instanceof Object == false) {
          createNewTab();
      }

     var current = new Date().getTime() / 1000;
     var expires_in = ttp_auth.expiresIn;
     var createdAt = ttp_auth.createdAt;
     checked = true;
     var expireDate = parseInt(expires_in)+parseInt(createdAt);
     token = ttp_auth.token;

     if(expireDate > current && token !== null){
         if (confirm("Do you want to add this Link to be processed on TAMTAM-IT ?")) {
              sendFavoriteToAPi(data);
         }
     } else{
          createNewTab();
     }
}


function createNewTab()
{
    var urlTo = homeUrl+'?goto='+safari.application.activeBrowserWindow.activeTab.url+'&url_favorite=handle';
    var newTab = safari.application.activeBrowserWindow.openTab(); // Open a new tab
    newTab.url = urlTo;
}


function notifications(response)
{
    var notification = new Notification('TAMTAM-IT', {
      icon: 'img/icon_120.png',
      body: (response=="OK" ?  "Link has been added to TAMTAM-IT!" : "Error occured, please try again later"),
    });
}


function sendFavoriteToAPi(url)
{
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(urls) {
        $.ajax({
            type: 'POST',
            url: ApiUrl +'blog/url-favorite',
            data: {
                'url': urls[0].url,
                'access_token': token
            },
            success: function(data) {
                //console.log(data); debugger;
                notifications(data.result);
            },
            error: function (request, error) {
                notifications('nOK');
            },
        });
    });
}


function isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}


function sendUrlToHome()
{
    if(!isUrl(safari.application.activeBrowserWindow.activeTab.url)){
        alert("ERROR : URL Format is not valid");
        return false;
    }

    if (confirm("Do you want to add this Link to be processed on TAMTAM-IT ?")) {
          createNewTab();
    }
}


function performCommand(event) {
    if (event.command == "open-tamtam-extension") {
        sendUrlToHome();
    }
}


/*
**** Lets Go ****
*/
safari.application.addEventListener("command", performCommand, true);
