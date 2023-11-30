document.addEventListener('DOMContentLoaded', function() {
	fetch('images.json')
	.then(response => response.json())
	.then(data => {
		const gallery = document.querySelector('.gallery');
		data.forEach(image => {
		const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;

		// Create gallery item container
		const galleryItem = document.createElement('div');
		galleryItem.classList.add('gallery-item');

		// Set eyeColor and other optional attributes as data attributes
		const attributes = ['eyeColor', 'gender', 'hat', 'speaking', 'smoking', 'noFace', 'demon', 'threePlusEye', 'oneEye', 'sick', 'animal', 'alien', 'weapon', 'ape', 'openScalp', 'miner', 'shadow', 'lfg', 'clown', 'hoodie', 'famous', 'letterhead', 'robot', 'punk', 'undead', 'mask'];
		attributes.forEach(attr => {
			if (image[attr]) {
			galleryItem.dataset[attr] = image[attr];
			}
		});

		// Create link element
		const link = document.createElement('a');
		link.href = `https://magiceden.io/ordinals/item-details/${image.tokenId}`;
		link.target = "_blank";

		// Create image container
		const imageContainer = document.createElement('div');
		imageContainer.classList.add('image-container');

		// Create and set image element
		const img = document.createElement('img');
		img.dataset.src = imageUrl;
		img.alt = `Ordinal Maxi Biz #${image.tokenId}`;
		img.classList.add('lazyload');

		// Append image to its container
		imageContainer.appendChild(img);

		// Append image container to link
		link.appendChild(imageContainer);

		// Append link to gallery item
		galleryItem.appendChild(link);

		// Price tag with Bitcoin symbol
		if (image.price) {
			const priceTag = document.createElement('div');
			priceTag.classList.add('price-tag');
			priceTag.textContent = `₿${image.price}`;
			galleryItem.appendChild(priceTag);
		}

		// Append gallery item to gallery
		gallery.appendChild(galleryItem);
		});
		
		initializeLazyLoad(); // After adding all images to the gallery, initialize lazy loading
		updateCount(); // This will update the count when the page loads
		paginateGallery(); // After the gallery items have been created, initialize pagination
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

function updateCount() {
	// Select all the gallery items
	const galleryItems = document.querySelectorAll('.gallery-item');
	// Use Array.prototype.filter to count the items that are currently visible
	const count = Array.from(galleryItems).filter(item => item.style.display !== 'none').length;
	// Update the display with the new count. You will need an element in your HTML to show the count.
	const countDisplay = document.getElementById('count-display');
	if (countDisplay) {
	countDisplay.textContent = `${count} OMBs`;
	}
}

function toggleDropdown(show) {
	const filterOptions = document.getElementById('filter-options');
	if (show) {
	filterOptions.classList.add('show');
	} else {
	filterOptions.classList.remove('show');
	}
}  

// Add event listeners to checkboxes
document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
	checkbox.addEventListener('change', filterGallery);
});

function filterGallery() {
	const checkedAttributes = Array.from(document.querySelectorAll('.filter-dropdown input[type="checkbox"]:not([name="eyeColor"], [name="no-trait"])'))
		.filter(checkbox => checkbox.checked)
		.map(checkbox => checkbox.name);
	const checkedEyeColors = Array.from(document.querySelectorAll('.filter-dropdown input[type="checkbox"][name="eyeColor"]:checked'))
		.map(checkbox => checkbox.value);
	const isNoTraitChecked = document.getElementById('no-trait').checked;

	document.querySelectorAll('.gallery-item').forEach(item => {
		const matchesEyeColor = checkedEyeColors.length === 0 || checkedEyeColors.includes(item.dataset.eyeColor);

		// Start with shouldDisplay set to the result of matchesEyeColor
		let shouldDisplay = matchesEyeColor;

		if (isNoTraitChecked) {
			// If "No Trait" is checked, count the attributes and check if only eyeColor is present
			const attributeCount = Object.keys(item.dataset).length;
			shouldDisplay = shouldDisplay && (attributeCount === 1); // This assumes eyeColor is the only attribute
		} else if (checkedAttributes.length > 0) {
			// If other attribute filters are checked, ensure they all match
			shouldDisplay = shouldDisplay && checkedAttributes.every(attr => item.dataset[attr] === 'true');
		}

		// If no filters are checked, shouldDisplay remains true based on the matchesEyeColor result
		item.style.display = shouldDisplay ? 'block' : 'none';
	});

    currentPage = 1; // Reset to the first page on filter change
	updateCount(); // Call updateCount after filtering is done to update the display count
	paginateGallery(); // Reapply pagination based on the new filtered set of items
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
	// Apply filter when checkboxes change
	document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
		checkbox.addEventListener('change', filterGallery);
	});

	filterGallery(); // Initial call to filterGallery to apply the default state
});

const itemsPerPage = 200; // Number of images per page
let currentPage = 1; // Current page number
let totalItems = 0; // Total number of images

function paginateGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    totalItems = galleryItems.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    galleryItems.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
            item.style.display = ''; // Show items for the current page
        } else {
            item.style.display = 'none'; // Hide other items
        }
    });

    document.getElementById('currentPage').textContent = currentPage;
}

function changePage(increment) {
    const maxPage = Math.ceil(totalItems / itemsPerPage);
    currentPage = Math.min(Math.max(1, currentPage + increment), maxPage);
    paginateGallery();
}

document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
document.getElementById('nextPage').addEventListener('click', () => changePage(1));
