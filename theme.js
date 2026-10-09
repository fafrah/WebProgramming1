//Gets the dark mode button
let theme_toggler = document.querySelector('#theme_toggler');

//Loads the saved theme
function retrieve_theme() {

    let theme = localStorage.getItem('website_theme');

    if (theme === 'dark_mode') {
        document.body.classList.add('dark_mode');
        theme_toggler.textContent = '☀ Light Mode';
    } else {
        document.body.classList.remove('dark_mode');
        theme_toggler.textContent = '☾ Dark Mode';
    }
}

//Changes the theme when the button is clicked
theme_toggler.addEventListener('click', function() {

    document.body.classList.toggle('dark_mode');

    //Saves the selected theme
    if (document.body.classList.contains('dark_mode')) {
        localStorage.setItem('website_theme', 'dark_mode');
    } else {
        localStorage.setItem('website_theme', 'default');
    }

    //Updates the button text
    retrieve_theme();
});

//Applies the saved theme when the page loads
retrieve_theme();

