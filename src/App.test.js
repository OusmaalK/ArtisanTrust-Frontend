import { render, screen } from '@testing-library/react';
import App from './App';

// Supprimez l'ancien test 'renders learn react link'

test('renders the ArtisanTrust title and the main search button', () => {
  render(<App />);
  
  // 1. Vérifie le titre principal de votre application
  const titleElement = screen.getByText(/ArtisanTrust - Moteur d'Adéquation Contextuelle/i);
  expect(titleElement).toBeInTheDocument();
  
  // 2. Vérifie que le bouton de soumission est présent
  const buttonElement = screen.getByRole('button', { name: /Trouver l'Artisan Adapté/i });
  expect(buttonElement).toBeInTheDocument();
});

// Facultatif : vous pourriez ajouter un test pour vérifier que le champ de texte est là
// test('renders the description textarea', () => {
//   render(<App />);
//   const textarea = screen.getByPlaceholderText(/Ex: URGENT burst pipe!/i);
//   expect(textarea).toBeInTheDocument();
// });