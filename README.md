# Rick & Morty Pro Analytics Dashboard

Welcome to the character explorer! This app lets you search, filter, and save your favorite characters from the Rick & Morty universe. It was built to be fast, reliable, and easy to use.

## Features

### Smart Search
- **Instant Results**: Type a name, and the app searches for characters.
- **Smart Validation**: We use "debouncing," which means we only search after you stop typing for a split second. This keeps the app fast and saves data.

### Advanced Filtering
You can filter characters by multiple categories at once:
- **Status** (Alive, Dead, Unknown)
- **Species** (Human, Alien)
- **Gender** (Female, Male, Genderless, Unknown)

Mix and match filters to find exactly who you're looking for!

### Shareable Links (URL Sync)
Every search and filter you apply updates the URL in your browser address bar. This means you can:
- **Bookmark** a specific search (e.g., "Alive Humans").
- **Share** the link with a friend, and they'll see the exact same results.
- Use the **Back Button** to go to your previous search.

### Favorites
- **Save Characters**: Click the heart icon to add a character to your favorites.
- **Saved Forever**: Your favorites are saved to your browser's local storage, so they'll still be there if you refresh the page or come back later.

### Character Details
Click on any character to see their full profile, including:
- Origin and current location.
- A list of all episodes they appeared in.



## How to Run It

1. **Install Dependencies**
   Run this command in your terminal to install the necessary tools:
   ```bash
   npm install
   ```

2. **Start the App**
   Start the local development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Vite**

## Project Structure
- `src/components`: Reusable UI parts like the SearchBar and CharacterCard.
- `src/hooks`: Custom logic for things like managing favorites and URL syncing.
- `src/pages`: Home Page and Character Detail Page
- `src/services`: Handles the connection to the Rick & Morty API.
