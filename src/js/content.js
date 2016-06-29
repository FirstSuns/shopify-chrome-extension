var shopifyProduct;

chrome.runtime.sendMessage({ from: 'shopify', subject: 'showPageAction'}, function(response) {
  // console.log('Product: (content.js)');
  // console.log(response);
  shopifyProduct = response;
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    var getElementByXPath = function(a,b){b=document;return b.evaluate(a,b,null,9,null).singleNodeValue}
    var node = getElementByXPath("//*[contains(text(),'Shopify.shop')]");
    var shopifyStore;

    if( typeof node != 'undefined' || node != null ) {
      var data = node.text.split('"');
      shopifyStore = data[1] || 'undefined';
    }

    if (typeof shopifyStore === 'undefined') {
      return;
    }

    var data = shopifyProduct;
    data['url'] = 'https://'+shopifyStore;
    data['product_url'] = 'https://'+shopifyStore+'/admin/products/'+data.id;
    sendResponse(data);
  }

});
