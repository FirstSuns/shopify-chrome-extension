var shopifyStore;

function toggle(id, className) {
  var el = document.getElementById(id);
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1);
    } else {
      classes.push(className);
    }
    el.className = classes.join(' ');
  }
}

function setDOMInfo(data) {
  shopifyStore = data.url;

  // Pop-up
  var weight = data.weight + ' ' + data.weight_unit;
  document.getElementById('product-url').href = data.product_url;
  document.getElementById('title').textContent = data.title;
  document.getElementById('price').textContent = data.price;
  document.getElementById('quantity').textContent = data.quantity;
  document.getElementById('weight').textContent = weight;

  // Links
  document.getElementById('theme-manager').href = data.url + '/admin/themes';
  document.getElementById('add-product').href = data.url + '/admin/products/new';
  document.getElementById('add-blog-post').href = data.url + '/admin/articles/new';
  document.getElementById('store-admin').href = data.url + '/admin';
  document.getElementById('general-settings').href = data.url + '/admin/settings/general';
}

document.addEventListener('DOMContentLoaded', function() {

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var message = { from: 'popup', subject: 'DOMInfo' };
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      setDOMInfo(response);
    });
  });

  var el = document.getElementById('toggle');
  el.addEventListener('click', function() {
    toggle('toggle', 'active');
    toggle('overlay', 'open');
  }, false);

  document.getElementById('clean-cart').addEventListener('click', function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", shopifyStore + '/cart/clear.js', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log('Shopify cart clean-up!');
      }
    }
    xhr.send();
  });

});
