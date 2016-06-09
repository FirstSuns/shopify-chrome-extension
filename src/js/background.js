/**
 *  Handle the browser action that gets executed if the user pushes
 *  the toolbar icon in Google Chrome
 */
chrome.browserAction.onClicked.addListener(function(tab, url) {
  // Check if we are in the "new Tab" site and open the
  // Shopify Home Page if so
  if (typeof url === "undefined" && tab.active && tab.url === "chrome://newtab/") {
    chrome.tabs.update(tab.id, { url: 'https://www.shopify.com/?ref=vitalogy'} );
    return;
  }
});

/**
 *  Get the Shopify Product Data
 */
function getShopifyProduct(url, callback) {
	var xhr = new XMLHttpRequest();
	var product;

	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
      var data = JSON.parse(xhr.responseText);
			var variant = data.product.variants[0];
			product = {
				id: data.product.id,
				title: data.product.title,
				price: variant.price,
				sku: variant.sku,
				quantity: variant.inventory_quantity,
				weight: variant.weight,
				weight_unit: variant.weight_unit
			};
      console.log('Product: (background.js)');
      console.log(product);
      callback(product);
		}
	}
	xhr.send();
}

/**
 * Handle the message action that gets executed if
 * the current url (tab) matches the product url pattern.
 */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // console.log(request);
    if ((request.from === 'shopify') && (request.subject === 'showPageAction')) {
      var tabId = sender.tab.id;
      var url = sender.tab.url + '.json';

      chrome.browserAction.setPopup({ tabId: tabId, popup: "popup.html" });
      getShopifyProduct(url, function(response){
        sendResponse(response);
      });
      return true;
    }
});
