document.addEventListener('DOMContentLoaded', function() {
  fetch('images.json')
    .then(response => response.json())
    .then(data => {
      const gallery = document.querySelector('.gallery');
      data.forEach(image => {
        const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;
        const itemClass = image.eyeColor; // Assuming this is a class like 'red', 'green', or 'blue'.
        let itemHtml = `<div class="gallery-item ${itemClass}">`;
        itemHtml += `<a href="https://magiceden.io/ordinals/item-details/${image.tokenId}" target="_blank">`;
        itemHtml += `<div class="image-container">`;
        // Set data-src with the actual image URL and src with a placeholder
        itemHtml += `<img data-src="${imageUrl}" alt="Ordinal Maxi Biz #${image.tokenId}" class="lazyload">`;
        if (image.price) {
          itemHtml += `<div class="price-tag">${image.price}</div>`;
        }
        itemHtml += `</div></a></div>`;
        gallery.innerHTML += itemHtml;
      });
      // After adding all images to the gallery, initialize lazy loading
      initializeLazyLoad();
    })
    .catch(error => console.error('Error loading image data:', error));
});

function initializeLazyLoad() {
  const lazyImages = document.querySelectorAll('img.lazyload');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.classList.remove('lazyload');
        observer.unobserve(entry.target);
      }
    });
  });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

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
