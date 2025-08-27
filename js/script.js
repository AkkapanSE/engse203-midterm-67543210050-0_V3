const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsGrid = document.getElementById('results-grid');

searchForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        showMessage('กรุณากรอกคำค้นหา');
        return;
    }
    
    try {
        showLoading();
        
        const meals = await searchRecipes(keyword);
        
        if (meals) {
            displayRecipes(meals);
        } else {
            showMessage('ไม่พบสูตรอาหารที่ตรงกับคำค้นหาของคุณ');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again later.');
    }
});

async function searchRecipes(keyword) {
    try {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function displayRecipes(meals) {
    if (meals === null) {
        showMessage('No recipes found.');
        return;
    }
    
    resultsGrid.innerHTML = '';
    
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
        `;
        
        resultsGrid.appendChild(mealCard);
    });
}

function showLoading() {
    resultsGrid.innerHTML = '<p class="status-message">Searching for recipes...</p>';
}

function showMessage(message) {
    resultsGrid.innerHTML = `<p class="status-message">${message}</p>`;
}