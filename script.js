document.addEventListener('DOMContentLoaded', function() {
  fetch('images.json')
    .then(response => response.json())
    .then(data => {
      const gallery = document.querySelector('.gallery');
      data.forEach(image => {
        const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;
        const itemClass = image.eyeColor; // Assuming this is a class like 'red', 'green' or 'blue'.
        let itemHtml = `<div class="gallery-item ${itemClass}">`;
        itemHtml += `<a href="https://magiceden.io/ordinals/item-details/${image.tokenId}" target="_blank">`;
        itemHtml += `<div class="image-container">`;
        itemHtml += `<img data-src="${imageUrl}" alt="Ordinal Maxi Biz #${image.tokenId}">`;
        if (image.price) {
          itemHtml += `<div class="price-tag">${image.price}</div>`;
        }
        itemHtml += `</div></a></div>`;
        gallery.innerHTML += itemHtml;
      });
    })
    .catch(error => console.error('Error loading image data:', error));
});

document.addEventListener('DOMContentLoaded', (event) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        const src = image.getAttribute('data-src');
        image.setAttribute('src', src);
        observer.unobserve(image);
      }
    });
  }, {
    rootMargin: '0px',
    threshold: 0.1
  });

  // Target all images with the data-src attribute
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => observer.observe(img));
});

function filterSelection(color) {
  var elements = document.getElementsByClassName('gallery-item');
  for (var i = 0; i < elements.length; i++) {
    if (color === 'all' || elements[i].classList.contains(color)) {
      w3AddClass(elements[i], 'show');
    } else {
      w3RemoveClass(elements[i], 'show');
    }
  }
}

function w3AddClass(element, name) {
  var arr1 = element.className.split(" ");
  if (arr1.indexOf(name) === -1) {
    element.className += " " + name;
  }
}

function w3RemoveClass(element, name) {
  var arr1 = element.className.split(" ");
  var index = arr1.indexOf(name);
  if (index > -1) {
    arr1.splice(index, 1);
  }
  element.className = arr1.join(" ");
}

var btnContainer = document.getElementById("filter-container");
var btns = btnContainer.getElementsByClassName("filter-btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }
    this.className += " active";
  });
}

document.getElementById('price-filter-checkbox').addEventListener('change', function() {
  var elements = document.getElementsByClassName('gallery-item');
  var isChecked = this.checked;

  for (var i = 0; i < elements.length; i++) {
    // Check if the item has a price tag
    var hasPriceTag = elements[i].getElementsByClassName('price-tag').length > 0;

    if (isChecked && hasPriceTag) {
      elements[i].style.display = 'block';
    } else if (isChecked && !hasPriceTag) {
      elements[i].style.display = 'none';
    } else {
      elements[i].style.display = ''; // Or use 'block' to show all
    }
  }
});
