document.addEventListener('DOMContentLoaded', () => {

    const searchBox = document.querySelector('.searchbox');
    const searchBtn = document.querySelector('.searchbtn');
    const recipeContainer = document.querySelector('.recipeContainer');
    const recipeDetails = document.querySelector('.recipe-details');
    const recipeDetailsContent = document.querySelector('.recipe-details-content');
    const recipeCloseBtn = document.querySelector('.recipe-close-btn');



    searchBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const fetchRecipes = async (query) => {
            recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
                const data = await response.json();

                recipeContainer.innerHTML = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        const recipeDiv = document.createElement('div');
                        recipeDiv.classList.add('recipe');
                        recipeDiv.innerHTML = `
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <h3>${meal.strMeal}</h3>
                            <p><span>${meal.strArea}</span>Dish</p>
                            <p>Belongs to <span>${meal.strCategory}</span></p>
                        `;

                        const button = document.createElement('button');
                        button.textContent = "View Recipe";
                        recipeDiv.appendChild(button);
                        recipeContainer.appendChild(recipeDiv);

                        // Adding event listener to recipe button
                        button.addEventListener('click', () => {
                            openRecipePopup(meal);
                        });
                    });
                } else {
                    recipeContainer.innerHTML = `<h2>No meals found for the given query.</h2>`;
                    console.log('No meals found for the given query.');
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        const fetchIngredients = (meal) => {
            let ingredientsList = "";
            for (let i = 1; i < 20; i++) {
                const ingredients = meal[`strIngredient${i}`];
                if (ingredients) {
                    const measure = meal[`strMeasure${i}`];
                    ingredientsList += `<li>${measure} ${ingredients}</li>`;
                } else {
                    break;
                }
            }
            return ingredientsList;
        };

        const openRecipePopup = (meal) => {
            recipeDetailsContent.innerHTML = `
                <h2 class ="recipeName">${meal.strMeal}</h2>
                <h3>Ingredients:</h3>
                <ul class="ingredientList">${fetchIngredients(meal)}</ul>
                <div>
                    <h3>Instructions:</h3>
                    <p class="recipeInstructions">${meal.strInstructions}</p>
                </div>
            `;

            recipeDetailsContent.parentElement.style.display = "block";
        };

        recipeCloseBtn.addEventListener('click', ()=> {
            recipeDetailsContent.parentElement.style.display="none";
        });

        searchBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const searchInput = searchBox.value.trim();

            console.log('Search Input:', searchInput);

            if (searchInput) {
                // Clear previous recipes
                recipeContainer.innerHTML = '';
                // Fetch new recipes
                await fetchRecipes(searchInput);
            } else {
                recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
                return;
            }
        });
    });
});
